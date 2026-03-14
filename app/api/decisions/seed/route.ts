import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Realistic market scenarios demonstrating Sentry "Discipline"
const SKIP_SCENARIOS = [
  {
    symbol: "SOL-PERP",
    funding_rate: 0.0012,
    predicted_funding: 0.0008,
    funding_velocity: -0.0004,
    spot_price: 142.35,
    perp_price: 142.52,
    basis_spread: 0.12,
    confidence_score: 45,
    risk_score: 72,
    alpha_decay_hours: 2.5,
    decision_reason: "Funding rate trending negative; alpha window closing within 3 hours",
    skip_reasons: ["FUNDING_DECAY_IMMINENT", "LOW_CONFIDENCE"],
    thought_process: [
      "Analyzing 24h funding velocity: -0.0004/hr decay detected",
      "Current spread (0.12%) below minimum threshold (0.15%)",
      "Liquidity depth adequate but decay risk exceeds tolerance",
      "DECISION: SKIP - Wait for next funding epoch"
    ],
    proposed_side: "SHORT",
    proposed_size: 500,
    proposed_leverage: 3,
    expected_yield: 8.2
  },
  {
    symbol: "BTC-PERP",
    funding_rate: 0.0028,
    predicted_funding: 0.0015,
    funding_velocity: -0.0008,
    spot_price: 67420.50,
    perp_price: 67495.00,
    basis_spread: 0.11,
    confidence_score: 38,
    risk_score: 81,
    alpha_decay_hours: 1.8,
    decision_reason: "Volatility spike detected; basis compression likely within 2h",
    skip_reasons: ["HIGH_VOLATILITY", "INSUFFICIENT_LIQUIDITY"],
    thought_process: [
      "BTC 1h volatility: 2.8% (threshold: 2.0%)",
      "Orderbook depth insufficient for $50k position",
      "Predicted slippage: 0.15% exceeds 0.10% max",
      "DECISION: SKIP - Volatility exceeds risk parameters"
    ],
    proposed_side: "SHORT",
    proposed_size: 0.8,
    proposed_leverage: 2,
    expected_yield: 12.5
  },
  {
    symbol: "ETH-PERP",
    funding_rate: 0.0018,
    predicted_funding: 0.0020,
    funding_velocity: 0.0001,
    spot_price: 3245.80,
    perp_price: 3251.20,
    basis_spread: 0.17,
    confidence_score: 52,
    risk_score: 65,
    alpha_decay_hours: 4.2,
    decision_reason: "Conflicting signals between funding and OI; deferring to next evaluation",
    skip_reasons: ["CONFLICTING_SIGNALS", "UNCERTAIN_DIRECTION"],
    thought_process: [
      "Funding stable but OI declining 3.2% over 4h",
      "Whale activity detected on spot side - potential unwind",
      "Signal conflict: positive funding vs declining OI",
      "DECISION: SKIP - Awaiting signal convergence"
    ],
    proposed_side: "SHORT",
    proposed_size: 15,
    proposed_leverage: 2.5,
    expected_yield: 9.8
  },
  {
    symbol: "SOL-PERP",
    funding_rate: 0.0008,
    predicted_funding: 0.0005,
    funding_velocity: -0.0002,
    spot_price: 141.90,
    perp_price: 142.05,
    basis_spread: 0.11,
    confidence_score: 41,
    risk_score: 58,
    alpha_decay_hours: 3.1,
    decision_reason: "Basis spread below minimum threshold for position sizing",
    skip_reasons: ["LOW_SPREAD", "SUBOPTIMAL_ENTRY"],
    thought_process: [
      "Current basis: 0.11% < 0.15% minimum threshold",
      "Entry would require extended holding for breakeven",
      "Opportunity cost analysis: better setups likely within 6h",
      "DECISION: SKIP - Suboptimal entry conditions"
    ],
    proposed_side: "SHORT",
    proposed_size: 800,
    proposed_leverage: 2,
    expected_yield: 5.2
  },
  {
    symbol: "JTO-PERP",
    funding_rate: 0.0045,
    predicted_funding: 0.0025,
    funding_velocity: -0.0012,
    spot_price: 3.42,
    perp_price: 3.48,
    basis_spread: 1.75,
    confidence_score: 62,
    risk_score: 78,
    alpha_decay_hours: 1.2,
    decision_reason: "High spread but rapid decay; window too narrow for safe execution",
    skip_reasons: ["RAPID_DECAY", "EXECUTION_RISK"],
    thought_process: [
      "JTO funding elevated at 0.45% but velocity -0.12%/hr",
      "Projected decay to 0.25% within 90 minutes",
      "Execution latency risk: ~15s avg, decay could erase alpha",
      "DECISION: SKIP - Decay velocity exceeds execution margin"
    ],
    proposed_side: "SHORT",
    proposed_size: 5000,
    proposed_leverage: 3,
    expected_yield: 18.5
  }
]

const GUARD_SCENARIOS = [
  {
    symbol: "SOL-PERP",
    funding_rate: -0.0025,
    predicted_funding: -0.0035,
    funding_velocity: -0.0008,
    spot_price: 138.50,
    perp_price: 137.80,
    basis_spread: -0.51,
    confidence_score: 28,
    risk_score: 92,
    alpha_decay_hours: 0.5,
    decision_reason: "GUARD TRIGGERED: Negative funding with accelerating decay",
    skip_reasons: ["NEGATIVE_FUNDING", "MAXIMUM_RISK_EXCEEDED"],
    thought_process: [
      "ALERT: Funding flipped negative at -0.25%",
      "Basis inverted: perp trading below spot",
      "Risk score 92 exceeds GUARD threshold (85)",
      "GUARD: Position would incur funding loss, not capture"
    ],
    proposed_side: "SHORT",
    proposed_size: 1000,
    proposed_leverage: 3,
    expected_yield: -12.5
  },
  {
    symbol: "BTC-PERP",
    funding_rate: 0.0085,
    predicted_funding: 0.0020,
    funding_velocity: -0.0025,
    spot_price: 68500.00,
    perp_price: 69150.00,
    basis_spread: 0.95,
    confidence_score: 35,
    risk_score: 88,
    alpha_decay_hours: 0.8,
    decision_reason: "GUARD TRIGGERED: Extreme funding rate indicates imminent mean reversion",
    skip_reasons: ["EXTREME_FUNDING", "REVERSION_IMMINENT"],
    thought_process: [
      "ALERT: BTC funding at 0.85% - 3.5 std devs above mean",
      "Historical analysis: 94% reversion within 2h at this level",
      "Entering now would likely face adverse funding flip",
      "GUARD: Extreme conditions require capital preservation"
    ],
    proposed_side: "SHORT",
    proposed_size: 1.5,
    proposed_leverage: 2,
    expected_yield: 35.0
  },
  {
    symbol: "ETH-PERP",
    funding_rate: 0.0042,
    predicted_funding: 0.0010,
    funding_velocity: -0.0018,
    spot_price: 3180.00,
    perp_price: 3225.00,
    basis_spread: 1.42,
    confidence_score: 42,
    risk_score: 86,
    alpha_decay_hours: 1.1,
    decision_reason: "GUARD TRIGGERED: Liquidity withdrawal detected on target exchange",
    skip_reasons: ["LIQUIDITY_CRISIS", "EXECUTION_IMPOSSIBLE"],
    thought_process: [
      "ALERT: Drift SOL-PERP book depth dropped 65% in 10 minutes",
      "Spread widened to 0.08% from 0.02% baseline",
      "Large limit orders pulled - whale activity suspected",
      "GUARD: Cannot execute at acceptable slippage"
    ],
    proposed_side: "SHORT",
    proposed_size: 25,
    proposed_leverage: 2.5,
    expected_yield: 18.2
  },
  {
    symbol: "WIF-PERP",
    funding_rate: 0.0125,
    predicted_funding: 0.0030,
    funding_velocity: -0.0045,
    spot_price: 2.85,
    perp_price: 2.98,
    basis_spread: 4.56,
    confidence_score: 55,
    risk_score: 91,
    alpha_decay_hours: 0.6,
    decision_reason: "GUARD TRIGGERED: Meme coin volatility exceeds all risk thresholds",
    skip_reasons: ["EXTREME_VOLATILITY", "MEME_COIN_RISK"],
    thought_process: [
      "ALERT: WIF 1h volatility at 8.5% (threshold: 3.0%)",
      "Social sentiment spike detected - potential pump/dump",
      "Liquidation cascade risk elevated",
      "GUARD: Memecoin risk parameters exceeded"
    ],
    proposed_side: "SHORT",
    proposed_size: 10000,
    proposed_leverage: 2,
    expected_yield: 52.0
  },
  {
    symbol: "SOL-PERP",
    funding_rate: 0.0055,
    predicted_funding: 0.0015,
    funding_velocity: -0.0020,
    spot_price: 145.20,
    perp_price: 146.80,
    basis_spread: 1.10,
    confidence_score: 48,
    risk_score: 87,
    alpha_decay_hours: 0.9,
    decision_reason: "GUARD TRIGGERED: Oracle divergence detected between exchanges",
    skip_reasons: ["ORACLE_DIVERGENCE", "PRICE_MANIPULATION_RISK"],
    thought_process: [
      "ALERT: SOL price divergence 1.2% between Pyth and Switchboard",
      "Potential oracle manipulation or delayed update",
      "Position could be liquidated on incorrect mark price",
      "GUARD: Oracle integrity compromised"
    ],
    proposed_side: "SHORT",
    proposed_size: 750,
    proposed_leverage: 3,
    expected_yield: 22.5
  }
]

const EXECUTE_SCENARIOS = [
  {
    symbol: "SOL-PERP",
    funding_rate: 0.0035,
    predicted_funding: 0.0032,
    funding_velocity: -0.0001,
    spot_price: 143.50,
    perp_price: 144.20,
    basis_spread: 0.49,
    confidence_score: 85,
    risk_score: 32,
    alpha_decay_hours: 8.5,
    decision_reason: "Optimal entry: stable funding with high confidence",
    skip_reasons: [],
    thought_process: [
      "Funding rate stable at 0.35% with minimal decay",
      "Liquidity depth: $2.5M within 0.1% of mid",
      "Confidence 85% exceeds execution threshold (75%)",
      "EXECUTE: Conditions optimal for basis capture"
    ],
    proposed_side: "SHORT",
    proposed_size: 500,
    proposed_leverage: 2,
    expected_yield: 15.2
  },
  {
    symbol: "ETH-PERP",
    funding_rate: 0.0028,
    predicted_funding: 0.0025,
    funding_velocity: -0.0002,
    spot_price: 3250.00,
    perp_price: 3268.50,
    basis_spread: 0.57,
    confidence_score: 78,
    risk_score: 38,
    alpha_decay_hours: 6.2,
    decision_reason: "Strong setup: elevated funding with slow decay trajectory",
    skip_reasons: [],
    thought_process: [
      "ETH funding elevated but stable over 4h window",
      "Alpha decay hours: 6.2h provides comfortable margin",
      "Risk score 38 well below threshold (60)",
      "EXECUTE: High conviction basis trade"
    ],
    proposed_side: "SHORT",
    proposed_size: 10,
    proposed_leverage: 2.5,
    expected_yield: 12.8
  }
]

const DEFER_SCENARIOS = [
  {
    symbol: "BTC-PERP",
    funding_rate: 0.0018,
    predicted_funding: 0.0022,
    funding_velocity: 0.0002,
    spot_price: 67800.00,
    perp_price: 67920.00,
    basis_spread: 0.18,
    confidence_score: 58,
    risk_score: 52,
    alpha_decay_hours: 5.0,
    decision_reason: "Borderline setup: deferring to next evaluation cycle",
    skip_reasons: ["BORDERLINE_CONFIDENCE"],
    thought_process: [
      "Setup shows potential but confidence at 58% (threshold: 65%)",
      "Funding trending positive - may improve next epoch",
      "No urgency: alpha window extends 5+ hours",
      "DEFER: Re-evaluate in 30 minutes"
    ],
    proposed_side: "SHORT",
    proposed_size: 0.5,
    proposed_leverage: 2,
    expected_yield: 9.5
  }
]

function generateTimestamps(count: number): Date[] {
  const now = new Date()
  const timestamps: Date[] = []
  const interval = (24 * 60 * 60 * 1000) / count
  
  for (let i = 0; i < count; i++) {
    const offset = Math.floor(Math.random() * interval) + (i * interval)
    timestamps.push(new Date(now.getTime() - offset))
  }
  
  return timestamps.sort((a, b) => b.getTime() - a.getTime())
}

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const allScenarios = [
      ...SKIP_SCENARIOS.map(s => ({ ...s, decision_type: "SKIP" })),
      ...GUARD_SCENARIOS.map(s => ({ ...s, decision_type: "GUARD" })),
      ...EXECUTE_SCENARIOS.map(s => ({ ...s, decision_type: "EXECUTE" })),
      ...DEFER_SCENARIOS.map(s => ({ ...s, decision_type: "DEFER" }))
    ]
    
    const timestamps = generateTimestamps(allScenarios.length)
    
    const decisions = allScenarios.map((scenario, index) => ({
      decision_type: scenario.decision_type,
      decision_reason: scenario.decision_reason,
      symbol: scenario.symbol,
      funding_rate: scenario.funding_rate,
      predicted_funding: scenario.predicted_funding,
      funding_velocity: scenario.funding_velocity,
      spot_price: scenario.spot_price,
      perp_price: scenario.perp_price,
      basis_spread: scenario.basis_spread,
      confidence_score: scenario.confidence_score,
      risk_score: scenario.risk_score,
      alpha_decay_hours: scenario.alpha_decay_hours,
      ai_reasoning_json: {
        thought_process: scenario.thought_process,
        market_context: {
          funding_rate: scenario.funding_rate,
          predicted_funding: scenario.predicted_funding,
          basis_spread: scenario.basis_spread
        }
      },
      thought_process: scenario.thought_process,
      proposed_side: scenario.proposed_side,
      proposed_size: scenario.proposed_size,
      proposed_leverage: scenario.proposed_leverage,
      expected_yield: scenario.expected_yield,
      skip_reasons: scenario.skip_reasons,
      risk_factors: {
        volatility: scenario.risk_score > 80 ? "HIGH" : scenario.risk_score > 60 ? "MEDIUM" : "LOW",
        liquidity: scenario.confidence_score > 70 ? "ADEQUATE" : "LIMITED",
        decay_velocity: scenario.alpha_decay_hours < 2 ? "RAPID" : "NORMAL"
      },
      market_timestamp: timestamps[index].toISOString(),
      created_at: timestamps[index].toISOString()
    }))
    
    const { data, error } = await supabase
      .from("ai_decisions")
      .insert(decisions)
      .select()
    
    if (error) {
      console.error("[v0] Error seeding decisions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Seeded ${decisions.length} AI decisions`,
      breakdown: {
        SKIP: SKIP_SCENARIOS.length,
        GUARD: GUARD_SCENARIOS.length,
        EXECUTE: EXECUTE_SCENARIOS.length,
        DEFER: DEFER_SCENARIOS.length
      },
      decisions: data
    })
  } catch (err) {
    console.error("[v0] Seed error:", err)
    return NextResponse.json({ error: "Failed to seed decisions" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to seed AI decisions",
    scenarios: {
      SKIP: SKIP_SCENARIOS.length,
      GUARD: GUARD_SCENARIOS.length,
      EXECUTE: EXECUTE_SCENARIOS.length,
      DEFER: DEFER_SCENARIOS.length,
      total: SKIP_SCENARIOS.length + GUARD_SCENARIOS.length + EXECUTE_SCENARIOS.length + DEFER_SCENARIOS.length
    }
  })
}
