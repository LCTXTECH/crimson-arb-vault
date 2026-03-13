/**
 * Solana Network Configuration
 * Supports both Devnet and Mainnet configurations
 */

export type SolanaNetwork = "devnet" | "mainnet-beta"

interface NetworkConfig {
  name: SolanaNetwork
  rpcUrl: string
  explorerUrl: string
  driftProgramId: string
  driftUiUrl: string
  faucetUrl?: string
}

const NETWORK_CONFIGS: Record<SolanaNetwork, NetworkConfig> = {
  devnet: {
    name: "devnet",
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
    explorerUrl: "https://explorer.solana.com/?cluster=devnet",
    driftProgramId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
    driftUiUrl: "https://app.drift.trade/?network=devnet",
    faucetUrl: "https://faucet.solana.com/",
  },
  "mainnet-beta": {
    name: "mainnet-beta",
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    explorerUrl: "https://explorer.solana.com/",
    driftProgramId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
    driftUiUrl: "https://app.drift.trade/",
  },
}

/**
 * Get the current network configuration
 */
export function getNetworkConfig(): NetworkConfig {
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || "devnet"
  return NETWORK_CONFIGS[network]
}

/**
 * Check if we're running on devnet
 */
export function isDevnet(): boolean {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === "devnet" || 
         process.env.NEXT_PUBLIC_IS_DEVNET === "true"
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(txHash: string): string {
  const config = getNetworkConfig()
  const clusterParam = config.name === "devnet" ? "?cluster=devnet" : ""
  return `https://explorer.solana.com/tx/${txHash}${clusterParam}`
}

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(address: string): string {
  const config = getNetworkConfig()
  const clusterParam = config.name === "devnet" ? "?cluster=devnet" : ""
  return `https://explorer.solana.com/address/${address}${clusterParam}`
}

/**
 * Get Solscan URL for a transaction (mainnet only)
 */
export function getSolscanTxUrl(txHash: string): string {
  const config = getNetworkConfig()
  if (config.name === "devnet") {
    return getExplorerTxUrl(txHash)
  }
  return `https://solscan.io/tx/${txHash}`
}

/**
 * Program IDs for CrimsonArb
 */
export const PROGRAM_IDS = {
  // Voltr SDK Programs (Ranger Earn)
  voltrVault: process.env.NEXT_PUBLIC_VOLTR_VAULT_PROGRAM_ID || "vo1tWgqZMjG4Z2RrPwcm8eMjWAkwuy3ffkvUs9G6AHr",
  voltrAdaptor: process.env.NEXT_PUBLIC_VOLTR_ADAPTOR_PROGRAM_ID || "vo1tWgqZMjG4Z2RrPwcm8eMjWAkwuy3ffkvUs9G6AHr",
  
  // CrimsonArb Custom Programs
  ctokenMarket: process.env.NEXT_PUBLIC_CTOKEN_MARKET_PROGRAM_ID || "",
  customAdaptor: process.env.NEXT_PUBLIC_CUSTOM_ADAPTOR_PROGRAM_ID || "",
  
  // Drift Protocol
  drift: process.env.NEXT_PUBLIC_DRIFT_PROGRAM_ID || "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
}

/**
 * AgentSentry Delegation Configuration
 */
export const SENTRY_CONFIG = {
  delegatePubkey: process.env.NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY || "",
  apiEndpoint: "https://api.agentsentry.net",
}

/**
 * Devnet Mock Data Configuration
 */
export const DEVNET_MOCK = {
  initialBalance: 100000, // $100,000 mock USDC
  mintAmount: 50000, // Amount to mint per click
  whaleTvl: 500000, // Simulated whale TVL
}
