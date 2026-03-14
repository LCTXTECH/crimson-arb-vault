"use client"

import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Drift Devnet Program IDs
export const DRIFT_DEVNET_CONFIG = {
  programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  statsId: "6W9yiHDCZ9d9f52fQ6JpU13yidU5mH63bNo1vL9C3H9G",
  usdcMint: "8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2", // Drift Devnet USDC
  spotMarketIndex: 0,
}

// Ranger Devnet Program IDs
export const RANGER_DEVNET_CONFIG = {
  strategyId: "vo1tWgqZMjG89MPASr4TT4aBECxKHys5XEbisLhJ27K",
  vaultAdaptor: process.env.NEXT_PUBLIC_RANGER_VAULT_ADAPTOR || "",
}

export interface SandboxFundingResult {
  success: boolean
  solAirdropped: number
  usdcDeposited: number
  txSignatures: string[]
  error?: string
}

/**
 * Request SOL airdrop from Devnet faucet
 */
export async function requestSolAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number = 2
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    )
    
    // Wait for confirmation
    const latestBlockhash = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
      signature: airdropSignature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    })

    return { success: true, signature: airdropSignature }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Airdrop failed",
    }
  }
}

/**
 * Onboard a new sandbox tester with SOL and Mock USDC
 * This is a simplified version - full implementation requires @drift-labs/sdk
 */
export async function onboardSandboxTester(
  walletPublicKey: string,
  rpcUrl: string = "https://api.devnet.solana.com"
): Promise<SandboxFundingResult> {
  const connection = new Connection(rpcUrl, "confirmed")
  const publicKey = new PublicKey(walletPublicKey)
  const txSignatures: string[] = []

  try {
    // Step 1: Airdrop 2 SOL for gas
    const solResult = await requestSolAirdrop(connection, publicKey, 2)
    if (!solResult.success) {
      return {
        success: false,
        solAirdropped: 0,
        usdcDeposited: 0,
        txSignatures,
        error: `SOL airdrop failed: ${solResult.error}`,
      }
    }
    if (solResult.signature) txSignatures.push(solResult.signature)

    // Step 2: Mock USDC deposit would be done via Drift SDK
    // For now, we return success with simulated values
    // Full implementation requires:
    // - DriftClient initialization
    // - Calling the devnet faucet for mock USDC
    // - Depositing to user's Drift subaccount

    return {
      success: true,
      solAirdropped: 2,
      usdcDeposited: 100000, // Simulated - actual deposit requires Drift SDK
      txSignatures,
    }
  } catch (error) {
    return {
      success: false,
      solAirdropped: 0,
      usdcDeposited: 0,
      txSignatures,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get current SOL balance for a wallet
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey)
  return balance / LAMPORTS_PER_SOL
}

/**
 * Check if wallet has sufficient SOL for transactions
 */
export async function hasSufficientGas(
  connection: Connection,
  publicKey: PublicKey,
  minimumSol: number = 0.05
): Promise<boolean> {
  const balance = await getSolBalance(connection, publicKey)
  return balance >= minimumSol
}

/**
 * Simulate a whale deposit for demo purposes
 * Returns mock transaction data for UI display
 */
export function simulateWhaleDeposit(amount: number = 500000): {
  txHash: string
  amount: number
  timestamp: Date
  status: "success"
} {
  return {
    txHash: `sim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
    amount,
    timestamp: new Date(),
    status: "success",
  }
}

/**
 * Get Devnet explorer URL for a transaction
 */
export function getDevnetExplorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`
}

/**
 * Get Devnet explorer URL for an address
 */
export function getDevnetAddressUrl(address: string): string {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`
}

/**
 * "Jobu" Easter Egg - Offer Rum to the Digital Jobu
 * Airdrops 0.01 SOL for gas as a ritual offering
 * "Bats, they are sick. I take fear from funding rates." - Digital Jobu
 */
export async function offerRum(
  walletPublicKey: string,
  rpcUrl: string = "https://api.devnet.solana.com"
): Promise<{ success: boolean; message: string; signature?: string }> {
  const connection = new Connection(rpcUrl, "confirmed")
  const publicKey = new PublicKey(walletPublicKey)

  try {
    // Jobu accepts the offering - airdrop 0.01 SOL for gas
    const result = await requestSolAirdrop(connection, publicKey, 0.01)
    
    if (result.success) {
      return {
        success: true,
        message: "Jobu thanks you for the rum. Gas fees replenished. The bats are no longer sick.",
        signature: result.signature,
      }
    } else {
      return {
        success: false,
        message: "Jobu is displeased. The faucet spirits are restless. Try again.",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Jobu says: 'Is very bad to steal Jobu's rum. Is very bad.'",
    }
  }
}

/**
 * Jobu's wisdom - Returns a random Jobu quote for the AI reasoning
 */
export function getJobuWisdom(): string {
  const wisdom = [
    "Bats, they are sick. I take fear from funding rates.",
    "Jobu says: This basis spread is cursed. We wait.",
    "The rum has been offered. Alpha capture initiated.",
    "Jobu sees the funding velocity. It is... acceptable.",
    "I am Jobu. I take fear from the market. You no worry.",
    "Is very bad to chase yield without Jobu's blessing.",
    "Jobu has spoken. The Sentry will guard the treasury.",
    "You want to win? Jobu help you win. But first, the rum.",
  ]
  return wisdom[Math.floor(Math.random() * wisdom.length)]
}
