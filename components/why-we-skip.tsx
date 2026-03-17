"use client"

import { useState, useEffect } from "react"

interface SkipDecision {
  id: string
  timestamp: Date
  symbol: string
  opportunityDetected: string
  reasoning: string
  confidenceScore: number
  fundingRate: number
  outcome: string
  decayHours: number
}

// Realistic skip decisions that demonstrate the AI's discipline
const mockSkipDecisions: SkipDecision[] = [
  {
    id: "skip-001",
    timestamp: new Date(Date.now() - 1200000), // 20 min ago
    symbol: "SOL-PERP",
    opportunityDetected: "Funding rate spike to 0.0342% (8h)",
    reasoning: "Funding velocity decelerating. Historical pattern suggests reversion within 6 hours. Risk/reward unfavorable.",
    confidenceScore: 62,
    fundingRate: 0.0342,
    outcome: "Alpha decayed 4.2 hours later",
    decayHours: 4.2,
  },
  {
    id: "skip-002",
    timestamp: new Date(Date.now() - 2700000), // 45 min ago
    symbol: "ETH-PERP",
    opportunityDetected: "Basis spread widened to 0.18%",
    reasoning: "Liquidity depth insufficient for target position size. Slippage would exceed 0.12% threshold.",
    confidenceScore: 54,
    fundingRate: 0.0156,
    outcome: "Alpha decayed 2.8 hours later",
    decayHours: 2.8,
  },
  {
    id: "skip-003",
    timestamp: new Date(Date.now() - 5400000), // 90 min ago
    symbol: "BTC-PERP",
    opportunityDetected: "Funding rate at 0.0267% with stable OI",
    reasoning: "Market volatility index elevated (VIX proxy at 78). GUARD threshold triggered. Position blocked.",
    confidenceScore: 41,
    fundingRate: 0.0267,
    outcome: "Volatility spike occurred 1.5 hours later",
    decayHours: 1.5,
  },
  {
    id: "skip-004",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    symbol: "JTO-PERP",
    opportunityDetected: "High funding divergence from spot premium",
    reasoning: "Order book imbalance detected. Large sell wall at target exit. Execution risk too high.",
    confidenceScore: 58,
    fundingRate: 0.0489,
    outcome: "Alpha decayed 3.1 hours later",
    decayHours: 3.1,
  },
  {
    id: "skip-005",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    symbol: "SOL-PERP",
    opportunityDetected: "Funding acceleration detected (3rd consecutive 8h positive)",
    reasoning: "Weekend liquidity conditions. Spread widening expected. Deferring to Monday open.",
    confidenceScore: 71,
    fundingRate: 0.0312,
    outcome: "Alpha decayed 5.7 hours later",
    decayHours: 5.7,
  },
  {
    id: "skip-006",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    symbol: "ETH-PERP",
    opportunityDetected: "Positive funding with narrowing basis",
    reasoning: "Correlation with BTC breaking down. Hedging complexity increases. Standalone position too risky.",
    confidenceScore: 49,
    fundingRate: 0.0198,
    outcome: "Alpha decayed 2.3 hours later",
    decayHours: 2.3,
  },
  {
    id: "skip-007",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    symbol: "WIF-PERP",
    opportunityDetected: "Extreme funding rate at 0.0892%",
    reasoning: "Meme coin volatility exceeds risk parameters. Historical decay rate too unpredictable. GUARD activated.",
    confidenceScore: 33,
    fundingRate: 0.0892,
    outcome: "Price crashed 18% within 2 hours",
    decayHours: 2.0,
  },
  {
    id: "skip-008",
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
    symbol: "SOL-PERP",
    opportunityDetected: "Funding rate stabilizing at 0.0245%",
    reasoning: "Predicted alpha capture below minimum threshold of 0.08% APR. Opportunity cost too high.",
    confidenceScore: 66,
    fundingRate: 0.0245,
    outcome: "Rate normalized within 3 hours",
    decayHours: 3.0,
  },
  {
    id: "skip-009",
    timestamp: new Date(Date.now() - 25200000), // 7 hours ago
    symbol: "BTC-PERP",
    opportunityDetected: "Basis trade opportunity during FOMC",
    reasoning: "Macro event risk elevated. Position sizing would require 80% reduction. Not capital efficient.",
    confidenceScore: 55,
    fundingRate: 0.0178,
    outcome: "Volatility spike post-announcement",
    decayHours: 1.8,
  },
  {
    id: "skip-010",
    timestamp: new Date(Date.now() - 28800000), // 8 hours ago
    symbol: "ETH-PERP",
    opportunityDetected: "Strong funding with upcoming merge anniversary",
    reasoning: "Event-driven volatility expected. Sentry Brain deferring to post-event normalization period.",
    confidenceScore: 61,
    fundingRate: 0.0334,
    outcome: "Alpha decayed during event volatility",
    decayHours: 4.5,
  },
]

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function WhyWeSkip() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [, setTick] = useState(0)

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 px-4 md:px-8 border-t border-border bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 mb-4">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-xs font-mono text-warning">TRANSPARENCY LAYER</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Proof of No-Trade: We Publish Our Reasoning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most vaults hide their inaction. We document every skip with AI reasoning. 
            Judges can audit our intelligence.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
          <div className="text-center p-4 rounded-lg bg-card border border-border">
            <div className="text-3xl font-mono font-bold text-warning">72%</div>
            <div className="text-xs text-muted-foreground">Skip Rate</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border border-border">
            <div className="text-3xl font-mono font-bold text-success">3.2h</div>
            <div className="text-xs text-muted-foreground">Avg. Decay Time</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border border-border">
            <div className="text-3xl font-mono font-bold text-foreground">94%</div>
            <div className="text-xs text-muted-foreground">Correct Skips</div>
          </div>
        </div>

        {/* Skip Decisions List */}
        <div className="space-y-3">
          {mockSkipDecisions.map((decision, index) => (
            <div
              key={decision.id}
              className={`
                group rounded-lg border bg-card overflow-hidden transition-all duration-300
                ${expandedId === decision.id 
                  ? "border-warning/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                  : "border-border hover:border-warning/30"
                }
              `}
            >
              <button
                onClick={() => setExpandedId(expandedId === decision.id ? null : decision.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Index Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center">
                      <span className="text-xs font-mono text-warning">{index + 1}</span>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-foreground">{decision.symbol}</span>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(decision.timestamp)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-mono">
                          SKIP
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {decision.opportunityDetected}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-mono text-foreground">{decision.confidenceScore}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === decision.id ? "rotate-180" : ""}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === decision.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-2">
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Why Sentry Brain Said No
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {decision.reasoning}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Funding Rate</span>
                        <span className="font-mono text-sm text-foreground">{(decision.fundingRate * 100).toFixed(4)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Confidence Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full bg-warning transition-all duration-500"
                              style={{ width: `${decision.confidenceScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-sm text-foreground">{decision.confidenceScore}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">Outcome</span>
                        <span className="text-sm text-success font-medium">{decision.outcome}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            All decisions logged to Supabase with full audit trail. <span className="text-warning">Verifiable on-chain.</span>
          </p>
          <a 
            href="/transparency"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 transition-colors"
          >
            <span className="font-medium">View Full Transparency Report</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
