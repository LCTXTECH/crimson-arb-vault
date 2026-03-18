"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Phase = "idle" | "normal" | "anomaly" | "deliberating" | "agentsentry" | "guard" | "aftermath"

interface MarketData {
  fundingRate: number
  oiConcentration: number
  spikeVelocity: number
  patternMatch: number
}

interface ChaosState {
  phase: Phase
  elapsed: number
  marketData: MarketData
  typedReasoning: string
  agentSentryResult: "pending" | "BLOCK" | null
  showComparison: boolean
}

const TYPING_SPEED = 35 // ms per character

const AI_REASONING_TEXT = `SOL-PERP funding rate spiked 847% in 12 minutes.
Surface reading: exceptional alpha opportunity.

Investigating: Single wallet controls 31.4% of
short open interest — exceeds 25% threshold.

Pattern match: 87% similarity to March 2025
SOL-PERP funding manipulation event that resulted
in -$2.1M loss for vaults that entered.

Preliminary decision: GUARD pending AgentSentry.`

export function ChaosDemo({ autoStart = false }: { autoStart?: boolean }) {
  const [state, setState] = useState<ChaosState>({
    phase: "idle",
    elapsed: 0,
    marketData: {
      fundingRate: 0.031,
      oiConcentration: 8.2,
      spikeVelocity: 0,
      patternMatch: 0,
    },
    typedReasoning: "",
    agentSentryResult: null,
    showComparison: false,
  })

  const [isRunning, setIsRunning] = useState(false)

  const startChaosDemo = useCallback(() => {
    setIsRunning(true)
    setState({
      phase: "normal",
      elapsed: 0,
      marketData: {
        fundingRate: 0.031,
        oiConcentration: 8.2,
        spikeVelocity: 0,
        patternMatch: 0,
      },
      typedReasoning: "",
      agentSentryResult: null,
      showComparison: false,
    })
  }, [])

  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(startChaosDemo, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoStart, startChaosDemo])

  // Main simulation loop
  useEffect(() => {
    if (!isRunning || state.phase === "idle") return

    const interval = setInterval(() => {
      setState((prev) => {
        const newElapsed = prev.elapsed + 100
        let newState = { ...prev, elapsed: newElapsed }

        // Phase transitions
        if (newElapsed < 10000) {
          // Phase 1: Normal (0-10s)
          newState.phase = "normal"
        } else if (newElapsed < 20000) {
          // Phase 2: Anomaly (10-20s)
          newState.phase = "anomaly"
          const progress = (newElapsed - 10000) / 10000
          newState.marketData = {
            fundingRate: 0.031 + progress * 0.170,
            oiConcentration: 8.2 + progress * 23.2,
            spikeVelocity: progress * 847,
            patternMatch: progress * 87,
          }
        } else if (newElapsed < 35000) {
          // Phase 3: Deliberating (20-35s)
          newState.phase = "deliberating"
          newState.marketData = {
            fundingRate: 0.201,
            oiConcentration: 31.4,
            spikeVelocity: 847,
            patternMatch: 87,
          }
          // Typing animation
          const typingProgress = Math.min(
            (newElapsed - 20000) / (TYPING_SPEED * AI_REASONING_TEXT.length),
            1
          )
          const charCount = Math.floor(typingProgress * AI_REASONING_TEXT.length)
          newState.typedReasoning = AI_REASONING_TEXT.slice(0, charCount)
        } else if (newElapsed < 45000) {
          // Phase 4: AgentSentry (35-45s)
          newState.phase = "agentsentry"
          newState.typedReasoning = AI_REASONING_TEXT
          if (newElapsed > 40000) {
            newState.agentSentryResult = "BLOCK"
          } else {
            newState.agentSentryResult = "pending"
          }
        } else if (newElapsed < 55000) {
          // Phase 5: Guard (45-55s)
          newState.phase = "guard"
          newState.agentSentryResult = "BLOCK"
        } else if (newElapsed < 65000) {
          // Phase 6: Aftermath (55-65s)
          newState.phase = "aftermath"
          // Rate collapses
          const collapseProgress = (newElapsed - 55000) / 5000
          newState.marketData = {
            ...newState.marketData,
            fundingRate: 0.201 - collapseProgress * 0.193,
          }
          newState.showComparison = true
        } else {
          // End
          setIsRunning(false)
          newState.phase = "idle"
          newState.showComparison = true
        }

        return newState
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, state.phase])

  const getStatusText = () => {
    switch (state.phase) {
      case "idle":
        return "READY — Click to simulate flash event"
      case "normal":
        return "MONITORING — Normal conditions"
      case "anomaly":
        return "ANOMALY DETECTED — Sentry Brain analyzing"
      case "deliberating":
        return "DELIBERATING — AI reasoning in progress"
      case "agentsentry":
        return "CIRCUIT OPEN — AgentSentry screening..."
      case "guard":
        return "GUARD — Circuit breaker activated"
      case "aftermath":
        return "PROTECTED — Capital secured"
      default:
        return "MONITORING"
    }
  }

  const getPhaseColor = () => {
    switch (state.phase) {
      case "normal":
        return "border-emerald-500/30"
      case "anomaly":
      case "deliberating":
        return "border-amber-500/50 animate-pulse"
      case "agentsentry":
      case "guard":
        return "border-red-500/70 animate-pulse"
      case "aftermath":
        return "border-emerald-500/50"
      default:
        return "border-border"
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Button */}
      {state.phase === "idle" && !state.showComparison && (
        <button
          onClick={startChaosDemo}
          className="w-full py-4 px-6 bg-red-900/30 border-2 border-red-500/50 rounded-lg text-lg font-mono text-red-400 hover:bg-red-900/50 hover:border-red-500 transition-all flex items-center justify-center gap-3 min-h-[56px]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Simulate Flash Event
        </button>
      )}

      {/* Main Simulation Panel */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border-2 ${getPhaseColor()} bg-card overflow-hidden transition-colors duration-300`}
          >
            {/* Status Bar */}
            <div
              className={`px-4 py-3 border-b border-border flex items-center justify-between ${
                state.phase === "anomaly" || state.phase === "deliberating"
                  ? "bg-amber-500/10"
                  : state.phase === "agentsentry" || state.phase === "guard"
                  ? "bg-red-500/10"
                  : state.phase === "aftermath"
                  ? "bg-emerald-500/10"
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    state.phase === "normal"
                      ? "bg-emerald-500"
                      : state.phase === "anomaly" || state.phase === "deliberating"
                      ? "bg-amber-500 animate-pulse"
                      : state.phase === "agentsentry" || state.phase === "guard"
                      ? "bg-red-500 animate-pulse"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="text-sm font-mono">{getStatusText()}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {Math.floor(state.elapsed / 1000)}s / 60s
              </span>
            </div>

            {/* Market Data */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">SOL-PERP Rate</div>
                <div
                  className={`text-lg font-mono ${
                    state.marketData.fundingRate > 0.1 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {(state.marketData.fundingRate * 100).toFixed(3)}%/hr
                  {state.marketData.fundingRate > 0.05 && (
                    <span className="text-xs ml-1 text-red-500">EXTREME</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Short OI #1</div>
                <div
                  className={`text-lg font-mono ${
                    state.marketData.oiConcentration > 25 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {state.marketData.oiConcentration.toFixed(1)}%
                  {state.marketData.oiConcentration > 25 && (
                    <span className="text-xs ml-1 text-red-500">DANGER</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Spike Velocity</div>
                <div
                  className={`text-lg font-mono ${
                    state.marketData.spikeVelocity > 500 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {state.marketData.spikeVelocity.toFixed(0)}%/hr
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Pattern Match</div>
                <div
                  className={`text-lg font-mono ${
                    state.marketData.patternMatch > 70 ? "text-amber-500" : "text-foreground"
                  }`}
                >
                  {state.marketData.patternMatch.toFixed(0)}%
                  {state.marketData.patternMatch > 70 && (
                    <span className="text-xs ml-1">MANIPULATION</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Reasoning (Phase 3+) */}
            {(state.phase === "deliberating" ||
              state.phase === "agentsentry" ||
              state.phase === "guard" ||
              state.phase === "aftermath") && (
              <div className="p-4 border-b border-border bg-muted/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Sentry Brain Reasoning
                </div>
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                  {state.typedReasoning}
                  {state.phase === "deliberating" && (
                    <span className="animate-pulse">|</span>
                  )}
                </pre>
              </div>
            )}

            {/* AgentSentry Result (Phase 4+) */}
            {(state.phase === "agentsentry" ||
              state.phase === "guard" ||
              state.phase === "aftermath") && (
              <div className="p-4 border-b border-border">
                <div
                  className={`rounded-lg border-2 p-4 font-mono text-sm ${
                    state.agentSentryResult === "BLOCK"
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-amber-500/50 bg-amber-500/10 animate-pulse"
                  }`}
                >
                  {state.agentSentryResult === "pending" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span>AgentSentry screening transaction...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-red-500 font-bold">AgentSentry Verdict: BLOCK</div>
                      <div className="text-muted-foreground text-xs space-y-1">
                        <div>Reason: Counterparty concentration</div>
                        <div>Single wallet: 31.4% short OI</div>
                        <div>Manipulation pattern: DETECTED</div>
                        <div>Risk assessment: EXTREME</div>
                        <div className="pt-2 text-foreground">
                          Transaction BLOCKED before reaching Drift Protocol.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GUARD Decision Card (Phase 5+) */}
            {(state.phase === "guard" || state.phase === "aftermath") && (
              <div className="p-4 border-b border-border">
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="font-mono text-red-500 font-bold">
                      GUARD — Circuit Breaker Activated
                    </span>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground space-y-1">
                    <div>Market: SOL-PERP | Rate: 0.201%/hr</div>
                    <div className="py-2 text-foreground">
                      &ldquo;Funding spike identified as probable manipulation. OI concentration
                      31.4%. AgentSentry blocked execution. Capital protected: $41,200 USDC.&rdquo;
                    </div>
                    <div className="flex items-center gap-4 pt-2 text-xs">
                      <span className="text-red-500">AgentSentry: BLOCKED</span>
                      <span className="text-emerald-500">Vault protected: Yes</span>
                      <span className="text-amber-500">Loss prevented: ~$892</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aftermath Message (Phase 6) */}
            {state.phase === "aftermath" && (
              <div className="p-4 bg-emerald-500/10">
                <div className="text-center space-y-2">
                  <div className="text-emerald-500 font-mono font-bold">
                    The Sentry Brain protected your capital.
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Every GUARD event like this is documented. This is why Proof of No-Trade exists.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Panel */}
      {state.showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* Without CrimsonARB */}
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-red-500 font-mono font-bold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              WITHOUT CRIMSONARB
            </div>
            <div className="text-sm font-mono text-muted-foreground space-y-2">
              <div>Standard vault behavior:</div>
              <div className="pl-2 border-l-2 border-red-500/30 space-y-1">
                <div>Funding spike detected: &ldquo;Alpha opportunity!&rdquo;</div>
                <div>Position opened: $41,200 USDC short</div>
                <div>Funding rate collapses: position underwater</div>
                <div className="text-red-500">Exit at -2.1% loss = -$865</div>
                <div>No log. No reason. Just a loss.</div>
              </div>
            </div>
          </div>

          {/* With CrimsonARB */}
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="text-emerald-500 font-mono font-bold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              WITH CRIMSONARB
            </div>
            <div className="text-sm font-mono text-muted-foreground space-y-2">
              <div>CrimsonARB behavior:</div>
              <div className="pl-2 border-l-2 border-emerald-500/30 space-y-1">
                <div>Funding spike detected: &ldquo;Analyzing...&rdquo;</div>
                <div>OI concentration check: FAIL (31.4%)</div>
                <div>AgentSentry: BLOCK</div>
                <div className="text-emerald-500">Position: never opened</div>
                <div className="text-emerald-500">Capital: $41,200 USDC protected</div>
                <div>Log: Full GUARD entry with reasoning</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset Button */}
      {state.showComparison && !isRunning && (
        <button
          onClick={startChaosDemo}
          className="w-full py-3 px-4 bg-muted/30 border border-border rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors min-h-[48px]"
        >
          Run Simulation Again
        </button>
      )}
    </div>
  )
}
