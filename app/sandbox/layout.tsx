import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "CrimsonArb Sandbox | Devnet Testing Environment",
  description: "Test the CrimsonArb AI-powered basis trading vault on Solana Devnet with $100,000 mock USDC. Validate execution logic before mainnet deployment.",
  keywords: [
    "CrimsonArb Devnet",
    "Solana Devnet Testing",
    "Drift Protocol Sandbox",
    "Basis Trading Test",
    "AI Trading Sandbox",
    "Ranger Finance Hackathon",
  ],
  openGraph: {
    title: "CrimsonArb Sandbox | Devnet Testing",
    description: "Test whale-sized positions with mock USDC on Solana Devnet",
    type: "website",
    url: "https://crimsonarb.com/sandbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrimsonArb Sandbox | Devnet Testing",
    description: "Test whale-sized positions with mock USDC on Solana Devnet",
    creator: "@bcblockhtx",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#eab308", // Warning yellow for devnet
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
