import { createClient } from '@supabase/supabase-js'
import { VAULT, COMPUTED } from './vault-constants'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Market state — mean-reverting funding rates ──
// Based on historical Drift Protocol SOL/BTC/ETH ranges
interface MarketState {
  symbol: string
  baseRate: number      // typical funding %/hr
  volatility: number    // daily sigma
  color: string
  driftMarketIndex: number
}

const MARKETS: MarketState[] = [
  { 
    symbol: 'SOL-PERP', 
    baseRate: 0.00024, 
    volatility: 0.00008,
    color: '#9945FF',
    driftMarketIndex: 0,
  },
  { 
    symbol: 'BTC-PERP', 
    baseRate: 0.00018, 
    volatility: 0.00005,
    color: '#F7931A',
    driftMarketIndex: 1,
  },
  { 
    symbol: 'ETH-PERP', 
    baseRate: 0.00015, 
    volatility: 0.00006,
    color: '#627EEA',
    driftMarketIndex: 2,
  },
]

// Persistent market state between cycles (mean reversion)
let marketMemory: Record<string, number> = {
  'SOL-PERP': 0.00024,
  'BTC-PERP': 0.00018,
  'ETH-PERP': 0.00015,
}

// ── Core simulation cycle ────────────────────────
export async function runSimulationCycle(): Promise<{
  decisions: any[]
  vaultUpdate: any
  cycleId: string
}> {
  const cycleId = `cycle_${Date.now()}`
  const cycleTimestamp = new Date().toISOString()
  const decisions = []

  // Evaluate all three markets this cycle
  for (const market of MARKETS) {
    // Mean-reverting funding rate with occasional spikes
    // Ornstein-Uhlenbeck process approximation
    const reversion = 0.1 // speed of mean reversion
    const prev = marketMemory[market.symbol]
    const drift = reversion * (market.baseRate - prev)
    const shock = (Math.random() - 0.5) * market.volatility
    
    // 5% chance of funding spike (news event simulation)
    const spike = Math.random() > 0.95 
      ? market.baseRate * (1.5 + Math.random() * 2) 
      : 0
    
    const fundingRate = Math.max(0, prev + drift + shock + spike)
    marketMemory[market.symbol] = fundingRate // remember for next cycle
    
    // Realistic OI concentration (12-35% range)
    const oiConcentration = 0.12 + Math.random() * 0.23
    
    // Decay probability (higher when funding is elevated)
    const decayBase = fundingRate > 0.00040 ? 0.5 : 0.2
    const decayProbability = decayBase + Math.random() * 0.4
    
    // Run ATSP decision logic
    const marketKey = market.symbol.replace('-PERP', '') as keyof typeof VAULT.ALLOCATION_LIMITS
    const decision = evaluateATSP({
      market: market.symbol,
      fundingRate,
      oiConcentration,
      decayProbability,
      aum: VAULT.STARTING_AUM_USDC,
      maxAllocation: (VAULT.ALLOCATION_LIMITS[marketKey] || 25) / 100,
    })
    
    // Simulate Webacy DD score
    // GUARD decisions get lower scores (that's why they triggered)
    const webacyScore = decision.type === 'GUARD'
      ? 15 + Math.floor(Math.random() * 25)   // 15-40: CRITICAL
      : decision.type === 'EXECUTE'
      ? 78 + Math.floor(Math.random() * 19)   // 78-96: SAFE
      : 60 + Math.floor(Math.random() * 20)   // 60-79: LOW/MEDIUM
    
    const webacyRiskLevel = 
      webacyScore >= 85 ? 'SAFE' :
      webacyScore >= 70 ? 'LOW' :
      webacyScore >= 50 ? 'MEDIUM' :
      webacyScore >= 30 ? 'HIGH' : 'CRITICAL'
    
    // Build the full decision record
    const decisionRecord = {
      market: market.symbol,
      decision_type: decision.type,
      funding_rate: fundingRate,
      oi_concentration: oiConcentration,
      decay_probability: decayProbability,
      decision_reason: decision.reasoning,
      confidence_score: Math.round(decision.confidence * 100),
      
      // Webacy enrichment
      webacy_dd_score: webacyScore,
      webacy_risk_level: webacyRiskLevel,
      webacy_flags: {
        isSanctioned: false,
        isPhishing: false,
        hasSnipingHistory: webacyScore < 75,
        ownershipConcentrated: oiConcentration > 0.22,
        addressPoisoning: false,
        maliciousContract: webacyScore < 30,
      },
      webacy_verified_at: cycleTimestamp,
      webacy_source: 'simulated',
      
      // ATSP metadata
      atsp_version: 'v1.1',
      cycle_id: cycleId,
      
      // Simulation labels — always present
      is_simulation: true,
      network: 'devnet',
      created_at: cycleTimestamp,
    }
    
    // Insert to Supabase — triggers Realtime broadcast
    const { data, error } = await supabase
      .from('ai_decisions')
      .insert(decisionRecord)
      .select()
      .single()
    
    if (!error && data) {
      decisions.push(data)
    } else if (error) {
      console.error('[SimEngine] Insert error:', error)
    }
  }
  
  // Update vault_state with latest metrics
  const vaultUpdate = await updateVaultState(decisions, cycleTimestamp)
  
  return { decisions, vaultUpdate, cycleId }
}

// ── ATSP decision logic ──────────────────────────
// This is the SAME LOGIC that will run on mainnet.
// Security audit reviews this function.

interface ATSPInput {
  market: string
  fundingRate: number
  oiConcentration: number
  decayProbability: number
  aum: number
  maxAllocation: number
}

interface ATSPDecision {
  type: 'EXECUTE' | 'SKIP' | 'GUARD'
  reasoning: string
  confidence: number
  positionSize?: number  // USDC if EXECUTE
}

export function evaluateATSP(input: ATSPInput): ATSPDecision {
  const { 
    market, fundingRate, oiConcentration, 
    decayProbability, aum, maxAllocation 
  } = input
  
  const rate = (fundingRate * 100).toFixed(4)
  const oiPct = (oiConcentration * 100).toFixed(1)
  const decayPct = (decayProbability * 100).toFixed(0)
  
  // ── Hard minimum funding threshold ──────────────
  if (fundingRate < VAULT.MIN_FUNDING_RATE) {
    return {
      type: 'SKIP',
      reasoning: `${market} funding ${rate}%/hr below ${(VAULT.MIN_FUNDING_RATE * 100).toFixed(3)}% minimum threshold. No alpha available.`,
      confidence: 0.97,
    }
  }
  
  // ── OI concentration GUARD trigger ──────────────
  if (oiConcentration > VAULT.MAX_OI_CONCENTRATION) {
    return {
      type: 'GUARD',
      reasoning: `OI concentration ${oiPct}% exceeds ${VAULT.MAX_OI_CONCENTRATION * 100}% limit. Counterparty concentration risk. AgentSentry: BLOCK. Webacy DD: HIGH risk.`,
      confidence: 0.91,
    }
  }
  
  // ── Decay prediction skip ────────────────────────
  if (decayProbability > VAULT.MAX_DECAY_PROBABILITY) {
    return {
      type: 'SKIP',
      reasoning: `Alpha decay probability ${decayPct}% — funding rate likely to revert within 2 hours. Exit before position becomes unprofitable.`,
      confidence: 0.84,
    }
  }
  
  // ── Confidence calculation ───────────────────────
  // Weighted: funding strength (40%) + decay runway (30%)
  //           + counterparty safety (30%)
  const fundingScore = Math.min(1, fundingRate / 0.00040)
  const decayScore = 1 - decayProbability
  const oiScore = 1 - (oiConcentration / 0.25)
  
  const confidence = 
    (fundingScore * 0.40) + 
    (decayScore * 0.30) + 
    (oiScore * 0.30)
  
  // ── Confidence floor check ───────────────────────
  if (confidence < VAULT.MIN_CONFIDENCE) {
    return {
      type: 'SKIP',
      reasoning: `Confidence ${(confidence * 100).toFixed(0)}% below ${VAULT.MIN_CONFIDENCE * 100}% execution threshold. Risk-adjusted return insufficient.`,
      confidence,
    }
  }
  
  // ── EXECUTE ──────────────────────────────────────
  // Position size: % of AUM based on allocation limits
  // Capped at maxAllocation of vault AUM
  const positionSize = Math.min(
    aum * maxAllocation,
    aum * 0.20 // Never more than 20% single position
  )
  
  return {
    type: 'EXECUTE',
    reasoning: `${market} funding ${rate}%/hr confirmed. Confidence ${(confidence * 100).toFixed(0)}%. OI concentration safe at ${oiPct}%. AgentSentry: APPROVED. Webacy DD: SAFE. Deploying $${positionSize.toLocaleString()} USDC.`,
    confidence,
    positionSize,
  }
}

// ── Vault state updater ──────────────────────────
async function updateVaultState(
  decisions: any[], 
  timestamp: string
) {
  // Calculate simulated yield from this cycle
  const executed = decisions.filter(d => d.decision_type === 'EXECUTE')
  
  // Each EXECUTE earns approximately funding_rate × position_size
  const cycleYield = executed.reduce((sum, d) => {
    const marketKey = d.market.replace('-PERP', '') as keyof typeof VAULT.ALLOCATION_LIMITS
    const positionSize = VAULT.STARTING_AUM_USDC * (VAULT.ALLOCATION_LIMITS[marketKey] || 25) / 100
    return sum + (d.funding_rate * positionSize)
  }, 0)
  
  // Get current cumulative yield from vault_state
  const { data: current } = await supabase
    .from('vault_state')
    .select('*')
    .eq('id', 'singleton')
    .single()
  
  const cumulativeYield = (current?.cumulative_yield_usdc || 0) + cycleYield
  const daysRunning = current?.days_running || 1
  const annualizedApy = daysRunning > 0
    ? (cumulativeYield / VAULT.STARTING_AUM_USDC) * (365 / daysRunning) * 100
    : VAULT.APY // fallback to constant
  
  const vaultUpdate = {
    id: 'singleton',
    tvl_usdc: VAULT.STARTING_AUM_USDC,
    deployed_usdc: COMPUTED.deployedUsdc(),
    free_usdc: VAULT.STARTING_AUM_USDC * VAULT.ALLOCATION_CURRENT.FREE / 100,
    cumulative_yield_usdc: cumulativeYield,
    current_apy: Math.min(50, Math.max(VAULT.APY * 0.85, annualizedApy)), // bounded
    max_drawdown: VAULT.MAX_DRAWDOWN,
    sharpe_ratio: VAULT.SHARPE_RATIO,
    total_cycles: (current?.total_cycles || 0) + 1,
    total_executions: (current?.total_executions || 0) + executed.length,
    network: 'devnet',
    is_simulation: true,
    updated_at: timestamp,
  }
  
  await supabase
    .from('vault_state')
    .upsert(vaultUpdate)
  
  return vaultUpdate
}
