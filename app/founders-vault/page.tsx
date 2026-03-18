"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

interface WaitlistStats {
  count: number
  totalIntended: number
}

function CrimsonLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
      <path
        d="M20 4C20 4 28 8 28 16C28 20 26 24 22 26C26 22 24 16 20 14C16 16 14 22 18 26C14 24 12 20 12 16C12 8 20 4 20 4Z"
        fill="currentColor"
        className="text-primary"
      />
      <circle cx="20" cy="30" r="4" fill="currentColor" className="text-primary" />
    </svg>
  )
}

function FoundersBadge() {
  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">OG</div>
        <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Founder</div>
      </div>
    </div>
  )
}

export default function FoundersVaultPage() {
  const [stats, setStats] = useState<WaitlistStats>({ count: 0, totalIntended: 0 })
  const [email, setEmail] = useState("")
  const [wallet, setWallet] = useState("")
  const [amount, setAmount] = useState("1000")
  const [source, setSource] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)

  useEffect(() => {
    // Fetch current waitlist stats
    fetch("/api/founders-waitlist/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/founders-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          wallet: wallet || null,
          amount_intended: parseInt(amount),
          source: source || "direct",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setSubmitted(true)
      setWaitlistPosition(data.position)
      setStats((prev) => ({
        count: prev.count + 1,
        totalIntended: prev.totalIntended + parseInt(amount),
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = Math.min((stats.count / 100) * 100, 100)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CrimsonLogo />
            <span className="font-mono text-lg font-bold text-primary">CRIMSONARB</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/sandbox"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sandbox
            </Link>
            <Link
              href="/proof-of-no-trade"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Proof of No-Trade
            </Link>
            <Link
              href="/whitepaper"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Whitepaper
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-4">
            PRE-LAUNCH — AUDIT PENDING
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-6">
            The First 100 Vault
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We aren&apos;t asking for millions. We are looking for 100 people to put $1,000 each
            into the first audited, AI-governed delta-neutral vault on Solana.
          </p>
          <p className="text-2xl md:text-3xl font-mono text-primary mt-6">
            In return: lifetime 0% performance fees. Forever.
          </p>
        </div>

        {/* Vault Status Card */}
        <div className="rounded-xl border-2 border-primary/30 bg-card p-6 md:p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xl font-bold">FOUNDERS VAULT</h2>
            <div className="flex items-center gap-2 text-amber-500">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-mono">Pre-Launch (Audit Pending)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-mono">$100,000 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Per wallet minimum</span>
                <span className="font-mono">$1,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maximum per founder</span>
                <span className="font-mono">$5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total spots</span>
                <span className="font-mono">100</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Performance fee</span>
                <span className="font-mono text-emerald-500">0% forever</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Waitlist count</span>
                <span className="font-mono">{stats.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Intent committed</span>
                <span className="font-mono">${stats.totalIntended.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="font-mono text-amber-500">Devnet (mainnet pending)</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.count} / 100 spots claimed</span>
              <span>{(100 - stats.count)} remaining</span>
            </div>
          </div>
        </div>

        {/* What Founders Get */}
        <div className="mb-12">
          <h2 className="font-mono text-2xl font-bold text-center mb-8">What Founders Get</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <span className="text-2xl text-emerald-500">0%</span>
              </div>
              <h3 className="font-mono font-bold mb-2">0% Performance Fees — Forever</h3>
              <p className="text-sm text-muted-foreground">
                Every other vault takes 15-20% of your yield. Founders pay nothing. Ever. Verified
                on-chain.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6">
              <div className="mb-4">
                <FoundersBadge />
              </div>
              <h3 className="font-mono font-bold mb-2">Sentry OG Badge</h3>
              <p className="text-sm text-muted-foreground">
                Permanent badge visible on your dashboard. The first 100 wallets that mattered.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="font-mono font-bold mb-2">Direct Access</h3>
              <p className="text-sm text-muted-foreground">
                Telegram group with Christopher directly. You see the Sentry Brain decisions before
                they&apos;re published. You see the audit results first.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-mono font-bold mb-2">The Audit Promise</h3>
              <p className="text-sm text-muted-foreground">
                We will not open the Founders Vault until the smart contract audit is complete. No
                exceptions. The audit report will be published publicly before dollar one deposits.
              </p>
            </div>
          </div>
        </div>

        {/* Why $1,000 */}
        <div className="rounded-lg border-l-4 border-primary bg-muted/30 p-6 mb-12">
          <h3 className="font-mono font-bold mb-4">Why $1,000 not $100,000?</h3>
          <p className="text-muted-foreground leading-relaxed">
            The goal of the Founders Vault is not maximum capital. It is maximum stress-testing. 100
            wallets x $1,000 = $100K of real money evaluating the Proof of No-Trade system.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            If the Sentry Brain performs — and we believe it will — you will have the receipts to
            show anyone who asks what it did and why.
          </p>
          <p className="text-foreground font-medium mt-4">
            That&apos;s the product. The yield is the bonus.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 mb-12">
          <h2 className="font-mono text-xl font-bold mb-6 text-center">Join the Founders Waitlist</h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-mono text-xl font-bold text-emerald-500 mb-2">
                You&apos;re on the list!
              </h3>
              {waitlistPosition && (
                <p className="text-lg text-muted-foreground mb-4">
                  Your position: <span className="font-mono text-foreground">#{waitlistPosition}</span>
                </p>
              )}
              <p className="text-muted-foreground">
                We&apos;ll notify you when the audit is complete and the vault opens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Solana Wallet Address (optional now, required at launch)
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="Your Solana wallet address"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 font-mono text-sm min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  Intended Deposit Amount *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["1000", "2500", "5000"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value)}
                      className={`py-3 px-4 rounded-lg border font-mono text-sm transition-colors min-h-[48px] ${
                        amount === value
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      ${parseInt(value).toLocaleString()}
                      {value === "1000" && (
                        <span className="block text-xs opacity-70">minimum</span>
                      )}
                      {value === "5000" && <span className="block text-xs opacity-70">maximum</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  How did you hear about CrimsonARB?
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 min-h-[48px]"
                >
                  <option value="">Select an option</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="hackathon">Ranger Hackathon</option>
                  <option value="drift">Drift Protocol</option>
                  <option value="friend">Friend/Referral</option>
                  <option value="search">Search Engine</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg font-mono font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
              >
                {isSubmitting ? "Joining..." : "Join Founders Waitlist"}
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            The Founders Vault is separate from the main vault. It launches after security audit.
          </p>
          <p>Currently on Solana devnet.</p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
