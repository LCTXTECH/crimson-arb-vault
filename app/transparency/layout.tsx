import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Investor Transparency Report | CrimsonArb",
  description:
    "Full visibility into CrimsonArb's AI-driven basis trading performance, risk metrics, Sentry decision accuracy, and drawdown analysis. Institutional-grade analytics for sophisticated investors.",
  keywords: [
    "CrimsonArb transparency",
    "basis trading performance",
    "AI trading analytics",
    "institutional crypto",
    "hedge fund performance",
    "Sentry AI",
    "risk metrics",
    "Sharpe ratio",
    "drawdown analysis",
  ],
  openGraph: {
    title: "CrimsonArb Investor Transparency Report",
    description:
      "Institutional-grade analytics: Cumulative alpha vs. passive basis, Sentry decision accuracy, and risk-adjusted returns.",
    type: "website",
    images: [
      {
        url: "/images/transparency-og.png",
        width: 1200,
        height: 630,
        alt: "CrimsonArb Transparency Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrimsonArb Investor Transparency Report",
    description:
      "Full visibility into AI-driven basis trading: 34.7% cumulative alpha, 2.84 Sharpe ratio, 78.9% win rate.",
    creator: "@bcblockhtx",
  },
}

export default function TransparencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
