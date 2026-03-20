// ╔════════════════════════════════════════════════╗
// ║  MAINNET VAULT EXECUTOR                        ║
// ║  STATUS: AUDIT PENDING — NOT ACTIVE            ║
// ║  Enabled when: NETWORK=mainnet-beta in env     ║
// ║  Audit scope: ALL functions in this file       ║
// ╚════════════════════════════════════════════════╝

import {
  Connection, PublicKey, Transaction,
  TransactionInstruction, SystemProgram,
} from '@solana/web3.js'
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { VAULT } from '@/lib/vault-constants'

// ── Network guard — hard stop if not mainnet-enabled ──
// AUDIT NOTE: This guard is the primary safety mechanism.
// Any bypass here is a critical vulnerability.
function requireMainnet(): number {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  if (network !== 'mainnet-beta') {
    throw new Error(
      `[VaultExecutor] BLOCKED: Network is '${network}'. ` +
      `Mainnet operations require NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
    )
  }
  const cap = parseFloat(process.env.MAINNET_USDC_CAP || '0')
  if (cap <= 0) {
    throw new Error(
      `[VaultExecutor] BLOCKED: MAINNET_USDC_CAP not set. ` +
      `Cannot execute without explicit cap configuration.`
    )
  }
  return cap
}

// Program IDs — set in env vars, NOT hardcoded
// AUDIT NOTE: These must match deployed program IDs exactly.
// Mismatch = funds sent to wrong program.
function getProgramIds() {
  const ctoken = process.env.CTOKEN_MARKET_PROGRAM_ID
  const adaptor = process.env.CUSTOM_ADAPTOR_PROGRAM_ID
  const rangerVault = process.env.RANGER_VAULT_PROGRAM_ID
  
  if (!ctoken || !adaptor || !rangerVault) {
    throw new Error(
      '[VaultExecutor] Missing program IDs in environment. ' +
      'Required: CTOKEN_MARKET_PROGRAM_ID, ' +
      'CUSTOM_ADAPTOR_PROGRAM_ID, RANGER_VAULT_PROGRAM_ID'
    )
  }
  
  return {
    ctokenMarket: new PublicKey(ctoken),
    customAdaptor: new PublicKey(adaptor),
    rangerVault: new PublicKey(rangerVault),
  }
}

// ── AUDIT SCOPE: Deposit function ───────────────────
// AUDIT QUESTIONS:
// 1. Is cap check enforced before any transfer?
// 2. Can the cToken program be substituted by attacker?
// 3. Is the amount validated against MAINNET_INITIAL_CAP?
// 4. Is the delegate wallet authorization checked?

export async function executeMainnetDeposit(params: {
  walletAddress: string
  amountUsdc: number
  delegateSigner: any // Privy embedded wallet
  connection: Connection
}): Promise<{
  txSignature: string
  ctokensReceived: number
  deposited: number
}> {
  // ── Safety checks (all must pass) ─────────────────
  
  // 1. Network guard
  const cap = requireMainnet()
  
  // 2. Cap enforcement
  // AUDIT NOTE: This check must be atomic with the transfer.
  // Race condition here could allow deposits to exceed cap.
  if (params.amountUsdc > VAULT.MAINNET_INITIAL_CAP) {
    throw new Error(
      `[VaultExecutor] Deposit ${params.amountUsdc} USDC ` +
      `exceeds initial cap of ${VAULT.MAINNET_INITIAL_CAP} USDC`
    )
  }
  
  // 3. Position size check (20% max)
  const maxPosition = cap * VAULT.MAINNET_MAX_POSITION_PCT
  if (params.amountUsdc > maxPosition) {
    throw new Error(
      `[VaultExecutor] Single deposit exceeds ` +
      `${VAULT.MAINNET_MAX_POSITION_PCT * 100}% position limit`
    )
  }
  
  // 4. AgentSentry pre-approval (MANDATORY)
  // AUDIT NOTE: This external call must complete successfully.
  // No way to bypass AgentSentry and reach the transfer.
  const sentryApproval = await fetch(
    'https://agentsentry.net/api/sentry/check-in',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AGENTSENTRY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: 'crimsonarb-vault-executor',
        transaction: {
          type: 'DEPOSIT',
          fromAddress: params.walletAddress,
          toAddress: process.env.VAULT_TREASURY_ADDRESS,
          amountUsdc: params.amountUsdc,
          token: 'USDC',
        },
      }),
    }
  ).then(r => r.json())
  
  if (sentryApproval.verdict !== 'APPROVE') {
    throw new Error(
      `[VaultExecutor] AgentSentry blocked deposit: ${sentryApproval.reason}`
    )
  }
  
  // 5. Build the actual transaction
  const programs = getProgramIds()
  const walletPubkey = new PublicKey(params.walletAddress)
  const usdcMint = new PublicKey(VAULT.USDC_MINT)
  
  // Get user's USDC token account
  const userUsdcAccount = await getAssociatedTokenAddress(
    usdcMint, walletPubkey
  )
  
  // Get vault USDC account
  const vaultUsdcAccount = await getAssociatedTokenAddress(
    usdcMint, 
    new PublicKey(process.env.VAULT_TREASURY_ADDRESS!)
  )
  
  // Build deposit instruction via custom-adaptor-program CPI
  // AUDIT NOTE: Instruction data encoding must match
  // the Anchor IDL exactly. Any mismatch = failed tx or wrong behavior.
  const depositInstruction = new TransactionInstruction({
    keys: [
      { pubkey: walletPubkey, isSigner: true, isWritable: true },
      { pubkey: userUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: vaultUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: programs.ctokenMarket, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programs.customAdaptor,
    data: encodeDepositInstruction(params.amountUsdc),
  })
  
  const tx = new Transaction().add(depositInstruction)
  const { blockhash } = await params.connection.getLatestBlockhash()
  tx.recentBlockhash = blockhash
  tx.feePayer = walletPubkey
  
  // Sign via Privy delegated wallet
  const signature = await params.delegateSigner.sendTransaction(tx, params.connection)
  
  // Confirm
  await params.connection.confirmTransaction(signature, 'confirmed')
  
  // Log to Supabase audit trail
  await logMainnetTransaction({
    type: 'DEPOSIT',
    walletAddress: params.walletAddress,
    amountUsdc: params.amountUsdc,
    txSignature: signature,
    agentSentryApprovalId: sentryApproval.transactionId,
    network: 'mainnet-beta',
  })
  
  return {
    txSignature: signature,
    ctokensReceived: params.amountUsdc, // 1:1 at launch
    deposited: params.amountUsdc,
  }
}

// Anchor instruction encoder for deposit
// AUDIT NOTE: Must match ctoken-market-program IDL exactly.
function encodeDepositInstruction(amountUsdc: number): Buffer {
  // Anchor discriminator for "deposit" instruction
  // Generated from: sha256("global:deposit")[0..8]
  const discriminator = Buffer.from([
    0xf2, 0x23, 0xc6, 0x89, 0x52, 0xe1, 0xf2, 0xb6
  ])
  const amountBuffer = Buffer.alloc(8)
  // Write as u64 little-endian (Anchor standard)
  const amountLamports = BigInt(Math.floor(amountUsdc * 1_000_000)) // USDC has 6 decimals
  amountBuffer.writeBigUInt64LE(amountLamports)
  return Buffer.concat([discriminator, amountBuffer])
}

async function logMainnetTransaction(data: {
  type: string
  walletAddress: string
  amountUsdc: number
  txSignature: string
  agentSentryApprovalId: string
  network: string
}) {
  // Uses service role — server-side only
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  await supabase.from('trade_actions').insert({
    ...data,
    is_simulation: false,
    created_at: new Date().toISOString(),
  })
}
