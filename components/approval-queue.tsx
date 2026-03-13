"use client"

import { useState } from "react"
import { generateAIReasoning, type DriftTradeData, type DriftMarketContext } from "@/lib/ai-reasoning"

interface PendingTrade extends DriftTradeData {
  id: string
  proposedAt: Date
  expiresAt: Date
  sentryScore: number
}

interface ApprovalQueueProps {
  trades: PendingTrade[]
  onApprove: (tradeId: string) => void
  onReject: (tradeId: string) => void
  clawEnabled: boolean
}

const mockContext: DriftMarketContext = {
  marketCondition: "BULLISH",
  avgFundingRate24h: 0.185,
  openInterest: 245000000,
  volatilityIndex: 42,
}

export function ApprovalQueue({ trades, onApprove, onReject, clawEnabled }: ApprovalQueueProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const handleApprove = async (tradeId: string) => {
    setProcessing(tradeId)
    
    // Call the Open Claw execute endpoint
    try {
      const trade = trades.find(t => t.id === tradeId)
      if (!trade) return

      const response = await fetch("/api/claw/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agentsentry-key": process.env.NEXT_PUBLIC_AGENTSENTRY_API_KEY || "demo-key",
        },
        body: JSON.stringify({
          tradeId: trade.id,
          type: trade.type,
          symbol: trade.symbol,
          size: trade.size,
          direction: trade.direction || "SHORT",
          targetPrice: trade.entryPrice,
          slippageTolerance: 0.005,
          approvedBy: "MANUAL",
          metadata: {
            fundingRate: trade.fundingRate,
            riskScore: trade.riskScore,
            aiConfidence: generateAIReasoning(trade, mockContext).confidence,
            sentryApproval: true,
          },
        }),
      })

      if (response.ok) {
        onApprove(tradeId)
      }
    } catch (error) {
      console.error("Failed to execute trade:", error)
    } finally {
      setProcessing(null)
    }
  }

  const getTimeRemaining = (expiresAt: Date): string => {
    const diff = expiresAt.getTime() - Date.now()
    if (diff <= 0) return "Expired"
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getConfidenceColor = (confidence: "HIGH" | "MEDIUM" | "LOW"): string => {
    switch (confidence) {
      case "HIGH": return "text-[#00FF88]"
      case "MEDIUM": return "text-warning"
      case "LOW": return "text-crimson"
    }
  }

  if (trades.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Pending Approvals</h3>
          {clawEnabled && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
              Auto-execute enabled
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">No pending trades</p>
          <p className="text-xs text-muted-foreground mt-1">
            {clawEnabled ? "Auto-execution is handling all trades" : "AgentSentry is monitoring for opportunities"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Pending Approvals</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson text-[10px] font-bold text-white">
            {trades.length}
          </span>
        </div>
        {clawEnabled && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
            Auto-execute for HIGH confidence
          </span>
        )}
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {trades.map((trade) => {
          const reasoning = generateAIReasoning(trade, mockContext)
          const isExpanded = expandedId === trade.id
          const isProcessing = processing === trade.id

          return (
            <div key={trade.id} className="p-4">
              {/* Trade Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{trade.symbol}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                      trade.type === "OPEN_BASIS" ? "bg-crimson/20 text-crimson" :
                      trade.type === "LIQUIDATION_GUARD" ? "bg-crimson/30 text-crimson border border-crimson/50" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {trade.type.replace(/_/g, " ")}
                    </span>
                    <span className={`text-xs font-medium ${getConfidenceColor(reasoning.confidence)}`}>
                      {reasoning.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{reasoning.summary}</p>
                </div>

                {/* Timer */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">Expires in</p>
                  <p className="text-sm font-mono text-warning">{getTimeRemaining(trade.expiresAt)}</p>
                </div>
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : trade.id)}
                className="mt-2 text-xs text-crimson hover:underline"
              >
                {isExpanded ? "Hide details" : "Show reasoning"}
              </button>

              {isExpanded && (
                <div className="mt-3 rounded-md bg-muted/30 p-3 text-xs">
                  <p className="text-muted-foreground leading-relaxed mb-2">{reasoning.detailed}</p>
                  <div className="flex items-center gap-4 text-[10px] border-t border-border pt-2 mt-2">
                    <span className="text-muted-foreground">
                      Size: <span className="text-foreground font-mono">{trade.size.toFixed(4)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Entry: <span className="text-foreground font-mono">${trade.entryPrice.toFixed(2)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Funding: <span className="text-crimson font-mono">{(trade.fundingRate * 100).toFixed(2)}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      Sentry Score: <span className="text-foreground font-mono">{trade.sentryScore}/100</span>
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    <span className="text-warning">Risk:</span> {reasoning.riskAssessment}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleApprove(trade.id)}
                  disabled={isProcessing}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isProcessing
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-[#00FF88]/20 text-[#00FF88] hover:bg-[#00FF88]/30"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Executing...
                    </span>
                  ) : (
                    "Approve & Execute"
                  )}
                </button>
                <button
                  onClick={() => onReject(trade.id)}
                  disabled={isProcessing}
                  className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
