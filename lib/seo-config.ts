import { Metadata, Viewport } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crimsonarb.io"

// Geo-targeted regions with language codes
export const GEO_REGIONS = {
  global: { code: "en", name: "Global", currency: "USD" },
  us: { code: "en-US", name: "United States", currency: "USD" },
  uk: { code: "en-GB", name: "United Kingdom", currency: "GBP" },
  sg: { code: "en-SG", name: "Singapore", currency: "SGD" },
  hk: { code: "en-HK", name: "Hong Kong", currency: "HKD" },
  ae: { code: "en-AE", name: "United Arab Emirates", currency: "AED" },
  de: { code: "de-DE", name: "Germany", currency: "EUR" },
  jp: { code: "ja-JP", name: "Japan", currency: "JPY" },
  cn: { code: "zh-CN", name: "China", currency: "CNY" },
  kr: { code: "ko-KR", name: "South Korea", currency: "KRW" },
} as const

export type GeoRegion = keyof typeof GEO_REGIONS

// Base metadata shared across all pages
export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CrimsonArb Vault | AI-Powered Basis Trading",
    template: "%s | CrimsonArb Vault",
  },
  description:
    "Delta-neutral arbitrage vault powered by AgentSentry AI on Drift Protocol. Capture funding rate yields with institutional-grade risk management.",
  keywords: [
    "DeFi",
    "arbitrage",
    "basis trading",
    "funding rate",
    "delta neutral",
    "Drift Protocol",
    "Solana",
    "yield farming",
    "AI trading",
    "AgentSentry",
    "perpetual futures",
    "crypto vault",
  ],
  authors: [{ name: "CrimsonArb", url: BASE_URL }],
  creator: "CrimsonArb",
  publisher: "CrimsonArb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "CrimsonArb Vault",
    title: "CrimsonArb Vault | AI-Powered Basis Trading",
    description:
      "Delta-neutral arbitrage vault powered by AgentSentry AI. Capture 15-40% APY from funding rate arbitrage on Drift Protocol.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CrimsonArb Vault - AI-Powered Basis Trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrimsonArb Vault | AI-Powered Basis Trading",
    description:
      "Delta-neutral arbitrage vault powered by AgentSentry AI. Capture 15-40% APY from funding rate arbitrage.",
    images: [`${BASE_URL}/twitter-image.png`],
    creator: "@CrimsonArb",
    site: "@CrimsonArb",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": `${BASE_URL}/us`,
      "en-GB": `${BASE_URL}/uk`,
      "en-SG": `${BASE_URL}/sg`,
      "en-HK": `${BASE_URL}/hk`,
      "en-AE": `${BASE_URL}/ae`,
      "de-DE": `${BASE_URL}/de`,
      "ja-JP": `${BASE_URL}/jp`,
      "zh-CN": `${BASE_URL}/cn`,
      "ko-KR": `${BASE_URL}/kr`,
      "x-default": BASE_URL,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
  category: "finance",
}

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e63946" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
}

// Generate page-specific metadata
export function generatePageMetadata(
  page: {
    title: string
    description: string
    path: string
    image?: string
  },
  region?: GeoRegion
): Metadata {
  const regionInfo = region ? GEO_REGIONS[region] : GEO_REGIONS.global
  const url = region ? `${BASE_URL}/${region}${page.path}` : `${BASE_URL}${page.path}`

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      locale: regionInfo.code.replace("-", "_"),
      images: page.image ? [{ url: `${BASE_URL}${page.image}` }] : undefined,
    },
    twitter: {
      title: page.title,
      description: page.description,
      images: page.image ? [`${BASE_URL}${page.image}`] : undefined,
    },
  }
}

// Structured data generators for Google Rich Results
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CrimsonArb",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "AI-powered delta-neutral arbitrage vault on Drift Protocol",
    sameAs: [
      "https://twitter.com/CrimsonArb",
      "https://github.com/CrimsonArb",
      "https://discord.gg/crimsonarb",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${BASE_URL}/support`,
    },
  }
}

export function generateFinancialProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "CrimsonArb Vault",
    description:
      "Delta-neutral arbitrage vault capturing funding rate yields through AI-powered basis trading on Drift Protocol",
    provider: {
      "@type": "Organization",
      name: "CrimsonArb",
      url: BASE_URL,
    },
    feesAndCommissionsSpecification:
      "10% performance fee on profits, no management fee",
    annualPercentageRate: {
      "@type": "QuantitativeValue",
      minValue: 15,
      maxValue: 40,
      unitText: "PERCENT",
    },
    category: "DeFi Yield Vault",
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CrimsonArb Vault",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  }
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}

// Geo-specific content variations
export const GEO_CONTENT = {
  global: {
    headline: "AI-Powered Basis Trading",
    subheadline: "Capture 15-40% APY from funding rate arbitrage",
    cta: "Start Earning",
  },
  us: {
    headline: "Institutional-Grade DeFi Yield",
    subheadline: "SEC-compliant delta-neutral strategies for accredited investors",
    cta: "Access Vault",
  },
  uk: {
    headline: "Smart DeFi Yield Generation",
    subheadline: "FCA-aware automated basis trading strategies",
    cta: "Start Earning",
  },
  sg: {
    headline: "Asia-Pacific Liquidity Hub",
    subheadline: "Optimised for APAC trading hours with low-latency execution",
    cta: "Connect Wallet",
  },
  hk: {
    headline: "Hong Kong DeFi Gateway",
    subheadline: "Access global liquidity from Asia's financial centre",
    cta: "Start Trading",
  },
  ae: {
    headline: "Middle East Crypto Yields",
    subheadline: "Sharia-compliant delta-neutral yield strategies",
    cta: "Explore Vault",
  },
  de: {
    headline: "KI-gesteuerte Arbitrage",
    subheadline: "15-40% APY durch automatisierte Basishandelsstrategien",
    cta: "Jetzt starten",
  },
  jp: {
    headline: "AI駆動のアービトラージ",
    subheadline: "ファンディングレート裁定取引で15-40% APYを獲得",
    cta: "始める",
  },
  cn: {
    headline: "AI驱动的套利交易",
    subheadline: "通过资金费率套利获得15-40% APY",
    cta: "开始赚取",
  },
  kr: {
    headline: "AI 기반 차익거래",
    subheadline: "펀딩비 차익거래로 15-40% APY 획득",
    cta: "시작하기",
  },
} as const
