"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Shield, 
  AlertTriangle,
  Lock,
  FileCheck,
  DollarSign,
  Users,
  Layers,
  ArrowRight
} from "lucide-react"

interface Milestone {
  status: "completed" | "in-progress" | "upcoming"
  title: string
  date: string
  items: string[]
  note?: string
}

const milestones: Milestone[] = [
  {
    status: "completed",
    title: "Devnet Deployment",
    date: "March 2026",
    items: [
      "Devnet deployment complete",
      "Sentry Brain + Proof of No-Trade",
      "AgentSentry circuit-breakers",
      "Hackathon submission (Ranger Build-A-Bear)",
      "7 days devnet validation data"
    ]
  },
  {
    status: "in-progress",
    title: "Security Audit",
    date: "April 2026",
    items: [
      "Smart contract security audit"
    ],
    note: "Candidates: Codespect, Hacken, OtterSec. Codespect audit included in TokenTon26 Grand Prize — audit funded if we win."
  },
  {
    status: "upcoming",
    title: "Mainnet Alpha",
    date: "Q2 2026",
    items: [
      "Mainnet deployment ($10K USDC initial cap)",
      "AgentSentry integration verified on mainnet",
      "First real deposits enabled (whitelist only)",
      "30-day observation period"
    ]
  },
  {
    status: "upcoming",
    title: "Growth Phase",
    date: "Q3 2026",
    items: [
      "Cap raised to $100K based on performance",
      "Institutional API access",
      "SPLit + RapidPay treasury bridge activated"
    ]
  },
  {
    status: "upcoming",
    title: "Scale",
    date: "Q4 2026",
    items: [
      "White-label vault infrastructure",
      "Multi-market expansion (beyond SOL/BTC/ETH)",
      "DAO treasury management integration"
    ]
  },
  {
    status: "upcoming",
    title: "Ecosystem Layer",
    date: "2027",
    items: [
      "CrimsonARB becomes yield backbone for all BCBlock USDC settlement volume"
    ]
  }
]

const launchParameters = [
  { label: "Initial deposit cap", value: "$10,000 USDC" },
  { label: "Max single position", value: "20% of vault ($2,000)" },
  { label: "AgentSentry", value: "Mandatory, all transactions" },
  { label: "Pause mechanism", value: "Owner can halt in 1 transaction" },
  { label: "Audit requirement", value: "Must complete before deposit #1" }
]

export default function MainnetRoadmapPage() {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />
      case "in-progress":
        return <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-500/50 bg-emerald-500/5"
      case "in-progress":
        return "border-amber-500/50 bg-amber-500/5"
      default:
        return "border-border bg-card"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-500">DEVNET — Audit Pending</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            CrimsonARB Mainnet Deployment Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We deploy real capital responsibly. This is our roadmap to mainnet.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-[23px] top-8 bottom-8 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative pl-12 md:pl-16 ${index === milestones.length - 1 ? '' : 'pb-6'}`}
                >
                  {/* Status icon */}
                  <div className="absolute left-0 top-0 bg-background p-1">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  {/* Content card */}
                  <div 
                    className={`p-4 md:p-6 rounded-lg border ${getStatusColor(milestone.status)} cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() => setExpandedMilestone(expandedMilestone === index ? null : index)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <h3 className="text-lg md:text-xl font-semibold">{milestone.title}</h3>
                      <span className="text-sm text-muted-foreground font-mono">{milestone.date}</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {milestone.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm md:text-base">
                          <ArrowRight className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {milestone.note && (
                      <div className="mt-4 p-3 rounded bg-muted/50 text-sm text-muted-foreground">
                        {milestone.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conservative Launch Parameters */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="p-6 md:p-8 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Conservative Launch Parameters</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              When we deploy mainnet, these limits are enforced by smart contract — not by UI:
            </p>
            
            <div className="space-y-3">
              {launchParameters.map((param, index) => (
                <div 
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded bg-muted/30 gap-1 md:gap-4"
                >
                  <span className="text-sm font-medium">{param.label}</span>
                  <span className="font-mono text-sm text-primary">{param.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why We Haven't Deployed Yet */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="p-6 md:p-8 rounded-lg border-2 border-primary/50 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Why We Haven&apos;t Deployed Yet</h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              CrimsonARB&apos;s Anchor programs will handle real USDC. Before that happens, we need a 
              professional smart contract audit. We will not deploy real capital until this is complete. 
              This is not a limitation — it is the standard we hold ourselves to.
            </p>
          </div>
        </div>

        {/* Audit Quote Status */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="p-6 md:p-8 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl md:text-2xl font-bold">Audit Quote Status</h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Audit quote requested from <strong>Codespect</strong> and <strong>Hacken</strong>. 
              If CrimsonARB wins the Ranger hackathon, audit fees are funded from prize. 
              Estimated timeline: <strong>4-6 weeks from funding</strong>.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col md:flex-row gap-4">
            <a 
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              <Layers className="w-5 h-5" />
              Try Devnet Sandbox
            </a>
            <a 
              href="/transparency"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors min-h-[44px]"
            >
              <DollarSign className="w-5 h-5" />
              View Transparency Report
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
