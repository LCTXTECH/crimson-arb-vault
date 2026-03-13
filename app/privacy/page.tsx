import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | CrimsonArb",
  description: "CrimsonArb Privacy Policy - Learn how we handle your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-crimson mb-8 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: March 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              CrimsonArb collects minimal data necessary to provide the Service. This includes 
              your wallet address, trading activity within your vault, and basic analytics data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use collected information to: provide and improve the Service, execute trades on 
              your behalf when authorized, generate performance analytics, and communicate important 
              updates about your vault.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal data. Trading activity is recorded on-chain and is 
              publicly visible by nature of blockchain technology. We may share anonymized, 
              aggregated analytics for research purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. However, 
              no system is completely secure. You are responsible for securing your wallet 
              and private keys.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Analytics</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to improve your experience and analyze 
              usage patterns. You can disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal data. Contact us 
              at privacy@crimsonarb.com for any data-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes via the Service or email.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
