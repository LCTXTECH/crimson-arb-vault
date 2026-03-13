import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Analytics | CrimsonArb",
  description: "Real-time analytics and performance metrics for your CrimsonArb vault.",
}

export default function AnalyticsPage() {
  redirect("/")
}
