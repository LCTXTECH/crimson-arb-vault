"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Color constants (computed for Recharts compatibility)
const COLORS = {
  crimson: "#e63946",
  crimsonDark: "#c1121f",
  success: "#22c55e",
  warning: "#eab308",
  muted: "#8b949e",
  background: "#0a0e14",
  card: "#0f1419",
  border: "#21262d",
}

// Cumulative Alpha data - CrimsonArb vs Passive Basis
const cumulativeAlphaData = [
  { month: "Jan", crimsonArb: 2.1, passiveBasis: 1.8, spread: 0.3 },
  { month: "Feb", crimsonArb: 4.5, passiveBasis: 3.2, spread: 1.3 },
  { month: "Mar", crimsonArb: 7.2, passiveBasis: 4.1, spread: 3.1 },
  { month: "Apr", crimsonArb: 9.8, passiveBasis: 4.8, spread: 5.0 },
  { month: "May", crimsonArb: 12.4, passiveBasis: 5.2, spread: 7.2 },
  { month: "Jun", crimsonArb: 15.1, passiveBasis: 5.9, spread: 9.2 },
  { month: "Jul", crimsonArb: 18.3, passiveBasis: 6.4, spread: 11.9 },
  { month: "Aug", crimsonArb: 21.7, passiveBasis: 6.8, spread: 14.9 },
  { month: "Sep", crimsonArb: 24.2, passiveBasis: 7.1, spread: 17.1 },
  { month: "Oct", crimsonArb: 27.8, passiveBasis: 7.5, spread: 20.3 },
  { month: "Nov", crimsonArb: 31.4, passiveBasis: 7.9, spread: 23.5 },
  { month: "Dec", crimsonArb: 34.7, passiveBasis: 8.2, spread: 26.5 },
]

// Sentry Decision Accuracy data
const decisionAccuracyData = [
  { name: "Execute", value: 28, color: COLORS.success },
  { name: "Skip", value: 52, color: COLORS.warning },
  { name: "Guard", value: 18, color: COLORS.crimson },
  { name: "Defer", value: 2, color: COLORS.muted },
]

// Drawdown Heatmap data (by week and strategy)
const drawdownData = [
  { week: "W1", solPerp: -0.2, btcPerp: -0.1, ethPerp: -0.3, aggregate: -0.2 },
  { week: "W2", solPerp: -0.5, btcPerp: -0.2, ethPerp: -0.4, aggregate: -0.4 },
  { week: "W3", solPerp: -0.1, btcPerp: -0.4, ethPerp: -0.2, aggregate: -0.2 },
  { week: "W4", solPerp: -0.8, btcPerp: -0.3, ethPerp: -0.6, aggregate: -0.6 },
  { week: "W5", solPerp: -0.3, btcPerp: -0.1, ethPerp: -0.2, aggregate: -0.2 },
  { week: "W6", solPerp: -1.2, btcPerp: -0.5, ethPerp: -0.8, aggregate: -0.8 },
  { week: "W7", solPerp: -0.4, btcPerp: -0.2, ethPerp: -0.3, aggregate: -0.3 },
  { week: "W8", solPerp: -0.6, btcPerp: -0.3, ethPerp: -0.5, aggregate: -0.5 },
  { week: "W9", solPerp: -0.2, btcPerp: -0.1, ethPerp: -0.2, aggregate: -0.2 },
  { week: "W10", solPerp: -0.9, btcPerp: -0.4, ethPerp: -0.7, aggregate: -0.7 },
  { week: "W11", solPerp: -0.3, btcPerp: -0.2, ethPerp: -0.3, aggregate: -0.3 },
  { week: "W12", solPerp: -0.5, btcPerp: -0.2, ethPerp: -0.4, aggregate: -0.4 },
]

// Key metrics
const keyMetrics = [
  { label: "Total Value Locked", value: "$2.4M", change: "+12.3%" },
  { label: "Cumulative Alpha", value: "34.7%", change: "+26.5% vs passive" },
  { label: "Max Drawdown", value: "-1.2%", change: "Week 6" },
  { label: "Sharpe Ratio", value: "2.84", change: "Risk-adjusted" },
]

export default function TransparencyReportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    aum: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-crimson/30 bg-crimson/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson"></span>
            </span>
            <span className="text-xs font-medium text-crimson">Institutional Grade Analytics</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Investor Transparency Report
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Full visibility into CrimsonArb's AI-driven basis trading performance, risk metrics, and decision-making logic.
          </p>
        </div>

        {/* Download Strategy PDF Button */}
        <div className="mb-12 flex justify-center">
          <button className="group flex items-center gap-3 rounded-lg border border-crimson bg-crimson/10 px-6 py-3 font-medium text-crimson transition-all hover:bg-crimson hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Strategy PDF
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Key Metrics Row */}
        <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {keyMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-2xl font-bold">{metric.value}</p>
              <p className="mt-1 text-xs text-success">{metric.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Chart 1: Cumulative Alpha */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Cumulative Alpha</h2>
              <p className="text-sm text-muted-foreground">
                CrimsonArb AI-managed returns vs. Passive Basis Strategy (%)
              </p>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeAlphaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.crimson} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.crimson} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mutedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.muted} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.muted} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" stroke={COLORS.muted} fontSize={12} />
                  <YAxis stroke={COLORS.muted} fontSize={12} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: COLORS.muted }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name === "crimsonArb" ? "CrimsonArb" : name === "passiveBasis" ? "Passive Basis" : "Alpha Spread",
                    ]}
                  />
                  <Legend
                    formatter={(value) =>
                      value === "crimsonArb" ? "CrimsonArb" : value === "passiveBasis" ? "Passive Basis" : "Alpha Spread"
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="crimsonArb"
                    stroke={COLORS.crimson}
                    strokeWidth={2}
                    fill="url(#crimsonGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="passiveBasis"
                    stroke={COLORS.muted}
                    strokeWidth={2}
                    fill="url(#mutedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Alpha Generated (YTD)</p>
                <p className="text-2xl font-bold text-crimson">+26.5%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">vs. Passive Strategy</p>
                <p className="text-sm text-success">4.2x outperformance</p>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Decision Accuracy + Drawdown */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Chart 2: Sentry Decision Accuracy */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Sentry Decision Accuracy</h2>
                <p className="text-sm text-muted-foreground">
                  AI decision distribution across 847 evaluated opportunities
                </p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={decisionAccuracyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={{ stroke: COLORS.muted }}
                    >
                      {decisionAccuracyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Decisions"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border pt-4">
                {decisionAccuracyData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div
                      className="mx-auto mb-1 h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                    <p className="font-bold">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Drawdown Heatmap */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Drawdown Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  Weekly maximum drawdown by strategy (%)
                </p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={drawdownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.crimson} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={COLORS.crimson} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="week" stroke={COLORS.muted} fontSize={12} />
                    <YAxis stroke={COLORS.muted} fontSize={12} tickFormatter={(v) => `${v}%`} domain={[-2, 0]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, "Drawdown"]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="aggregate"
                      stroke={COLORS.crimson}
                      strokeWidth={2}
                      fill="url(#drawdownGradient)"
                      name="Aggregate"
                    />
                    <Line
                      type="monotone"
                      dataKey="solPerp"
                      stroke={COLORS.warning}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      dot={false}
                      name="SOL-PERP"
                    />
                    <Line
                      type="monotone"
                      dataKey="btcPerp"
                      stroke={COLORS.success}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      dot={false}
                      name="BTC-PERP"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-xl font-bold text-crimson">-1.2%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Recovery Time</p>
                  <p className="text-sm text-success">{"< 48 hours"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics Table */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Risk Metrics Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Real-time risk monitoring across all active strategies
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Strategy</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">VaR (95%)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Sharpe</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Sortino</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Win Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Avg Trade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">SOL-PERP Basis</td>
                    <td className="px-4 py-3 text-right text-crimson">-0.8%</td>
                    <td className="px-4 py-3 text-right">2.94</td>
                    <td className="px-4 py-3 text-right">4.12</td>
                    <td className="px-4 py-3 text-right text-success">78.2%</td>
                    <td className="px-4 py-3 text-right">+0.12%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">BTC-PERP Basis</td>
                    <td className="px-4 py-3 text-right text-crimson">-0.5%</td>
                    <td className="px-4 py-3 text-right">3.21</td>
                    <td className="px-4 py-3 text-right">4.58</td>
                    <td className="px-4 py-3 text-right text-success">82.1%</td>
                    <td className="px-4 py-3 text-right">+0.09%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">ETH-PERP Basis</td>
                    <td className="px-4 py-3 text-right text-crimson">-0.6%</td>
                    <td className="px-4 py-3 text-right">2.78</td>
                    <td className="px-4 py-3 text-right">3.89</td>
                    <td className="px-4 py-3 text-right text-success">76.4%</td>
                    <td className="px-4 py-3 text-right">+0.11%</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="px-4 py-3 font-bold">Aggregate Portfolio</td>
                    <td className="px-4 py-3 text-right font-bold text-crimson">-0.6%</td>
                    <td className="px-4 py-3 text-right font-bold">2.84</td>
                    <td className="px-4 py-3 text-right font-bold">4.06</td>
                    <td className="px-4 py-3 text-right font-bold text-success">78.9%</td>
                    <td className="px-4 py-3 text-right font-bold">+0.11%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="mt-16 rounded-lg border border-border bg-card p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">Institutional Inquiries</span>
            </div>
            <h2 className="mb-4 text-2xl font-bold">Contact Bayou City Blockchain</h2>
            <p className="mb-8 text-muted-foreground">
              Interested in learning more about CrimsonArb's institutional-grade basis trading strategies? 
              Our team is ready to discuss custom allocations and white-label solutions.
            </p>

            {submitted ? (
              <div className="rounded-lg border border-success/30 bg-success/10 p-8">
                <svg className="mx-auto mb-4 h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mb-2 text-xl font-bold text-success">Thank You!</h3>
                <p className="text-muted-foreground">
                  Your inquiry has been received. A member of our team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                      placeholder="john@institution.com"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Company / Fund</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                      placeholder="Acme Capital"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">AUM Range</label>
                    <select
                      value={formData.aum}
                      onChange={(e) => setFormData({ ...formData, aum: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                    >
                      <option value="">Select range...</option>
                      <option value="<1M">{"< $1M"}</option>
                      <option value="1M-10M">$1M - $10M</option>
                      <option value="10M-50M">$10M - $50M</option>
                      <option value="50M-100M">$50M - $100M</option>
                      <option value=">100M">{"> $100M"}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                    placeholder="Tell us about your investment goals and how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-crimson px-6 py-3 font-medium text-white transition-colors hover:bg-crimson-dark disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Submit Inquiry"
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link href="/privacy" className="text-crimson hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Part of the{" "}
            <a href="https://bcblock.net" target="_blank" rel="noopener noreferrer" className="text-crimson hover:underline">
              BCBlock.net
            </a>{" "}
            ecosystem
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
