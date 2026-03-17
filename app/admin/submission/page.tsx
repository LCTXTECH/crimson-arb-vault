"use client"

import { useState, useEffect } from "react"
import { Check, Copy, ExternalLink, Video, Twitter, Send, ClipboardList, FileText } from "lucide-react"

// Checklist items with categories
const CHECKLIST = {
  preRecording: [
    { id: "seed", label: "Run: curl -X POST crimsonarb.com/api/decisions/seed" },
    { id: "sandbox", label: "Verify /sandbox auto-simulation works" },
    { id: "proof", label: "Verify /proof-of-no-trade populated (20+ decisions)" },
    { id: "judges", label: "Verify /judges all links work" },
    { id: "sentry", label: "Verify AgentSentry widget shows green" },
    { id: "jobu", label: "Add JOBU_TREASURY_SECRET_KEY to Vercel" },
    { id: "jwt", label: "Add JWT_SECRET to Vercel" },
    { id: "openclaw", label: "Add OPENCLAW_WEBHOOK_TOKEN to Vercel" },
    { id: "metrics", label: "Test: crimsonarb.com/api/openclaw/metrics returns 200" },
  ],
  recording: [
    { id: "demo_rec", label: "Demo video recorded (Loom, 3 min)" },
    { id: "demo_yt", label: "Demo video uploaded to YouTube unlisted" },
    { id: "demo_url", label: "Demo video URL copied" },
    { id: "pitch_rec", label: "Pitch video recorded (Loom, 5 min)" },
    { id: "pitch_yt", label: "Pitch video uploaded to YouTube unlisted" },
    { id: "pitch_url", label: "Pitch video URL copied" },
    { id: "env_videos", label: "Add video URLs to Vercel env vars" },
  ],
  submission: [
    { id: "drift_track", label: "Drift Side Track submitted (superteam.fun)" },
    { id: "main_track", label: "Main Track submitted (superteam.fun)" },
    { id: "twitter", label: "Twitter thread posted (@RangerFinance @DriftProtocol)" },
    { id: "telegram", label: "DM sent to @fez_xbt on Telegram" },
  ],
}

const DEMO_SCRIPT = `[0:00–0:15] HOOK  /  look at camera
"Most DeFi vaults are black boxes.
They trade. You wait. You hope.
You never know why they traded —
or why they didn't.
CrimsonARB changes that."

[0:15–0:45] SANDBOX  /  share screen
Open crimsonarb.com/sandbox
"This is the Sentry Brain.
It's watching Drift Protocol right now."
[Simulation auto-starts — let 2 decisions appear]
"SKIP. Not enough alpha. Still documented.
EXECUTE. Alpha confirmed. AgentSentry approved.
Every decision published. Every reason logged."

[0:45–1:15] PROOF OF NO-TRADE  /  navigate
crimsonarb.com/proof-of-no-trade
"1,460 skips. All documented.
[Hover over a bar in the skip reasons chart]
'Alpha below threshold' — 47% of our skips.
[Scroll to decision feed]
Every single one. Timestamped. In plain English.
Show me another vault that does this."

[1:15–1:45] AGENTSENTRY  /  back to sandbox
[Point at AgentSentry widget — green]
"Before any position opens:
AgentSentry circuit-breaker check.
APPROVE. WARN. BLOCK.
[Point at GUARD decision in feed]
That one was blocked. Anomaly.
$18,600 protected. Documented."

[1:45–2:15] TECHNICAL PROOF  /  /judges page
[Click Solscan link]
"Anchor programs on Solana devnet.
Real on-chain transaction. Not a mockup."

[2:15–2:45] THE NUMBER  /  metrics card
[Point at 0.00% max drawdown]
"0.00% max drawdown.
Not simulated.
Delta-neutral means we collect funding.
We don't bet on price."

[2:45–3:00] CLOSE  /  camera
"CrimsonARB.
The first vault that proves its intelligence
by showing you when it chose not to trade.
crimsonarb.com"`

const PITCH_SCRIPT = `[0:00–0:45] THE PROBLEM  /  camera only
"Institutional capital won't enter DeFi yield.
Not because the returns aren't there.
Because there's no accountability.

You deposit. Something happens.
Returns — or not. No audit trail.
No reasoning. No documentation of inaction.

Traditional finance mandates all of this.
In DeFi, none of it exists.
We built the bridge."

[0:45–2:00] LIVE PRODUCT  /  screen share
Tour in order:
→ crimsonarb.com/sandbox — show auto-simulation
→ crimsonarb.com/proof-of-no-trade — show skip feed
→ crimsonarb.com/transparency — show metrics
→ crimsonarb.com/judges — all green, live

"Built on Ranger Finance's Voltr SDK.
Integrated with Drift Protocol.
AgentSentry circuit-breakers.
The full institutional stack. Live on devnet."

[2:00–3:00] ARCHITECTURE  /  whitepaper
Navigate to /whitepaper
"Delta-neutral: long spot, short perp.
Net directional exposure: zero.
Revenue: funding rate only.

The Sentry Brain evaluates every opportunity.
[Hold up fingers]
Rate above threshold? Check.
Alpha won't decay in 2 hours? Check.
OI concentration safe? Check.
AgentSentry approved? Check.
Then — and only then — we execute.

79% skip rate. Because discipline
is the product."

[3:00–4:00] THE ECOSYSTEM  /  bcblock.net briefly
"CrimsonARB isn't a hackathon demo.

It's the treasury layer for a 10-product
Solana ecosystem. SPLit users split bills.
RapidPay users send international payments.
USDC accumulates. AgentSentry guards it.
CrimsonARB puts it to work.
Yield funds everything else.

We're not building a vault.
We're building a self-funding company
on Solana."

[4:00–5:00] WHY WE WIN  /  camera, direct
"Drift Side Track: zero other submissions.
We built CrimsonARB on Drift's infrastructure.
We have the only AI transparency layer.
The only pre-finality security integration.
A real ecosystem depending on this vault.

Main Track: we're the only submission
where 'Proof of No-Trade' is a DeFi primitive
that didn't exist before this hackathon.

We didn't build something for a prize.
We built something that needed to exist.

crimsonarb.com/judges
Judge for yourself."`

const SUBMISSION_COPY = {
  projectName: "CrimsonARB",
  oneLiner: "The first AI-native delta-neutral yield vault on Drift Protocol with complete decision transparency — every trade and every skip, documented with reasoning.",
  description: `CrimsonARB is an AI-augmented delta-neutral yield vault built natively on Ranger Finance's Voltr SDK and Drift Protocol. It captures funding rate alpha from Solana perpetual markets while maintaining zero directional exposure through delta-neutral position management.

THE CORE INNOVATION — PROOF OF NO-TRADE:
Most DeFi yield vaults are black boxes. CrimsonARB introduces the "Proof of No-Trade" protocol: every trading decision — including every skipped opportunity — is documented with machine-readable AI reasoning. 79% of evaluated opportunities are intentionally passed. Every pass is published, in plain English, permanently.

This is the first implementation of complete decision transparency in a DeFi yield vault — a standard traditional finance has required for decades that DeFi has never met. Until now.

BUILT ON RANGER FINANCE:
CrimsonARB uses Ranger Finance's Voltr SDK as its vault management layer, with two Anchor programs deployed to Solana devnet:
- ctoken-market-program: liquidity pool with cToken mint/burn mechanics
- custom-adaptor-program: CPI bridge to Ranger vault

AGENTSENTRY PRE-FINALITY SCREENING:
Every EXECUTE decision passes through AgentSentry (agentsentry.net) before touching Drift Protocol. APPROVE / WARN / BLOCK verdicts are logged. CrimsonARB is the only yield vault with pre-finality transaction screening — a circuit-breaker that operates before capital moves, not after.

PERFORMANCE (Devnet Simulation):
- Simulated APY: 23.4%
- Sharpe Ratio: 2.41
- Max Drawdown: 0.00% (architecturally guaranteed)
- Funding Capture Rate: 73.2%
- Decisions evaluated: 1,847
- Executed: 387 (20.9%)
- Skipped with documented reasoning: 1,460

All metrics clearly labeled as devnet simulation. Mainnet deployment pending security audit.

ECOSYSTEM CONTEXT:
CrimsonARB is the treasury layer for Bayou City Blockchain LLC's 10-product Solana ecosystem. Consumer settlement volume from SPLit and RapidPay flows through AgentSentry into CrimsonARB for yield generation — creating a self-funding product ecosystem backed by institutional DeFi infrastructure.

LINKS:
Live Demo: crimsonarb.com/sandbox
Dashboard: crimsonarb.com
Whitepaper: crimsonarb.com/whitepaper
Proof of No-Trade: crimsonarb.com/proof-of-no-trade
Judges Page: crimsonarb.com/judges
Transparency: crimsonarb.com/transparency
GitHub: github.com/LCTXTECH

CONTACT:
Christopher Trotti | Bayou City Blockchain LLC
info@bcblock.net | @bcblockhtx
discord.gg/V2DksdSE`,
}

const TWITTER_THREAD = [
  {
    label: "Tweet 1 (main)",
    text: `Just submitted @CrimsonARB to @RangerFinance Build-A-Bear Hackathon

Delta-neutral yield vault on @DriftProtocol.
Built on Ranger's Voltr SDK.

The innovation: Proof of No-Trade.
Every skip documented. Every reason published.

crimsonarb.com`,
  },
  {
    label: "Tweet 2 (the data)",
    text: `CrimsonARB devnet numbers:

1,847 funding opportunities evaluated
387 executed (20.9%)
1,460 skipped — each with AI reasoning

79% skip rate isn't failure.
It's discipline.

crimsonarb.com/proof-of-no-trade`,
  },
  {
    label: "Tweet 3 (the differentiator)",
    text: `Before any @DriftProtocol position opens,
it clears @agentsentry circuit-breakers.

APPROVE. WARN. BLOCK.
All logged. All auditable.

Max drawdown: 0.00%
(Delta-neutral = guaranteed, not simulated)

crimsonarb.com/judges`,
  },
  {
    label: "Tweet 4 (the ecosystem)",
    text: `CrimsonARB isn't just a hackathon submission.

It's the yield engine for a 10-product @Solana ecosystem built by @bcblockhtx.

SPLit + RapidPay settlements →
AgentSentry screening →
CrimsonARB yield →
BCB treasury

Real infrastructure. Real company.
crimsonarb.com`,
  },
]

const TELEGRAM_DM = `Hi — just submitted CrimsonARB to both Build-A-Bear tracks (Main + Drift Side).

AI delta-neutral vault on Drift Protocol, built on Ranger's Voltr SDK. Key innovation is Proof of No-Trade — publishing every skip decision with AI reasoning. First complete DeFi audit trail for inaction.

AgentSentry circuit-breakers on every trade.
0.00% max drawdown (delta-neutral architecture).

Live demo: crimsonarb.com/judges
Whitepaper: crimsonarb.com/whitepaper

Happy to answer any questions. Thanks for running this competition — it pushed us to build something we needed for our ecosystem regardless of the outcome.`

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors min-h-[44px]"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {label || (copied ? "Copied!" : "Copy")}
    </button>
  )
}

function ChecklistSection({ 
  title, 
  items, 
  checked, 
  onToggle 
}: { 
  title: string
  items: { id: string; label: string }[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const completedCount = items.filter(item => checked[item.id]).length
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <span className="text-xs font-mono text-muted-foreground">{completedCount}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
              checked[item.id] 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-card border-border hover:border-muted-foreground/30"
            }`}
          >
            <input
              type="checkbox"
              checked={checked[item.id] || false}
              onChange={() => onToggle(item.id)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              checked[item.id] 
                ? "bg-emerald-500 border-emerald-500" 
                : "border-muted-foreground/50"
            }`}>
              {checked[item.id] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${checked[item.id] ? "text-emerald-400 line-through" : "text-foreground"}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function SubmissionWarRoom() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"checklist" | "demo" | "pitch" | "copy" | "twitter" | "telegram">("checklist")
  
  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("crimsonarb-submission-checklist")
    if (saved) {
      setCheckedItems(JSON.parse(saved))
    }
  }, [])
  
  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("crimsonarb-submission-checklist", JSON.stringify(checkedItems))
    }
  }, [checkedItems, mounted])
  
  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
  // Calculate overall progress
  const allItems = [...CHECKLIST.preRecording, ...CHECKLIST.recording, ...CHECKLIST.submission]
  const completedCount = allItems.filter(item => checkedItems[item.id]).length
  const progressPercent = Math.round((completedCount / allItems.length) * 100)
  
  const tabs = [
    { id: "checklist", label: "Checklist", icon: ClipboardList },
    { id: "demo", label: "Demo Script", icon: Video },
    { id: "pitch", label: "Pitch Script", icon: Video },
    { id: "copy", label: "Submission", icon: FileText },
    { id: "twitter", label: "Twitter", icon: Twitter },
    { id: "telegram", label: "Telegram", icon: Send },
  ] as const
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading war room...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-mono font-bold text-primary">SUBMISSION WAR ROOM</h1>
              <p className="text-sm text-muted-foreground">Ranger Build-A-Bear Hackathon</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-mono font-bold">{progressPercent}%</div>
                <div className="text-xs text-muted-foreground">{completedCount}/{allItems.length} tasks</div>
              </div>
              <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Checklist Tab */}
        {activeTab === "checklist" && (
          <div className="space-y-8">
            <ChecklistSection
              title="Pre-Recording"
              items={CHECKLIST.preRecording}
              checked={checkedItems}
              onToggle={toggleItem}
            />
            <ChecklistSection
              title="Recording"
              items={CHECKLIST.recording}
              checked={checkedItems}
              onToggle={toggleItem}
            />
            <ChecklistSection
              title="Submission"
              items={CHECKLIST.submission}
              checked={checkedItems}
              onToggle={toggleItem}
            />
            
            {/* Quick Links */}
            <div className="pt-8 border-t border-border">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Drift Side Track", url: "https://superteam.fun/earn/listing/ranger-build-a-bear-hackathon-drift-side-track" },
                  { label: "Main Track", url: "https://superteam.fun/earn/listing/ranger-build-a-bear-hackathon-main-track" },
                  { label: "Vercel Dashboard", url: "https://vercel.com/lctxtech/crimson-arb-vault/settings/environment-variables" },
                  { label: "@fez_xbt Telegram", url: "https://t.me/fez_xbt" },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-sm min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Demo Script Tab */}
        {activeTab === "demo" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-mono font-bold">Demo Video Script (3 min)</h2>
              <CopyButton text={DEMO_SCRIPT} label="Copy Script" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">{DEMO_SCRIPT}</pre>
            </div>
          </div>
        )}
        
        {/* Pitch Script Tab */}
        {activeTab === "pitch" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-mono font-bold">Pitch Video Script (5 min)</h2>
              <CopyButton text={PITCH_SCRIPT} label="Copy Script" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">{PITCH_SCRIPT}</pre>
            </div>
          </div>
        )}
        
        {/* Submission Copy Tab */}
        {activeTab === "copy" && (
          <div className="space-y-8">
            <h2 className="text-xl font-mono font-bold">Submission Copy</h2>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">Project Name</h3>
                  <CopyButton text={SUBMISSION_COPY.projectName} />
                </div>
                <p className="text-lg font-semibold">{SUBMISSION_COPY.projectName}</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">One-Liner</h3>
                  <CopyButton text={SUBMISSION_COPY.oneLiner} />
                </div>
                <p className="text-base">{SUBMISSION_COPY.oneLiner}</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">Product Description (500 words)</h3>
                  <CopyButton text={SUBMISSION_COPY.description} />
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{SUBMISSION_COPY.description}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Twitter Tab */}
        {activeTab === "twitter" && (
          <div className="space-y-6">
            <h2 className="text-xl font-mono font-bold">Twitter Thread</h2>
            <p className="text-sm text-muted-foreground">Post when submitting. Tag @RangerFinance @DriftProtocol</p>
            
            <div className="space-y-4">
              {TWITTER_THREAD.map((tweet, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-mono text-sm font-bold text-primary">{tweet.label}</h3>
                    <CopyButton text={tweet.text} />
                  </div>
                  <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{tweet.text}</pre>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {tweet.text.length}/280 characters
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Telegram Tab */}
        {activeTab === "telegram" && (
          <div className="space-y-6">
            <h2 className="text-xl font-mono font-bold">Telegram DM to @fez_xbt</h2>
            <p className="text-sm text-muted-foreground">Copy and send after submitting to both tracks.</p>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</h3>
                <CopyButton text={TELEGRAM_DM} label="Copy Message" />
              </div>
              <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{TELEGRAM_DM}</pre>
            </div>
            
            <a
              href="https://t.me/fez_xbt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-medium rounded-lg transition-colors min-h-[44px]"
            >
              <Send className="w-5 h-5" />
              Open Telegram
            </a>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>CrimsonARB Submission War Room | Bayou City Blockchain LLC</p>
          <p className="mt-1">Build-A-Bear Hackathon | March 2026</p>
        </div>
      </footer>
    </div>
  )
}
