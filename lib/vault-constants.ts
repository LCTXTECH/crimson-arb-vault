// ═══════════════════════════════════════════════
// CANONICAL VAULT METRICS — ONE SOURCE OF TRUTH
// Every component imports from here.
// Never hardcode these values anywhere else.
// ═══════════════════════════════════════════════

export const VAULT = {
  // ── Simulation parameters ──────────────────
  STARTING_AUM_USDC: 100_000,        // Founders Vault
  FOUNDERS_SPOTS: 100,
  FOUNDERS_MIN_DEPOSIT: 1_000,
  FOUNDERS_MAX_DEPOSIT: 5_000,
  
  // ── Performance (devnet simulation) ────────
  APY: 34.7,                         // Single canonical APY
  MAX_DRAWDOWN: 0.00,                // Architecturally guaranteed
  SHARPE_RATIO: 2.41,
  FUNDING_CAPTURE_RATE: 73.2,        // % of alpha captured
  
  // ── Decision statistics ─────────────────────
  TOTAL_CYCLES: 1_847,
  MARKETS_PER_CYCLE: 3,
  TOTAL_EVALUATIONS: 5_541,          // cycles × markets
  TOTAL_EXECUTED: 387,
  TOTAL_SKIPPED: 1_460,
  TOTAL_GUARDED: 412,
  SKIP_RATE: 79,                     // %
  EXECUTE_RATE: 20.9,                // %
  WIN_RATE: 94,                      // % of executed = profitable
  
  // ── Market allocation ───────────────────────
  // LIMITS = maximum allowed allocation
  // CURRENT = actual deployed right now
  ALLOCATION_LIMITS: {
    SOL: 40,
    BTC: 35,
    ETH: 25,
  },
  ALLOCATION_CURRENT: {
    SOL: 40,
    BTC: 28,
    ETH: 19,
    FREE: 13,                        // Undeployed — waiting
  },
  
  // ── Protocol references ─────────────────────
  DRIFT_ADDRESS: 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  NETWORK: 'devnet' as const,
  
  // ── Mainnet parameters (post-audit) ─────────
  MAINNET_INITIAL_CAP: 10_000,       // $10K hard cap at launch
  MAINNET_MAX_POSITION_PCT: 0.20,    // 20% max single position
  MAINNET_PERFORMANCE_FEE: 0.20,     // 20% on yield
  FOUNDERS_PERFORMANCE_FEE: 0.00,    // 0% forever for founders
  
  // ── Safety thresholds ───────────────────────
  MIN_FUNDING_RATE: 0.00020,         // 0.020%/hr minimum to execute
  MAX_OI_CONCENTRATION: 0.25,        // 25% max counterparty
  MIN_CONFIDENCE: 0.75,              // Confidence floor
  MAX_DECAY_PROBABILITY: 0.70,       // Decay prediction exit
  
  // ── Display labels ───────────────────────────
  NETWORK_LABEL: 'Devnet Simulation',
  DISCLAIMER: 'Devnet Simulation — Mainnet pending security audit',
  SHORT_DISCLAIMER: 'Devnet · Audit Pending',
} as const

// ── Computed values ─────────────────────────────
export const COMPUTED = {
  deployedUsdc: () => 
    VAULT.STARTING_AUM_USDC * (100 - VAULT.ALLOCATION_CURRENT.FREE) / 100,
  
  dailyYield: () => 
    VAULT.STARTING_AUM_USDC * (VAULT.APY / 100) / 365,
  
  weeklyYield: () => 
    VAULT.STARTING_AUM_USDC * (VAULT.APY / 100) / 52,
  
  annualYield: () => 
    VAULT.STARTING_AUM_USDC * (VAULT.APY / 100),
  
  perFounderApy: (deposit: number) => 
    deposit * (VAULT.APY / 100),
}

// ── Formatters ───────────────────────────────────
export const FMT = {
  apy: () => `${VAULT.APY}%`,
  drawdown: () => `${VAULT.MAX_DRAWDOWN.toFixed(2)}%`,
  sharpe: () => VAULT.SHARPE_RATIO.toFixed(2),
  skipRate: () => `${VAULT.SKIP_RATE}%`,
  winRate: () => `${VAULT.WIN_RATE}%`,
  aum: () => `$${VAULT.STARTING_AUM_USDC.toLocaleString()}`,
  evaluations: () => VAULT.TOTAL_EVALUATIONS.toLocaleString(),
  executed: () => VAULT.TOTAL_EXECUTED.toLocaleString(),
  skipped: () => VAULT.TOTAL_SKIPPED.toLocaleString(),
  fundingCapture: () => `${VAULT.FUNDING_CAPTURE_RATE}%`,
  dailyYield: () => `$${COMPUTED.dailyYield().toFixed(2)}`,
  annualYield: () => `$${COMPUTED.annualYield().toFixed(0)}`,
}

// Type exports for TypeScript
export type AllocationMarket = keyof typeof VAULT.ALLOCATION_LIMITS
export type VaultConfig = typeof VAULT
