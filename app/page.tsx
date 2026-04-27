"use client"

import { useState, useEffect } from "react"
import {
  generateAIReasoning,
  generateLogMessage,
  generateBrainMetrics,
  type DriftTradeData,
  type DriftMarketContext,
} from "@/lib/ai-reasoning"
import { SentryBrain } from "@/components/sentry-brain"
import { LiquidityHeatmap } from "@/components/liquidity-heatmap"
import { ApprovalQueue } from "@/components/approval-queue"
import { AuditTrailDrawer } from "@/components/audit-trail-drawer"
import { DepthChart } from "@/components/depth-chart"
import { GeoSelector } from "@/components/geo-selector"
import { OnboardingModal } from "@/components/onboarding-modal"
import { SiteFooter } from "@/components/site-footer"
import { WhyWeSkip } from "@/components/why-we-skip"
import { AgentSentryStatus } from "@/components/agent-sentry-status"
import { InstitutionalMetrics } from "@/components/institutional-metrics"
import Link from "next/link"

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

const mockPendingTrades = [
  {
    id: "pending-1",
    type: "OPEN_BASIS" as const,
    symbol: "JTO-PERP",
    size: 450.0,
    entryPrice: 3.85,
    fundingRate: 0.312,
    direction: "SHORT" as const,
    spotPrice: 3.82,
    perpPrice: 3.85,
    liquidityDepth: 72,
    riskScore: 28,
    proposedAt: new Date(),
    expiresAt: new Date(Date.now() + 300000), // 5 minutes
    sentryScore: 87,
  },
  {
    id: "pending-2",
    type: "REBALANCE" as const,
    symbol: "SOL-PERP",
    size: 15.25,
    entryPrice: 142.50,
    fundingRate: 0.248,
    direction: "SHORT" as const,
    liquidityDepth: 85,
    riskScore: 22,
    proposedAt: new Date(Date.now() - 60000),
    expiresAt: new Date(Date.now() + 180000), // 3 minutes
    sentryScore: 92,
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
        <MetricBar label="Liquidity Depth" value={metrics.liquidityDepth} color="bg-[#00FF88]" />
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
    HIGH: "text-[#00FF88]",
    MEDIUM: "text-warning",
    LOW: "text-crimson",
  }[reasoning.confidence]

  const typeColors: Record<string, string> = {
    OPEN_BASIS: "bg-crimson/20 text-crimson",
    CLOSE_BASIS: "bg-[#00FF88]/20 text-[#00FF88]",
    REBALANCE: "bg-warning/20 text-warning",
    LIQUIDATION_GUARD: "bg-crimson/30 text-crimson border border-crimson/50",
    FUNDING_CAPTURE: "bg-[#00FF88]/20 text-[#00FF88]",
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
  const [clawEnabled, setClawEnabled] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(true)
  const [pendingTrades, setPendingTrades] = useState(mockPendingTrades)
  const [activeTab, setActiveTab] = useState<"reasoning" | "heatmap" | "depth">("reasoning")
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate evaluation cycles
  useEffect(() => {
    const interval = setInterval(() => {
      setIsEvaluating((prev) => !prev)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleApprove = (tradeId: string) => {
    setPendingTrades((prev) => prev.filter((t) => t.id !== tradeId))
  }

  const handleReject = (tradeId: string) => {
    setPendingTrades((prev) => prev.filter((t) => t.id !== tradeId))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <CrimsonLogo />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CrimsonArb Vault</h1>
              <p className="text-xs text-muted-foreground">ATSP v1.0.1 Compliant</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson-dark transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Get Started
            </button>
            <GeoSelector />
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-crimson/50 hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Audit Trail
            </button>
            <Link 
              href="/protocol/atsp"
              className="flex items-center gap-2 px-2 py-1 rounded border border-[#00ff88]/30 hover:border-[#00ff88]/60 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF88]"></span>
              </span>
              <span className="text-xs text-[#00ff88] font-mono">ATSP</span>
            </Link>
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

        {/* Sentry Brain */}
        <div className="mb-6">
          <SentryBrain
            isEvaluating={isEvaluating}
            isSafe={!isEvaluating}
            clawEnabled={clawEnabled}
            onClawToggle={setClawEnabled}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("reasoning")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "reasoning"
                ? "text-crimson border-crimson"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            AI Reasoning Feed
          </button>
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "heatmap"
                ? "text-crimson border-crimson"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Global Liquidity
          </button>
          <button
            onClick={() => setActiveTab("depth")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "depth"
                ? "text-crimson border-crimson"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Depth Chart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "reasoning" ? (
              <>
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
              </>
            ) : activeTab === "heatmap" ? (
              <LiquidityHeatmap />
            ) : (
              <DepthChart symbol="SOL-PERP" sentryTargetPrice={142.85} sentryTargetSide="SELL" />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* AgentSentry Status Widget */}
            <AgentSentryStatus />
            
            {/* Institutional Performance Metrics */}
            <InstitutionalMetrics />
            
            <ApprovalQueue
              trades={pendingTrades}
              onApprove={handleApprove}
              onReject={handleReject}
              clawEnabled={clawEnabled}
            />
            <BrainMetricsCard trade={mockTrades[0]} />
            <ExecutionLog trades={mockTrades} mounted={mounted} />
          </div>
        </div>
      </main>

      {/* Why We Skip - Proof of No-Trade Section */}
      <WhyWeSkip />

      {/* Audit Trail Drawer */}
      <AuditTrailDrawer isOpen={isAuditDrawerOpen} onClose={() => setIsAuditDrawerOpen(false)} />

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
      />

      {/* Footer */}
      <SiteFooter />
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
