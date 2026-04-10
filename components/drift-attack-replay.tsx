"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Shield, 
  AlertTriangle, 
  XCircle, 
  CheckCircle,
  ExternalLink
} from "lucide-react"

interface DriftAttackReplayProps {
  autoPlay?: boolean
  onComplete?: () => void
  className?: string
}

type Phase = 0 | 1 | 2 | 3 | 4
type HexState = 'IDLE' | 'SCANNING' | 'ACTIVE' | 'SKIP' | 'GUARD' | 'BLOCK' | 'SAFE'

interface DecisionLog {
  timestamp: string
  layer: string
  decision: string
  reason: string
}

const PHASE_DURATION = 18 // seconds per phase at 1x
const TOTAL_DURATION = 72 // 4 phases

export function DriftAttackReplay({ autoPlay = false, onComplete, className = "" }: DriftAttackReplayProps) {
  const [currentPhase, setCurrentPhase] = useState<Phase>(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [elapsed, setElapsed] = useState(0)
  const [logs, setLogs] = useState<DecisionLog[]>([])
  const [hexStates, setHexStates] = useState<HexState[]>(Array(42).fill('IDLE'))
  const [speed, setSpeed] = useState<1 | 2>(1)
  const [phaseLabel, setPhaseLabel] = useState<string | null>(null)
  const [circuitBroken, setCircuitBroken] = useState(false)

  const vaultStatus = currentPhase >= 4 ? 'PROTECTED' : currentPhase >= 2 ? 'GUARDED' : 'OPERATIONAL'

  // Phase logs data
  const phaseLogs: Record<number, DecisionLog[]> = {
    1: [
      { timestamp: "09:14:31", layer: "SENTRY_BRAIN", decision: "EVALUATING", reason: "New yield opportunity: CVT/USDC" },
      { timestamp: "09:14:33", layer: "SENTRY_BRAIN", decision: "ANALYZING", reason: "Token: CVT | Liquidity: SHALLOW" },
      { timestamp: "09:14:35", layer: "SENTRY_BRAIN", decision: "ANALYZING", reason: "Volume pattern: WASH_DETECTED" },
      { timestamp: "09:14:37", layer: "SENTRY_BRAIN", decision: "ANALYZING", reason: "Organic holders: <50 wallets" },
      { timestamp: "09:14:39", layer: "SENTRY_BRAIN", decision: "ANALYZING", reason: "Confidence score: 12/100" },
      { timestamp: "09:14:41", layer: "SENTRY_BRAIN", decision: "⚠ SKIP", reason: "Manufactured price history detected" },
    ],
    2: [
      { timestamp: "09:14:43", layer: "AGENT_SENTRY", decision: "MONITORING", reason: "Protocol: Drift Security Council" },
      { timestamp: "09:14:45", layer: "AGENT_SENTRY", decision: "ALERT", reason: "GOVERNANCE_MIGRATION detected" },
      { timestamp: "09:14:47", layer: "AGENT_SENTRY", decision: "ALERT", reason: "Timelock: 48h → 0h (REMOVED)" },
      { timestamp: "09:14:49", layer: "AGENT_SENTRY", decision: "ALERT", reason: "Signer threshold: Changed 2/5" },
      { timestamp: "09:14:51", layer: "AGENT_SENTRY", decision: "🔴 GUARD", reason: "CIRCUIT BREAK: Safety degraded" },
      { timestamp: "09:14:52", layer: "AGENT_SENTRY", decision: "🔴 GUARD", reason: "All positions suspended" },
    ],
    3: [
      { timestamp: "09:14:54", layer: "WEBACY_DD", decision: "SCREENING", reason: "Counterparty wallet: 8Xk...9mR" },
      { timestamp: "09:14:56", layer: "WEBACY_DD", decision: "SCREENING", reason: "TORNADO_CASH_ORIGIN: TRUE" },
      { timestamp: "09:14:58", layer: "WEBACY_DD", decision: "SCREENING", reason: "Wallet age: 8 days" },
      { timestamp: "09:15:00", layer: "WEBACY_DD", decision: "SCREENING", reason: "DD Score: 11/100" },
      { timestamp: "09:15:02", layer: "WEBACY_DD", decision: "🚨 BLOCK", reason: "CRITICAL: Counterparty rejected" },
    ],
    4: [
      { timestamp: "09:15:04", layer: "VAULT", decision: "PROTECTED", reason: "Attack vectors blocked: 3/3" },
      { timestamp: "09:15:05", layer: "VAULT", decision: "PROTECTED", reason: "Capital preserved: $0 lost" },
      { timestamp: "09:15:06", layer: "VAULT", decision: "PROTECTED", reason: "Proof of No-Trade: CONFIRMED" },
    ],
  }

  // Handle phase transitions
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setElapsed(prev => {
        const newElapsed = prev + (1 / speed)
        const newPhase = Math.min(4, Math.floor(newElapsed / PHASE_DURATION) + 1) as Phase
        
        if (newPhase !== currentPhase && newPhase > currentPhase) {
          setCurrentPhase(newPhase)
          
          // Show phase label
          const labels = ["", "LAYER 1 — SENTRY BRAIN", "LAYER 2 — CIRCUIT BREAK", "LAYER 3 — RISK SCREEN", "VAULT PROTECTED"]
          setPhaseLabel(labels[newPhase])
          setTimeout(() => setPhaseLabel(null), 1500)
          
          // Phase 2: Circuit break
          if (newPhase === 2) {
            setCircuitBroken(true)
            setTimeout(() => setCircuitBroken(false), 1000)
          }
        }
        
        if (newElapsed >= TOTAL_DURATION) {
          setIsPlaying(false)
          onComplete?.()
          return TOTAL_DURATION
        }
        
        return newElapsed
      })
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isPlaying, currentPhase, speed, onComplete])

  // Add logs based on elapsed time
  useEffect(() => {
    if (!isPlaying || currentPhase === 0) return

    const phaseLogs_ = phaseLogs[currentPhase] || []
    const phaseStart = (currentPhase - 1) * PHASE_DURATION
    const phaseElapsed = elapsed - phaseStart
    const logsToShow = Math.floor((phaseElapsed / PHASE_DURATION) * phaseLogs_.length)
    
    const existingCount = logs.filter(l => 
      phaseLogs_.some(pl => pl.timestamp === l.timestamp)
    ).length
    
    if (logsToShow > existingCount && logsToShow <= phaseLogs_.length) {
      setLogs(prev => [...prev, phaseLogs_[logsToShow - 1]])
    }
  }, [elapsed, currentPhase, isPlaying])

  // Update hex states based on phase
  useEffect(() => {
    const newStates = [...hexStates]
    
    if (currentPhase === 1) {
      // Scanning animation for phase 1
      const scanningIndexes = [5, 12, 18, 23, 29, 34, 38, 41]
      scanningIndexes.forEach((idx, i) => {
        setTimeout(() => {
          setHexStates(prev => {
            const updated = [...prev]
            updated[idx] = 'SCANNING'
            return updated
          })
        }, i * 200)
      })
      
      // Then SKIP
      setTimeout(() => {
        setHexStates(prev => prev.map(s => s === 'SCANNING' ? 'SKIP' : s))
      }, 2000)
    } else if (currentPhase === 2) {
      // GUARD state
      setHexStates(prev => prev.map(s => s === 'SKIP' || s === 'SCANNING' || s === 'ACTIVE' ? 'GUARD' : s))
    } else if (currentPhase === 3) {
      // BLOCK specific hexes
      const blockIndexes = [7, 21, 35]
      setHexStates(prev => {
        const updated = [...prev]
        blockIndexes.forEach(idx => { updated[idx] = 'BLOCK' })
        return updated
      })
    } else if (currentPhase === 4) {
      // All safe
      setTimeout(() => {
        setHexStates(Array(42).fill('SAFE'))
      }, 500)
    }
  }, [currentPhase])

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentPhase(0)
    setElapsed(0)
    setLogs([])
    setHexStates(Array(42).fill('IDLE'))
    setCircuitBroken(false)
    setPhaseLabel(null)
  }

  const getHexColor = (state: HexState) => {
    switch (state) {
      case 'IDLE': return 'bg-[#1e293b] border-[#334155]'
      case 'SCANNING': return 'bg-[#f59e0b]/20 border-[#f59e0b] animate-pulse'
      case 'ACTIVE': return 'bg-[#f59e0b]/30 border-[#f59e0b]'
      case 'SKIP': return 'bg-[#475569] border-[#64748b]'
      case 'GUARD': return 'bg-[#7f1d1d]/50 border-[#ef4444]'
      case 'BLOCK': return 'bg-[#7f1d1d] border-[#dc2626]'
      case 'SAFE': return 'bg-[#10b981]/20 border-[#10b981]'
    }
  }

  const getLogStyle = (decision: string) => {
    if (decision.includes('SKIP')) return 'text-[#f59e0b]'
    if (decision.includes('GUARD')) return 'text-[#ef4444] font-bold'
    if (decision.includes('BLOCK')) return 'text-[#dc2626] font-bold'
    if (decision.includes('PROTECTED')) return 'text-[#10b981]'
    return 'text-[#94a3b8]'
  }

  const progress = (elapsed / TOTAL_DURATION) * 100
  const progressColor = currentPhase === 4 ? '#10b981' : currentPhase >= 2 ? '#ef4444' : '#f59e0b'

  return (
    <div className={`bg-[#0a0a0f] rounded-xl border border-[#1e293b] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#f1f5f9] font-mono">DRIFT ATTACK REPLAY — APRIL 1, 2026</h2>
            <p className="text-sm text-[#94a3b8]">Three layers of NO. Zero funds lost.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-lg bg-[#1e293b] hover:bg-[#334155] flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-[#94a3b8]" />
            </button>
            <button
              onClick={() => setSpeed(speed === 1 ? 2 : 1)}
              className="px-3 h-10 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-xs font-mono text-[#94a3b8] transition-colors"
            >
              {speed}x
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className="absolute h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
          />
          {/* Phase markers */}
          {[27, 53, 80, 100].map((pos, i) => (
            <div 
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#334155] rotate-45"
              style={{ left: `${pos}%`, transform: 'translateX(-50%) translateY(-50%) rotate(45deg)' }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs font-mono text-[#64748b]">
          <span>L1</span>
          <span>L2</span>
          <span>L3</span>
          <span>✓</span>
        </div>
        <div className="text-right text-xs font-mono text-[#94a3b8] mt-1">
          {Math.floor(elapsed).toString().padStart(2, '0')}:{((elapsed % 1) * 60).toFixed(0).padStart(2, '0')}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[240px_1fr_280px] gap-4 p-4 relative">
        {/* Phase Label Overlay */}
        {phaseLabel && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0a0f]/80 animate-pulse">
            <div className={`text-2xl font-bold font-mono ${currentPhase === 4 ? 'text-[#10b981]' : currentPhase === 2 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
              {phaseLabel}
            </div>
          </div>
        )}

        {/* Circuit Break Banner */}
        {circuitBroken && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-[#ef4444] px-8 py-4 rounded-lg flex items-center gap-3 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
              <span className="text-white font-bold font-mono text-xl">CIRCUIT BROKEN</span>
            </div>
          </div>
        )}

        {/* Left: Attack Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">ATTACK VECTORS</h3>
          
          {[
            { phase: 1, title: "CVT COLLATERAL DETECTED", icon: Shield, color: "#f59e0b" },
            { phase: 2, title: "GOVERNANCE MIGRATION", icon: AlertTriangle, color: "#ef4444" },
            { phase: 3, title: "COUNTERPARTY RISK", icon: XCircle, color: "#dc2626" },
            { phase: 4, title: "VAULT PROTECTED", icon: CheckCircle, color: "#10b981" },
          ].map(({ phase, title, icon: Icon, color }) => {
            const isActive = currentPhase === phase
            const isPast = currentPhase > phase
            const status = isPast ? (phase === 4 ? 'PROTECTED' : 'BLOCKED') : isActive ? 'ACTIVE' : 'PENDING'
            
            return (
              <div 
                key={phase}
                className={`p-3 rounded-lg border-l-4 transition-all ${
                  isPast ? 'bg-[#0f172a]' : isActive ? 'bg-[#0f172a] animate-pulse' : 'bg-[#0f172a]/50'
                }`}
                style={{ borderColor: isPast || isActive ? color : '#334155' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#64748b]">0{phase}</span>
                  <Icon className="w-4 h-4" style={{ color: isPast || isActive ? color : '#64748b' }} />
                </div>
                <div className="text-xs text-[#f1f5f9] font-medium">{title}</div>
                <div 
                  className="text-xs font-mono mt-1"
                  style={{ color: isPast ? color : isActive ? '#f59e0b' : '#64748b' }}
                >
                  {status}
                </div>
              </div>
            )
          })}
        </div>

        {/* Center: Hex Grid */}
        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-7 gap-1 relative">
            {hexStates.map((state, i) => (
              <div
                key={i}
                className={`w-10 h-12 flex items-center justify-center text-xs font-mono border transition-all ${getHexColor(state)}`}
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  transform: i % 2 === 1 ? 'translateY(24px)' : ''
                }}
              >
                {state === 'SKIP' && <span className="text-[#64748b]">—</span>}
                {state === 'GUARD' && <span className="text-[#ef4444]">!</span>}
                {state === 'BLOCK' && <span className="text-[#dc2626]">X</span>}
                {state === 'SAFE' && <span className="text-[#10b981]">✓</span>}
              </div>
            ))}
            
            {/* Center overlay for phase 4 */}
            {currentPhase === 4 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#0a0a0f]/90 rounded-lg px-4 py-2 text-center">
                  <div className="text-[#10b981] font-bold">✓ VAULT PROTECTED</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mini ticker */}
          <div className="mt-4 text-xs font-mono text-[#64748b] text-center">
            PHASE: {currentPhase}/4 | ELAPSED: {Math.floor(elapsed)}s
          </div>
        </div>

        {/* Right: Decision Log */}
        <div className="bg-[#0f172a] rounded-lg p-3 max-h-[400px] overflow-y-auto">
          <h3 className="text-xs font-mono text-[#64748b] uppercase tracking-wider mb-3">SENTRY DECISION LOG</h3>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="text-xs font-mono animate-slide-in">
                <span className="text-[#64748b]">{log.timestamp}</span>
                <span className="text-[#94a3b8] ml-2">{log.layer}</span>
                <span className={`ml-2 ${getLogStyle(log.decision)}`}>{log.decision}</span>
                <div className="text-[#64748b] pl-4 truncate">{log.reason}</div>
              </div>
            ))}
            {logs.length > 0 && isPlaying && (
              <span className="inline-block w-2 h-4 bg-[#f1f5f9] animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="p-4 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            vaultStatus === 'PROTECTED' ? 'bg-[#10b981]' : vaultStatus === 'GUARDED' ? 'bg-[#f59e0b] animate-pulse' : 'bg-[#10b981]'
          }`} />
          <span className="text-sm font-mono" style={{ color: vaultStatus === 'PROTECTED' ? '#10b981' : vaultStatus === 'GUARDED' ? '#f59e0b' : '#10b981' }}>
            {vaultStatus === 'PROTECTED' ? '✓ PROTECTED' : `● ${vaultStatus}`}
          </span>
        </div>
        
        <div className="text-center flex-1">
          {currentPhase === 4 ? (
            <div className="text-[#dc2626] font-mono font-bold">
              <span className="text-2xl">$285,000,000</span>
              <span className="text-sm ml-2">PROTECTED — 3 VECTORS BLOCKED</span>
            </div>
          ) : currentPhase > 0 ? (
            <div className="text-[#f59e0b] font-mono">
              LAYER {currentPhase} ACTIVE — {['', 'SENTRY BRAIN', 'CIRCUIT BREAKER', 'RISK SCREENING'][currentPhase]}
            </div>
          ) : (
            <div className="text-[#94a3b8] font-mono">AWAITING THREAT ANALYSIS</div>
          )}
        </div>

        {currentPhase === 4 && (
          <Link
            href="/proof-of-no-trade"
            className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-mono px-4 py-2 rounded-lg transition-colors"
          >
            VIEW PROOF OF NO-TRADE
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
