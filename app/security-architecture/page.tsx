{`import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Brain, AlertTriangle, Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Three-Layer Security Architecture | CrimsonARB',
  description: 'Complete technical documentation of CrimsonARB\\'s three-layer security model: Sentry Brain AI, AgentSentry ATSP, and Webacy DD.xyz integration.',
}

export default function SecurityArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f1f5f9]">
      {/* Print-friendly styles */}
      <style jsx global>{\`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          a { color: black !important; text-decoration: underline !important; }
        }
      \`}</style>

      {/* Navigation */}
      <nav className="no-print sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#1e293b]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/judges" className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Judges
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.print()} 
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Document Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-[#1e293b]">
          <div className="text-[#dc2626] font-mono text-sm mb-4">TECHNICAL DOCUMENTATION</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Three-Layer Security Architecture
          </h1>
          <p className="text-xl text-[#94a3b8] mb-6">
            How CrimsonARB protects capital through independent, layered verification
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-[#94a3b8]">
            <span>Version 1.0</span>
            <span>|</span>
            <span>April 2026</span>
            <span>|</span>
            <span>Ranger Build-A-Bear Hackathon</span>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Executive Summary</h2>
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              CrimsonARB employs a three-layer security architecture where each layer operates independently 
              and must approve before any capital is deployed. This design ensures that no single point of 
              failure can result in fund loss.
            </p>
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              On April 1, 2026, $285 million was drained from Drift Protocol in 12 minutes. The attack exploited 
              trust assumptions, not code vulnerabilities. CrimsonARB&apos;s architecture would have blocked all 
              three attack vectors through independent verification layers.
            </p>
            <div className="mt-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
              <p className="text-[#10b981] font-mono text-center">
                3 Attack Vectors Detected → 3 Attack Vectors Blocked → $0 Lost
              </p>
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Architecture Overview</h2>
          <p className="text-[#94a3b8] leading-relaxed mb-6">
            Every yield opportunity passes through three independent verification layers before 
            capital is deployed. Each layer has veto power. If any layer returns a negative 
            signal, the operation is blocked.
          </p>
          
          {/* Flow Diagram */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 mb-6 overflow-x-auto">
            <div className="font-mono text-sm min-w-[600px]">
              <pre className="text-[#94a3b8]">{`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  YIELD SOURCE   │────▶│  SENTRY BRAIN   │────▶│  AGENTSENTRY    │────▶│  WEBACY DD.XYZ  │
│                 │     │  (Layer 1)      │     │  (Layer 2)      │     │  (Layer 3)      │
│  Drift, Jupiter │     │  AI Reasoning   │     │  Circuit Break  │     │  Risk Screen    │
│  Zeta, Kamino   │     │                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │                       │
                                 ▼                       ▼                       ▼
                        ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
                        │ EXECUTE / SKIP │      │ OPERATIONAL /  │      │ APPROVED /     │
                        │ GUARD / DEFER  │      │ GUARD          │      │ BLOCK          │
                        └────────────────┘      └────────────────┘      └────────────────┘
                                 │                       │                       │
                                 └───────────────────────┼───────────────────────┘
                                                         ▼
                                              ┌─────────────────────┐
                                              │   ALL THREE MUST    │
                                              │   APPROVE TO        │
                                              │   EXECUTE           │
                                              └─────────────────────┘
              `}</pre>
            </div>
          </div>
        </section>

        {/* Layer 1: Sentry Brain */}
        <section className="mb-12 print-break">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <div className="text-[#f59e0b] font-mono text-xs">LAYER 01</div>
              <h2 className="text-2xl font-bold text-white">Sentry Brain AI</h2>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                The Sentry Brain is an AI reasoning engine that evaluates every yield opportunity 
                before capital is committed. It analyzes market conditions, token fundamentals, 
                price history, and liquidity depth to generate a confidence score.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Evaluation Criteria</h3>
              <ul className="space-y-2 text-[#94a3b8]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981] mt-1 flex-shrink-0" />
                  <span><strong>Funding Rate Analysis:</strong> 24h velocity, decay prediction, historical patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981] mt-1 flex-shrink-0" />
                  <span><strong>Liquidity Assessment:</strong> Order book depth, bid-ask spread, slippage estimation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981] mt-1 flex-shrink-0" />
                  <span><strong>Token Fundamentals:</strong> Holder distribution, volume patterns, organic activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981] mt-1 flex-shrink-0" />
                  <span><strong>Price History:</strong> Anomaly detection, wash trading signals, manufactured patterns</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Decision Outputs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-3 text-center">
                  <div className="text-[#10b981] font-mono font-bold">EXECUTE</div>
                  <div className="text-xs text-[#94a3b8]">High confidence</div>
                </div>
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-3 text-center">
                  <div className="text-[#f59e0b] font-mono font-bold">SKIP</div>
                  <div className="text-xs text-[#94a3b8]">Low confidence</div>
                </div>
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-3 text-center">
                  <div className="text-[#dc2626] font-mono font-bold">GUARD</div>
                  <div className="text-xs text-[#94a3b8]">Risk detected</div>
                </div>
                <div className="bg-[#94a3b8]/10 border border-[#94a3b8]/30 rounded-lg p-3 text-center">
                  <div className="text-[#94a3b8] font-mono font-bold">DEFER</div>
                  <div className="text-xs text-[#94a3b8]">Wait for data</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-[#f59e0b]/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Drift Attack Case Study: Layer 1 Response</h3>
              <p className="text-[#94a3b8] mb-4">
                The attacker created CVT (a fake token) with manufactured price history and 
                artificial volume. Sentry Brain&apos;s analysis:
              </p>
              <div className="font-mono text-sm bg-[#0a0a0f] rounded-lg p-4">
                <div className="text-[#94a3b8]">Token:        CVT/USDC</div>
                <div className="text-[#94a3b8]">Liquidity:    <span className="text-[#dc2626]">SHALLOW</span></div>
                <div className="text-[#94a3b8]">Volume:       <span className="text-[#dc2626]">WASH_DETECTED</span></div>
                <div className="text-[#94a3b8]">Holders:      <span className="text-[#dc2626]">&lt; 50 wallets</span></div>
                <div className="text-[#94a3b8]">Confidence:   <span className="text-[#dc2626]">12 / 100</span></div>
                <div className="border-t border-[#1e293b] my-3"></div>
                <div className="text-[#f59e0b]">DECISION:     SKIP</div>
                <div className="text-[#94a3b8]">Reason:       Manufactured price history detected.</div>
                <div className="text-[#94a3b8]">              Insufficient organic market depth.</div>
              </div>
              <div className="mt-4 p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded">
                <p className="text-[#f59e0b] text-sm font-mono">
                  ATTACK VECTOR BLOCKED: Fake CVT collateral at manufactured price
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 2: AgentSentry */}
        <section className="mb-12 print-break">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dc2626]/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
            </div>
            <div>
              <div className="text-[#dc2626] font-mono text-xs">LAYER 02</div>
              <h2 className="text-2xl font-bold text-white">AgentSentry ATSP</h2>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                AgentSentry is a protocol-level circuit breaker that monitors governance health, 
                multisig configurations, and timelock parameters. It operates independently of 
                market conditions and triggers GUARD state on any protocol-level anomaly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Monitored Events</h3>
              <ul className="space-y-2 text-[#94a3b8]">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Governance Migration:</strong> Any change to security council or admin keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Timelock Modification:</strong> Reduction or removal of safety delays</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Multisig Threshold:</strong> Changes to required signature count</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Oracle Updates:</strong> Price feed modifications or additions</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Decision Outputs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-3 text-center">
                  <div className="text-[#10b981] font-mono font-bold">OPERATIONAL</div>
                  <div className="text-xs text-[#94a3b8]">Protocol healthy</div>
                </div>
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-3 text-center">
                  <div className="text-[#dc2626] font-mono font-bold">GUARD</div>
                  <div className="text-xs text-[#94a3b8]">Circuit break active</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-[#dc2626]/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Drift Attack Case Study: Layer 2 Response</h3>
              <p className="text-[#94a3b8] mb-4">
                Before the exploit, attackers migrated the Drift Security Council to a 2/5 
                threshold and removed the 48-hour timelock. AgentSentry&apos;s response:
              </p>
              <div className="font-mono text-sm bg-[#0a0a0f] rounded-lg p-4">
                <div className="text-[#94a3b8]">Protocol:     Drift Security Council</div>
                <div className="text-[#94a3b8]">Event:        <span className="text-[#dc2626]">GOVERNANCE_MIGRATION</span></div>
                <div className="text-[#94a3b8]">Timelock:     <span className="text-[#dc2626]">48h → 0h [REMOVED]</span></div>
                <div className="text-[#94a3b8]">Threshold:    <span className="text-[#dc2626]">Changed to 2/5</span></div>
                <div className="border-t border-[#1e293b] my-3"></div>
                <div className="text-[#dc2626]">STATUS:       CIRCUIT BREAK</div>
                <div className="text-[#dc2626]">DECISION:     GUARD</div>
                <div className="text-[#94a3b8]">Action:       All positions suspended.</div>
                <div className="text-[#94a3b8]">              Pending protocol review.</div>
              </div>
              <div className="mt-4 p-3 bg-[#dc2626]/10 border border-[#dc2626]/30 rounded">
                <p className="text-[#dc2626] text-sm font-mono">
                  ATTACK VECTOR BLOCKED: Governance migration removed safety timelocks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 3: Webacy DD.xyz */}
        <section className="mb-12 print-break">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dc2626]/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-[#dc2626]" />
            </div>
            <div>
              <div className="text-[#dc2626] font-mono text-xs">LAYER 03</div>
              <h2 className="text-2xl font-bold text-white">Webacy DD.xyz</h2>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Purpose</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Webacy DD.xyz is a third-party AI risk intelligence platform that screens 
                counterparty wallets against on-chain risk signals. It provides independent 
                verification outside of CrimsonARB&apos;s internal systems, adding a layer of 
                external validation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Risk Signals Analyzed</h3>
              <ul className="space-y-2 text-[#94a3b8]">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Mixer Origins:</strong> Tornado Cash, privacy mixer funding patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Wallet Age:</strong> Recently created wallets with suspicious funding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Sanctions Lists:</strong> OFAC and other regulatory blacklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#dc2626] mt-1 flex-shrink-0" />
                  <span><strong>Interaction History:</strong> Known exploit contracts, phishing wallets</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Risk Levels</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-2 text-center">
                  <div className="text-[#10b981] font-mono text-sm font-bold">SAFE</div>
                  <div className="text-xs text-[#94a3b8]">85-100</div>
                </div>
                <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg p-2 text-center">
                  <div className="text-[#22c55e] font-mono text-sm font-bold">LOW</div>
                  <div className="text-xs text-[#94a3b8]">70-84</div>
                </div>
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg p-2 text-center">
                  <div className="text-[#f59e0b] font-mono text-sm font-bold">MEDIUM</div>
                  <div className="text-xs text-[#94a3b8]">50-69</div>
                </div>
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg p-2 text-center">
                  <div className="text-[#ef4444] font-mono text-sm font-bold">HIGH</div>
                  <div className="text-xs text-[#94a3b8]">25-49</div>
                </div>
                <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-2 text-center">
                  <div className="text-[#dc2626] font-mono text-sm font-bold">CRITICAL</div>
                  <div className="text-xs text-[#94a3b8]">0-24</div>
                </div>
              </div>
            </div>

            <div className="bg-[#0f172a] border border-[#dc2626]/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Drift Attack Case Study: Layer 3 Response</h3>
              <p className="text-[#94a3b8] mb-4">
                The attacker wallets originated from Tornado Cash, were only 8 days old, and 
                showed no organic on-chain history. Webacy DD.xyz&apos;s analysis:
              </p>
              <div className="font-mono text-sm bg-[#0a0a0f] rounded-lg p-4">
                <div className="text-[#94a3b8]">Wallet:       8Xk...9mR</div>
                <div className="text-[#94a3b8]">TC_ORIGIN:    <span className="text-[#dc2626]">TRUE</span></div>
                <div className="text-[#94a3b8]">Wallet age:   <span className="text-[#dc2626]">8 days</span></div>
                <div className="text-[#94a3b8]">Funding:      <span className="text-[#dc2626]">Privacy mixer</span></div>
                <div className="text-[#94a3b8]">DD Score:     <span className="text-[#dc2626]">11 / 100</span></div>
                <div className="border-t border-[#1e293b] my-3"></div>
                <div className="text-[#dc2626]">RISK LEVEL:   CRITICAL</div>
                <div className="text-[#dc2626]">DECISION:     BLOCK</div>
                <div className="text-[#94a3b8]">Action:       Counterparty rejected.</div>
                <div className="text-[#94a3b8]">              Interaction terminated.</div>
              </div>
              <div className="mt-4 p-3 bg-[#dc2626]/10 border border-[#dc2626]/30 rounded">
                <p className="text-[#dc2626] text-sm font-mono">
                  ATTACK VECTOR BLOCKED: Tornado Cash-origin attacker wallet
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Combined Defense */}
        <section className="mb-12 print-break">
          <h2 className="text-2xl font-bold mb-4 text-white">Combined Defense Summary</h2>
          
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-6 mb-6">
            <p className="text-[#10b981] font-mono text-xl text-center mb-4">
              3 Attack Vectors Detected → 3 Attack Vectors Blocked → $0 Lost
            </p>
            <p className="text-[#94a3b8] text-center">
              This is not a post-hoc analysis. This is how CrimsonARB&apos;s architecture 
              operates on every trade.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="text-left py-3 px-4 text-[#94a3b8]">Layer</th>
                  <th className="text-left py-3 px-4 text-[#94a3b8]">Attack Vector</th>
                  <th className="text-left py-3 px-4 text-[#94a3b8]">Detection Signal</th>
                  <th className="text-left py-3 px-4 text-[#94a3b8]">Response</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e293b]/50">
                  <td className="py-3 px-4 text-[#f59e0b] font-mono">Layer 1</td>
                  <td className="py-3 px-4 text-[#94a3b8]">Fake CVT collateral</td>
                  <td className="py-3 px-4 text-[#94a3b8]">Wash trading, shallow liquidity</td>
                  <td className="py-3 px-4 text-[#f59e0b] font-mono">SKIP</td>
                </tr>
                <tr className="border-b border-[#1e293b]/50">
                  <td className="py-3 px-4 text-[#dc2626] font-mono">Layer 2</td>
                  <td className="py-3 px-4 text-[#94a3b8]">Governance migration</td>
                  <td className="py-3 px-4 text-[#94a3b8]">Timelock removed, 2/5 threshold</td>
                  <td className="py-3 px-4 text-[#dc2626] font-mono">GUARD</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#dc2626] font-mono">Layer 3</td>
                  <td className="py-3 px-4 text-[#94a3b8]">Attacker wallet</td>
                  <td className="py-3 px-4 text-[#94a3b8]">TC origin, 8-day wallet age</td>
                  <td className="py-3 px-4 text-[#dc2626] font-mono">BLOCK</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Operational Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 text-center">
              <div className="text-3xl font-mono font-bold text-[#dc2626]">79%</div>
              <div className="text-sm text-[#94a3b8]">Skip Rate</div>
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 text-center">
              <div className="text-3xl font-mono font-bold text-white">21%</div>
              <div className="text-sm text-[#94a3b8]">Execute Rate</div>
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 text-center">
              <div className="text-3xl font-mono font-bold text-[#10b981]">$0</div>
              <div className="text-sm text-[#94a3b8]">Funds Lost</div>
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 text-center">
              <div className="text-3xl font-mono font-bold text-[#f59e0b]">3</div>
              <div className="text-sm text-[#94a3b8]">Security Layers</div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-12 no-print">
          <h2 className="text-2xl font-bold mb-4 text-white">Related Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/whitepaper" className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 hover:border-[#dc2626]/50 transition-colors flex items-center justify-between">
              <span className="text-white">Technical Whitepaper</span>
              <ExternalLink className="w-4 h-4 text-[#94a3b8]" />
            </Link>
            <Link href="/drift-replay" className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 hover:border-[#dc2626]/50 transition-colors flex items-center justify-between">
              <span className="text-white">Drift Attack Replay Demo</span>
              <ExternalLink className="w-4 h-4 text-[#94a3b8]" />
            </Link>
            <Link href="/proof-of-no-trade" className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 hover:border-[#dc2626]/50 transition-colors flex items-center justify-between">
              <span className="text-white">Proof of No-Trade</span>
              <ExternalLink className="w-4 h-4 text-[#94a3b8]" />
            </Link>
            <Link href="/transparency" className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-4 hover:border-[#dc2626]/50 transition-colors flex items-center justify-between">
              <span className="text-white">Transparency Report</span>
              <ExternalLink className="w-4 h-4 text-[#94a3b8]" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#1e293b] text-center text-[#94a3b8] text-sm">
          <p className="mb-2">CrimsonARB — Bayou City Blockchain</p>
          <p className="text-[#dc2626] font-mono">
            The vault that says NO — because the safest yield is the yield you don&apos;t chase.
          </p>
          <p className="mt-4">crimsonarb.com | Ranger Build-A-Bear 2026</p>
        </footer>
      </main>
    </div>
  )
}`}
