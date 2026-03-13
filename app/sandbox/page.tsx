"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  generateAIReasoning,
  generateLogMessage,
  generateBrainMetrics,
  type DriftTradeData,
  type DriftMarketContext,
} from "@/lib/ai-reasoning"
import { SentryBrain } from "@/components/sentry-brain"
import { DepthChart } from "@/components/depth-chart"
import { SiteFooter } from "@/components/site-footer"

// Devnet mock data with whale-sized positions
const devnetTrades: DriftTradeData[] = [
  {
    type: "OPEN_BASIS",
    symbol: "SOL-PERP",
    size: 2500.0, // Whale position
    entryPrice: 142.35,
    fundingRate: 0.312,
    direction: "SHORT",
    spotPrice: 142.12,
    perpPrice: 142.35,
    liquidityDepth: 92,
    predictedDecay: 78,
    riskScore: 24,
    timestamp: new Date(),
  },
  {
    type: "FUNDING_CAPTURE",
    symbol: "SOL-PERP",
    size: 2500.0,
    entryPrice: 142.35,
    fundingRate: 0.312,
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    type: "OPEN_BASIS",
    symbol: "BTC-PERP",
    size: 1.5,
    entryPrice: 67450.0,
    fundingRate: 0.245,
    direction: "SHORT",
    spotPrice: 67380.0,
    perpPrice: 67450.0,
    liquidityDepth: 88,
    predictedDecay: 82,
    riskScore: 18,
    timestamp: new Date(Date.now() - 3600000),
  },
]

const mockContext: DriftMarketContext = {
  marketCondition: "BULLISH",
  avgFundingRate24h: 0.285,
  openInterest: 345000000,
  volatilityIndex: 38,
}

interface FeedbackNote {
  id: string
  author: string
  message: string
  timestamp: Date
  type: "bug" | "suggestion" | "question" | "praise"
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

function DevnetBanner() {
  return (
    <div className="bg-gradient-to-r from-warning/20 via-warning/10 to-warning/20 border-b border-warning/30">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-warning"></span>
        </span>
        <span className="text-sm font-bold text-warning tracking-wider">DEVNET - TESTING MODE</span>
        <span className="text-xs text-warning/70">|</span>
        <span className="text-xs text-warning/70">All transactions use mock USDC on Solana Devnet</span>
        <span className="text-xs text-warning/70">|</span>
        <a 
          href="https://faucet.solana.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-warning hover:text-warning/80 underline"
        >
          Get Devnet SOL
        </a>
      </div>
    </div>
  )
}

function FeedbackWidget({ 
  notes, 
  onSubmit 
}: { 
  notes: FeedbackNote[]
  onSubmit: (note: Omit<FeedbackNote, "id" | "timestamp">) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [author, setAuthor] = useState("")
  const [type, setType] = useState<FeedbackNote["type"]>("suggestion")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !author.trim()) return
    onSubmit({ author, message, type })
    setMessage("")
    setAuthor("")
  }

  const typeColors = {
    bug: "bg-crimson/20 text-crimson border-crimson/30",
    suggestion: "bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30",
    question: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    praise: "bg-warning/20 text-warning border-warning/30",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-2 w-80 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Developer Feedback</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Notes List */}
          <div className="max-h-48 overflow-y-auto p-3 space-y-2">
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No feedback yet. Be the first!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className={`rounded-lg border p-2 ${typeColors[note.type]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{note.author}</span>
                    <span className="text-[10px] opacity-70">{note.type.toUpperCase()}</span>
                  </div>
                  <p className="text-xs opacity-90">{note.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border space-y-2">
            <input
              type="text"
              placeholder="Your name (e.g., @driftlabs)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50"
            />
            <textarea
              placeholder="Share feedback on execution logic..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-crimson/50 resize-none"
            />
            <div className="flex items-center gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackNote["type"])}
                className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-border bg-muted/50 text-foreground focus:outline-none focus:border-crimson/50"
              >
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="question">Question</option>
                <option value="praise">Praise</option>
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-crimson text-white hover:bg-crimson-dark transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-crimson text-white shadow-lg hover:bg-crimson-dark transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
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

function DevnetTradeCard({ trade }: { trade: DriftTradeData }) {
  const reasoning = generateAIReasoning(trade, mockContext)
  
  const typeColors: Record<string, string> = {
    OPEN_BASIS: "bg-crimson/20 text-crimson",
    CLOSE_BASIS: "bg-[#00FF88]/20 text-[#00FF88]",
    REBALANCE: "bg-warning/20 text-warning",
    LIQUIDATION_GUARD: "bg-crimson/30 text-crimson border border-crimson/50",
    FUNDING_CAPTURE: "bg-[#00FF88]/20 text-[#00FF88]",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[trade.type]}`}>
            {trade.type.replace(/_/g, " ")}
          </span>
          <span className="text-sm font-medium text-foreground">{trade.symbol}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {trade.timestamp?.toLocaleTimeString() || "--:--:--"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{reasoning.summary}</p>
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">Size</span>
          <p className="font-mono text-foreground">{trade.size.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Funding APY</span>
          <p className="font-mono text-[#00FF88]">{((trade.fundingRate || 0) * 100).toFixed(2)}%</p>
        </div>
        <div>
          <span className="text-muted-foreground">Confidence</span>
          <p className="font-mono text-foreground">{reasoning.confidence}</p>
        </div>
      </div>
    </div>
  )
}

export default function SandboxDashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mockBalance, setMockBalance] = useState(100000)
  const [isMinting, setIsMinting] = useState(false)
  const [clawEnabled, setClawEnabled] = useState(true)
  const [isEvaluating, setIsEvaluating] = useState(true)
  const [feedbackNotes, setFeedbackNotes] = useState<FeedbackNote[]>([
    {
      id: "1",
      author: "@driftprotocol",
      message: "Interesting approach to funding rate prediction. Have you considered adding a volatility dampener?",
      timestamp: new Date(Date.now() - 3600000),
      type: "suggestion",
    },
  ])

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsEvaluating((prev) => !prev)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleMintAlpha = () => {
    setIsMinting(true)
    setTimeout(() => {
      setMockBalance((prev) => prev + 50000)
      setIsMinting(false)
    }, 1500)
  }

  const handleFeedbackSubmit = (note: Omit<FeedbackNote, "id" | "timestamp">) => {
    setFeedbackNotes((prev) => [
      {
        ...note,
        id: `note-${Date.now()}`,
        timestamp: new Date(),
      },
      ...prev,
    ])
  }

  const metrics = generateBrainMetrics(devnetTrades[0], mockContext)

  return (
    <div className="min-h-screen bg-background">
      {/* Devnet Banner */}
      <DevnetBanner />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <CrimsonLogo />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CrimsonArb Sandbox</h1>
              <p className="text-xs text-warning">Devnet Testing Environment</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-warning/30 bg-warning/10">
              <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono text-warning">${mockBalance.toLocaleString()} Mock USDC</span>
            </div>
            <Link 
              href="/"
              className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-crimson/50 transition-colors"
            >
              Exit Sandbox
            </Link>
            <span className="text-xs font-mono text-muted-foreground">
              {mounted && currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        {/* Whale Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <p className="text-xs text-warning">Mock TVL</p>
            <p className="text-2xl font-bold text-warning">${(mockBalance * 5).toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Devnet APY</p>
            <p className="text-2xl font-bold text-crimson">31.2%</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Test Trades</p>
            <p className="text-2xl font-bold text-foreground">47</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-[#00FF88]">94%</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Risk Score</p>
            <p className="text-2xl font-bold text-foreground">18/100</p>
          </div>
        </div>

        {/* Mint Mock Alpha Button */}
        <div className="mb-6 flex items-center justify-center">
          <button
            onClick={handleMintAlpha}
            disabled={isMinting}
            className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed border-warning/50 bg-warning/5 text-warning hover:bg-warning/10 hover:border-warning transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Minting Mock USDC...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Mint +$50,000 Mock Alpha</span>
              </>
            )}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sentry Brain */}
            <SentryBrain
              isEvaluating={isEvaluating}
              isSafe={!isEvaluating}
              clawEnabled={clawEnabled}
              onClawToggle={setClawEnabled}
            />

            {/* Depth Chart */}
            <DepthChart symbol="SOL-PERP" sentryTargetPrice={142.85} sentryTargetSide="SELL" />

            {/* Recent Devnet Trades */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent Devnet Executions</h2>
              <div className="space-y-3">
                {devnetTrades.map((trade, i) => (
                  <DevnetTradeCard key={i} trade={trade} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Network Status */}
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <h3 className="text-sm font-medium text-warning mb-3">Network Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-warning font-mono">Solana Devnet</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">RPC</span>
                  <span className="text-foreground font-mono truncate max-w-32">api.devnet.solana.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Drift Program</span>
                  <span className="text-foreground font-mono">dRifty...kNyD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Block Height</span>
                  <span className="text-foreground font-mono">287,451,234</span>
                </div>
              </div>
            </div>

            {/* Brain Metrics */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Decision Brain Metrics</h3>
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

            {/* Tester Resources */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Tester Resources</h3>
              <div className="space-y-2">
                <a
                  href="https://faucet.solana.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Solana Devnet Faucet
                </a>
                <a
                  href="https://app.drift.trade/?network=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Drift Devnet App
                </a>
                <a
                  href="https://explorer.solana.com/?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Solana Explorer (Devnet)
                </a>
                <a
                  href="https://github.com/LCTXTECH/crimson-arb-vault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Source on GitHub
                </a>
              </div>
            </div>

            {/* Invite Card */}
            <div className="rounded-lg border border-crimson/30 bg-gradient-to-br from-crimson/10 to-transparent p-4">
              <h3 className="text-sm font-medium text-crimson mb-2">Invite Testers</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Share this link with Drift/Ranger devs for sandbox access:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://crimsonarb.com/sandbox"
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-border bg-muted/50 text-foreground"
                />
                <button
                  onClick={() => navigator.clipboard.writeText("https://crimsonarb.com/sandbox")}
                  className="px-3 py-1.5 text-xs rounded-lg bg-crimson text-white hover:bg-crimson-dark transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Widget */}
      <FeedbackWidget notes={feedbackNotes} onSubmit={handleFeedbackSubmit} />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
