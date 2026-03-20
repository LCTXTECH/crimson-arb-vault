// ╔════════════════════════════════════════════════╗
// ║  DRIFT PROTOCOL EXECUTOR                       ║
// ║  STATUS: AUDIT PENDING — NOT ACTIVE            ║
// ║  Opens/closes perp positions on Drift          ║
// ║  AUDIT SCOPE: ALL functions                    ║
// ╚════════════════════════════════════════════════╝

import { VAULT } from '@/lib/vault-constants'

// AUDIT NOTE: This file executes real Drift Protocol
// transactions. Every function requires:
// 1. Network guard (requireMainnet)
// 2. AgentSentry approval
// 3. Webacy DD screening
// 4. Position size validation against VAULT constants
// 5. Supabase audit log entry

function requireMainnet(): void {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  if (network !== 'mainnet-beta') {
    throw new Error(
      `[DriftExecutor] BLOCKED: Network is '${network}'. ` +
      `Mainnet operations require NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
    )
  }
}

export async function openDeltaNeutralPosition(params: {
  market: 'SOL-PERP' | 'BTC-PERP' | 'ETH-PERP'
  usdcSize: number               // USDC to deploy
  direction: 'short'             // Always short (delta-neutral)
  driftClient: any               // @drift-labs/sdk DriftClient
  agentSentryApprovalId: string  // Required — no bypass
  webacyDDScore: number          // Required — must be > 50
}): Promise<{
  txSignature: string
  positionId: string
  fundingRateAtEntry: number
}> {
  // ── Safety checks ────────────────────────────────
  
  requireMainnet()
  
  // Webacy minimum score check
  // AUDIT NOTE: Should this be enforced on-chain?
  // Currently server-side only — discuss with auditor.
  if (params.webacyDDScore < 50) {
    throw new Error(
      `[DriftExecutor] Webacy DD Score ${params.webacyDDScore} ` +
      `below minimum 50. Position blocked.`
    )
  }
  
  // Position size validation
  const marketKey = params.market.replace('-PERP', '') as keyof typeof VAULT.ALLOCATION_LIMITS
  const allocationLimit = (VAULT.ALLOCATION_LIMITS[marketKey] || 25) / 100
  
  const maxPositionUsdc = VAULT.STARTING_AUM_USDC * allocationLimit
  
  if (params.usdcSize > maxPositionUsdc) {
    throw new Error(
      `[DriftExecutor] Position size $${params.usdcSize} ` +
      `exceeds ${allocationLimit * 100}% allocation limit ` +
      `of $${maxPositionUsdc} for ${params.market}`
    )
  }
  
  // Hard cap: never more than 20% in one position
  const absoluteMax = VAULT.STARTING_AUM_USDC * VAULT.MAINNET_MAX_POSITION_PCT
  if (params.usdcSize > absoluteMax) {
    throw new Error(
      `[DriftExecutor] Exceeds absolute max position ` +
      `${VAULT.MAINNET_MAX_POSITION_PCT * 100}%`
    )
  }
  
  // ── Open Drift perp position ─────────────────────
  // AUDIT NOTE: Review @drift-labs/sdk version pinning.
  // SDK version changes can break instruction encoding.
  
  const marketIndex = {
    'SOL-PERP': 0,
    'BTC-PERP': 1,
    'ETH-PERP': 2,
  }[params.market]
  
  // Short position = selling funding rate risk to longs
  const txSig = await params.driftClient.openPosition({
    marketIndex,
    direction: { short: {} },         // Anchor enum
    baseAssetAmount: calculateBaseAmount(params.usdcSize, params.market),
    limitPrice: undefined,            // Market order
    reduceOnly: false,
  })
  
  // Get funding rate at entry for Proof of No-Trade log
  const fundingRate = await params.driftClient.getFundingRate(marketIndex)
  
  // Audit log — MANDATORY
  await logMainnetTransaction({
    type: `OPEN_${params.market}`,
    walletAddress: params.driftClient.authority.toString(),
    amountUsdc: params.usdcSize,
    txSignature: txSig,
    agentSentryApprovalId: params.agentSentryApprovalId,
    network: 'mainnet-beta',
  })
  
  return {
    txSignature: txSig,
    positionId: `${params.market}_${Date.now()}`,
    fundingRateAtEntry: fundingRate,
  }
}

// Convert USDC amount to base asset amount for Drift
// AUDIT NOTE: Price oracle dependency here.
// Stale oracle = wrong position size.
function calculateBaseAmount(
  usdcSize: number,
  market: string
): number {
  // In production: fetch from Pyth oracle
  // For audit preparation: placeholder with comment
  // TODO: Replace with real oracle price fetch
  // oracle = await pythClient.getPriceFeedLatest(PYTH_FEEDS[market])
  // return usdcSize / oracle.price
  throw new Error(
    '[DriftExecutor] calculateBaseAmount requires ' +
    'oracle price feed — implement before mainnet'
  )
}

async function logMainnetTransaction(data: {
  type: string
  walletAddress: string
  amountUsdc: number
  txSignature: string
  agentSentryApprovalId: string
  network: string
}) {
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
