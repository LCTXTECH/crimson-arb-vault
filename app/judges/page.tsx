"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AgentSentryStatus } from "@/components/agent-sentry-status"
import { InstitutionalMetrics } from "@/components/institutional-metrics"
import { VIDEOS, ANCHOR_PROGRAMS, EXTERNAL_LINKS, CONTACT } from "@/lib/config"

interface RecentDecision {
  id: string
  decision: string
  market: string
  created_at: string
  tx_hash?: string
  confidence_score?: number
}

export default function JudgesPage() {
  const [recentDecisions, setRecentDecisions] = useState<RecentDecision[]>([])
  const [lastDecisionTime, setLastDecisionTime] = useState<string>("")
  const [systemStatus, setSystemStatus] = useState({
    vault: "ACTIVE",
    sentryBrain: "PROCESSING",
    driftProtocol: "CONNECTED",
    agentSentry: "CONNECTED"
  })

  useEffect(() => {
    // Fetch recent decisions
    const fetchDecisions = async () => {
      try {
        const res = await fetch("/api/decisions?limit=5")
        if (res.ok) {
          const data = await res.json()
          if (data.decisions && data.decisions.length > 0) {
            setRecentDecisions(data.decisions)
            setLastDecisionTime(data.decisions[0].created_at)
          }
        }
      } catch (error) {
        console.error("Failed to fetch decisions:", error)
      }
    }

    fetchDecisions()
    const interval = setInterval(fetchDecisions, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTimeSince = (timestamp: string) => {
    if (!timestamp) return "—"
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "EXECUTE": return "text-emerald-400"
      case "SKIP": return "text-amber-400"
      case "GUARD": return "text-red-400"
      default: return "text-muted-foreground"
    }
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono font-bold text-lg">CRIMSON</span>
              <span className="text-foreground font-mono font-bold text-lg">ARB</span>
              <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Ranger Build-A-Bear Submission</span>
            </div>
            <nav className="flex items-center gap-2 sm:gap-4 text-sm">
              <Link href="/sandbox" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                Live Demo
              </Link>
              <Link href="/whitepaper" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
                Whitepaper
              </Link>
              <Link href="/proof-of-no-trade" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
                Proof of No-Trade
              </Link>
              <Link href={EXTERNAL_LINKS.github} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background text-foreground">
        {/* SECTION 1: 30-Second Version */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-center mb-4">
              CrimsonARB in <span className="text-primary">30 Seconds</span>
            </h1>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Three things judges need to know
            </p>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Card 1 */}
              <div className="bg-card border border-border rounded-lg p-6 relative">
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xl">
                  1
                </div>
                <h3 className="font-mono font-semibold mt-4 mb-3 text-foreground">Delta-Neutral Yield</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Delta-neutral yield vault capturing funding rate alpha on Drift Protocol via Ranger&apos;s Voltr SDK. 
                  Two Anchor programs deployed to Solana devnet.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-card border border-border rounded-lg p-6 relative">
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center font-mono font-bold text-amber-500 text-xl">
                  2
                </div>
                <h3 className="font-mono font-semibold mt-4 mb-3 text-foreground">Proof of No-Trade</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Sentry Brain AI evaluates every opportunity and publishes its reasoning — including every skip. 
                  We call this Proof of No-Trade. <span className="text-amber-400 font-mono">1,460 skips published.</span>
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-card border border-border rounded-lg p-6 relative">
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-mono font-bold text-emerald-500 text-xl">
                  3
                </div>
                <h3 className="font-mono font-semibold mt-4 mb-3 text-foreground">AgentSentry Security</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every EXECUTE passes through AgentSentry circuit-breakers before reaching Drift Protocol. 
                  The only AI-native vault with <span className="text-emerald-400">pre-finality screening</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Live Systems */}
        <section className="py-12 sm:py-16 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-10">
              Live Systems Status
            </h2>

            <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto mb-10">
              <AgentSentryStatus />
              <InstitutionalMetrics />
            </div>

            {/* System Status Panel */}
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-6">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4">System Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">Vault (Devnet):</span>
                  <span className="font-mono text-emerald-400">{systemStatus.vault}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">Sentry Brain:</span>
                  <span className="font-mono text-emerald-400">{systemStatus.sentryBrain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">Drift Protocol:</span>
                  <span className="font-mono text-emerald-400">{systemStatus.driftProtocol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">AgentSentry:</span>
                  <span className="font-mono text-emerald-400">{systemStatus.agentSentry}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last decision:</span>
                <span className="font-mono text-sm text-foreground">{getTimeSince(lastDecisionTime)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Technical Verification */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-10">
              Technical Verification
            </h2>

            {/* Anchor Programs */}
            <div className="max-w-3xl mx-auto mb-10">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4">Anchor Programs (Solana Devnet)</h3>
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm text-foreground">{ANCHOR_PROGRAMS.ctokenMarket.name}</span>
                    <p className="font-mono text-xs text-muted-foreground mt-1 break-all">{ANCHOR_PROGRAMS.ctokenMarket.address}</p>
                  </div>
                  <Link 
                    href={ANCHOR_PROGRAMS.ctokenMarket.solscanUrl} 
                    target="_blank"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    View on Solscan →
                  </Link>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm text-foreground">{ANCHOR_PROGRAMS.customAdaptor.name}</span>
                    <p className="font-mono text-xs text-muted-foreground mt-1 break-all">{ANCHOR_PROGRAMS.customAdaptor.address}</p>
                  </div>
                  <Link 
                    href={ANCHOR_PROGRAMS.customAdaptor.solscanUrl} 
                    target="_blank"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    View on Solscan →
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Devnet Activity */}
            <div className="max-w-3xl mx-auto">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4">Recent Devnet Activity</h3>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-mono text-xs uppercase text-muted-foreground">Timestamp</th>
                        <th className="text-left p-3 font-mono text-xs uppercase text-muted-foreground">Decision</th>
                        <th className="text-left p-3 font-mono text-xs uppercase text-muted-foreground">Market</th>
                        <th className="text-left p-3 font-mono text-xs uppercase text-muted-foreground">TX Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDecisions.length > 0 ? recentDecisions.map((d, i) => (
                        <tr key={d.id || i} className="border-t border-border">
                          <td className="p-3 font-mono text-xs text-muted-foreground">
                            {new Date(d.created_at).toLocaleString()}
                          </td>
                          <td className={`p-3 font-mono text-xs font-bold ${getDecisionColor(d.decision)}`}>
                            {d.decision}
                          </td>
                          <td className="p-3 font-mono text-xs">{d.market || "SOL-PERP"}</td>
                          <td className="p-3 font-mono text-xs">
                            {d.tx_hash ? (
                              <Link 
                                href={`https://solscan.io/tx/${d.tx_hash}?cluster=devnet`}
                                target="_blank"
                                className="text-primary hover:underline"
                              >
                                {d.tx_hash.slice(0, 8)}...
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-muted-foreground">
                            Loading decisions...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Three Differentiators */}
        <section className="py-12 sm:py-16 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-10">
              Key Differentiators
            </h2>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Proof of No-Trade */}
              <div className="bg-card border border-primary/50 rounded-lg p-6">
                <div className="text-3xl mb-3">🔴</div>
                <h3 className="font-mono font-bold text-lg mb-3 text-primary">PROOF OF NO-TRADE</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-mono text-foreground">1,847 decisions. 387 executed. 1,460 skipped.</span><br />
                  Every skip documented with AI reasoning. First complete audit trail in DeFi yield.
                </p>
                <Link 
                  href="/proof-of-no-trade" 
                  target="_blank"
                  className="text-sm text-primary hover:underline"
                >
                  → crimsonarb.com/proof-of-no-trade
                </Link>
              </div>

              {/* AgentSentry */}
              <div className="bg-card border border-emerald-500/50 rounded-lg p-6">
                <div className="text-3xl mb-3">🛡</div>
                <h3 className="font-mono font-bold text-lg mb-3 text-emerald-400">AGENTSENTRY INTEGRATION</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Every trade pre-screened by circuit-breaker.<br />
                  <span className="font-mono text-foreground">APPROVE / WARN / BLOCK</span> — all logged.
                </p>
                <Link 
                  href="https://agentsentry.net" 
                  target="_blank"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  → agentsentry.net
                </Link>
              </div>

              {/* Ranger Voltr SDK */}
              <div className="bg-card border border-amber-500/50 rounded-lg p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-mono font-bold text-lg mb-3 text-amber-400">RANGER VOLTR SDK</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-mono text-foreground">ctoken-market-program + custom-adaptor-program</span><br />
                  deployed to Solana devnet. Integrated with Drift Protocol funding markets.
                </p>
                <Link 
                  href={EXTERNAL_LINKS.github} 
                  target="_blank"
                  className="text-sm text-amber-400 hover:underline"
                >
                  → View Source
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Video Players */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-10">
              Video Demos
            </h2>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Demo Video */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-mono font-semibold">Demo Video</h3>
                  <p className="text-xs text-muted-foreground">3 minute walkthrough</p>
                </div>
                {VIDEOS.demo ? (
                  <div className="aspect-video">
                    <iframe
                      src={VIDEOS.demo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/50 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">🎬</div>
                      <p className="font-mono text-sm text-muted-foreground">DEMO VIDEO</p>
                      <p className="text-xs text-muted-foreground mt-1">Recording March 19, 2026 — 3 min</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pitch Video */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-mono font-semibold">Pitch Video</h3>
                  <p className="text-xs text-muted-foreground">5 minute deep dive</p>
                </div>
                {VIDEOS.pitch ? (
                  <div className="aspect-video">
                    <iframe
                      src={VIDEOS.pitch}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/50 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">🎬</div>
                      <p className="font-mono text-sm text-muted-foreground">PITCH VIDEO</p>
                      <p className="text-xs text-muted-foreground mt-1">Recording March 19, 2026 — 5 min</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Ecosystem */}
        <section className="py-12 sm:py-16 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-4">
              BCBlock Ecosystem
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Not a hackathon demo — a real company&apos;s yield engine
            </p>

            {/* Flow Diagram */}
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 sm:p-8 font-mono text-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                <div className="px-3 py-2 bg-muted rounded">SPLit settlements</div>
                <span className="text-muted-foreground">→</span>
                <div className="px-3 py-2 bg-muted rounded">USDC</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 text-center">
                <div className="px-3 py-2 bg-muted rounded">RapidPay settlements</div>
                <span className="text-muted-foreground">→</span>
                <div className="px-3 py-2 bg-muted rounded">USDC</div>
                <span className="text-muted-foreground">→</span>
                <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-500 rounded">AgentSentry</div>
                <span className="text-muted-foreground">→</span>
                <div className="px-3 py-2 bg-primary/20 border border-primary rounded text-primary">CrimsonARB</div>
                <span className="text-muted-foreground">→</span>
                <div className="px-3 py-2 bg-amber-500/20 border border-amber-500 rounded text-amber-400">Yield</div>
              </div>
              <div className="flex justify-center mt-4">
                <span className="text-muted-foreground">↓</span>
              </div>
              <div className="flex justify-center mt-2">
                <div className="px-3 py-2 bg-muted rounded">BCB Treasury</div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              10-product ecosystem. CrimsonARB compounds idle capital.
            </p>
            <div className="text-center mt-4">
              <Link 
                href="https://bcblock.net" 
                target="_blank"
                className="text-sm text-primary hover:underline"
              >
                → bcblock.net
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 7: Contact */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-center mb-10">
              Contact
            </h2>

            <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 text-center">
              <div className="font-semibold text-lg mb-1">{CONTACT.name}</div>
              <div className="text-muted-foreground mb-4">{CONTACT.company}</div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <Link href={`mailto:${CONTACT.email}`} className="text-primary hover:underline">
                    {CONTACT.email}
                  </Link>
                </div>
                <div>
                  <Link href={EXTERNAL_LINKS.twitter} target="_blank" className="text-muted-foreground hover:text-foreground">
                    {CONTACT.twitter}
                  </Link>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-border">
                <Link 
                  href={EXTERNAL_LINKS.github} 
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </Link>
                <Link 
                  href={EXTERNAL_LINKS.discord} 
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Discord
                </Link>
                <Link 
                  href={EXTERNAL_LINKS.twitter} 
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>CrimsonARB — Ranger Build-A-Bear Hackathon Submission</p>
        <p className="mt-1">© 2026 Bayou City Blockchain LLC</p>
      </footer>
    </>
  )
}
