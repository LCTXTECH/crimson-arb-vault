"use client"

import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SentryBrainReport } from "@/components/sentry-brain-report"

// Blog post metadata
const BLOG_POSTS = [
  {
    slug: "proof-of-no-trade",
    title: "Proof of No-Trade: The Missing Accountability Standard in DeFi",
    description: "Why documenting skipped trades matters more than documenting executed ones. CrimsonARB introduces the first complete audit trail for DeFi yield vault inaction.",
    date: "March 15, 2026",
    readTime: "7 min read",
    category: "Transparency",
    featured: true,
  },
  {
    slug: "drift-protocol-funding-rate-guide",
    title: "Funding Rate Arbitrage on Drift Protocol: A Complete 2026 Guide",
    description: "How funding rate arbitrage works on Drift Protocol, why delta-neutral positions earn yield without directional risk, and how AI improves capture rates.",
    date: "March 14, 2026",
    readTime: "6 min read",
    category: "Education",
    featured: true,
  },
  {
    slug: "agentsentry-pre-finality-screening",
    title: "Pre-Finality Transaction Screening: How CrimsonARB Guards Every Trade",
    description: "Why autonomous DeFi systems need circuit-breakers, and how AgentSentry's ATSP protocol provides pre-finality screening for CrimsonARB.",
    date: "March 13, 2026",
    readTime: "5 min read",
    category: "Security",
    featured: false,
  },
]

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter(p => p.featured)
  const otherPosts = BLOG_POSTS.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-mono text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sentry Brain Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into delta-neutral strategies, funding rate mechanics, 
            and the future of transparent DeFi yield.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-16">
          <SentryBrainReport />
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="font-mono text-sm uppercase tracking-wider text-primary mb-6">Featured</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="font-mono text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {post.description}
                </p>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-6">All Posts</h2>
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div>
                  <h3 className="font-mono font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mt-16 p-8 bg-muted/30 rounded-lg border border-border">
          <h2 className="font-mono text-lg font-semibold text-foreground mb-4">Coming Soon</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li>What is a Funding Rate? (3,000 words)</li>
            <li>Delta Neutral Trading on Solana</li>
            <li>How to Earn Passive Income on Solana</li>
            <li>JLP Delta Neutral Strategy Guide</li>
            <li>Kamino Finance vs CrimsonARB</li>
            <li>How to Earn Yield on JitoSOL</li>
            <li>The Safest Way to Earn DeFi Yield</li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
