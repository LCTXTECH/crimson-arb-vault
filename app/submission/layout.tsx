import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'CrimsonARB | Ranger Build-A-Bear Submission — Superteam',
  description: 'Official hackathon submission: CrimsonARB — The vault architecture that says NO. Three-layer AI security. Proof of No-Trade. Built on Solana.',
}

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
