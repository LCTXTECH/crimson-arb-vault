import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | CrimsonArb",
  description: "CrimsonArb Terms of Service - Read our terms and conditions.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using CrimsonArb (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              CrimsonArb provides an AI-powered interface for managing delta-neutral arbitrage positions 
              on decentralized perpetual futures protocols. The Service does not custody user funds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Risk Disclosure</h2>
            <p className="text-muted-foreground">
              Trading perpetual futures involves substantial risk of loss. Past performance is not 
              indicative of future results. You should only trade with funds you can afford to lose. 
              CrimsonArb is not responsible for any trading losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the security of your wallet and any delegated 
              trading authority. You agree to use the Service in compliance with all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              CrimsonArb shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the Service 
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
