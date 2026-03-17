"use client"

import { useState, useEffect, useCallback } from "react"

type DecisionType = "EXECUTE" | "SKIP" | "GUARD" | "DEFER"

interface SimulatedDecision {
  id: string
  type: DecisionType
  symbol: string
  confidence: number
  reasoning: string
  fundingRate: number
  timestamp: Date
}

// Pre-defined simulation decisions that tell a story
const simulationScript: Omit<SimulatedDecision, "id" | "timestamp">[] = [
  {
    type: "SKIP",
    symbol: "SOL-PERP",
    confidence: 67,
    reasoning: "Funding rate elevated but velocity declining. Alpha decay predicted in 4.2 hours.",
    fundingRate: 0.0234,
  },
  {
    type: "EXECUTE",
    symbol: "BTC-PERP",
    confidence: 89,
    reasoning: "Strong funding divergence with stable liquidity. Opening delta-neutral position.",
    fundingRate: 0.0412,
  },
  {
    type: "GUARD",
    symbol: "ETH-PERP",
    confidence: 45,
    reasoning: "Volatility spike detected. Risk circuit breaker activated. Position blocked.",
    fundingRate: 0.0156,
  },
  {
    type: "SKIP",
    symbol: "JTO-PERP",
    confidence: 58,
    reasoning: "Insufficient liquidity depth. Slippage would exceed 0.15% threshold.",
    fundingRate: 0.0378,
  },
  {
    type: "EXECUTE",
    symbol: "SOL-PERP",
    confidence: 94,
    reasoning: "Funding rate acceleration confirmed. Sentry initiating basis capture.",
    fundingRate: 0.0489,
  },
]

interface LiveSimulationProps {
  onDecisionAdded?: (decision: SimulatedDecision) => void
  onSimulationComplete?: () => void
}

export function LiveSimulation({ onDecisionAdded, onSimulationComplete }: LiveSimulationProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [hasAutoStarted, setHasAutoStarted] = useState(false)
  const [decisions, setDecisions] = useState<SimulatedDecision[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stats, setStats] = useState({ evaluated: 0, executed: 0, skipped: 0, guarded: 0 })
  const [sentryStatus, setSentryStatus] = useState<"INITIALIZING" | "SCANNING" | "ANALYZING" | "MONITORING">("INITIALIZING")

  const runSimulation = useCallback(() => {
    if (isRunning) return
    
    setIsRunning(true)
    setDecisions([])
    setCurrentIndex(0)
    setStats({ evaluated: 0, executed: 0, skipped: 0, guarded: 0 })
    setSentryStatus("SCANNING")
  }, [isRunning])

  // Auto-start after 3 seconds on first visit
  useEffect(() => {
    if (hasAutoStarted) return
    
    const timer = setTimeout(() => {
      setHasAutoStarted(true)
      runSimulation()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [hasAutoStarted, runSimulation])

  // Simulation tick - add decisions one by one
  useEffect(() => {
    if (!isRunning || currentIndex >= simulationScript.length) {
      if (currentIndex >= simulationScript.length && isRunning) {
        setIsRunning(false)
        setSentryStatus("MONITORING")
        onSimulationComplete?.()
      }
      return
    }

    const delay = 6000 // 6 seconds between decisions (30s total for 5 decisions)
    
    const timer = setTimeout(() => {
      const script = simulationScript[currentIndex]
      const newDecision: SimulatedDecision = {
        ...script,
        id: `sim-${Date.now()}-${currentIndex}`,
        timestamp: new Date(),
      }
      
      setDecisions(prev => [...prev, newDecision])
      setCurrentIndex(prev => prev + 1)
      
      setStats(prev => ({
        evaluated: prev.evaluated + 1,
        executed: script.type === "EXECUTE" ? prev.executed + 1 : prev.executed,
        skipped: script.type === "SKIP" ? prev.skipped + 1 : prev.skipped,
        guarded: script.type === "GUARD" ? prev.guarded + 1 : prev.guarded,
      }))
      
      setSentryStatus(currentIndex < simulationScript.length - 1 ? "ANALYZING" : "MONITORING")
      
      onDecisionAdded?.(newDecision)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [isRunning, currentIndex, onDecisionAdded, onSimulationComplete])

  const getTypeColor = (type: DecisionType) => {
    switch (type) {
      case "EXECUTE": return "bg-success/20 border-success text-success"
      case "SKIP": return "bg-warning/20 border-warning text-warning"
      case "GUARD": return "bg-crimson/20 border-crimson text-crimson"
      case "DEFER": return "bg-muted/20 border-muted-foreground text-muted-foreground"
    }
  }

  const getGlowClass = (type: DecisionType) => {
    switch (type) {
      case "EXECUTE": return "shadow-[0_0_20px_rgba(34,197,94,0.4)]"
      case "SKIP": return "shadow-[0_0_20px_rgba(234,179,8,0.4)]"
      case "GUARD": return "shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      case "DEFER": return "shadow-[0_0_10px_rgba(100,100,100,0.3)]"
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-success animate-pulse" : sentryStatus === "MONITORING" ? "bg-success" : "bg-muted"}`} />
          <h3 className="font-mono text-lg font-semibold text-foreground">
            SENTRY BRAIN — {sentryStatus}
          </h3>
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-crimson text-white hover:bg-crimson-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? "Simulation Running..." : "Run Live Simulation"}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 rounded-lg bg-muted/30">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground">{stats.evaluated}</div>
          <div className="text-xs text-muted-foreground">Evaluated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-success">{stats.executed}</div>
          <div className="text-xs text-muted-foreground">Executed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-warning">{stats.skipped}</div>
          <div className="text-xs text-muted-foreground">Skipped</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-crimson">{stats.guarded}</div>
          <div className="text-xs text-muted-foreground">Guarded</div>
        </div>
      </div>

      {/* Decision Hex Grid */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[0, 1, 2, 3, 4].map((index) => {
          const decision = decisions[index]
          const isEmpty = !decision
          
          return (
            <div
              key={index}
              className={`
                relative aspect-square rounded-lg border-2 p-3 transition-all duration-500
                ${isEmpty 
                  ? "border-dashed border-muted-foreground/30 bg-muted/10" 
                  : `${getTypeColor(decision.type)} ${getGlowClass(decision.type)}`
                }
              `}
            >
              {isEmpty ? (
                <div className="flex items-center justify-center h-full">
                  <div className={`w-4 h-4 rounded-full border-2 border-muted-foreground/30 ${isRunning && index === currentIndex ? "animate-pulse bg-muted-foreground/20" : ""}`} />
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold">{decision.type}</span>
                    <span className="text-xs font-mono">{decision.confidence}%</span>
                  </div>
                  <div className="text-[10px] font-medium mb-1">{decision.symbol}</div>
                  <div className="text-[9px] leading-tight opacity-80 line-clamp-3 flex-1">
                    {decision.reasoning}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Running Total */}
      <div className="text-center p-3 rounded-lg bg-muted/20 border border-border">
        <p className="text-sm font-mono text-muted-foreground">
          {isRunning ? (
            <>
              <span className="text-foreground">{stats.evaluated}</span> opportunities evaluated, {" "}
              <span className="text-success">{stats.executed}</span> executed, {" "}
              <span className="text-warning">{stats.skipped}</span> skipped
            </>
          ) : sentryStatus === "MONITORING" ? (
            <span className="text-success">System Active — Monitoring for next opportunity</span>
          ) : (
            <span className="text-muted-foreground">Waiting to initialize...</span>
          )}
        </p>
      </div>
    </div>
  )
}
