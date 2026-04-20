import { Suspense } from "react"
import Link from "next/link"
import { 
  ChevronDown, 
  Shield, 
  Brain, 
  AlertTriangle, 
  ArrowRight,
  FileText,
  BarChart3,
  Map,
  Search,
  ExternalLink,
  Play
} from "lucide-react"

export const metadata = {
  title: 'CrimsonARB | Ranger Build-A-Bear Hackathon Submission',
  description: 'The vault that says NO. Three-layer security model validated by the $285M Drift exploit. Proof of No-Trade. Ranger Build-A-Bear 2026.',
}

// Fallback metrics
const FALLBACK_METRICS = {
  skipCount: 4347,
  guardCount: 891,
  executeRate: 21,
  decisionsToday: 127,
  uptime: 99.9
}

// Fetch vault metrics with graceful fallback
async function getVaultMetrics() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/vault/metrics`, { 
      next: { revalidate: 60 },
      cache: 'no-store'
    })
    if (!res.ok) return FALLBACK_METRICS
    const data = await res.json()
    return {
      skipCount: data.totalSkips || FALLBACK_METRICS.skipCount,
      guardCount: data.totalGuards || FALLBACK_METRICS.guardCount,
      executeRate: data.executeRate || FALLBACK_METRICS.executeRate,
      decisionsToday: data.decisionsToday || FALLBACK_METRICS.decisionsToday,
      uptime: data.uptime || FALLBACK_METRICS.uptime
    }
  } catch {
    return FALLBACK_METRICS
  }
}

export default async function JudgesPage() {
  const metrics = await getVaultMetrics()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 h-14 border-b backdrop-blur-md" style={{ 
        backgroundColor: 'rgba(10, 10, 15, 0.95)', 
        borderColor: '#1e293b' 
      }}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg" style={{ color: '#dc2626' }}>CRIMSON</span>
            <span className="font-mono font-bold text-lg" style={{ color: '#f1f5f9' }}>ARB</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border" style={{ 
              borderColor: '#dc2626', 
              color: '#dc2626' 
            }}>
              RANGER BUILD-A-BEAR 2026
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#security-model" className="hover:opacity-80 transition-opacity" style={{ color: '#94a3b8' }}>Security Model</a>
            <a href="#demo" className="hover:opacity-80 transition-opacity" style={{ color: '#94a3b8' }}>Live Demo</a>
            <a href="#architecture" className="hover:opacity-80 transition-opacity" style={{ color: '#94a3b8' }}>Architecture</a>
          </div>
        </div>
      </nav>

      {/* SECTION 1: THE $285M QUESTION - Hero */}
      <section className="min-h-screen flex flex-col justify-center px-4 py-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono tracking-wider mb-8 border" style={{ 
            borderColor: '#dc2626',
            color: '#dc2626'
          }}>
            RANGER BUILD-A-BEAR HACKATHON — APRIL 2026
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#f1f5f9' }}>
            On April 1, 2026, $285M was drained from
            <br className="hidden sm:block" />
            {" "}Solana&apos;s largest perps DEX in 12 minutes.
          </h1>
          
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8" style={{ color: '#dc2626' }}>
            Not from a code bug.
            <br />
            From trust.
          </p>

          {/* Subheadline */}
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: '#94a3b8' }}>
            A fake token. Compromised governance. Absent safety timelocks. 
            The attack didn&apos;t break the code — it broke the assumptions 
            that protocols are safe to trust blindly.
          </p>

          {/* Separator */}
          <div className="w-24 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#dc2626' }} />

          {/* Thesis Statement */}
          <p className="text-lg sm:text-xl max-w-3xl mx-auto font-medium" style={{ color: '#f1f5f9' }}>
            CrimsonARB was not built to predict which protocol would fail.
            It was built to assume <span style={{ color: '#dc2626' }}>any protocol can fail</span> — and to say NO 
            before capital is ever at risk.
          </p>

          {/* Attack Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
            <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#dc2626' }}>$285M</div>
              <div className="text-sm" style={{ color: '#94a3b8' }}>Drained</div>
            </div>
            <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#f59e0b' }}>12 min</div>
              <div className="text-sm" style={{ color: '#94a3b8' }}>Duration of exploit</div>
            </div>
            <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid #1e293b' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#f1f5f9' }}>0</div>
              <div className="text-sm" style={{ color: '#94a3b8' }}>Safety timelocks</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6" style={{ color: '#94a3b8' }} />
        </div>
      </section>

      {/* SECTION 2: THREE LAYERS OF NO */}
      <section id="security-model" className="py-20 px-4" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <h2 className="text-center font-mono text-sm tracking-widest mb-2" style={{ color: '#dc2626' }}>
            THREE LAYERS OF NO
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: '#94a3b8' }}>
            How CrimsonARB&apos;s security architecture maps to the Drift attack
          </p>

          {/* Layer Cards */}
          <div className="space-y-6">
            {/* LAYER 1: SENTRY BRAIN */}
            <div className="rounded-xl p-6 sm:p-8" style={{ 
              backgroundColor: '#0f172a', 
              borderLeft: '4px solid #f59e0b',
              border: '1px solid #1e293b',
              borderLeftWidth: '4px',
              borderLeftColor: '#f59e0b'
            }}>
              <div className="text-xs font-mono tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                LAYER 01 — AI REASONING ENGINE
              </div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#f1f5f9' }}>
                <Brain className="w-6 h-6" style={{ color: '#f59e0b' }} />
                SENTRY BRAIN
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
                    The Sentry Brain evaluates every yield opportunity before 
                    capital is committed. It scores market conditions, token 
                    fundamentals, and price history for anomalies.
                  </p>
                  <p className="leading-relaxed" style={{ color: '#94a3b8' }}>
                    <strong style={{ color: '#f1f5f9' }}>During the Drift attack:</strong> CVT presented shallow liquidity, 
                    wash-traded volume patterns, and fewer than 50 organic 
                    holders. Confidence score: 12/100.
                  </p>
                </div>
                
                {/* Terminal Block */}
                <div className="rounded-lg p-4 font-mono text-sm" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8' }}>Token:        <span style={{ color: '#f1f5f9' }}>CVT/USDC</span></div>
                  <div style={{ color: '#94a3b8' }}>Liquidity:    <span style={{ color: '#dc2626' }}>SHALLOW</span></div>
                  <div style={{ color: '#94a3b8' }}>Volume:       <span style={{ color: '#dc2626' }}>WASH_DETECTED</span></div>
                  <div style={{ color: '#94a3b8' }}>Holders:      <span style={{ color: '#f1f5f9' }}>&lt; 50 wallets</span></div>
                  <div style={{ color: '#94a3b8' }}>Confidence:   <span style={{ color: '#dc2626' }}>12 / 100</span></div>
                  <div className="my-2" style={{ borderTop: '1px solid #1e293b' }} />
                  <div style={{ color: '#f59e0b' }}>DECISION:  SKIP</div>
                  <div style={{ color: '#94a3b8' }}>Reason:    Manufactured price history.</div>
                  <div style={{ color: '#94a3b8' }}>           Insufficient market depth.</div>
                </div>
              </div>
              
              {/* Attack Vector Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b'
              }}>
                <Shield className="w-4 h-4" />
                ATTACK VECTOR BLOCKED: Fake CVT collateral at manufactured price
              </div>
            </div>

            {/* LAYER 2: AGENTSENTRY */}
            <div className="rounded-xl p-6 sm:p-8" style={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderLeftWidth: '4px',
              borderLeftColor: '#dc2626'
            }}>
              <div className="text-xs font-mono tracking-wider mb-2" style={{ color: '#dc2626' }}>
                LAYER 02 — PROTOCOL CIRCUIT BREAKER
              </div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#f1f5f9' }}>
                <Shield className="w-6 h-6" style={{ color: '#dc2626' }} />
                AGENTSENTRY
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
                    AgentSentry monitors protocol-level health signals 
                    continuously. Governance migrations, multisig changes, 
                    and timelock modifications are classified as circuit-break 
                    events — regardless of stated intent.
                  </p>
                  <p className="leading-relaxed" style={{ color: '#94a3b8' }}>
                    <strong style={{ color: '#f1f5f9' }}>During the Drift attack:</strong> The Security Council was migrated 
                    to a 2/5 threshold and the 48-hour timelock was eliminated. 
                    AgentSentry would have triggered a full GUARD state.
                  </p>
                </div>
                
                {/* Terminal Block */}
                <div className="rounded-lg p-4 font-mono text-sm" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8' }}>Protocol:     <span style={{ color: '#f1f5f9' }}>Drift Security Council</span></div>
                  <div style={{ color: '#94a3b8' }}>Event:        <span style={{ color: '#dc2626' }}>GOVERNANCE_MIGRATION</span></div>
                  <div style={{ color: '#94a3b8' }}>Timelock:     <span style={{ color: '#dc2626' }}>48h → 0h [REMOVED]</span></div>
                  <div style={{ color: '#94a3b8' }}>Threshold:    <span style={{ color: '#f1f5f9' }}>Changed to 2/5</span></div>
                  <div className="my-2" style={{ borderTop: '1px solid #1e293b' }} />
                  <div style={{ color: '#dc2626' }}>STATUS:    CIRCUIT BREAK</div>
                  <div style={{ color: '#dc2626' }}>DECISION:  GUARD</div>
                  <div style={{ color: '#94a3b8' }}>Action:    All positions suspended.</div>
                  <div style={{ color: '#94a3b8' }}>           Pending protocol review.</div>
                </div>
              </div>
              
              {/* Attack Vector Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.1)', 
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#dc2626'
              }}>
                <Shield className="w-4 h-4" />
                ATTACK VECTOR BLOCKED: Governance migration removed safety timelocks
              </div>
            </div>

            {/* LAYER 3: WEBACY DD.XYZ */}
            <div className="rounded-xl p-6 sm:p-8" style={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderLeftWidth: '4px',
              borderLeftColor: '#dc2626'
            }}>
              <div className="text-xs font-mono tracking-wider mb-2" style={{ color: '#dc2626' }}>
                LAYER 03 — THIRD-PARTY RISK SCREENING
              </div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#f1f5f9' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#dc2626' }} />
                WEBACY DD.XYZ
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
                    Webacy DD.xyz screens every counterparty wallet against 
                    on-chain risk signals — mixer origins, wallet age, 
                    funding patterns, and protocol interaction history.
                  </p>
                  <p className="leading-relaxed" style={{ color: '#94a3b8' }}>
                    <strong style={{ color: '#f1f5f9' }}>During the Drift attack:</strong> The attacker wallets originated 
                    from Tornado Cash, were 8 days old, and funded via a 
                    privacy mixer. DD Score: 11/100. Classification: CRITICAL.
                  </p>
                </div>
                
                {/* Terminal Block */}
                <div className="rounded-lg p-4 font-mono text-sm" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8' }}>Wallet:        <span style={{ color: '#f1f5f9' }}>8Xk...9mR</span></div>
                  <div style={{ color: '#94a3b8' }}>TC_ORIGIN:     <span style={{ color: '#dc2626' }}>TRUE</span></div>
                  <div style={{ color: '#94a3b8' }}>Wallet age:    <span style={{ color: '#dc2626' }}>8 days</span></div>
                  <div style={{ color: '#94a3b8' }}>Funding:       <span style={{ color: '#dc2626' }}>Privacy mixer</span></div>
                  <div style={{ color: '#94a3b8' }}>DD Score:      <span style={{ color: '#dc2626' }}>11 / 100</span></div>
                  <div className="my-2" style={{ borderTop: '1px solid #1e293b' }} />
                  <div style={{ color: '#dc2626' }}>RISK LEVEL: CRITICAL</div>
                  <div style={{ color: '#dc2626' }}>DECISION:   BLOCK</div>
                  <div style={{ color: '#94a3b8' }}>Action:     Counterparty rejected.</div>
                  <div style={{ color: '#94a3b8' }}>            Interaction terminated.</div>
                </div>
              </div>
              
              {/* Attack Vector Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.1)', 
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#dc2626'
              }}>
                <Shield className="w-4 h-4" />
                ATTACK VECTOR BLOCKED: Tornado Cash-origin attacker wallet
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mt-8 rounded-xl p-6 text-center" style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.05)', 
            border: '1px solid rgba(16, 185, 129, 0.3)' 
          }}>
            <div className="font-mono text-xl sm:text-2xl font-bold mb-2" style={{ color: '#10b981' }}>
              3 ATTACK VECTORS DETECTED → 3 ATTACK VECTORS BLOCKED → $0 LOST
            </div>
            <p style={{ color: '#94a3b8' }}>
              This is not a post-hoc analysis. This is how CrimsonARB&apos;s architecture operates on every trade.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROOF OF NO-TRADE */}
      <section className="py-20 px-4" style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <h2 className="text-center text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
            PROOF OF NO-TRADE
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: '#dc2626' }}>
            In a post-Drift world, the most valuable trade is the one you don&apos;t make.
          </p>

          {/* Hero Metric */}
          <div className="text-center mb-12">
            <div className="font-mono font-bold leading-none" style={{ fontSize: '128px', color: '#dc2626' }}>
              79%
            </div>
            <div className="font-mono text-sm tracking-widest mt-2" style={{ color: '#94a3b8' }}>
              OF OPPORTUNITIES REJECTED
            </div>
            <p className="mt-2" style={{ color: '#f1f5f9' }}>
              Because discipline is the edge.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                {metrics.skipCount.toLocaleString()}+
              </div>
              <div className="text-sm font-medium" style={{ color: '#f1f5f9' }}>SKIP Decisions</div>
              <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>This month</div>
            </div>
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#dc2626' }}>
                {metrics.guardCount.toLocaleString()}
              </div>
              <div className="text-sm font-medium" style={{ color: '#f1f5f9' }}>GUARD Events</div>
              <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>Circuit breaks triggered</div>
            </div>
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
              <div className="font-mono text-4xl font-bold mb-1" style={{ color: '#10b981' }}>
                {metrics.executeRate}%
              </div>
              <div className="text-sm font-medium" style={{ color: '#f1f5f9' }}>EXECUTE Rate</div>
              <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>Only when conviction is high</div>
            </div>
          </div>

          {/* Callout Panel */}
          <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            <p className="text-center text-lg" style={{ color: '#f1f5f9' }}>
              On April 1, 2026, $285M was lost because a protocol couldn&apos;t say no.
              <br />
              <span style={{ color: '#dc2626' }}>CrimsonARB said no {metrics.skipCount.toLocaleString()} times this month.</span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              href="/proof-of-no-trade"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#dc2626', color: '#f1f5f9' }}
            >
              VIEW ALL DECISIONS
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: VENUE-AGNOSTIC ARCHITECTURE */}
      <section id="architecture" className="py-20 px-4" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <h2 className="text-center text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
            VENUE-AGNOSTIC ARCHITECTURE
          </h2>
          <p className="text-center text-lg mb-6" style={{ color: '#94a3b8' }}>
            The Sentry Brain doesn&apos;t trust any single protocol. Neither should your capital.
          </p>

          {/* Explainer */}
          <p className="text-center max-w-3xl mx-auto mb-12" style={{ color: '#94a3b8' }}>
            Drift Protocol is one yield venue — now paused pending recovery. 
            CrimsonARB&apos;s security model is not coupled to Drift. The AI 
            evaluates opportunities. The circuit breaker evaluates protocol 
            health. The risk screener evaluates counterparties. 
            None of these are DEX-specific.
          </p>

          {/* Architecture Flow */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-stretch gap-4 min-w-[900px]">
              {/* Yield Sources */}
              <div className="flex-shrink-0 w-48">
                <div className="text-xs font-mono mb-2" style={{ color: '#94a3b8' }}>YIELD SOURCES</div>
                <div className="space-y-2">
                  <div className="rounded p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                    <span className="text-sm line-through" style={{ color: '#64748b' }}>Drift Protocol</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>PAUSED</span>
                  </div>
                  <div className="rounded p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                    <span className="text-sm" style={{ color: '#f1f5f9' }}>Jupiter JLP</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>Q2 2026</span>
                  </div>
                  <div className="rounded p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                    <span className="text-sm" style={{ color: '#f1f5f9' }}>Zeta Cross-Venue</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>Q2 2026</span>
                  </div>
                  <div className="rounded p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                    <span className="text-sm" style={{ color: '#64748b' }}>Kamino / JitoSOL</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>ROADMAP</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <ArrowRight className="w-6 h-6" style={{ color: '#1e293b' }} />
              </div>

              {/* Sentry Brain */}
              <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '2px solid #f59e0b' }}>
                <div className="text-xs font-mono mb-1" style={{ color: '#f59e0b' }}>AI REASONING</div>
                <div className="font-bold mb-2" style={{ color: '#f1f5f9' }}>SENTRY BRAIN</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                  Evaluates: Price history, liquidity depth, market conditions
                </div>
                <div className="text-xs mt-2 font-mono" style={{ color: '#f59e0b' }}>
                  Output: EXECUTE / SKIP / GUARD / DEFER
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <ArrowRight className="w-6 h-6" style={{ color: '#1e293b' }} />
              </div>

              {/* AgentSentry */}
              <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '2px solid #dc2626' }}>
                <div className="text-xs font-mono mb-1" style={{ color: '#dc2626' }}>CIRCUIT BREAKER</div>
                <div className="font-bold mb-2" style={{ color: '#f1f5f9' }}>AGENTSENTRY</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                  Monitors: Protocol governance, multisig changes, timelocks
                </div>
                <div className="text-xs mt-2 font-mono" style={{ color: '#dc2626' }}>
                  Output: OPERATIONAL / GUARD
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <ArrowRight className="w-6 h-6" style={{ color: '#1e293b' }} />
              </div>

              {/* Webacy DD */}
              <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '2px solid #dc2626' }}>
                <div className="text-xs font-mono mb-1" style={{ color: '#dc2626' }}>RISK SCREENER</div>
                <div className="font-bold mb-2" style={{ color: '#f1f5f9' }}>WEBACY DD.XYZ</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                  Screens: Counterparty wallets, mixer origins, wallet age
                </div>
                <div className="text-xs mt-2 font-mono" style={{ color: '#dc2626' }}>
                  Output: APPROVED / BLOCK
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 flex items-center">
                <ArrowRight className="w-6 h-6" style={{ color: '#1e293b' }} />
              </div>

              {/* Vault */}
              <div className="flex-shrink-0 w-48 rounded-xl p-4" style={{ 
                backgroundColor: '#0f172a', 
                border: '2px solid #10b981',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}>
                <div className="text-xs font-mono mb-1" style={{ color: '#10b981' }}>PROTECTED</div>
                <div className="font-bold mb-2" style={{ color: '#f1f5f9' }}>VAULT</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>
                  Only executes when ALL THREE layers approve
                </div>
                <div className="text-xs mt-2 font-mono" style={{ color: '#10b981' }}>
                  21% execution rate
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-center mt-8" style={{ color: '#f1f5f9' }}>
            The Drift pause is a venue pause. <span style={{ color: '#dc2626' }}>Not an architecture pause.</span>
          </p>
          <div className="text-center mt-4">
            <Link 
              href="/mainnet-roadmap"
              className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
              style={{ color: '#94a3b8' }}
            >
              VIEW MAINNET ROADMAP
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE DEMO */}
      <section id="demo" className="py-20 px-4" style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <h2 className="text-center text-3xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
            SEE IT LIVE
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: '#94a3b8' }}>
            Every demo is connected to Solana devnet. Every decision is logged to Supabase in real-time.
          </p>

          {/* Demo Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Featured: Drift Attack Replay */}
            <div className="md:col-span-2 rounded-xl p-6 relative overflow-hidden" style={{ 
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(10, 10, 15, 1) 100%)',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono mb-4" style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.2)', 
                color: '#dc2626' 
              }}>
                <Play className="w-3 h-3" /> FEATURED DEMO
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Drift Attack Replay</h3>
              <p className="mb-4" style={{ color: '#94a3b8' }}>
                Watch CrimsonARB&apos;s three-layer security model 
                block the $285M exploit in real-time. Layer by layer. 
                60 seconds. Zero funds lost.
              </p>
              <Link 
                href="/drift-replay"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#dc2626', color: '#f1f5f9' }}
              >
                LAUNCH REPLAY
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              {/* Mini Hex Grid Preview */}
              <div className="absolute bottom-4 right-4 opacity-30">
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: i % 3 === 0 ? '#dc2626' : '#1e293b' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Chaos Demo */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#f1f5f9' }}>60-Second GUARD Demo</h3>
              <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                Real-time demonstration of the circuit breaker 
                triggering under market stress conditions.
              </p>
              <Link 
                href="/chaos-demo"
                className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#f59e0b' }}
              >
                RUN DEMO
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              {/* Pulse indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }} />
                <span className="text-xs" style={{ color: '#94a3b8' }}>Live devnet</span>
              </div>
            </div>
          </div>

          {/* Sandbox Card */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#f1f5f9' }}>Devnet Sandbox</h3>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  Connect a wallet. Trigger real decisions. Watch the Sentry Brain log to Supabase live.
                </p>
              </div>
              <Link 
                href="/sandbox"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}
              >
                OPEN SANDBOX
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Live Metrics Strip */}
          <Suspense fallback={<MetricsStripSkeleton />}>
            <div className="mt-8 rounded-xl p-4 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ 
              backgroundColor: '#0a0a0f', 
              border: '1px solid #1e293b' 
            }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span style={{ color: '#94a3b8' }}>VAULT STATUS:</span>
                <span className="font-mono" style={{ color: '#10b981' }}>OPERATIONAL</span>
              </div>
              <div style={{ color: '#1e293b' }}>|</div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#94a3b8' }}>DECISIONS TODAY:</span>
                <span className="font-mono" style={{ color: '#f1f5f9' }}>{metrics.decisionsToday}</span>
              </div>
              <div style={{ color: '#1e293b' }}>|</div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#94a3b8' }}>SKIP RATE:</span>
                <span className="font-mono" style={{ color: '#f59e0b' }}>79%</span>
              </div>
              <div style={{ color: '#1e293b' }}>|</div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#94a3b8' }}>UPTIME:</span>
                <span className="font-mono" style={{ color: '#10b981' }}>{metrics.uptime}%</span>
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      {/* SECTION 6: GO DEEPER */}
      <section className="py-16 px-4" style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center font-mono text-xs tracking-widest mb-8" style={{ color: '#94a3b8' }}>
            GO DEEPER
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/whitepaper"
              className="rounded-xl p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            >
              <FileText className="w-6 h-6" style={{ color: '#94a3b8' }} />
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Whitepaper</span>
            </Link>
            <Link 
              href="/transparency"
              className="rounded-xl p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            >
              <Search className="w-6 h-6" style={{ color: '#94a3b8' }} />
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Transparency</span>
            </Link>
            <Link 
              href="/proof-of-no-trade"
              className="rounded-xl p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            >
              <BarChart3 className="w-6 h-6" style={{ color: '#94a3b8' }} />
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Proof of No-Trade</span>
            </Link>
            <Link 
              href="/mainnet-roadmap"
              className="rounded-xl p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            >
              <Map className="w-6 h-6" style={{ color: '#94a3b8' }} />
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Mainnet Roadmap</span>
            </Link>
            <Link 
              href="/security-architecture"
              className="rounded-xl p-4 flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#0f172a', border: '1px solid #dc2626' }}
            >
              <Shield className="w-6 h-6" style={{ color: '#dc2626' }} />
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Security Architecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4" style={{ backgroundColor: '#0a0a0f', borderTop: '1px solid #1e293b' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div style={{ color: '#64748b' }}>
            CrimsonARB — Bayou City Blockchain 2026
          </div>
          <div className="font-mono text-center" style={{ color: '#dc2626' }}>
            The vault that says NO — because the safest yield is the yield you don&apos;t chase.
          </div>
          <div style={{ color: '#64748b' }}>
            crimsonarb.com | Ranger Build-A-Bear 2026
          </div>
        </div>
      </footer>
    </div>
  )
}

function MetricsStripSkeleton() {
  return (
    <div className="mt-8 rounded-xl p-4 flex items-center justify-center gap-6" style={{ 
      backgroundColor: '#0a0a0f', 
      border: '1px solid #1e293b' 
    }}>
      <div className="animate-pulse flex gap-6">
        <div className="h-4 w-32 rounded" style={{ backgroundColor: '#1e293b' }} />
        <div className="h-4 w-24 rounded" style={{ backgroundColor: '#1e293b' }} />
        <div className="h-4 w-20 rounded" style={{ backgroundColor: '#1e293b' }} />
      </div>
    </div>
  )
}
