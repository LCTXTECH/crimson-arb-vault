import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Your Vault | CrimsonArb",
  description: "Access your delta-neutral arbitrage vault powered by AgentSentry AI on Drift Protocol.",
}

export default function VaultPage() {
  redirect("/")
}
