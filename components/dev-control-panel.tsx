"use client"

import { useState, useEffect } from "react"

interface DevControlPanelProps {
  isOpen: boolean
  onClose: () => void
  onSimulateFundingSpike: (rate: number) => void
  onResetSandbox: () => void
}

interface FeedbackEntry {
  id: string
  message: string
  category: string
  timestamp: Date
}

interface SDKLog {
  id: string
  type: "drift" | "ranger" | "solana"
  method: string
  payload: string
  timestamp: Date
}

export function DevControlPanel({
  isOpen,
  onClose,
  onSimulateFundingSpike,
  onResetSandbox,
}: DevControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"simulate" | "logs" | "feedback">("simulate")
  const [fundingRate, setFundingRate] = useState(25)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackCategory, setFeedbackCategory] = useState("execution")
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([])
  const [sdkLogs, setSdkLogs] = useState<SDKLog[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize mock SDK logs
    setSdkLogs([
      {
        id: "1",
        type: "drift",
        method: "getUser",
        payload: JSON.stringify({ subAccountId: 0, authority: "7xK...abc" }, null, 2),
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: "2",
        type: "ranger",
        method: "getVaultState",
        payload: JSON.stringify({ tvl: 100000, apy: 24.8, positions: 3 }, null, 2),
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: "3",
        type: "solana",
        method: "getLatestBlockhash",
        payload: JSON.stringify({ blockhash: "ABC123...", lastValidBlockHeight: 12345678 }, null, 2),
        timestamp: new Date(),
      },
    ])
  }, [])

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return

    setSubmittingFeedback(true)

    try {
      // Submit to Supabase feedback table
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: feedbackText,
          category: feedbackCategory,
          source: "dev_control_panel",
        }),
      })

      if (response.ok) {
        setFeedbackHistory((prev) => [
          {
            id: Date.now().toString(),
            message: feedbackText,
            category: feedbackCategory,
            timestamp: new Date(),
          },
          ...prev,
        ])
        setFeedbackText("")
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (!isOpen || !mounted) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-[#0a0e14] border-l border-border z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <h2 className="font-mono text-sm font-semibold text-foreground">DEV CONTROL PANEL</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["simulate", "logs", "feedback"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-crimson/10 text-crimson border-b-2 border-crimson"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "simulate" && (
            <div className="space-y-6">
              {/* Funding Spike Simulator */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Simulate Funding Spike
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fundingRate}
                    onChange={(e) => setFundingRate(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-crimson"
                  />
                  <span className="text-sm font-mono text-crimson w-16 text-right">{fundingRate}% APY</span>
                </div>
                <button
                  onClick={() => onSimulateFundingSpike(fundingRate)}
                  className="w-full py-2 px-4 bg-crimson/20 border border-crimson/50 rounded text-sm font-mono text-crimson hover:bg-crimson/30 transition-colors"
                >
                  TRIGGER AI REASONING
                </button>
              </div>

              {/* Liquidity Depth Simulator */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Simulate Liquidity Event
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 px-3 bg-success/10 border border-success/30 rounded text-xs font-mono text-success hover:bg-success/20 transition-colors">
                    WHALE BUY
                  </button>
                  <button className="py-2 px-3 bg-crimson/10 border border-crimson/30 rounded text-xs font-mono text-crimson hover:bg-crimson/20 transition-colors">
                    WHALE SELL
                  </button>
                </div>
              </div>

              {/* Sentry State Override */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Sentry Brain State
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 px-2 bg-muted border border-border rounded text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                    IDLE
                  </button>
                  <button className="py-2 px-2 bg-warning/10 border border-warning/30 rounded text-xs font-mono text-warning hover:bg-warning/20 transition-colors">
                    EVALUATING
                  </button>
                  <button className="py-2 px-2 bg-success/10 border border-success/30 rounded text-xs font-mono text-success hover:bg-success/20 transition-colors">
                    EXECUTING
                  </button>
                </div>
              </div>

              {/* Reset Sandbox */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={onResetSandbox}
                  className="w-full py-3 px-4 bg-red-900/20 border border-red-500/50 rounded text-sm font-mono text-red-400 hover:bg-red-900/30 transition-colors"
                >
                  RESET SANDBOX
                </button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Clears all simulated data and resets to $100k USDC
                </p>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase">SDK Transaction Logs</span>
                <button className="text-xs text-crimson hover:text-crimson/80 transition-colors">
                  Clear
                </button>
              </div>
              <div className="space-y-3">
                {sdkLogs.map((log) => (
                  <div key={log.id} className="bg-muted/30 rounded border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono uppercase ${
                            log.type === "drift"
                              ? "text-blue-400"
                              : log.type === "ranger"
                                ? "text-purple-400"
                                : "text-green-400"
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-xs font-mono text-foreground">{log.method}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="p-3 text-xs font-mono text-muted-foreground overflow-x-auto">
                      {log.payload}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-4">
              {/* Feedback Form */}
              <div className="space-y-3">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-crimson/50"
                >
                  <option value="execution">Execution Logic</option>
                  <option value="ui">UI/UX</option>
                  <option value="sdk">SDK Integration</option>
                  <option value="performance">Performance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Feedback Message
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts on the execution logic, slippage, or any issues..."
                  rows={4}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback || !feedbackText.trim()}
                className="w-full py-2 px-4 bg-crimson rounded text-sm font-medium text-white hover:bg-crimson-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>

              {/* Feedback History */}
              {feedbackHistory.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Recent Submissions</span>
                  {feedbackHistory.map((entry) => (
                    <div key={entry.id} className="bg-muted/30 rounded border border-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-crimson uppercase">{entry.category}</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Network: DEVNET</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
