"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Skip reason breakdown data
const SKIP_REASONS = [
  { reason: "Alpha below threshold", percentage: 47, example: "Funding rate was +0.0089%/hr. After fees (0.003%), expected alpha was +0.006%. Minimum threshold: +0.020%. Not traded." },
  { reason: "Funding rate decay", percentage: 31, example: "Rate was +0.0341%/hr but trending -0.002%/hr. Decay model predicted crossover in 1.4 hours. Position would have been unprofitable." },
  { reason: "Counterparty anomaly", percentage: 14, example: "Single wallet accumulated 28% of short OI in 45 minutes. Potential manipulation detected. Circuit breaker activated." },
  { reason: "AgentSentry BLOCK", percentage: 5, example: "External security layer detected elevated systemic risk across Drift markets. All execution paused for 15 minutes." },
  { reason: "Position size too small", percentage: 3, example: "Available capital $847 USDC. Minimum position size $1,000. Waiting for deposits or position closure." },
]

// Last 24 hours decisions (mock data)
const RECENT_DECISIONS = [
  { time: "05:32 UTC", type: "SKIP", market: "SOL/USDC", rate: 0.009, reason: "Below threshold" },
  { time: "05:28 UTC", type: "SKIP", market: "BTC/USDC", rate: 0.011, reason: "Decay predicted" },
  { time: "05:21 UTC", type: "EXECUTE", market: "SOL/USDC", rate: 0.034, reason: "Alpha confirmed" },
  { time: "05:18 UTC", type: "SKIP", market: "ETH/USDC", rate: 0.007, reason: "Below threshold" },
  { time: "05:14 UTC", type: "GUARD", market: "JUP/USDC", rate: 0.041, reason: "OI anomaly" },
  { time: "05:09 UTC", type: "SKIP", market: "BONK/USDC", rate: 0.019, reason: "Decay predicted" },
  { time: "05:03 UTC", type: "SKIP", market: "SOL/USDC", rate: 0.012, reason: "Below threshold" },
  { time: "04:58 UTC", type: "EXECUTE", market: "ETH/USDC", rate: 0.028, reason: "Alpha confirmed" },
  { time: "04:51 UTC", type: "SKIP", market: "BTC/USDC", rate: 0.008, reason: "Below threshold" },
  { time: "04:47 UTC", type: "GUARD", market: "SOL/USDC", rate: 0.045, reason: "OI concentration" },
  { time: "04:42 UTC", type: "SKIP", market: "JUP/USDC", rate: 0.016, reason: "Liquidity depth" },
  { time: "04:38 UTC", type: "SKIP", market: "ETH/USDC", rate: 0.009, reason: "Below threshold" },
]

// Comparison table data
const COMPARISON = [
  { feature: "Trade history", others: "Sometimes", crimson: "Always ✓" },
  { feature: "Skip history", others: "Never", crimson: "Always ✓" },
  { feature: "Skip reasoning", others: "Never", crimson: "Always ✓" },
  { feature: "Circuit breaker log", others: "Never", crimson: "Always ✓" },
  { feature: "AgentSentry checks", others: "N/A", crimson: "Every trade" },
  { feature: "Real-time decision feed", others: "Never", crimson: "Live ✓" },
  { feature: "Downloadable audit trail", others: "Never", crimson: "CSV ✓" },
]

export default function ProofOfNoTradePage() {
  const [counters, setCounters] = useState({ total: 2847, skipped: 2247, skipRate: 79.1 })
  const [hoveredReason, setHoveredReason] = useState<string | null>(null)
  const [visibleDecisions, setVisibleDecisions] = useState(6)

  // Animate counters on load
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        total: prev.total + 1,
        skipped: Math.random() > 0.2 ? prev.skipped + 1 : prev.skipped,
        skipRate: Number((((prev.skipped + (Math.random() > 0.2 ? 1 : 0)) / (prev.total + 1)) * 100).toFixed(1)),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero Section - The Manifesto */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-mono font-bold text-foreground mb-6 leading-tight"
          >
            MOST VAULTS HIDE<br />THEIR INACTION.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Every automated trading system makes thousands of decisions daily. 
            Most of them are {"'"}do nothing.{"'"} Those decisions are never shown to you.
            <br /><br />
            <span className="text-foreground font-semibold">We show you all of them.</span>
          </motion.p>

          {/* Counter Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto mb-8"
          >
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-primary">{counters.total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Decisions Published</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-amber-400">{counters.skipped.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Were SKIP</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-foreground">{counters.skipRate}%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Skip Rate</div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-primary font-mono text-lg"
          >
            This is not a failure rate. This is discipline.
          </motion.p>
        </div>
      </section>

      {/* Why We Skip Breakdown */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-mono font-bold text-foreground mb-8 text-center">Why we skip</h2>
          
          <div className="space-y-4">
            {SKIP_REASONS.map((item, index) => (
              <motion.div
                key={item.reason}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredReason(item.reason)}
                onMouseLeave={() => setHoveredReason(null)}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-mono text-muted-foreground w-48 shrink-0">{item.reason}</span>
                  <div className="flex-1 h-8 bg-muted/30 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-amber-500/60 rounded flex items-center justify-end pr-2"
                    >
                      <span className="text-xs font-mono text-white">{item.percentage}%</span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Hover tooltip */}
                {hoveredReason === item.reason && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-3 bg-card border border-border rounded-lg z-10"
                  >
                    <p className="text-xs text-muted-foreground font-mono">{item.example}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Last 24 Hours Feed */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-mono font-bold text-foreground mb-2 text-center">The last 24 hours</h2>
          <p className="text-muted-foreground text-center mb-8">Every decision. Timestamped. Reasoned. Permanent.</p>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-3 bg-muted/30 text-xs font-mono text-muted-foreground uppercase tracking-wider border-b border-border">
              <div>Time</div>
              <div>Type</div>
              <div>Market</div>
              <div>Rate</div>
              <div>Reason</div>
            </div>
            
            <div className="divide-y divide-border">
              {RECENT_DECISIONS.slice(0, visibleDecisions).map((decision, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-5 gap-4 p-3 text-sm font-mono hover:bg-muted/20 transition-colors"
                >
                  <div className="text-muted-foreground">{decision.time}</div>
                  <div className={`
                    ${decision.type === "EXECUTE" ? "text-emerald-400" : ""}
                    ${decision.type === "SKIP" ? "text-amber-400" : ""}
                    ${decision.type === "GUARD" ? "text-red-400" : ""}
                  `}>
                    {decision.type}
                  </div>
                  <div className="text-foreground">{decision.market}</div>
                  <div className="text-muted-foreground">{(decision.rate * 100).toFixed(3)}%</div>
                  <div className="text-muted-foreground">{decision.reason}</div>
                </motion.div>
              ))}
            </div>
            
            {visibleDecisions < RECENT_DECISIONS.length && (
              <div className="p-3 text-center border-t border-border">
                <button
                  onClick={() => setVisibleDecisions(prev => prev + 6)}
                  className="text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  Load more...
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-mono font-bold text-foreground mb-2 text-center">
            What other vaults show you vs what we show you
          </h2>
          <p className="text-muted-foreground text-center mb-8">Transparency is our competitive advantage.</p>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 text-sm font-mono text-muted-foreground uppercase tracking-wider border-b border-border">
              <div>Feature</div>
              <div className="text-center">Other Vaults</div>
              <div className="text-center">CrimsonARB</div>
            </div>
            
            <div className="divide-y divide-border">
              {COMPARISON.map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 text-sm font-mono">
                  <div className="text-foreground">{row.feature}</div>
                  <div className="text-center text-muted-foreground">{row.others}</div>
                  <div className="text-center text-emerald-400">{row.crimson}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Download Audit Trail */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm rounded hover:bg-primary/90 transition-colors">
              Download Full Audit Trail (CSV)
            </button>
            <p className="text-xs text-muted-foreground mt-2">Enterprise feature — includes all decisions with reasoning</p>
          </div>
        </div>
      </section>

      {/* Institutional Credibility */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-mono font-bold text-foreground mb-8 text-center">
            Why institutional capital needs this
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary text-2xl mb-4">📋</div>
              <h3 className="font-mono font-bold text-foreground mb-2">REGULATORY COMPLIANCE</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Regulators require documented decision trails for automated trading systems. 
                CrimsonARB provides the only on-demand audit trail in DeFi yield.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary text-2xl mb-4">🛡</div>
              <h3 className="font-mono font-bold text-foreground mb-2">RISK MANAGEMENT</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our skip log is a real-time risk management tool. GUARD events show where 
                circuit-breakers fired. Every anomaly is documented before it becomes a loss.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-primary text-2xl mb-4">📊</div>
              <h3 className="font-mono font-bold text-foreground mb-2">INVESTOR REPORTING</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Share the full decision log with your LPs. Not just returns — the reasoning 
                behind every trade and every pass. This is DeFi growing up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-mono font-bold text-foreground mb-4">
            See the Sentry Brain in action
          </h2>
          <p className="text-muted-foreground mb-8">
            Watch live decisions happen. See exactly why we skip 80% of opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sandbox"
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm rounded hover:bg-primary/90 transition-colors"
            >
              Launch Sandbox →
            </Link>
            <Link
              href="/transparency"
              className="px-6 py-3 bg-muted text-foreground font-mono text-sm rounded hover:bg-muted/80 transition-colors"
            >
              View Transparency Report
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
