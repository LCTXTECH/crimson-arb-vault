"use client"

import { useState, useEffect, useRef } from "react"

interface SentryThought {
  id: string
  phase: "MONITORING" | "EVALUATING" | "PREDICTING" | "DECIDING" | "EXECUTING"
  message: string
  timestamp: Date
  status: "active" | "complete" | "pending"
}

interface SentryBrainProps {
  isEvaluating: boolean
  isSafe: boolean
  onClawToggle?: (enabled: boolean) => void
  clawEnabled?: boolean
}

const THOUGHT_PHASES: { phase: SentryThought["phase"]; label: string }[] = [
  { phase: "MONITORING", label: "Monitoring Funding Rates..." },
  { phase: "EVALUATING", label: "Evaluating Liquidity Depth..." },
  { phase: "PREDICTING", label: "Predicting Basis Decay..." },
  { phase: "DECIDING", label: "Calculating Risk Parameters..." },
  { phase: "EXECUTING", label: "Ready for Execution" },
]

export function SentryBrain({ isEvaluating, isSafe, onClawToggle, clawEnabled = false }: SentryBrainProps) {
  const [mounted, setMounted] = useState(false)
  const [activePhase, setActivePhase] = useState(0)
  const [thoughts, setThoughts] = useState<SentryThought[]>([])
  const thoughtCounterRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate AI thought progression
  useEffect(() => {
    if (!isEvaluating) return

    const interval = setInterval(() => {
      // Increment counter first, outside of any state updater
      thoughtCounterRef.current += 1
      const currentCounter = thoughtCounterRef.current
      
      setActivePhase((prev) => {
        const nextPhase = (prev + 1) % THOUGHT_PHASES.length
        
        // Add thought to timeline using the counter captured above
        const thought: SentryThought = {
          id: `thought-${currentCounter}`,
          phase: THOUGHT_PHASES[prev].phase,
          message: THOUGHT_PHASES[prev].label,
          timestamp: new Date(),
          status: "complete",
        }
        
        setThoughts((prevThoughts) => {
          // Check if this thought already exists to handle Strict Mode double-invoke
          if (prevThoughts.some(t => t.id === thought.id)) {
            return prevThoughts
          }
          return [thought, ...prevThoughts].slice(0, 8)
        })
        
        return nextPhase
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isEvaluating])

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">The Sentry Brain</h3>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isEvaluating ? "animate-pulse bg-crimson" : isSafe ? "bg-[#00FF88]" : "bg-warning"}`} />
          <span className="text-xs text-muted-foreground">
            {isEvaluating ? "Evaluating" : isSafe ? "Safe" : "Caution"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: AI Thoughts Timeline */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Thoughts</p>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
            {THOUGHT_PHASES.map((phase, index) => (
              <div
                key={phase.phase}
                className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-all duration-300 ${
                  index === activePhase && isEvaluating
                    ? "border-crimson/50 bg-crimson/10"
                    : index < activePhase || !isEvaluating
                      ? "border-border bg-muted/30"
                      : "border-border/50 bg-transparent opacity-50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono ${
                    index === activePhase && isEvaluating
                      ? "bg-crimson text-white"
                      : index < activePhase || !isEvaluating
                        ? "bg-[#00FF88]/20 text-[#00FF88]"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < activePhase || !isEvaluating ? "✓" : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground truncate">{phase.label}</p>
                  <p className="text-[10px] text-muted-foreground">{phase.phase}</p>
                </div>
                {index === activePhase && isEvaluating && (
                  <div className="h-1.5 w-1.5 rounded-full bg-crimson animate-ping" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Decision Matrix Hexagon */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* Outer glow */}
            <div
              className={`absolute inset-0 blur-xl transition-all duration-500 ${
                isEvaluating ? "bg-crimson/30" : isSafe ? "bg-[#00FF88]/30" : "bg-warning/30"
              }`}
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            
            {/* Hexagon */}
            <svg viewBox="0 0 200 230" className="h-48 w-48 relative z-10">
              {/* Hexagon background */}
              <polygon
                points="100,10 185,55 185,145 100,190 15,145 15,55"
                className={`transition-all duration-500 ${
                  isEvaluating ? "fill-crimson/20 stroke-crimson" : isSafe ? "fill-[#00FF88]/20 stroke-[#00FF88]" : "fill-warning/20 stroke-warning"
                }`}
                strokeWidth="2"
              />
              
              {/* Inner hexagon pattern */}
              <polygon
                points="100,40 155,70 155,130 100,160 45,130 45,70"
                className="fill-transparent stroke-border"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              
              {/* Center pulse */}
              <circle
                cx="100"
                cy="100"
                r="20"
                className={`transition-all duration-500 ${
                  isEvaluating ? "fill-crimson animate-pulse" : isSafe ? "fill-[#00FF88]" : "fill-warning"
                }`}
              />
              
              {/* Center icon */}
              <text
                x="100"
                y="106"
                textAnchor="middle"
                className="fill-background text-lg font-bold"
              >
                {isEvaluating ? "◎" : isSafe ? "✓" : "!"}
              </text>

              {/* Metrics labels */}
              <text x="100" y="30" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">FUNDING</text>
              <text x="175" y="75" textAnchor="end" className="fill-muted-foreground text-[8px] font-mono">LIQUIDITY</text>
              <text x="175" y="145" textAnchor="end" className="fill-muted-foreground text-[8px] font-mono">DECAY</text>
              <text x="100" y="205" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">RISK</text>
              <text x="25" y="145" textAnchor="start" className="fill-muted-foreground text-[8px] font-mono">MARGIN</text>
              <text x="25" y="75" textAnchor="start" className="fill-muted-foreground text-[8px] font-mono">DELTA</text>
            </svg>
          </div>

          {/* Status text */}
          <p className={`mt-4 text-sm font-mono ${isEvaluating ? "text-crimson" : isSafe ? "text-[#00FF88]" : "text-warning"}`}>
            {isEvaluating ? "EVALUATING..." : isSafe ? "CLEAR TO EXECUTE" : "REVIEW REQUIRED"}
          </p>
        </div>
      </div>

      {/* Human-in-the-Loop Toggle */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-medium text-foreground">Open Claw Automation</p>
          <p className="text-xs text-muted-foreground">Allow automatic trade execution when safe</p>
        </div>
        <button
          onClick={() => onClawToggle?.(!clawEnabled)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            clawEnabled ? "bg-crimson" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              clawEnabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Recent Thoughts Log */}
      {mounted && thoughts.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</p>
          <div className="space-y-1 font-mono text-[10px] text-muted-foreground max-h-20 overflow-y-auto">
            {thoughts.slice(0, 4).map((thought) => (
              <div key={thought.id} className="flex items-center gap-2">
                <span className="text-crimson/70">[{thought.timestamp.toLocaleTimeString()}]</span>
                <span>{thought.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
