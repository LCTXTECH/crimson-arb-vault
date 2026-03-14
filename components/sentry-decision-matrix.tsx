"use client"

import { useState, useEffect } from "react"

// Decision types from ai_decisions table
type DecisionType = "EXECUTE" | "SKIP" | "GUARD" | "DEFER"

interface AIDecision {
  id: string
  decision_type: DecisionType
  decision_reason: string
  symbol: string
  funding_rate: number
  predicted_funding: number
  basis_spread: number
  spot_price: number
  perp_price: number
  confidence_score: number
  risk_score: number
  alpha_decay_hours: number
  thought_process: string[]
  skip_reasons?: string[]
  expected_yield?: number
  created_at: string
}

interface DecisionMetrics {
  fundingIntensity: number
  liquidityDepth: number
  riskMitigation: number
  alphaDecay: number
}

interface SentryDecisionMatrixProps {
  decisions?: AIDecision[]
  isLive?: boolean
}

// Generate mock decisions for visualization
function generateMockDecisions(): AIDecision[] {
  const types: DecisionType[] = ["EXECUTE", "SKIP", "GUARD", "DEFER"]
  const symbols = ["SOL-PERP", "BTC-PERP", "ETH-PERP", "JTO-PERP"]
  const skipReasons = [
    "Funding rate below threshold",
    "Liquidity depth insufficient",
    "Volatility spike detected",
    "Basis spread narrowing",
    "Alpha decay imminent",
    "Risk score exceeds limit",
  ]
  const thoughtProcesses = [
    "Analyzing 8h funding rate trend...",
    "Calculating basis spread deviation...",
    "Evaluating liquidity at entry price...",
    "Predicting funding velocity decay...",
    "Cross-referencing OI change rate...",
    "Checking volatility index threshold...",
    "Validating margin requirements...",
    "Assessing counterparty risk...",
  ]

  return Array.from({ length: 24 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const fundingRate = (Math.random() * 0.5 - 0.1).toFixed(4)
    const confidence = Math.floor(Math.random() * 40) + 60
    const risk = type === "GUARD" ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50) + 10

    return {
      id: `decision-${i}`,
      decision_type: type,
      decision_reason: type === "EXECUTE" 
        ? "High conviction alpha detected" 
        : type === "GUARD"
        ? "Risk threshold breached"
        : type === "SKIP"
        ? skipReasons[Math.floor(Math.random() * skipReasons.length)]
        : "Awaiting better entry",
      symbol,
      funding_rate: parseFloat(fundingRate),
      predicted_funding: parseFloat((parseFloat(fundingRate) * (0.7 + Math.random() * 0.6)).toFixed(4)),
      basis_spread: (Math.random() * 0.3).toFixed(3) as unknown as number,
      spot_price: symbol === "SOL-PERP" ? 142.35 : symbol === "BTC-PERP" ? 67450 : symbol === "ETH-PERP" ? 3450 : 2.85,
      perp_price: symbol === "SOL-PERP" ? 142.58 : symbol === "BTC-PERP" ? 67520 : symbol === "ETH-PERP" ? 3458 : 2.87,
      confidence_score: confidence,
      risk_score: risk,
      alpha_decay_hours: Math.floor(Math.random() * 48) + 2,
      thought_process: thoughtProcesses.slice(0, Math.floor(Math.random() * 4) + 3),
      skip_reasons: type === "SKIP" || type === "GUARD" 
        ? skipReasons.slice(0, Math.floor(Math.random() * 2) + 1)
        : undefined,
      expected_yield: type === "EXECUTE" ? Math.random() * 25 + 10 : Math.random() * 15,
      created_at: new Date(Date.now() - Math.random() * 3600000 * 4).toISOString(),
    }
  })
}

function HexCell({ 
  decision, 
  onClick,
  isSelected 
}: { 
  decision: AIDecision
  onClick: () => void
  isSelected: boolean
}) {
  const getColor = () => {
    switch (decision.decision_type) {
      case "EXECUTE": return { fill: "rgba(0, 255, 136, 0.2)", stroke: "#00FF88", pulse: "bg-[#00FF88]" }
      case "GUARD": return { fill: "rgba(220, 38, 38, 0.2)", stroke: "#DC2626", pulse: "bg-crimson" }
      case "SKIP": return { fill: "rgba(31, 41, 55, 0.8)", stroke: "#F59E0B", pulse: "bg-warning" }
      case "DEFER": return { fill: "rgba(31, 41, 55, 0.5)", stroke: "#6B7280", pulse: "bg-muted-foreground" }
    }
  }

  const colors = getColor()
  const pulseIntensity = decision.confidence_score / 100

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ${isSelected ? "scale-110 z-10" : "hover:scale-105"}`}
    >
      <svg viewBox="0 0 100 115" className="h-16 w-14">
        {/* Hexagon shape */}
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={isSelected ? "3" : "1.5"}
          className="transition-all duration-300"
        />
        {/* Inner indicator */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill={colors.stroke}
          opacity={pulseIntensity}
          className={decision.decision_type === "EXECUTE" || decision.decision_type === "GUARD" ? "animate-pulse" : ""}
        />
        {/* Confidence text */}
        <text
          x="50"
          y="80"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px] font-mono"
        >
          {decision.confidence_score}%
        </text>
      </svg>
      {/* Symbol badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono text-muted-foreground whitespace-nowrap">
        {decision.symbol.replace("-PERP", "")}
      </div>
    </button>
  )
}

function MetricBar({ 
  label, 
  value, 
  color 
}: { 
  label: string
  value: number
  color: string 
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono text-foreground">{value.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  )
}

export function SentryDecisionMatrix({ decisions: propDecisions, isLive = true }: SentryDecisionMatrixProps) {
  const [mounted, setMounted] = useState(false)
  const [decisions, setDecisions] = useState<AIDecision[]>([])
  const [selectedDecision, setSelectedDecision] = useState<AIDecision | null>(null)
  const [filter, setFilter] = useState<DecisionType | "ALL">("ALL")
  const [metrics, setMetrics] = useState<DecisionMetrics>({
    fundingIntensity: 72,
    liquidityDepth: 85,
    riskMitigation: 68,
    alphaDecay: 45,
  })

  useEffect(() => {
    setMounted(true)
    setDecisions(propDecisions || generateMockDecisions())
  }, [propDecisions])

  // Simulate live updates
  useEffect(() => {
    if (!isLive || !mounted) return

    const interval = setInterval(() => {
      setMetrics({
        fundingIntensity: Math.min(100, Math.max(0, metrics.fundingIntensity + (Math.random() * 10 - 5))),
        liquidityDepth: Math.min(100, Math.max(0, metrics.liquidityDepth + (Math.random() * 6 - 3))),
        riskMitigation: Math.min(100, Math.max(0, metrics.riskMitigation + (Math.random() * 8 - 4))),
        alphaDecay: Math.min(100, Math.max(0, metrics.alphaDecay + (Math.random() * 12 - 6))),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive, mounted, metrics])

  const filteredDecisions = filter === "ALL" 
    ? decisions 
    : decisions.filter(d => d.decision_type === filter)

  const recentDecisions = [...decisions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const stats = {
    execute: decisions.filter(d => d.decision_type === "EXECUTE").length,
    skip: decisions.filter(d => d.decision_type === "SKIP").length,
    guard: decisions.filter(d => d.decision_type === "GUARD").length,
    defer: decisions.filter(d => d.decision_type === "DEFER").length,
  }

  if (!mounted) {
    return <div className="rounded-lg border border-border bg-card p-6 h-[600px] animate-pulse" />
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-crimson/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-crimson" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Sentry Brain Decision Matrix</h3>
              <p className="text-[10px] text-muted-foreground">Real-time AI reasoning visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#00FF88]/10 px-2 py-0.5 text-[10px] text-[#00FF88]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground font-mono uppercase mr-2">Filter:</span>
        {(["ALL", "EXECUTE", "SKIP", "GUARD", "DEFER"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
              filter === type
                ? type === "EXECUTE" ? "bg-[#00FF88]/20 text-[#00FF88]"
                : type === "GUARD" ? "bg-crimson/20 text-crimson"
                : type === "SKIP" ? "bg-warning/20 text-warning"
                : type === "DEFER" ? "bg-muted text-muted-foreground"
                : "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type} {type !== "ALL" && `(${stats[type.toLowerCase() as keyof typeof stats]})`}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left: Hex Grid */}
        <div className="lg:col-span-2 p-4">
          <div className="flex flex-wrap gap-1 justify-center">
            {filteredDecisions.map((decision) => (
              <HexCell
                key={decision.id}
                decision={decision}
                onClick={() => setSelectedDecision(decision)}
                isSelected={selectedDecision?.id === decision.id}
              />
            ))}
          </div>

          {/* Bottom Metrics Row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <MetricBar 
              label="Funding Yield" 
              value={metrics.fundingIntensity} 
              color="#00FF88" 
            />
            <MetricBar 
              label="Liquidity Depth" 
              value={metrics.liquidityDepth} 
              color="#3B82F6" 
            />
            <MetricBar 
              label="Risk Mitigation" 
              value={metrics.riskMitigation} 
              color="#F59E0B" 
            />
            <MetricBar 
              label="Alpha Decay" 
              value={metrics.alphaDecay} 
              color="#DC2626" 
            />
          </div>
        </div>

        {/* Right: Intelligence Panel */}
        <div className="p-4 space-y-4">
          {/* Live Thought Process */}
          <div>
            <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
              Live Thought Process
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {recentDecisions.map((decision) => (
                <div 
                  key={decision.id}
                  className={`p-2 rounded border text-[10px] font-mono ${
                    decision.decision_type === "EXECUTE" 
                      ? "border-[#00FF88]/30 bg-[#00FF88]/5"
                      : decision.decision_type === "GUARD"
                      ? "border-crimson/30 bg-crimson/5"
                      : decision.decision_type === "SKIP"
                      ? "border-warning/30 bg-warning/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={
                      decision.decision_type === "EXECUTE" ? "text-[#00FF88]"
                      : decision.decision_type === "GUARD" ? "text-crimson"
                      : decision.decision_type === "SKIP" ? "text-warning"
                      : "text-muted-foreground"
                    }>
                      [{decision.decision_type}]
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(decision.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-foreground/80">{decision.decision_reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Decision Details */}
          {selectedDecision && (
            <div className="border-t border-border pt-4">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Decision Details
              </h4>
              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol</span>
                  <span className="text-foreground">{selectedDecision.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="text-[#00FF88]">{selectedDecision.confidence_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className={selectedDecision.risk_score > 60 ? "text-crimson" : "text-warning"}>
                    {selectedDecision.risk_score}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Funding Rate</span>
                  <span className="text-foreground">{(selectedDecision.funding_rate * 100).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alpha Decay</span>
                  <span className="text-foreground">{selectedDecision.alpha_decay_hours}h</span>
                </div>
                {selectedDecision.expected_yield && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected APR</span>
                    <span className="text-[#00FF88]">{selectedDecision.expected_yield.toFixed(1)}%</span>
                  </div>
                )}
                {selectedDecision.skip_reasons && selectedDecision.skip_reasons.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-warning">Skip Reasons:</span>
                    <ul className="mt-1 space-y-0.5">
                      {selectedDecision.skip_reasons.map((reason, i) => (
                        <li key={i} className="text-muted-foreground">- {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thought Process Log */}
          {selectedDecision && selectedDecision.thought_process.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                AI Thought Chain
              </h4>
              <div className="space-y-1 text-[9px] font-mono text-muted-foreground">
                {selectedDecision.thought_process.map((thought, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-crimson/70">{i + 1}.</span>
                    <span>{thought}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
