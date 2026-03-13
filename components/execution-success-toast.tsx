"use client"

import { useState, useEffect } from "react"

interface ExecutionSuccessProps {
  isVisible: boolean
  onClose: () => void
  executionData: {
    symbol: string
    amount: number
    capturedAPR: number
    txSignature: string
    aiReasoning: string
    executionType: "FUNDING_CAPTURE" | "BASIS_OPEN" | "BASIS_CLOSE" | "REBALANCE"
    timestamp: Date
  }
}

export function ExecutionSuccessToast({
  isVisible,
  onClose,
  executionData,
}: ExecutionSuccessProps) {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Auto-collapse after 10 seconds
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!mounted || !isVisible) return null

  const baseAsset = executionData.symbol.replace("-PERP", "")
  const solscanUrl = `https://solscan.io/tx/${executionData.txSignature}`

  const getExecutionLabel = () => {
    switch (executionData.executionType) {
      case "FUNDING_CAPTURE":
        return "FUNDING CAPTURED"
      case "BASIS_OPEN":
        return "BASIS TRADE OPENED"
      case "BASIS_CLOSE":
        return "BASIS TRADE CLOSED"
      case "REBALANCE":
        return "POSITION REBALANCED"
      default:
        return "TRADE EXECUTED"
    }
  }

  return (
    <>
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-500 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-lg border border-crimson/50 bg-card shadow-2xl">
          {/* Glowing crimson border effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-crimson/20 via-transparent to-crimson/20 animate-pulse" />
          <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-crimson via-crimson/50 to-crimson opacity-50 blur-sm" />

          <div className="relative bg-card p-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                {/* Success Icon */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-crimson/30 animate-ping" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-crimson-dark">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-crimson">
                      Sentry Execution Successful
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {getExecutionLabel()}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount
                </p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {executionData.amount.toFixed(4)} {baseAsset}
                </p>
              </div>
              <div className="rounded-md bg-muted/50 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Captured APR
                </p>
                <p className="text-lg font-bold text-success font-mono">
                  {executionData.capturedAPR.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Expandable AI Reasoning */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-crimson" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                AI Reasoning
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-2 rounded-md bg-muted/30 p-3 border-l-2 border-crimson">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{executionData.aiReasoning}"
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[10px] text-muted-foreground font-mono">
                {executionData.timestamp.toLocaleTimeString()}
              </span>
              <a
                href={solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-crimson hover:text-crimson-dark transition-colors"
              >
                View on Solscan
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Execution Success Card - For display in the audit trail or dashboard
 */
export function ExecutionSuccessCard({
  executionData,
}: {
  executionData: ExecutionSuccessProps["executionData"]
}) {
  const baseAsset = executionData.symbol.replace("-PERP", "")
  const solscanUrl = `https://solscan.io/tx/${executionData.txSignature}`

  return (
    <div className="relative overflow-hidden rounded-lg border border-success/30 bg-card">
      {/* Success glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-success to-transparent" />

      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
              <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {executionData.executionType.replace("_", " ")}
              </p>
              <p className="text-xs text-muted-foreground">{executionData.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-success font-mono">
              +{executionData.capturedAPR.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">APR Captured</p>
          </div>
        </div>

        <div className="rounded-md bg-muted/30 p-3 mb-3">
          <p className="text-xs text-muted-foreground mb-1">Sentry Reasoning:</p>
          <p className="text-sm text-foreground">{executionData.aiReasoning}</p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-muted-foreground">
            {executionData.amount.toFixed(4)} {baseAsset}
          </span>
          <a
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-crimson hover:text-crimson-dark transition-colors"
          >
            {executionData.txSignature.slice(0, 8)}...
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
