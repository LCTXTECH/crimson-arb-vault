"use client"

import { useState, useEffect, useCallback } from "react"

type SentryStatus = "APPROVE" | "WARN" | "BLOCK" | "OFFLINE"

interface SentryResponse {
  status: SentryStatus
  timestamp: string
  blockedToday: number
  message?: string
}

interface AgentSentryStatusProps {
  onExecuteCheck?: () => Promise<{ approved: boolean; message: string }>
}

export function AgentSentryStatus({ onExecuteCheck }: AgentSentryStatusProps) {
  const [status, setStatus] = useState<SentryStatus>("APPROVE")
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  const [blockedToday, setBlockedToday] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{ approved: boolean; message: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    setLastCheckIn(new Date())
  }, [])

  const fetchStatus = useCallback(async () => {
    try {
      // In production, this would call the real AgentSentry API
      // For demo, we simulate the response
      const response = await fetch("/api/sentry/status", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).catch(() => null)

      if (response?.ok) {
        const data: SentryResponse = await response.json()
        setStatus(data.status)
        setLastCheckIn(new Date(data.timestamp))
        setBlockedToday(data.blockedToday)
      } else {
        // Simulate healthy status for demo
        setStatus("APPROVE")
        setLastCheckIn(new Date())
        setBlockedToday(0)
      }
    } catch {
      // Fallback to simulated healthy status
      setStatus("APPROVE")
      setLastCheckIn(new Date())
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [fetchStatus])

  // Exposed function for simulation to trigger visible check
  const triggerExecuteCheck = useCallback(async () => {
    setIsChecking(true)
    setCheckResult(null)

    // Show loading state for 1.5 seconds to make it visible
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      if (onExecuteCheck) {
        const result = await onExecuteCheck()
        setCheckResult(result)
      } else {
        // Simulate approval
        setCheckResult({ approved: true, message: "Transaction approved by AgentSentry" })
      }
    } catch {
      setCheckResult({ approved: false, message: "AgentSentry check failed" })
    } finally {
      setIsChecking(false)
      // Clear result after 3 seconds
      setTimeout(() => setCheckResult(null), 3000)
    }
  }, [onExecuteCheck])

  // Expose triggerExecuteCheck to window for simulation component
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { triggerAgentSentryCheck?: () => Promise<void> }).triggerAgentSentryCheck = triggerExecuteCheck
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { triggerAgentSentryCheck?: () => Promise<void> }).triggerAgentSentryCheck
      }
    }
  }, [triggerExecuteCheck])

  const getStatusConfig = (s: SentryStatus) => {
    switch (s) {
      case "APPROVE":
        return {
          color: "bg-emerald-500",
          ringColor: "ring-emerald-500/30",
          label: "ACTIVE",
          textColor: "text-emerald-400",
        }
      case "WARN":
        return {
          color: "bg-warning",
          ringColor: "ring-warning/30",
          label: "ELEVATED",
          textColor: "text-warning",
        }
      case "BLOCK":
        return {
          color: "bg-crimson",
          ringColor: "ring-crimson/30",
          label: "CIRCUIT OPEN",
          textColor: "text-crimson",
        }
      default:
        return {
          color: "bg-muted-foreground",
          ringColor: "ring-muted-foreground/30",
          label: "OFFLINE",
          textColor: "text-muted-foreground",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span className="text-sm font-medium text-foreground">AgentSentry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`relative flex h-2.5 w-2.5`}>
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`}></span>
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.color} ring-2 ${config.ringColor}`}></span>
          </span>
          <span className={`text-xs font-mono font-semibold ${config.textColor}`}>{config.label}</span>
        </div>
      </div>

      {/* Status Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Last check-in:</span>
          <span className="font-mono text-foreground" suppressHydrationWarning>
            {mounted && lastCheckIn ? lastCheckIn.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-mono text-foreground">MONITORING</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Transactions blocked today:</span>
          <span className="font-mono text-foreground">{blockedToday}</span>
        </div>
      </div>

      {/* Real-time check indicator */}
      {isChecking && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-warning" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-warning font-mono animate-pulse">
              Checking AgentSentry...
            </span>
          </div>
        </div>
      )}

      {/* Check result */}
      {checkResult && !isChecking && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className={`flex items-center gap-2 ${checkResult.approved ? "text-emerald-400" : "text-crimson"}`}>
            {checkResult.approved ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-xs font-mono font-semibold">
              {checkResult.approved ? "AgentSentry APPROVED" : "AgentSentry BLOCKED"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
