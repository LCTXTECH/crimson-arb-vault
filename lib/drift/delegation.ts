/**
 * Drift Protocol Delegated Signer Integration
 * Allows users to delegate trading authority to AgentSentry without withdrawal permissions
 */

// Type definitions for Drift SDK (to be replaced with actual SDK imports when available)
interface PublicKey {
  toBase58(): string
}

interface DriftClient {
  updateUserDelegate(delegatePublicKey: PublicKey): Promise<string>
  getUserAccount(): Promise<{
    delegate: PublicKey | null
    authority: PublicKey
  }>
}

interface DelegationResult {
  success: boolean
  txSignature?: string
  error?: string
  delegateAddress?: string
}

/**
 * CrimsonArb Delegated Signer Public Key
 * This wallet can place trades on behalf of users but CANNOT withdraw funds
 */
const CRIMSON_DELEGATE_PUBKEY = process.env.NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY

/**
 * Initialize Sentry delegation - allows CrimsonArb to trade on user's behalf
 * This is a one-time authorization that persists until revoked
 */
export async function initializeSentryDelegation(
  userClient: DriftClient
): Promise<DelegationResult> {
  try {
    if (!CRIMSON_DELEGATE_PUBKEY) {
      throw new Error("CRIMSON_DELEGATE_PUBKEY not configured")
    }

    // Create PublicKey from environment variable
    const delegatePublicKey = {
      toBase58: () => CRIMSON_DELEGATE_PUBKEY,
    } as PublicKey

    // This instruction authorizes CrimsonArb to place trades but NOT withdraw
    const txSignature = await userClient.updateUserDelegate(delegatePublicKey)

    return {
      success: true,
      txSignature,
      delegateAddress: CRIMSON_DELEGATE_PUBKEY,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delegation failed",
    }
  }
}

/**
 * Revoke Sentry delegation - removes trading authority
 */
export async function revokeSentryDelegation(
  userClient: DriftClient
): Promise<DelegationResult> {
  try {
    // Setting delegate to null/zero address revokes delegation
    const nullDelegate = {
      toBase58: () => "11111111111111111111111111111111",
    } as PublicKey

    const txSignature = await userClient.updateUserDelegate(nullDelegate)

    return {
      success: true,
      txSignature,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Revocation failed",
    }
  }
}

/**
 * Check if user has delegated to CrimsonArb
 */
export async function checkDelegationStatus(
  userClient: DriftClient
): Promise<{
  isDelegated: boolean
  delegateAddress: string | null
}> {
  try {
    const userAccount = await userClient.getUserAccount()

    const isDelegated =
      userAccount.delegate !== null &&
      userAccount.delegate.toBase58() === CRIMSON_DELEGATE_PUBKEY

    return {
      isDelegated,
      delegateAddress: userAccount.delegate?.toBase58() ?? null,
    }
  } catch {
    return {
      isDelegated: false,
      delegateAddress: null,
    }
  }
}

/**
 * Delegation permissions explanation for UI
 */
export const DELEGATION_PERMISSIONS = {
  allowed: [
    "Open and close perpetual positions",
    "Execute delta-neutral basis trades",
    "Rebalance hedge positions",
    "Capture funding rate payments",
    "Activate liquidation guards",
  ],
  notAllowed: [
    "Withdraw funds from your account",
    "Transfer assets to other wallets",
    "Modify account settings",
    "Close your Drift account",
  ],
} as const

/**
 * Generate delegation instruction for manual signing (if needed)
 */
export function getDelegationInstructionData(): {
  programId: string
  instruction: string
  delegateAddress: string
} {
  return {
    programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH", // Drift Program ID
    instruction: "updateUserDelegate",
    delegateAddress: CRIMSON_DELEGATE_PUBKEY || "NOT_CONFIGURED",
  }
}
