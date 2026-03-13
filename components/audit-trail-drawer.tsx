"use client"

import { useState, useEffect, useMemo } from "react"

interface TradeAction {
  id: string
  timestamp: Date
  action: "OPEN_BASIS" | "CLOSE_BASIS" | "REBALANCE" | "LIQUIDATION_GUARD" | "FUNDING_CAPTURE"
  symbol: string
  yieldCaptured: number
  sentryReasoning: string
  confidence: "HIGH" | "MEDIUM" | "LOW"
  size: number
  entryPrice: number
  txHash?: string
}

// Mock audit data - replace with Prisma fetch
const mockAuditData: TradeAction[] = [
  {
    id: "tx-001",
    timestamp: new Date(Date.now() - 300000),
    action: "OPEN_BASIS",
    symbol: "SOL-PERP",
    yieldCaptured: 0.248,
    sentryReasoning: "Funding rate at 24.8% APY exceeds 15% threshold. Spot-perp spread favorable at 0.16%. Opening delta-neutral basis position.",
    confidence: "HIGH",
    size: 125.5,
    entryPrice: 142.35,
    txHash: "5Kj2...xF9a",
  },
  {
    id: "tx-002",
    timestamp: new Date(Date.now() - 900000),
    action: "FUNDING_CAPTURE",
    symbol: "SOL-PERP",
    yieldCaptured: 0.0031,
    sentryReasoning: "Hourly funding payment collected. Position maintaining delta neutrality within 0.3% tolerance.",
    confidence: "HIGH",
    size: 125.5,
    entryPrice: 142.35,
    txHash: "8Np4...kL2m",
  },
  {
    id: "tx-003",
    timestamp: new Date(Date.now() - 1800000),
    action: "REBALANCE",
    symbol: "BTC-PERP",
    yieldCaptured: 0,
    sentryReasoning: "Delta drift detected at 2.1%. Rebalancing hedge ratio to restore neutrality. Market impact estimated at 0.02%.",
    confidence: "MEDIUM",
    size: 0.0234,
    entryPrice: 67250.0,
    txHash: "2Rt7...pQ5n",
  },
  {
    id: "tx-004",
    timestamp: new Date(Date.now() - 3600000),
    action: "LIQUIDATION_GUARD",
    symbol: "ETH-PERP",
    yieldCaptured: -0.0012,
    sentryReasoning: "Health factor approaching 1.25 threshold. Reducing position by 15% to restore safety margin. Volatility index elevated at 78.",
    confidence: "HIGH",
    size: -2.5,
    entryPrice: 3245.0,
    txHash: "7Yz3...aB8c",
  },
  {
    id: "tx-005",
    timestamp: new Date(Date.now() - 7200000),
    action: "CLOSE_BASIS",
    symbol: "JTO-PERP",
    yieldCaptured: 0.0156,
    sentryReasoning: "Funding rate collapsed to 3.2% APY. Closing position to redeploy capital to higher-yielding opportunities.",
    confidence: "MEDIUM",
    size: 450.0,
    entryPrice: 3.82,
    txHash: "4Km9...vD1e",
  },
  {
    id: "tx-006",
    timestamp: new Date(Date.now() - 14400000),
    action: "OPEN_BASIS",
    symbol: "WIF-PERP",
    yieldCaptured: 0.312,
    sentryReasoning: "Exceptional funding rate at 31.2% APY detected. Liquidity depth sufficient at 72%. Initiating basis trade with conservative sizing.",
    confidence: "MEDIUM",
    size: 8500.0,
    entryPrice: 2.45,
    txHash: "9Xw2...hJ6f",
  },
  {
    id: "tx-007",
    timestamp: new Date(Date.now() - 21600000),
    action: "FUNDING_CAPTURE",
    symbol: "BTC-PERP",
    yieldCaptured: 0.00195,
    sentryReasoning: "Funding payment received. Yield contribution tracking at 102% of projected model.",
    confidence: "HIGH",
    size: 0.0234,
    entryPrice: 67180.0,
    txHash: "1Qp5...mN3g",
  },
  {
    id: "tx-008",
    timestamp: new Date(Date.now() - 28800000),
    action: "REBALANCE",
    symbol: "SOL-PERP",
    yieldCaptured: 0,
    sentryReasoning: "Spot oracle price divergence of 0.23% detected. Adjusting hedge to maintain delta within tolerance band.",
    confidence: "HIGH",
    size: 3.2,
    entryPrice: 141.85,
    txHash: "6Hy8...tR4k",
  },
]

interface AuditTrailDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function AuditTrailDrawer({ isOpen, onClose }: AuditTrailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState<string>("ALL")
  const [sortField, setSortField] = useState<"timestamp" | "yieldCaptured">("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const filteredData = useMemo(() => {
    let data = [...mockAuditData]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.symbol.toLowerCase().includes(query) ||
          item.sentryReasoning.toLowerCase().includes(query) ||
          item.txHash?.toLowerCase().includes(query)
      )
    }

    // Filter by action type
    if (filterAction !== "ALL") {
      data = data.filter((item) => item.action === filterAction)
    }

    // Sort
    data.sort((a, b) => {
      const aVal = sortField === "timestamp" ? a.timestamp.getTime() : a.yieldCaptured
      const bVal = sortField === "timestamp" ? b.timestamp.getTime() : b.yieldCaptured
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal
    })

    return data
  }, [searchQuery, filterAction, sortField, sortDirection])

  const totalYield = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.yieldCaptured, 0)
  }, [filteredData])

  const actionColors: Record<string, string> = {
    OPEN_BASIS: "bg-crimson/20 text-crimson border-crimson/30",
    CLOSE_BASIS: "bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30",
    REBALANCE: "bg-warning/20 text-warning border-warning/30",
    LIQUIDATION_GUARD: "bg-crimson/30 text-crimson border-crimson/50",
    FUNDING_CAPTURE: "bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30",
  }

  const confidenceColors: Record<string, string> = {
    HIGH: "text-[#00FF88]",
    MEDIUM: "text-warning",
    LOW: "text-crimson",
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Glassmorphism container */}
        <div className="h-full border-l border-crimson/30 bg-card/90 backdrop-blur-xl shadow-2xl shadow-crimson/10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-crimson/20 bg-gradient-to-r from-crimson/10 to-transparent p-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Full Audit Trail</h2>
              <p className="text-xs text-muted-foreground">
                {filteredData.length} records | Total Yield: {(totalYield * 100).toFixed(3)}%
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="border-b border-border/50 p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search symbol, reasoning, or tx hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-crimson/50 focus:outline-none focus:ring-1 focus:ring-crimson/30"
              />
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-3">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5 text-xs text-foreground focus:border-crimson/50 focus:outline-none"
              >
                <option value="ALL">All Actions</option>
                <option value="OPEN_BASIS">Open Basis</option>
                <option value="CLOSE_BASIS">Close Basis</option>
                <option value="REBALANCE">Rebalance</option>
                <option value="LIQUIDATION_GUARD">Liquidation Guard</option>
                <option value="FUNDING_CAPTURE">Funding Capture</option>
              </select>

              <button
                onClick={() => {
                  if (sortField === "timestamp") {
                    setSortDirection((d) => (d === "desc" ? "asc" : "desc"))
                  } else {
                    setSortField("timestamp")
                    setSortDirection("desc")
                  }
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  sortField === "timestamp"
                    ? "border-crimson/50 bg-crimson/10 text-crimson"
                    : "border-border/50 bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Time {sortField === "timestamp" && (sortDirection === "desc" ? "↓" : "↑")}
              </button>

              <button
                onClick={() => {
                  if (sortField === "yieldCaptured") {
                    setSortDirection((d) => (d === "desc" ? "asc" : "desc"))
                  } else {
                    setSortField("yieldCaptured")
                    setSortDirection("desc")
                  }
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  sortField === "yieldCaptured"
                    ? "border-crimson/50 bg-crimson/10 text-crimson"
                    : "border-border/50 bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Yield {sortField === "yieldCaptured" && (sortDirection === "desc" ? "↓" : "↑")}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
            <div className="space-y-2">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-lg border border-border/30 bg-muted/30 p-3 hover:border-crimson/30 hover:bg-muted/50 transition-all"
                >
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${actionColors[item.action]}`}>
                        {item.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-foreground">{item.symbol}</span>
                      <span className={`text-[10px] ${confidenceColors[item.confidence]}`}>
                        {item.confidence}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {mounted ? item.timestamp.toLocaleString() : "--"}
                    </span>
                  </div>

                  {/* Metrics row */}
                  <div className="flex items-center gap-4 mb-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Yield: </span>
                      <span className={item.yieldCaptured >= 0 ? "text-[#00FF88]" : "text-crimson"}>
                        {item.yieldCaptured >= 0 ? "+" : ""}{(item.yieldCaptured * 100).toFixed(4)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size: </span>
                      <span className="text-foreground">{Math.abs(item.size).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price: </span>
                      <span className="text-foreground">${item.entryPrice.toLocaleString()}</span>
                    </div>
                    {item.txHash && (
                      <div className="ml-auto">
                        <span className="font-mono text-[10px] text-crimson/70 group-hover:text-crimson">
                          {item.txHash}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reasoning */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-crimson/70 font-medium">Sentry:</span> {item.sentryReasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 p-4 bg-gradient-to-r from-transparent to-crimson/5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Powered by AgentSentry</span>
              <span className="font-mono">Last sync: {mounted ? new Date().toLocaleTimeString() : "--:--:--"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
