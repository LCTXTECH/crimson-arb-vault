"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

// Decision script - matches the battle plan exactly
const SIMULATION_SCRIPT = [
  {
    delay: 5000,
    type: "SKIP" as const,
    market: "BTC-PERP/USDC",
    fundingRate: 0.0089,
    confidence: 91,
    reasoning: "Rate below minimum threshold (0.02%). Alpha insufficient after fee load. Opportunity logged. Not traded.",
    hexIndex: 7,
  },
  {
    delay: 12000,
    type: "EXECUTE" as const,
    market: "SOL-PERP/USDC",
    fundingRate: 0.0312,
    confidence: 87,
    reasoning: "Funding rate exceeds 3σ threshold. Decay model projects 4.2hr runway. Position size: $12,400 USDC.",
    hexIndex: 0,
    positionSize: 12400,
  },
  {
    delay: 20000,
    type: "SKIP" as const,
    market: "JUP-PERP/USDC",
    fundingRate: 0.0156,
    confidence: 84,
    reasoning: "Funding rate trending downward. Decay predicted within 1.8 hours. Risk-adjusted return negative.",
    hexIndex: 21,
  },
  {
    delay: 31000,
    type: "GUARD" as const,
    market: "ETH-PERP/USDC",
    fundingRate: 0.0445,
    confidence: 94,
    reasoning: "Counterparty concentration anomaly detected. Single wallet holds 31% of short OI. Circuit breaker active.",
    hexIndex: 14,
  },
  {
    delay: 45000,
    type: "SKIP" as const,
    market: "BONK-PERP/USDC",
    fundingRate: 0.0198,
    confidence: 78,
    reasoning: "Rate approaching threshold but liquidity depth insufficient. Slippage would exceed 0.5% on entry.",
    hexIndex: 28,
  },
]

// Market labels for hex grid (7 columns x 5 rows = 35 hexes)
const MARKET_LABELS = ["SOL", "BTC", "ETH", "JUP", "BONK"]

interface Decision {
  type: "EXECUTE" | "SKIP" | "GUARD"
  market: string
  fundingRate: number
  confidence: number
  reasoning: string
  timestamp: Date
  hexIndex: number
  positionSize?: number
  agentSentryStatus?: "APPROVED" | "BLOCK"
}

export function LiveSimulationV2() {
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null)
  const [activeHexes, setActiveHexes] = useState<Map<number, "EXECUTE" | "SKIP" | "GUARD">>(new Map())
  const [checkingAgentSentry, setCheckingAgentSentry] = useState(false)
  
  // Live counters that increment
  const [counters, setCounters] = useState({
    evaluated: 1847,
    executed: 387,
    skipRate: 79.1,
    currentApy: 23.4,
  })

  // Increment counters in background
  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(() => {
        setCounters(prev => {
          const newEvaluated = prev.evaluated + 1
          const newExecuted = Math.random() > 0.8 ? prev.executed + 1 : prev.executed
          return {
            evaluated: newEvaluated,
            executed: newExecuted,
            skipRate: Number((((newEvaluated - newExecuted) / newEvaluated) * 100).toFixed(1)),
            currentApy: prev.currentApy + (Math.random() - 0.5) * 0.1,
          }
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isComplete])

  const runSimulation = useCallback(async () => {
    setIsRunning(true)
    setHasStarted(true)
    setIsComplete(false)
    setDecisions([])
    setActiveHexes(new Map())
    setCurrentDecision(null)

    for (const script of SIMULATION_SCRIPT) {
      await new Promise(resolve => setTimeout(resolve, script === SIMULATION_SCRIPT[0] ? script.delay : script.delay - SIMULATION_SCRIPT[SIMULATION_SCRIPT.indexOf(script) - 1].delay))

      // For EXECUTE, show AgentSentry check
      if (script.type === "EXECUTE") {
        setCheckingAgentSentry(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCheckingAgentSentry(false)
      }

      const decision: Decision = {
        type: script.type,
        market: script.market,
        fundingRate: script.fundingRate,
        confidence: script.confidence,
        reasoning: script.reasoning,
        timestamp: new Date(),
        hexIndex: script.hexIndex,
        positionSize: script.positionSize,
        agentSentryStatus: script.type === "EXECUTE" ? "APPROVED" : script.type === "GUARD" ? "BLOCK" : undefined,
      }

      setCurrentDecision(decision)
      setDecisions(prev => [...prev, decision])
      setActiveHexes(prev => new Map(prev).set(script.hexIndex, script.type))
    }

    setIsRunning(false)
    setIsComplete(true)
  }, [])

  // Auto-start after 1.5 seconds on first load
  useEffect(() => {
    if (!hasStarted) {
      const timer = setTimeout(() => {
        runSimulation()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [hasStarted, runSimulation])

  const stats = {
    evaluated: decisions.length,
    executed: decisions.filter(d => d.type === "EXECUTE").length,
    skipped: decisions.filter(d => d.type === "SKIP").length,
    guarded: decisions.filter(d => d.type === "GUARD").length,
  }

  const getHexColor = (type: "EXECUTE" | "SKIP" | "GUARD") => {
    switch (type) {
      case "EXECUTE": return "bg-emerald-500/80 shadow-emerald-500/50"
      case "SKIP": return "bg-amber-500/80 shadow-amber-500/50"
      case "GUARD": return "bg-red-600/80 shadow-red-600/50"
    }
  }

  const getTypeIcon = (type: "EXECUTE" | "SKIP" | "GUARD") => {
    switch (type) {
      case "EXECUTE": return "⚡"
      case "SKIP": return "○"
      case "GUARD": return "🛡"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with scanning animation */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : isComplete ? "bg-emerald-500" : "bg-muted"}`} />
            <span className="font-mono text-sm">
              {isRunning ? (
                <span className="text-emerald-400">SENTRY BRAIN ACTIVE — Scanning Drift Protocol markets...</span>
              ) : isComplete ? (
                <span className="text-emerald-400">MONITORING — System Active</span>
              ) : (
                <span className="text-muted-foreground">SENTRY BRAIN — Initializing...</span>
              )}
            </span>
          </div>
          {isComplete && (
            <button
              onClick={() => {
                setHasStarted(false)
                setIsComplete(false)
                setTimeout(() => runSimulation(), 100)
              }}
              className="px-3 py-1.5 text-xs font-mono bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors"
            >
              Run Again
            </button>
          )}
        </div>
      </div>

      {/* Performance Counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-mono font-bold text-foreground">{counters.evaluated.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Evaluated</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-mono font-bold text-foreground">{counters.executed.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Executed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-mono font-bold text-foreground">{counters.skipRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Skip Rate</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-mono font-bold text-foreground">{counters.currentApy.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Current APY</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center relative group">
          <div className="text-2xl font-mono font-bold text-emerald-400">0.00%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Max Drawdown*</div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-emerald-500/50 rounded" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-background border border-border rounded text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            *Delta-neutral architecture guarantees zero directional exposure
          </div>
        </div>
      </div>

      {/* Main Grid: Hex Grid + Decision Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hex Grid - 5x3 on mobile, 7x5 on desktop */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">Market Activity Grid</h3>
          {/* Mobile Grid (5x3 = 15 hexes) */}
          <div className="grid grid-cols-5 gap-1.5 md:hidden">
            {Array.from({ length: 15 }).map((_, i) => {
              const desktopIndex = Math.floor(i / 5) * 7 + (i % 5)
              const activeType = activeHexes.get(desktopIndex)
              const marketIndex = Math.floor(i / 5)
              const isFirstInRow = i % 5 === 0
              
              return (
                <motion.div
                  key={i}
                  className={`
                    aspect-square rounded-sm flex items-center justify-center text-xs font-mono min-h-[44px]
                    ${activeType ? `${getHexColor(activeType)} shadow-lg` : "bg-muted/30"}
                    transition-all duration-500
                  `}
                  animate={activeType ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isFirstInRow && MARKET_LABELS[marketIndex] ? (
                    <span className={activeType ? "text-white font-bold" : "text-muted-foreground"}>
                      {MARKET_LABELS[marketIndex]}
                    </span>
                  ) : activeType ? (
                    <span className="text-white">{getTypeIcon(activeType)}</span>
                  ) : null}
                </motion.div>
              )
            })}
          </div>
          {/* Desktop Grid (7x5 = 35 hexes) */}
          <div className="hidden md:grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const activeType = activeHexes.get(i)
              const marketIndex = Math.floor(i / 7)
              const isFirstInRow = i % 7 === 0
              
              return (
                <motion.div
                  key={i}
                  className={`
                    aspect-square rounded-sm flex items-center justify-center text-[10px] font-mono
                    ${activeType ? `${getHexColor(activeType)} shadow-lg` : "bg-muted/30"}
                    transition-all duration-500
                  `}
                  animate={activeType ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isFirstInRow && MARKET_LABELS[marketIndex] ? (
                    <span className={activeType ? "text-white font-bold" : "text-muted-foreground"}>
                      {MARKET_LABELS[marketIndex]}
                    </span>
                  ) : activeType ? (
                    <span className="text-white">{getTypeIcon(activeType)}</span>
                  ) : null}
                </motion.div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500" /> Execute</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500" /> Skip</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-600" /> Guard</span>
          </div>
        </div>

        {/* Decision Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Live Decisions</h3>
          
          {/* AgentSentry Check Animation */}
          <AnimatePresence>
            {checkingAgentSentry && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-mono text-amber-400">Checking AgentSentry...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Decision Card */}
          <AnimatePresence mode="wait">
            {currentDecision && (
              <motion.div
                key={currentDecision.timestamp.toISOString()}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`
                  border rounded-lg p-4 font-mono text-sm
                  ${currentDecision.type === "EXECUTE" ? "bg-emerald-500/10 border-emerald-500/30" : ""}
                  ${currentDecision.type === "SKIP" ? "bg-amber-500/10 border-amber-500/30" : ""}
                  ${currentDecision.type === "GUARD" ? "bg-red-600/10 border-red-600/30" : ""}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    font-bold
                    ${currentDecision.type === "EXECUTE" ? "text-emerald-400" : ""}
                    ${currentDecision.type === "SKIP" ? "text-amber-400" : ""}
                    ${currentDecision.type === "GUARD" ? "text-red-400" : ""}
                  `}>
                    {getTypeIcon(currentDecision.type)} {currentDecision.type}
                  </span>
                  <span className="text-muted-foreground">Confidence: {currentDecision.confidence}%</span>
                </div>
                <div className="text-foreground mb-2">
                  {currentDecision.market} <span className="text-muted-foreground">Funding: +{(currentDecision.fundingRate * 100).toFixed(4)}%/hr</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  {`"${currentDecision.reasoning}"`}
                </p>
                <div className="flex items-center justify-between text-xs">
                  {currentDecision.agentSentryStatus === "APPROVED" && (
                    <span className="text-emerald-400">AgentSentry: ✓ APPROVED</span>
                  )}
                  {currentDecision.agentSentryStatus === "BLOCK" && (
                    <span className="text-red-400">AgentSentry: ⚠ BLOCK — Position held</span>
                  )}
                  {!currentDecision.agentSentryStatus && (
                    <span className="text-amber-400">Proof of No-Trade: Documented ✓</span>
                  )}
                  <span className="text-muted-foreground">
                    {currentDecision.timestamp.toISOString().replace("T", " ").slice(0, 19)} UTC
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Running Tally */}
          {stats.evaluated > 0 && (
            <div className="text-sm font-mono text-muted-foreground text-center py-2">
              {stats.evaluated} evaluated, {stats.executed} executed ({Math.round((stats.executed / stats.evaluated) * 100)}%)
            </div>
          )}
        </div>
      </div>

      {/* Summary Card (shows after completion) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/30 rounded-lg p-6"
          >
            <h3 className="text-lg font-mono font-bold text-foreground mb-4">
              Simulation Complete — Sentry Brain Results
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-foreground">{stats.evaluated}</div>
                <div className="text-xs text-muted-foreground uppercase">Evaluated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-emerald-400">{stats.executed}</div>
                <div className="text-xs text-muted-foreground uppercase">Executed ({Math.round((stats.executed / stats.evaluated) * 100)}%)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-amber-400">{stats.skipped}</div>
                <div className="text-xs text-muted-foreground uppercase">Skipped ({Math.round((stats.skipped / stats.evaluated) * 100)}%)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-red-400">{stats.guarded}</div>
                <div className="text-xs text-muted-foreground uppercase">Guarded ({Math.round((stats.guarded / stats.evaluated) * 100)}%)</div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-6 text-center max-w-2xl mx-auto">
              This discipline is <span className="text-primary font-semibold">Proof of No-Trade</span>. 
              We publish every decision. Every skip. Every reason. No other vault does this.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/transparency"
                className="px-4 py-2 text-sm font-mono bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                View Full Transparency Report →
              </Link>
              <Link
                href="/proof-of-no-trade"
                className="px-4 py-2 text-sm font-mono bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
              >
                Read the Manifesto →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
