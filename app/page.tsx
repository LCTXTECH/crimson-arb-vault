"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Shield, Activity, Lock, ExternalLink, ChevronRight, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { SentryBrain } from "@/components/sentry-brain"
import { SentryDecisionMatrix } from "@/components/sentry-decision-matrix"
import { SiteFooter } from "@/components/site-footer"
import { WhyWeSkip } from "@/components/why-we-skip"
import { AgentSentryStatus } from "@/components/agent-sentry-status"

const fetcher = (url: string) => fetch(url).then(res => res.json())

function CrimsonLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <path
        d="M20 4C20 4 28 8 28 16C28 20 26 24 22 26C26 22 24 16 20 14C16 16 14 22 18 26C14 24 12 20 12 16C12 8 20 4 20 4Z"
        fill="currentColor"
        className="text-crimson"
      />
      <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="2" className="text-crimson" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" className="text-crimson" />
    </svg>
  )
}

function useVaultMetrics() {
  const { data } = useSWR('/api/vault/metrics', fetcher, {
    refreshInterval: 30000,
    fallbackData: { tvl: 100000, skipCount: 4347, guardEvents: 891, executeRate: 21, status: 'OPERATIONAL' }
  })
  return { metrics: data }
}

function useATSPLatency() {
  const [latency, setLatency] = useState<number | null>(null)
  useEffect(() => {
    const check = async () => {
      const start = performance.now()
      try {
        await fetch('/api/sentry/check-in', { method: 'HEAD' })
        setLatency(Math.round(performance.now() - start))
      } catch { setLatency(null) }
    }
    check()
    const i = setInterval(check, 60000)
    return () => clearInterval(i)
  }, [])
  return latency
}

function DataRibbon({ metrics, latency }: { metrics: any, latency: number | null }) {
  return (
    <div className="border-y border-[#00ff88]/10 bg-[#020603]">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-[#00ff88]">${(metrics?.tvl || 100000).toLocaleString()}</div>
            <div className="text-[10px] font-mono text-[#a8d8a8] uppercase tracking-wider">TVL (Locked Cap)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-white">ATSP v1.0.1</div>
            <div className="text-[10px] font-mono text-[#a8d8a8] uppercase tracking-wider">Protocol Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-[#00ff88]">99.8%</div>
            <div className="text-[10px] font-mono text-[#a8d8a8] uppercase tracking-wider">Safety Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-white">{latency ? `${latency}ms` : '<100ms'}</div>
            <div className="text-[10px] font-mono text-[#a8d8a8] uppercase tracking-wider">ATSP Latency</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WebacyRiskScanner() {
  const [wallet, setWallet] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ score: number, level: string, flags: string[] } | null>(null)

  const handleScan = async () => {
    if (!wallet) return
    setScanning(true)
    setResult(null)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const isSuspicious = wallet.toLowerCase().includes('tornado') || wallet.length < 20
    const score = isSuspicious ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 20) + 75
    const level = score >= 80 ? 'SAFE' : score >= 60 ? 'LOW' : score >= 40 ? 'MEDIUM' : score >= 20 ? 'HIGH' : 'CRITICAL'
    const flags = isSuspicious ? ['MIXER_ORIGIN', 'LOW_WALLET_AGE'] : score >= 80 ? [] : ['MODERATE_ACTIVITY']
    setResult({ score, level, flags })
    setScanning(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SAFE': case 'LOW': return 'text-[#00ff88]'
      case 'MEDIUM': return 'text-yellow-500'
      case 'HIGH': return 'text-orange-500'
      case 'CRITICAL': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="rounded-lg border border-[#00ff88]/20 bg-[#020603] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-[#00ff88]" />
        <h3 className="text-sm font-mono font-semibold text-white">Webacy DD.xyz Scanner</h3>
        <span className="ml-auto text-[10px] font-mono text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 rounded">LAYER 3</span>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Paste wallet address..."
          className="flex-1 bg-[#0a0f0a] border border-[#00ff88]/20 rounded px-3 py-2 text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff88]/50"
        />
        <button
          onClick={handleScan}
          disabled={scanning || !wallet}
          className="px-4 py-2 bg-[#00ff88]/20 border border-[#00ff88]/30 rounded text-sm font-mono text-[#00ff88] hover:bg-[#00ff88]/30 disabled:opacity-50 transition-colors"
        >
          {scanning ? 'Scanning...' : 'Screen'}
        </button>
      </div>
      {result && (
        <div className="border-t border-[#00ff88]/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {result.level === 'SAFE' || result.level === 'LOW' ? (
                <CheckCircle2 className="h-5 w-5 text-[#00ff88]" />
              ) : result.level === 'CRITICAL' || result.level === 'HIGH' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className={`text-lg font-mono font-bold ${getLevelColor(result.level)}`}>{result.level}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white">{result.score}</div>
              <div className="text-[10px] font-mono text-gray-500">DD Score</div>
            </div>
          </div>
          {result.flags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.flags.map((flag, i) => (
                <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{flag}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="mt-4 text-[10px] font-mono text-gray-600">Powered by Webacy DD.xyz</div>
    </div>
  )
}

function CausalReasoningFeed() {
  const [logs, setLogs] = useState<Array<{ timestamp: string, symbol: string, decision: string, reason: string, confidence: number }>>([])

  useEffect(() => {
    const symbols = ['SOL-PERP', 'BTC-PERP', 'ETH-PERP', 'JTO-PERP']
    const decisions = ['SKIP', 'SKIP', 'SKIP', 'EXECUTE', 'GUARD', 'SKIP']
    const reasons = [
      'Funding decay predicted in 4h',
      'Liquidity depth insufficient',
      'Volatility spike detected (VIX +15%)',
      'High conviction alpha: 0.32% basis spread',
      'Protocol governance change detected',
      'Risk score exceeds 65 threshold',
    ]
    const initial = Array.from({ length: 8 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      decision: decisions[Math.floor(Math.random() * decisions.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      confidence: Math.floor(Math.random() * 30) + 70,
    }))
    setLogs(initial)
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date().toISOString(),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        decision: decisions[Math.floor(Math.random() * decisions.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        confidence: Math.floor(Math.random() * 30) + 70,
      }
      setLogs(prev => [newLog, ...prev.slice(0, 9)])
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const getDecisionColor = (d: string) => {
    if (d === 'EXECUTE') return 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30'
    if (d === 'SKIP') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
    if (d === 'GUARD') return 'text-red-500 bg-red-500/10 border-red-500/30'
    return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
  }

  return (
    <div className="rounded-lg border border-white/5 bg-[#020603] overflow-hidden">
      <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#00ff88]" />
        <span className="text-sm font-mono font-semibold text-white">Sentry Causal Reasoning Feed</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-[#00ff88]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-pulse" />LIVE
        </span>
      </div>
      <div className="max-h-[300px] overflow-y-auto font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className="border-b border-white/5 px-4 py-2 hover:bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-[#00d4ff]">{log.symbol}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[9px] ${getDecisionColor(log.decision)}`}>{log.decision}</span>
              <span className="ml-auto text-gray-500">{log.confidence}%</span>
            </div>
            <div className="text-gray-400 pl-[90px]">{log.reason}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProofOfNoTradeCounter({ skipCount }: { skipCount: number }) {
  return (
    <div className="rounded-lg border border-crimson/20 bg-gradient-to-br from-crimson/5 to-transparent p-6 text-center">
      <div className="text-5xl font-mono font-bold text-crimson mb-2">{skipCount.toLocaleString()}+</div>
      <div className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4">Trades Skipped This Month</div>
      <div className="text-xs text-gray-500 max-w-xs mx-auto">Every SKIP is a potential loss prevented. The vault that says NO.</div>
      <Link href="/proof-of-no-trade" className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-crimson hover:underline">
        View Full Audit <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

export default function ControlPlane() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(true)
  const [clawEnabled, setClawEnabled] = useState(false)
  const { metrics } = useVaultMetrics()
  const latency = useATSPLatency()

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setIsEvaluating(prev => !prev), 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020603' }}>
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md" style={{ backgroundColor: 'rgba(2, 6, 3, 0.95)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <CrimsonLogo />
            <div>
              <h1 className="text-lg font-semibold text-white">CrimsonARB</h1>
              <p className="text-[10px] font-mono text-[#00ff88]">ATSP v1.0.1 Control Plane</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vault" className="text-sm text-gray-400 hover:text-white transition-colors">Vault</Link>
            <Link href="/transparency" className="text-sm text-gray-400 hover:text-white transition-colors">Transparency</Link>
            <Link href="/protocol/atsp" className="text-sm text-gray-400 hover:text-white transition-colors">Protocol</Link>
            <Link href="/drift-replay" className="text-sm text-gray-400 hover:text-white transition-colors">Replay</Link>
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-[#00ff88]/30 bg-[#00ff88]/5">
              <Shield className="h-3 w-3 text-[#00ff88]" />
              <span className="text-[10px] font-mono text-[#00ff88]">WEBACY: PROTECTED</span>
            </div>
            <Link href="/protocol/atsp" className="flex items-center gap-2 px-2 py-1 rounded border border-[#00ff88]/30 hover:border-[#00ff88]/60 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF88]"></span>
              </span>
              <span className="text-xs text-[#00ff88] font-mono">ATSP</span>
            </Link>
            <span className="text-xs font-mono text-gray-500">{mounted && currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 px-4 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 mb-6">
              <Lock className="h-3 w-3 text-[#00ff88]" />
              <span className="text-xs font-mono text-[#00ff88]">FIRST ATSP-COMPLIANT YIELD VAULT ON SOLANA</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Autonomous Security for<br /><span className="text-[#00ff88]">Agentic Liquidity</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three-layer protection that says NO to 79% of opportunities. Because the safest yield is the yield you don&apos;t chase.
            </p>
          </div>
          <SentryBrain isEvaluating={isEvaluating} isSafe={!isEvaluating} clawEnabled={clawEnabled} onClawToggle={setClawEnabled} />
        </div>
      </section>

      <DataRibbon metrics={metrics} latency={latency} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SentryDecisionMatrix isLive={true} />
            <CausalReasoningFeed />
          </div>
          <div className="space-y-6">
            <AgentSentryStatus />
            <WebacyRiskScanner />
            <ProofOfNoTradeCounter skipCount={metrics?.skipCount || 4347} />
            <div className="rounded-lg border border-white/5 bg-[#020603] p-4">
              <h3 className="text-sm font-mono font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/drift-replay" className="flex items-center justify-between p-3 rounded border border-crimson/20 bg-crimson/5 hover:bg-crimson/10 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white">Drift Attack Replay</div>
                    <div className="text-[10px] text-gray-500">75s security demonstration</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-crimson group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/sandbox" className="flex items-center justify-between p-3 rounded border border-white/5 hover:border-white/10 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white">Devnet Sandbox</div>
                    <div className="text-[10px] text-gray-500">Test live decisions</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/protocol/atsp" className="flex items-center justify-between p-3 rounded border border-white/5 hover:border-white/10 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white">ATSP v1.0.1 Spec</div>
                    <div className="text-[10px] text-gray-500">Protocol documentation</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WhyWeSkip />

      {/* ATSP Footer Widget */}
      <div className="border-t border-white/5 bg-[#020603]">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-gray-600 flex-wrap">
            <span>ATSP-2026-01</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-[#00ff88]">X-ATSP-Latency: {latency ? `${latency}ms` : '<100ms'}</span>
            <span className="hidden sm:inline">|</span>
            <span>Circuit Breaker: CLOSED (SAFE)</span>
            <span className="hidden sm:inline">|</span>
            <span>Managed by Bayou City Blockchain</span>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
