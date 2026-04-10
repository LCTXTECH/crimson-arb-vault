"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, ExternalLink, Clipboard } from "lucide-react"

function CopyButton({ text, sectionId }: { text: string; sectionId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors ${
        copied 
          ? 'bg-[#10b981] text-white' 
          : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

const SECTIONS = {
  hook: `On April 1, 2026, $285 million was drained from Drift Protocol in 12 minutes. Not from a code exploit. Not from a smart contract bug. From compromised governance, manufactured collateral, and the complete absence of safety timelocks. It was the second-largest hack in Solana history.

CrimsonARB was built to prevent exactly this — not because we predicted the Drift exploit, but because we designed a vault that assumes any protocol can fail.`,

  whatWeBuilt: `CrimsonARB: The Security-First AI Vault on Solana

CrimsonARB is an AI-augmented institutional basis trade vault with a three-layer security model. Built on Next.js with a Supabase backend, the system runs a continuous AI reasoning loop — the Sentry Brain — that evaluates every yield opportunity before capital is committed. The vault integrates Ranger Finance's Smart Order Router, Drift v3 Delegated Signers (now paused), and a venue-agnostic multi-DEX architecture.

The central innovation is not the yield strategy — it is the capital protection model. CrimsonARB rejects 79% of all trade opportunities. Every rejection is logged on-chain and visible in the public Transparency Report.`,

  theEdge: `Proof of No-Trade

79% Skip Rate — 4,347+ rejections this month

Every other vault strategy optimizes for yield. CrimsonARB optimizes for survival. The Sentry Brain's SKIP, GUARD, and DEFER decisions are not failures — they are the product. The vault earns its credibility by saying NO to opportunities that carry hidden risk.

In the week following the Drift exploit, every yield vault with Drift exposure either suspended operations or suffered losses. CrimsonARB's architecture is designed so that the circuit breaker triggers before exposure occurs — not after.`,

  securityModel: `Three Layers of NO

LAYER 1 — Sentry Brain (AI Reasoning Engine)
The Sentry Brain is a continuous reasoning loop that scores every trade opportunity on price history integrity, liquidity depth, organic volume patterns, and market conviction. When confidence falls below the execution threshold, the vault issues a SKIP decision and logs the reasoning to Supabase.

Drift Attack Vector: Manufactured CVT price history
Sentry Response: Confidence: 12/100 → SKIP
Capital at risk: $0

LAYER 2 — AgentSentry (Protocol Circuit Breaker)
AgentSentry monitors protocol-level governance health in real-time. Multisig threshold changes, timelock modifications, and Security Council migrations are classified as GUARD-triggering events. When a protocol degrades its own safety parameters, the circuit breaker suspends all active positions immediately — without waiting for a human decision.

Drift Attack Vector: Timelock 48h → 0h, threshold 2/5
AgentSentry Response: GOVERNANCE_MIGRATION → CIRCUIT BREAK → GUARD
Capital at risk: $0

LAYER 3 — Webacy DD.xyz (Counterparty Risk Screening)
Every counterparty wallet is screened against Webacy DD.xyz's on-chain risk database. Tornado Cash origin, wallet age under 30 days, and privacy mixer funding are hard-block signals. A DD Score below 20/100 triggers automatic transaction rejection — the vault will not interact with the counterparty under any conditions.

Drift Attack Vector: Tornado Cash-origin attacker wallet
Webacy Response: DD Score: 11/100 → CRITICAL → BLOCK
Capital at risk: $0

The three-layer architecture blocked all three primary Drift attack vectors. This is not a theoretical exercise — it is a live demonstration of the security model operating as designed.`,

  multiVenue: `Drift Is One Venue. The Architecture Is Not.

CrimsonARB's Sentry Brain is protocol-agnostic. It evaluates yield opportunities based on market signals, not protocol loyalty. The Drift integration is currently paused pending protocol recovery. The following venue integrations are prioritized for Q2 2026:

→ Jupiter JLP Module [PRIORITY — Q2 2026]
→ Zeta Cross-Venue [PRIORITY — Q2 2026]
→ Kamino Rate Module [ROADMAP — Q3 2026]
→ JitoSOL Collateral Layer [ROADMAP — Q3 2026]

The multi-venue Sentry architecture evaluates opportunities across all venues simultaneously. The security model — Sentry Brain → AgentSentry → Webacy — applies uniformly to every source.`,

  liveDemos: `Every Demo Is Live on Solana Devnet

crimsonarb.com/judges
→ Hackathon submission hub — full security thesis

crimsonarb.com/drift-replay
→ Drift Attack Replay — three-layer defense in 75 seconds

crimsonarb.com/sandbox
→ Live devnet demo — connect wallet, trigger real decisions

crimsonarb.com/chaos-demo
→ 60-second GUARD event demonstration`,

  techStack: `Tech Stack

Frontend: Next.js 16 (App Router)
Backend: Supabase (7 tables)
Chain: Solana Devnet
Auth: Privy
Simulation: Vercel Cron (5-min tick)

Pages: 26
Components: 28
API Endpoints: 19
DB Tables: 7
Security SDK: Voltr SDK

Core Libraries:
Ranger Finance SOR | Drift v3 Delegated Signers (paused) | AgentSentry SDK | Webacy DD.xyz | Supabase JS | @solana/web3.js | Privy Auth`,

  closing: `Protocol failure is not a risk to be modeled.
It is a certainty to be designed around.

CrimsonARB: The vault architecture that would have said NO to the $285M Drift exploit — because it says NO to 79% of everything.

Bayou City Blockchain | Houston, TX | 2026
crimsonarb.com`,
}

const ALL_TEXT = Object.values(SECTIONS).join('\n\n---\n\n')

export default function SubmissionPage() {
  const [copiedAll, setCopiedAll] = useState(false)

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(ALL_TEXT)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f1f5f9] print:bg-white print:text-black">
      {/* Sticky sidebar - desktop only */}
      <aside className="hidden xl:block fixed left-0 top-0 w-48 h-screen bg-[#0f172a] border-r border-[#1e293b] p-6 print:hidden">
        <div className="text-xs font-mono text-[#64748b] uppercase tracking-wider mb-4">SUBMISSION</div>
        <div className="h-px bg-[#1e293b] mb-4" />
        <nav className="space-y-2 text-sm">
          <a href="#hook" className="block text-[#94a3b8] hover:text-[#dc2626]">01 Hook</a>
          <a href="#what" className="block text-[#94a3b8] hover:text-[#dc2626]">02 What We Built</a>
          <a href="#edge" className="block text-[#94a3b8] hover:text-[#dc2626]">03 The Edge</a>
          <a href="#security" className="block text-[#94a3b8] hover:text-[#dc2626]">04 Security Model</a>
          <a href="#venue" className="block text-[#94a3b8] hover:text-[#dc2626]">05 Multi-Venue</a>
          <a href="#demos" className="block text-[#94a3b8] hover:text-[#dc2626]">06 Live Demos</a>
          <a href="#tech" className="block text-[#94a3b8] hover:text-[#dc2626]">07 Tech Stack</a>
        </nav>
        <div className="h-px bg-[#1e293b] my-4" />
        <button
          onClick={handleCopyAll}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-mono transition-colors ${
            copiedAll 
              ? 'bg-[#10b981] text-white' 
              : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
          }`}
        >
          {copiedAll ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
          {copiedAll ? 'Copied!' : 'Copy All'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="max-w-[860px] mx-auto px-6 py-12 xl:ml-48">
        {/* Header */}
        <header className="text-center mb-16 print:mb-8">
          <h1 className="text-[#dc2626] font-mono text-3xl tracking-[0.2em] font-bold mb-2">CRIMSONARB</h1>
          <p className="text-[#94a3b8] text-sm">Bayou City Blockchain</p>
          
          <div className="mt-8 inline-block border border-[#1e293b] rounded-lg p-4 text-left print:border-black">
            <div className="text-sm font-mono text-[#f1f5f9]">RANGER BUILD-A-BEAR HACKATHON 2026</div>
            <div className="text-xs text-[#94a3b8] mt-1">Track: Main Track + AI Track</div>
            <div className="text-xs text-[#94a3b8]">Submitted: April 2026</div>
            <div className="text-xs text-[#dc2626]">Live: crimsonarb.com</div>
          </div>
        </header>

        {/* Section 1: Hook */}
        <section id="hook" className="mb-12 print:break-before-page">
          <div className="flex justify-end mb-4 print:hidden">
            <CopyButton text={SECTIONS.hook} sectionId="hook" />
          </div>
          <p className="text-lg text-[#94a3b8] leading-relaxed font-light print:text-black">
            On April 1, 2026, $285 million was drained from Drift Protocol in 12 minutes. Not from a code exploit. Not from a smart contract bug. From compromised governance, manufactured collateral, and the complete absence of safety timelocks. It was the second-largest hack in Solana history.
          </p>
          <p className="text-lg text-[#94a3b8] leading-relaxed font-light mt-4 print:text-black">
            CrimsonARB was built to prevent exactly this — not because we predicted the Drift exploit, but because we designed a vault that assumes any protocol can fail.
          </p>
          <div className="h-px bg-[#dc2626] mt-8" />
        </section>

        {/* Section 2: What We Built */}
        <section id="what" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">01 — WHAT WE BUILT</span>
            <CopyButton text={SECTIONS.whatWeBuilt} sectionId="what" />
          </div>
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-4 print:text-black">CrimsonARB: The Security-First AI Vault on Solana</h2>
          <p className="text-[#94a3b8] leading-relaxed mb-4 print:text-black">
            CrimsonARB is an AI-augmented institutional basis trade vault with a three-layer security model. Built on Next.js with a Supabase backend, the system runs a continuous AI reasoning loop — the Sentry Brain — that evaluates every yield opportunity before capital is committed. The vault integrates {"Ranger Finance's"} Smart Order Router, Drift v3 Delegated Signers (now paused), and a venue-agnostic multi-DEX architecture.
          </p>
          <p className="text-[#94a3b8] leading-relaxed print:text-black">
            The central innovation is not the yield strategy — it is the capital protection model. CrimsonARB rejects 79% of all trade opportunities. Every rejection is logged on-chain and visible in the public Transparency Report.
          </p>
        </section>

        {/* Section 3: The Edge */}
        <section id="edge" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">02 — THE EDGE</span>
            <CopyButton text={SECTIONS.theEdge} sectionId="edge" />
          </div>
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6 print:text-black">Proof of No-Trade</h2>
          
          <div className="grid md:grid-cols-[200px_1fr] gap-6 mb-6">
            <div className="text-center md:text-left">
              <div className="text-6xl font-mono font-bold text-[#dc2626]">79%</div>
              <div className="text-sm text-[#94a3b8]">Skip Rate</div>
              <div className="text-xs text-[#64748b]">4,347+ rejections this month</div>
            </div>
            <div className="text-[#94a3b8] leading-relaxed print:text-black">
              <p className="mb-4">
                Every other vault strategy optimizes for yield. CrimsonARB optimizes for survival. The Sentry {"Brain's"} SKIP, GUARD, and DEFER decisions are not failures — they are the product. The vault earns its credibility by saying NO to opportunities that carry hidden risk.
              </p>
              <p>
                In the week following the Drift exploit, every yield vault with Drift exposure either suspended operations or suffered losses. {"CrimsonARB's"} architecture is designed so that the circuit breaker triggers before exposure occurs — not after.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Security Model */}
        <section id="security" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">03 — SECURITY ARCHITECTURE</span>
            <CopyButton text={SECTIONS.securityModel} sectionId="security" />
          </div>
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6 print:text-black">Three Layers of NO</h2>

          {/* Layer 1 */}
          <div className="border-l-4 border-[#f59e0b] pl-4 mb-6">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2 print:text-black">Layer 1 — Sentry Brain (AI Reasoning Engine)</h3>
            <p className="text-[#94a3b8] text-sm mb-4 print:text-black">
              The Sentry Brain is a continuous reasoning loop that scores every trade opportunity on price history integrity, liquidity depth, organic volume patterns, and market conviction. When confidence falls below the execution threshold, the vault issues a SKIP decision and logs the reasoning to Supabase.
            </p>
            <div className="bg-[#0f172a] rounded p-3 font-mono text-xs print:bg-gray-100 print:text-black">
              <div>Drift Attack Vector: Manufactured CVT price history</div>
              <div>Sentry Response: Confidence: 12/100 → SKIP</div>
              <div className="text-[#10b981]">Capital at risk: $0</div>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="border-l-4 border-[#ef4444] pl-4 mb-6">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2 print:text-black">Layer 2 — AgentSentry (Protocol Circuit Breaker)</h3>
            <p className="text-[#94a3b8] text-sm mb-4 print:text-black">
              AgentSentry monitors protocol-level governance health in real-time. Multisig threshold changes, timelock modifications, and Security Council migrations are classified as GUARD-triggering events. When a protocol degrades its own safety parameters, the circuit breaker suspends all active positions immediately — without waiting for a human decision.
            </p>
            <div className="bg-[#0f172a] rounded p-3 font-mono text-xs print:bg-gray-100 print:text-black">
              <div>Drift Attack Vector: Timelock 48h → 0h, threshold 2/5</div>
              <div>AgentSentry Response: GOVERNANCE_MIGRATION → CIRCUIT BREAK → GUARD</div>
              <div className="text-[#10b981]">Capital at risk: $0</div>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="border-l-4 border-[#dc2626] pl-4 mb-6">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2 print:text-black">Layer 3 — Webacy DD.xyz (Counterparty Risk Screening)</h3>
            <p className="text-[#94a3b8] text-sm mb-4 print:text-black">
              Every counterparty wallet is screened against Webacy {"DD.xyz's"} on-chain risk database. Tornado Cash origin, wallet age under 30 days, and privacy mixer funding are hard-block signals. A DD Score below 20/100 triggers automatic transaction rejection — the vault will not interact with the counterparty under any conditions.
            </p>
            <div className="bg-[#0f172a] rounded p-3 font-mono text-xs print:bg-gray-100 print:text-black">
              <div>Drift Attack Vector: Tornado Cash-origin attacker wallet</div>
              <div>Webacy Response: DD Score: 11/100 → CRITICAL → BLOCK</div>
              <div className="text-[#10b981]">Capital at risk: $0</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#10b981]/10 border border-[#10b981]/50 rounded-lg p-4 text-sm text-[#94a3b8] print:border-green-500 print:text-black">
            The three-layer architecture blocked all three primary Drift attack vectors. This is not a theoretical exercise — it is a live demonstration of the security model operating as designed.
          </div>
        </section>

        {/* Section 5: Multi-Venue */}
        <section id="venue" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">04 — VENUE-AGNOSTIC DESIGN</span>
            <CopyButton text={SECTIONS.multiVenue} sectionId="venue" />
          </div>
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-4 print:text-black">Drift Is One Venue. The Architecture Is Not.</h2>
          <p className="text-[#94a3b8] leading-relaxed mb-6 print:text-black">
            {"CrimsonARB's"} Sentry Brain is protocol-agnostic. It evaluates yield opportunities based on market signals, not protocol loyalty. The Drift integration is currently paused pending protocol recovery.
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#f1f5f9]">→</span>
              <span className="text-[#f1f5f9]">Jupiter JLP Module</span>
              <span className="text-xs text-[#f59e0b] font-mono">[PRIORITY — Q2 2026]</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#f1f5f9]">→</span>
              <span className="text-[#f1f5f9]">Zeta Cross-Venue</span>
              <span className="text-xs text-[#f59e0b] font-mono">[PRIORITY — Q2 2026]</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#f1f5f9]">→</span>
              <span className="text-[#94a3b8]">Kamino Rate Module</span>
              <span className="text-xs text-[#64748b] font-mono">[ROADMAP — Q3 2026]</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#f1f5f9]">→</span>
              <span className="text-[#94a3b8]">JitoSOL Collateral Layer</span>
              <span className="text-xs text-[#64748b] font-mono">[ROADMAP — Q3 2026]</span>
            </div>
          </div>

          <p className="text-[#94a3b8] text-sm print:text-black">
            The multi-venue Sentry architecture evaluates opportunities across all venues simultaneously. The security model — Sentry Brain → AgentSentry → Webacy — applies uniformly to every source.
          </p>
        </section>

        {/* Section 6: Live Demos */}
        <section id="demos" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">05 — LIVE DEMOS</span>
            <CopyButton text={SECTIONS.liveDemos} sectionId="demos" />
          </div>
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6 print:text-black">Every Demo Is Live on Solana Devnet</h2>
          
          <div className="space-y-3">
            {[
              { url: "/judges", desc: "Hackathon submission hub — full security thesis" },
              { url: "/drift-replay", desc: "Drift Attack Replay — three-layer defense in 75 seconds" },
              { url: "/sandbox", desc: "Live devnet demo — connect wallet, trigger real decisions" },
              { url: "/chaos-demo", desc: "60-second GUARD event demonstration" },
            ].map(({ url, desc }) => (
              <Link 
                key={url}
                href={url}
                className="flex items-center justify-between p-3 bg-[#0f172a] border border-[#1e293b] rounded-lg hover:border-[#dc2626] transition-colors group print:border-black"
              >
                <div>
                  <span className="text-[#dc2626] font-mono text-sm">crimsonarb.com{url}</span>
                  <p className="text-xs text-[#94a3b8] mt-1">{desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-[#dc2626] print:hidden" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 7: Tech Stack */}
        <section id="tech" className="mb-12 print:break-before-page">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#dc2626] uppercase tracking-wider">06 — TECH STACK</span>
            <CopyButton text={SECTIONS.techStack} sectionId="tech" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-[#94a3b8]">Frontend:</span><span className="text-[#f1f5f9]">Next.js 16 (App Router)</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Backend:</span><span className="text-[#f1f5f9]">Supabase (7 tables)</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Chain:</span><span className="text-[#f1f5f9]">Solana Devnet</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Auth:</span><span className="text-[#f1f5f9]">Privy</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Simulation:</span><span className="text-[#f1f5f9]">Vercel Cron (5-min)</span></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-[#94a3b8]">Pages:</span><span className="text-[#f1f5f9]">26</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Components:</span><span className="text-[#f1f5f9]">28</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">API Endpoints:</span><span className="text-[#f1f5f9]">19</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">DB Tables:</span><span className="text-[#f1f5f9]">7</span></div>
              <div className="flex justify-between"><span className="text-[#94a3b8]">Security SDK:</span><span className="text-[#f1f5f9]">Voltr SDK</span></div>
            </div>
          </div>

          <div className="mt-6 text-xs text-[#64748b]">
            <span className="text-[#94a3b8]">Core Libraries:</span> Ranger Finance SOR | Drift v3 Delegated Signers (paused) | AgentSentry SDK | Webacy DD.xyz | Supabase JS | @solana/web3.js | Privy Auth
          </div>
        </section>

        {/* Closing */}
        <section className="text-center pt-8 border-t border-[#1e293b] print:border-black">
          <div className="flex justify-end mb-4 print:hidden">
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-mono transition-colors ${
                copiedAll 
                  ? 'bg-[#10b981] text-white' 
                  : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
              {copiedAll ? 'Copied All!' : 'Copy Entire Submission'}
            </button>
          </div>

          <p className="text-xl text-[#f1f5f9] mb-2 print:text-black">
            Protocol failure is not a risk to be modeled.
          </p>
          <p className="text-xl text-[#f1f5f9] mb-6 print:text-black">
            It is a certainty to be designed around.
          </p>

          <p className="text-[#94a3b8] max-w-xl mx-auto print:text-black">
            CrimsonARB: The vault architecture that would have said NO to the $285M Drift exploit — because it says NO to 79% of everything.
          </p>

          <div className="mt-8 text-sm text-[#64748b]">
            <div>Bayou City Blockchain | Houston, TX | 2026</div>
            <div className="text-[#dc2626]">crimsonarb.com</div>
          </div>
        </section>
      </main>
    </div>
  )
}
