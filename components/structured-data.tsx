import {
  generateOrganizationSchema,
  generateFinancialProductSchema,
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo-config"

interface StructuredDataProps {
  type: "organization" | "financial-product" | "software" | "faq" | "breadcrumb"
  data?: {
    faqs?: Array<{ question: string; answer: string }>
    breadcrumbs?: Array<{ name: string; url: string }>
  }
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: object

  switch (type) {
    case "organization":
      schema = generateOrganizationSchema()
      break
    case "financial-product":
      schema = generateFinancialProductSchema()
      break
    case "software":
      schema = generateSoftwareApplicationSchema()
      break
    case "faq":
      if (!data?.faqs) return null
      schema = generateFAQSchema(data.faqs)
      break
    case "breadcrumb":
      if (!data?.breadcrumbs) return null
      schema = generateBreadcrumbSchema(data.breadcrumbs)
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Convenience components for common use cases
export function OrganizationSchema() {
  return <StructuredData type="organization" />
}

export function FinancialProductSchema() {
  return <StructuredData type="financial-product" />
}

export function SoftwareSchema() {
  return <StructuredData type="software" />
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  return <StructuredData type="faq" data={{ faqs }} />
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return <StructuredData type="breadcrumb" data={{ breadcrumbs: items }} />
}

// Combined schema for the main landing page
export function LandingPageSchemas() {
  return (
    <>
      <OrganizationSchema />
      <FinancialProductSchema />
      <SoftwareSchema />
      <FAQSchema
        faqs={[
          {
            question: "What is CrimsonArb Vault?",
            answer:
              "CrimsonArb Vault is an AI-powered delta-neutral arbitrage vault that captures funding rate yields through automated basis trading on Drift Protocol.",
          },
          {
            question: "How does basis trading work?",
            answer:
              "Basis trading involves simultaneously holding a long spot position and a short perpetual futures position. This delta-neutral strategy captures the funding rate paid by leveraged traders.",
          },
          {
            question: "What is AgentSentry AI?",
            answer:
              "AgentSentry is our proprietary AI system that monitors market conditions, predicts funding rate movements, and executes trades with institutional-grade risk management.",
          },
          {
            question: "What are the expected returns?",
            answer:
              "Historical returns range from 15-40% APY depending on market volatility and funding rate conditions. Past performance does not guarantee future results.",
          },
          {
            question: "Is my capital safe?",
            answer:
              "The vault employs delta-neutral strategies to minimize directional risk. All trades are executed on Drift Protocol with real-time monitoring and automatic risk adjustments.",
          },
        ]}
      />
    </>
  )
}
