"use client"

import { useState, useEffect } from "react"
import {
  generateAIReasoning,
  generateLogMessage,
  generateBrainMetrics,
  type DriftTradeData,
  type DriftMarketContext,
} from "@/lib/ai-reasoning"

// Mock data for demonstration
const mockTrades: DriftTradeData[] = [
  {
    type: "OPEN_BASIS",
    symbol: "SOL-PERP",
    size: 125.5,
    entryPrice: 142.35,
    fundingRate: 0.248,
    direction: "SHORT",
    spotPrice: 142.12,
    perpPrice: 142.35,
    liquidityDepth: 85,
    predictedDecay: 72,
    riskScore: 32,
    timestamp: new Date(),
  },
  {
    type: "FUNDING_CAPTURE",
    symbol: "SOL-PERP",
    size: 125.5,
    entryPrice: 142.35,
    fundingRate: 0.248,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    type: "REBALANCE",
    symbol: "BTC-PERP",
    size: 0.0234,
    entryPrice: 67250.0,
    fundingRate: 0.156,
    spotPrice: 67180.0,
    perpPrice: 67250.0,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    type: "LIQUIDATION_GUARD",
    symbol: "ETH-PERP",
    size: -2.5,
    entryPrice: 3245.0,
    fundingRate: 0.089,
    riskScore: 78,
    timestamp: new Date(Date.now() - 14400000),
  },
]

const mockContext: DriftMarketContext = {
  marketCondition: "BULLISH",
  avgFundingRate24h: 0.185,
  openInterest: 245000000,
  volatilityIndex: 42,
}

function CrimsonLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <path
        d="M20 4C20 4 28 8 28 16C28 20 26 24 22 26C26 22 24 16 20 14C16 16 14 22 18 26C14 24 12 20 12 16C12 8 20 4 20 4Z"
        fill="currentColor"
        className="text-crimson"
      />
      <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="2" className="text-crimson" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" className="text-crimson" />
    </svg>
  )
}

function BrainMetricsCard({ trade }: { trade: DriftTradeData }) {
  const metrics = generateBrainMetrics(trade, mockContext)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Decision Brain Metrics</h3>
      <div className="space-y-4">
        <MetricBar label="Funding Yield Intensity" value={metrics.fundingYieldIntensity} color="bg-crimson" />
        <MetricBar label="Liquidity Depth" value={metrics.liquidityDepth} color="bg-success" />
        <MetricBar label="Decay Resistance" value={metrics.predictedDecay} color="bg-warning" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Overall Score</span>
        <span className="text-2xl font-bold text-crimson">{metrics.overallScore}</span>
      </div>
    </div>
  )
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ReasoningCard({ trade, isExpanded, onToggle }: { trade: DriftTradeData; isExpanded: boolean; onToggle: () => void }) {
  const reasoning = generateAIReasoning(trade, mockContext)

  const confidenceColor = {
    HIGH: "text-success",
    MEDIUM: "text-warning",
    LOW: "text-crimson",
  }[reasoning.confidence]

  const typeColors: Record<string, string> = {
    OPEN_BASIS: "bg-crimson/20 text-crimson",
    CLOSE_BASIS: "bg-success/20 text-success",
    REBALANCE: "bg-warning/20 text-warning",
    LIQUIDATION_GUARD: "bg-crimson/30 text-crimson border border-crimson/50",
    FUNDING_CAPTURE: "bg-success/20 text-success",
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[trade.type]}`}>
                {trade.type.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-muted-foreground">{trade.symbol}</span>
              <span className={`text-xs font-medium ${confidenceColor}`}>
                {reasoning.confidence} Confidence
              </span>
            </div>
            <p className="text-sm text-foreground">{reasoning.summary}</p>
          </div>
          <svg
            className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{reasoning.detailed}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Risk:</span>
            <span className={trade.type === "LIQUIDATION_GUARD" ? "text-crimson font-medium" : "text-foreground"}>
              {reasoning.riskAssessment}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function ExecutionLog({ trades, mounted }: { trades: DriftTradeData[]; mounted: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Execution Log</h3>
      <div className="space-y-2 font-mono text-xs">
        {trades.map((trade, i) => (
          <div key={i} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-crimson/70">
              [{mounted ? new Date(trade.timestamp || Date.now()).toLocaleTimeString() : "--:--:--"}]
            </span>
            <span className="text-foreground">{generateLogMessage(trade)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [expandedCard, setExpandedCard] = useState<number | null>(0)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <CrimsonLogo />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CrimsonArb Vault</h1>
              <p className="text-xs text-muted-foreground">AgentSentry Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              <span className="text-xs text-muted-foreground">Connected to Drift</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {mounted && currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Value Locked" value="$2.45M" />
          <StatCard label="24h APY" value="24.8%" highlight />
          <StatCard label="Active Positions" value="3" />
          <StatCard label="Risk Score" value="32/100" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Reasoning Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">AI Reasoning Feed</h2>
            <div className="space-y-3">
              {mockTrades.map((trade, i) => (
                <ReasoningCard
                  key={i}
                  trade={trade}
                  isExpanded={expandedCard === i}
                  onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Brain Analysis</h2>
            <BrainMetricsCard trade={mockTrades[0]} />
            <ExecutionLog trades={mockTrades} mounted={mounted} />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-crimson" : "text-foreground"}`}>{value}</p>
    </div>
  )
}
