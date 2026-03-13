import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Security | CrimsonArb",
  description: "Learn about CrimsonArb's security measures and how we protect your assets.",
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Security</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Your security is our top priority. Learn how we protect your assets.
        </p>

        <div className="grid gap-6 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-crimson/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Self-Custody</h2>
            </div>
            <p className="text-muted-foreground">
              Your assets remain in your own wallet at all times. CrimsonArb never takes custody of your funds.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-crimson/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Delegated Authority Only</h2>
            </div>
            <p className="text-muted-foreground">
              Sentry AI can only execute trades within your vault. It cannot withdraw funds or transfer assets.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-crimson/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Liquidation Guards</h2>
            </div>
            <p className="text-muted-foreground">
              Automatic position management prevents liquidation during extreme market volatility.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-crimson/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Full Audit Trail</h2>
            </div>
            <p className="text-muted-foreground">
              Every action is logged with AI reasoning, timestamps, and transaction hashes for complete transparency.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-crimson/30 bg-crimson/5">
          <h3 className="text-lg font-semibold text-crimson mb-2">Security Audit</h3>
          <p className="text-muted-foreground">
            CrimsonArb&apos;s smart contracts have been audited by leading security firms. 
            Contact us for the full audit report.
          </p>
        </div>
      </div>
    </div>
  )
}
