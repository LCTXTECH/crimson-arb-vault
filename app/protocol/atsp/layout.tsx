import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATSP v1.0.1 | Agent-to-Sentry Trust Protocol Specification',
  description: 'The open standard for hashed intent declarations between autonomous AI agents and security sentries. Proof of reasoning. Audit trails. MiCA Article 14 compliant.',
  keywords: ['ATSP', 'AgentSentry', 'AI Security', 'Solana', 'DeFi', 'MiCA', 'Autonomous Agents', 'Trust Protocol'],
  openGraph: {
    title: 'ATSP v1.0.1 | Agent-to-Sentry Trust Protocol',
    description: 'The open standard for AI agent intent declarations with causal reasoning chains.',
    type: 'website',
    siteName: 'AgentSentry',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATSP v1.0.1 Protocol Specification',
    description: 'Open standard for AI agent intent declarations with audit trails.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ATSPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
