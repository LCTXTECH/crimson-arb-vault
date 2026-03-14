import { createClient } from "@supabase/supabase-js"

// Types for AI decision logging
export type DecisionType = "EXECUTE" | "SKIP" | "GUARD" | "DEFER"

export interface MarketContext {
  symbol: string
  fundingRate: number
  predictedFunding: number
  fundingVelocity: number
  spotPrice: number
  perpPrice: number
  basisSpread: number
}

export interface AIDecisionInput {
  userId?: string
  decisionType: DecisionType
  decisionReason: string
  marketContext: MarketContext
  confidenceScore: number
  riskScore: number
  alphaDecayHours: number
  aiReasoningJson: Record<string, unknown>
  thoughtProcess: string[]
  tradeId?: string
  proposedSide?: "LONG" | "SHORT"
  proposedSize?: number
  proposedLeverage?: number
  expectedYield?: number
  skipReasons?: string[]
  riskFactors?: Record<string, unknown>
}

// Skip reason constants for consistency
export const SKIP_REASONS = {
  LOW_FUNDING: "Funding rate below threshold (< 0.01%)",
  HIGH_VOLATILITY: "Market volatility exceeds risk tolerance",
  ALPHA_DECAY: "Predicted alpha decay within 4 hours",
  LIQUIDITY_GAP: "Insufficient liquidity depth",
  CORRELATION_RISK: "High correlation with existing positions",
  MAX_EXPOSURE: "Position would exceed max exposure limits",
  GUARD_TRIGGERED: "Risk guard triggered - circuit breaker active",
  UNFAVORABLE_BASIS: "Basis spread unfavorable for entry",
  FUNDING_REVERSAL: "Funding rate showing reversal signals",
  TIME_DECAY: "Time decay risk exceeds potential yield",
  SLIPPAGE_RISK: "Expected slippage too high",
  REBALANCE_PENDING: "Rebalance operation pending",
} as const

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not configured")
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Log an AI decision to Supabase
 * This captures EVERY decision - executed trades AND skipped opportunities
 */
export async function logAIDecision(input: AIDecisionInput): Promise<{ id: string } | null> {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from("ai_decisions")
      .insert({
        user_id: input.userId || null,
        decision_type: input.decisionType,
        decision_reason: input.decisionReason,
        symbol: input.marketContext.symbol,
        funding_rate: input.marketContext.fundingRate,
        predicted_funding: input.marketContext.predictedFunding,
        funding_velocity: input.marketContext.fundingVelocity,
        spot_price: input.marketContext.spotPrice,
        perp_price: input.marketContext.perpPrice,
        basis_spread: input.marketContext.basisSpread,
        confidence_score: input.confidenceScore,
        risk_score: input.riskScore,
        alpha_decay_hours: input.alphaDecayHours,
        ai_reasoning_json: input.aiReasoningJson,
        thought_process: input.thoughtProcess,
        trade_id: input.tradeId || null,
        proposed_side: input.proposedSide || null,
        proposed_size: input.proposedSize || null,
        proposed_leverage: input.proposedLeverage || null,
        expected_yield: input.expectedYield || null,
        skip_reasons: input.skipReasons || null,
        risk_factors: input.riskFactors || null,
        market_timestamp: new Date().toISOString(),
      })
      .select("id")
      .single()
    
    if (error) {
      console.error("[AI Decision Logger] Failed to log decision:", error)
      return null
    }
    
    return { id: data.id }
  } catch (err) {
    console.error("[AI Decision Logger] Error:", err)
    return null
  }
}

/**
 * Log a SKIP decision with detailed reasoning
 */
export async function logSkipDecision(
  marketContext: MarketContext,
  skipReasons: string[],
  confidenceScore: number,
  riskScore: number,
  expectedYield: number,
  thoughtProcess: string[]
): Promise<{ id: string } | null> {
  return logAIDecision({
    decisionType: "SKIP",
    decisionReason: `Trade skipped: ${skipReasons[0]}`,
    marketContext,
    confidenceScore,
    riskScore,
    alphaDecayHours: 0,
    aiReasoningJson: {
      skipReasons,
      marketSnapshot: marketContext,
      timestamp: new Date().toISOString(),
    },
    thoughtProcess,
    expectedYield,
    skipReasons,
    riskFactors: {
      primaryReason: skipReasons[0],
      allReasons: skipReasons,
      riskScore,
    },
  })
}

/**
 * Log a GUARD decision (risk circuit breaker)
 */
export async function logGuardDecision(
  marketContext: MarketContext,
  guardReason: string,
  riskFactors: Record<string, unknown>,
  thoughtProcess: string[]
): Promise<{ id: string } | null> {
  return logAIDecision({
    decisionType: "GUARD",
    decisionReason: `Guard triggered: ${guardReason}`,
    marketContext,
    confidenceScore: 0,
    riskScore: 100,
    alphaDecayHours: 0,
    aiReasoningJson: {
      guardReason,
      riskFactors,
      timestamp: new Date().toISOString(),
    },
    thoughtProcess,
    skipReasons: [guardReason],
    riskFactors,
  })
}

/**
 * Log an EXECUTE decision with trade details
 */
export async function logExecuteDecision(
  marketContext: MarketContext,
  tradeId: string,
  side: "LONG" | "SHORT",
  size: number,
  leverage: number,
  expectedYield: number,
  confidenceScore: number,
  thoughtProcess: string[]
): Promise<{ id: string } | null> {
  return logAIDecision({
    decisionType: "EXECUTE",
    decisionReason: `Executing ${side} ${size} ${marketContext.symbol} @ ${leverage}x`,
    marketContext,
    confidenceScore,
    riskScore: 100 - confidenceScore,
    alphaDecayHours: expectedYield > 0.5 ? 12 : 6,
    aiReasoningJson: {
      tradeDetails: { side, size, leverage },
      expectedYield,
      timestamp: new Date().toISOString(),
    },
    thoughtProcess,
    tradeId,
    proposedSide: side,
    proposedSize: size,
    proposedLeverage: leverage,
    expectedYield,
  })
}

/**
 * Fetch recent AI decisions for the dashboard
 */
export async function getRecentDecisions(
  limit: number = 50,
  decisionTypes?: DecisionType[]
): Promise<unknown[]> {
  try {
    const supabase = getSupabaseClient()
    
    let query = supabase
      .from("ai_decisions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
    
    if (decisionTypes && decisionTypes.length > 0) {
      query = query.in("decision_type", decisionTypes)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("[AI Decision Logger] Failed to fetch decisions:", error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error("[AI Decision Logger] Error fetching decisions:", err)
    return []
  }
}

/**
 * Get decision analytics for the investor report
 */
export async function getDecisionAnalytics(
  symbol?: string,
  days: number = 7
): Promise<{
  totalDecisions: number
  executedCount: number
  skippedCount: number
  guardedCount: number
  avgConfidence: number
  avgRiskScore: number
  topSkipReasons: string[]
}> {
  try {
    const supabase = getSupabaseClient()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    
    let query = supabase
      .from("ai_decisions")
      .select("decision_type, confidence_score, risk_score, skip_reasons")
      .gte("created_at", since)
    
    if (symbol) {
      query = query.eq("symbol", symbol)
    }
    
    const { data, error } = await query
    
    if (error || !data) {
      return {
        totalDecisions: 0,
        executedCount: 0,
        skippedCount: 0,
        guardedCount: 0,
        avgConfidence: 0,
        avgRiskScore: 0,
        topSkipReasons: [],
      }
    }
    
    const executedCount = data.filter(d => d.decision_type === "EXECUTE").length
    const skippedCount = data.filter(d => d.decision_type === "SKIP").length
    const guardedCount = data.filter(d => d.decision_type === "GUARD").length
    
    const avgConfidence = data.length > 0
      ? data.reduce((sum, d) => sum + (d.confidence_score || 0), 0) / data.length
      : 0
    
    const avgRiskScore = data.length > 0
      ? data.reduce((sum, d) => sum + (d.risk_score || 0), 0) / data.length
      : 0
    
    // Count skip reasons
    const skipReasonCounts: Record<string, number> = {}
    data.forEach(d => {
      if (d.skip_reasons) {
        d.skip_reasons.forEach((reason: string) => {
          skipReasonCounts[reason] = (skipReasonCounts[reason] || 0) + 1
        })
      }
    })
    
    const topSkipReasons = Object.entries(skipReasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason]) => reason)
    
    return {
      totalDecisions: data.length,
      executedCount,
      skippedCount,
      guardedCount,
      avgConfidence: Math.round(avgConfidence),
      avgRiskScore: Math.round(avgRiskScore),
      topSkipReasons,
    }
  } catch (err) {
    console.error("[AI Decision Logger] Error fetching analytics:", err)
    return {
      totalDecisions: 0,
      executedCount: 0,
      skippedCount: 0,
      guardedCount: 0,
      avgConfidence: 0,
      avgRiskScore: 0,
      topSkipReasons: [],
    }
  }
}
