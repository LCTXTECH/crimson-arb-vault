import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'CrimsonARB | Ranger Build-A-Bear Hackathon Submission',
  description: 'The vault that says NO. Three-layer security model validated by the $285M Drift exploit. Proof of No-Trade. Ranger Build-A-Bear 2026.',
}

export default function JudgesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
