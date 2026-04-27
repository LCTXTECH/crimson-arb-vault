'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Clock,
  Zap,
  FileCode,
  GitBranch,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Copy,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  bg: '#030a06',
  bgCode: '#020a04',
  accent: '#00ff88',
  accentDim: '#00ff8833',
  amber: '#f59e0b',
  amberDim: '#f59e0b33',
  cyan: '#00d4ff',
  border: '#0f1f14',
  text: '#e2e8f0',
  textDim: '#64748b',
}

// ═══════════════════════════════════════════════════════════════════════════
// CODE BLOCK COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function CodeBlock({ 
  title, 
  code, 
  language = 'typescript' 
}: { 
  title: string
  code: string
  language?: string 
}) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
      <div 
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: colors.bgCode, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4" style={{ color: colors.accent }} />
          <span className="font-mono text-sm" style={{ color: colors.text }}>{title}</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.accentDim, color: colors.accent }}>
            {language}
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"
          style={{ color: colors.textDim }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre 
        className="p-4 overflow-x-auto font-mono text-sm"
        style={{ backgroundColor: colors.bgCode, color: colors.text }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPANDABLE SECTION
// ═══════════════════════════════════════════════════════════════════════════

function ExpandableSection({ 
  title, 
  children,
  defaultOpen = false 
}: { 
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border rounded-lg" style={{ borderColor: colors.border }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <span className="font-mono font-semibold" style={{ color: colors.text }}>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5" style={{ color: colors.accent }} />
        ) : (
          <ChevronRight className="w-5 h-5" style={{ color: colors.textDim }} />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function ATSPProtocolPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ backgroundColor: `${colors.bg}ee`, borderColor: colors.border }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: colors.accent }} />
            <span className="font-mono font-bold" style={{ color: colors.text }}>AgentSentry</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/judges" className="text-sm hover:underline" style={{ color: colors.textDim }}>
              CrimsonARB
            </Link>
            <Link href="/docs" className="text-sm hover:underline" style={{ color: colors.textDim }}>
              Docs
            </Link>
            <a 
              href="https://github.com/agentsentry/atsp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm"
              style={{ color: colors.accent }}
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="py-16 px-4 border-b" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6"
            style={{ backgroundColor: colors.accentDim, color: colors.accent }}
          >
            <Zap className="w-3 h-3" />
            PROTOCOL SPECIFICATION v1.0.1
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Agent-to-Sentry Trust Protocol
          </h1>
          
          <p 
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{ color: colors.textDim }}
          >
            The open standard for hashed intent declarations between autonomous AI agents 
            and security sentries. Proof of reasoning. Audit trails. MiCA-ready.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#spec"
              className="px-6 py-3 rounded-lg font-mono text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{ backgroundColor: colors.accent, color: colors.bg }}
            >
              Read Specification <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              href="/drift-replay"
              className="px-6 py-3 rounded-lg font-mono text-sm flex items-center gap-2 border transition-all hover:bg-white/5"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              Watch Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Atomic Summary */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="p-6 rounded-lg border-l-4"
            style={{ backgroundColor: colors.bgCode, borderColor: colors.accent }}
          >
            <h2 className="font-mono font-bold text-lg mb-3" style={{ color: colors.accent }}>
              ATOMIC SUMMARY
            </h2>
            <p style={{ color: colors.text }}>
              <strong>ATSP (Agent-to-Sentry Trust Protocol)</strong> is an open standard that enables 
              autonomous AI agents to declare their trading intentions in a cryptographically verifiable 
              format. Each intent declaration includes a <code className="px-1 rounded" style={{ backgroundColor: colors.accentDim }}>
              causalReasoningChain</code> that proves <em>why</em> the agent made its decision, 
              enabling post-hoc auditing and regulatory compliance (MiCA Article 14).
            </p>
          </div>
        </div>
      </section>

      {/* Semantic Triad */}
      <section className="py-12 px-4 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-mono font-bold text-xl mb-8 text-center" style={{ color: colors.text }}>
            THE SEMANTIC TRIAD
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* NHI */}
            <div className="p-6 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: colors.accentDim }}>
                <Cpu className="w-6 h-6" style={{ color: colors.accent }} />
              </div>
              <h3 className="font-mono font-bold mb-2" style={{ color: colors.text }}>
                NHI Identity
              </h3>
              <p className="text-sm" style={{ color: colors.textDim }}>
                Non-Human Identity. Every autonomous agent has a unique <code>agentId</code> that 
                persists across sessions and is tied to its on-chain permissions.
              </p>
            </div>
            
            {/* ATSP */}
            <div className="p-6 rounded-lg border" style={{ borderColor: colors.accent }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: colors.accentDim }}>
                <Shield className="w-6 h-6" style={{ color: colors.accent }} />
              </div>
              <h3 className="font-mono font-bold mb-2" style={{ color: colors.text }}>
                ATSP Protocol
              </h3>
              <p className="text-sm" style={{ color: colors.textDim }}>
                The wire format and validation rules for intent declarations. Includes 
                <code>ipiVerificationHash</code> for proof-of-context scanning.
              </p>
            </div>
            
            {/* Squads V4 */}
            <div className="p-6 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: colors.accentDim }}>
                <Lock className="w-6 h-6" style={{ color: colors.accent }} />
              </div>
              <h3 className="font-mono font-bold mb-2" style={{ color: colors.text }}>
                Squads V4
              </h3>
              <p className="text-sm" style={{ color: colors.textDim }}>
                Multi-signature vault integration. ATSP intents can reference a 
                <code>squadsVaultPda</code> for institutional-grade execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specification Blocks */}
      <section id="spec" className="py-12 px-4 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-mono font-bold text-xl mb-8" style={{ color: colors.text }}>
            SPECIFICATION BLOCKS
          </h2>
          
          <div className="space-y-6">
            {/* Intent Declaration */}
            <ExpandableSection title="ATSPIntentDeclaration" defaultOpen>
              <p className="mb-4 text-sm" style={{ color: colors.textDim }}>
                The agent&apos;s commitment. Declares what action it intends to take, with full 
                causal reasoning for audit trails.
              </p>
              <CodeBlock 
                title="ATSPIntentDeclaration"
                code={`interface ATSPIntentDeclaration {
  version: '1.0'
  agentId: string              // NHI identifier
  amount: string               // Lamport precision (BigInt-safe)
  ipiVerificationHash: string  // 64-char proof of context scan
  action: ATSPAction           // 7-variant discriminated union
  decisionTrace: {
    causalReasoningChain: string  // "Because X, concluded Y"
    confidence: number            // 0.0 - 1.0
    micaCompliant: boolean
  }
  timestamp: number
  ttl: number                  // Default: 60000ms
  squadsVaultPda?: string      // Optional Squads V4 reference
}`}
              />
            </ExpandableSection>

            {/* Verdict Response */}
            <ExpandableSection title="ATSPVerdictResponse">
              <p className="mb-4 text-sm" style={{ color: colors.textDim }}>
                The sentry&apos;s decision. Includes X-ATSP-Latency header for performance monitoring.
              </p>
              <CodeBlock 
                title="ATSPVerdictResponse"
                code={`interface ATSPVerdictResponse {
  intentHash: string           // SHA-256 of intent
  verdict: 'APPROVED' | 'DENIED' | 'DEFERRED' | 'GUARD'
  reason: string
  latencyMs: number            // Target: <100ms
  sentryLogId?: string         // UUID for audit trail
  webacyDdScore?: number       // 0-100 risk score
  circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  timestamp: number
  policyViolations?: PolicyViolation[]
}

// HTTP Headers returned:
// X-ATSP-Verdict: APPROVED
// X-ATSP-Latency: 42ms
// X-ATSP-Circuit: CLOSED`}
              />
            </ExpandableSection>

            {/* Action Types */}
            <ExpandableSection title="ATSPAction (7 Variants)">
              <p className="mb-4 text-sm" style={{ color: colors.textDim }}>
                Discriminated union of all supported action types. Use <code>type</code> field 
                to determine the variant.
              </p>
              <CodeBlock 
                title="ATSPAction"
                code={`type ATSPAction =
  | { type: 'SWAP'; fromToken: string; toToken: string; slippageBps: number }
  | { type: 'TRANSFER'; token: string; recipient: string; memo?: string }
  | { type: 'LP'; pool: string; tokenA: string; tokenB: string; amountA: string; amountB: string }
  | { type: 'STAKE'; validator: string; lockupPeriodDays?: number }
  | { type: 'UNSTAKE'; validator: string; immediate?: boolean }
  | { type: 'VOTE'; proposal: string; vote: 'FOR' | 'AGAINST' | 'ABSTAIN'; governance: string }
  | { type: 'X402_STREAM'; recipient: string; ratePerSecond: string; durationSeconds: number }
  
// NEW in v1.0.1: X402_STREAM for payment streaming`}
              />
            </ExpandableSection>
          </div>
        </div>
      </section>

      {/* Causal Provenance */}
      <section className="py-12 px-4 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-mono font-bold text-xl mb-4" style={{ color: colors.text }}>
            CAUSAL PROVENANCE
          </h2>
          <p className="mb-6" style={{ color: colors.textDim }}>
            The <code>decisionTrace.causalReasoningChain</code> field is the institutional moat. 
            It provides a human-readable explanation of <em>why</em> the AI made its decision, 
            enabling:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="font-mono text-sm" style={{ color: colors.text }}>MiCA Article 14 Compliance</span>
              </div>
              <p className="text-sm" style={{ color: colors.textDim }}>
                EU regulation requires AI systems to provide explanations for automated decisions 
                affecting financial outcomes.
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="font-mono text-sm" style={{ color: colors.text }}>System of Record</span>
              </div>
              <p className="text-sm" style={{ color: colors.textDim }}>
                Every decision is logged with its reasoning, creating an immutable audit trail 
                for institutional due diligence.
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="font-mono text-sm" style={{ color: colors.text }}>Proof of No-Trade</span>
              </div>
              <p className="text-sm" style={{ color: colors.textDim }}>
                When the sentry SKIPs a trade, the reasoning proves the AI scanned for risks 
                (e.g., CVT anomalies, Tornado Cash origins).
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="font-mono text-sm" style={{ color: colors.text }}>IPI Verification</span>
              </div>
              <p className="text-sm" style={{ color: colors.textDim }}>
                The <code>ipiVerificationHash</code> proves exactly what data the AI scanned 
                before making its decision.
              </p>
            </div>
          </div>
          
          <CodeBlock 
            title="Example Causal Reasoning Chain"
            language="json"
            code={`{
  "causalReasoningChain": "Because CVT/USDC showed wash-traded volume patterns (>80% self-referential txns), shallow liquidity depth (<$50k), and fewer than 50 organic holders, the agent concluded the token has manufactured price history. Risk score: 92/100. DECISION: SKIP.",
  "confidence": 0.94,
  "factors": [
    { "name": "wash_trade_ratio", "value": 0.83, "weight": 0.4 },
    { "name": "liquidity_depth", "value": 48000, "weight": 0.3 },
    { "name": "holder_count", "value": 47, "weight": 0.3 }
  ],
  "micaCompliant": true
}`}
          />
        </div>
      </section>

      {/* ATSP v1.1 Preview */}
      <section className="py-12 px-4 border-t" style={{ borderColor: colors.amber }}>
        <div className="max-w-4xl mx-auto">
          <div 
            className="p-6 rounded-lg border"
            style={{ backgroundColor: colors.amberDim, borderColor: colors.amber }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: colors.amber }} />
              <h2 className="font-mono font-bold text-lg" style={{ color: colors.amber }}>
                ATSP v1.1 PREVIEW
              </h2>
            </div>
            
            <p className="mb-6" style={{ color: colors.text }}>
              The next version of ATSP introduces <strong>TRUST_THRESHOLD</strong> for dynamic 
              trust scoring and <strong>Handshake protocols</strong> for bi-directional verification.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded border" style={{ borderColor: colors.amber, backgroundColor: colors.bg }}>
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4" style={{ color: colors.amber }} />
                  <span className="font-mono text-sm" style={{ color: colors.text }}>TRUST_THRESHOLD</span>
                </div>
                <p className="text-sm" style={{ color: colors.textDim }}>
                  Agents build trust scores over time. Higher trust = faster approvals, lower latency.
                </p>
              </div>
              
              <div className="p-4 rounded border" style={{ borderColor: colors.amber, backgroundColor: colors.bg }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: colors.amber }} />
                  <span className="font-mono text-sm" style={{ color: colors.text }}>Handshake Protocol</span>
                </div>
                <p className="text-sm" style={{ color: colors.textDim }}>
                  Challenge-response verification before intent processing. Prevents replay attacks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: colors.accent }} />
            <span className="font-mono text-sm" style={{ color: colors.textDim }}>
              AgentSentry ATSP v1.0.1 | Open Standard
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/judges" className="text-sm hover:underline" style={{ color: colors.textDim }}>
              CrimsonARB
            </Link>
            <Link href="/transparency" className="text-sm hover:underline" style={{ color: colors.textDim }}>
              Audit Logs
            </Link>
            <a 
              href="https://github.com/agentsentry/atsp" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: colors.accent }}
            >
              Contribute
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
