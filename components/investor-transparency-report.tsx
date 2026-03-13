"use client"

import { useState, useEffect } from "react"

interface PnLData {
  date: string
  grossYield: number
  fees: number
  netYield: number
  tvl: number
  tradesExecuted: number
}

interface InvestorReportProps {
  vaultName?: string
  reportPeriod?: "24h" | "7d" | "30d" | "all"
}

// Mock data - replace with real API calls
const generateMockPnLData = (days: number): PnLData[] => {
  const data: PnLData[] = []
  const now = new Date()
  let cumulativeTvl = 125000

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const dailyYield = (Math.random() * 0.5 + 0.1) // 0.1% - 0.6% daily
    const fees = dailyYield * 0.1 // 10% performance fee
    const netYield = dailyYield - fees
    cumulativeTvl *= (1 + netYield / 100)

    data.push({
      date: date.toISOString().split("T")[0],
      grossYield: dailyYield,
      fees,
      netYield,
      tvl: cumulativeTvl,
      tradesExecuted: Math.floor(Math.random() * 15) + 5,
    })
  }

  return data
}

export function InvestorTransparencyReport({
  vaultName = "CrimsonArb Delta-Neutral Vault",
  reportPeriod = "7d",
}: InvestorReportProps) {
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState<"24h" | "7d" | "30d" | "all">(reportPeriod)
  const [pnlData, setPnlData] = useState<PnLData[]>([])

  useEffect(() => {
    setMounted(true)
    const days = period === "24h" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90
    setPnlData(generateMockPnLData(days))
  }, [period])

  if (!mounted) return null

  // Calculate summary metrics
  const totalGrossYield = pnlData.reduce((sum, d) => sum + d.grossYield, 0)
  const totalFees = pnlData.reduce((sum, d) => sum + d.fees, 0)
  const totalNetYield = pnlData.reduce((sum, d) => sum + d.netYield, 0)
  const totalTrades = pnlData.reduce((sum, d) => sum + d.tradesExecuted, 0)
  const currentTvl = pnlData[pnlData.length - 1]?.tvl || 0
  const avgDailyYield = totalNetYield / pnlData.length
  const projectedAPY = avgDailyYield * 365

  // Find max yield day for chart scaling
  const maxYield = Math.max(...pnlData.map(d => d.grossYield), 0.5)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-success font-medium">
                Live Report
              </span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{vaultName}</h2>
            <p className="text-xs text-muted-foreground">Investor Transparency Report</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["24h", "7d", "30d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  period === p
                    ? "bg-crimson text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "all" ? "All Time" : p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        <div className="bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Total Value Locked
          </p>
          <p className="text-2xl font-bold text-foreground font-mono">
            ${(currentTvl / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Net Yield ({period})
          </p>
          <p className="text-2xl font-bold text-success font-mono">
            +{totalNetYield.toFixed(2)}%
          </p>
        </div>
        <div className="bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Projected APY
          </p>
          <p className="text-2xl font-bold text-crimson font-mono">
            {projectedAPY.toFixed(1)}%
          </p>
        </div>
        <div className="bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Trades Executed
          </p>
          <p className="text-2xl font-bold text-foreground font-mono">{totalTrades}</p>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4">Daily Yield Performance</h3>
        <div className="h-32 flex items-end gap-1">
          {pnlData.map((day, i) => {
            const heightPercent = (day.grossYield / maxYield) * 100
            const netHeightPercent = (day.netYield / maxYield) * 100
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-0.5 group relative"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="rounded bg-foreground px-2 py-1 text-[10px] text-background whitespace-nowrap">
                    <p className="font-medium">{day.date}</p>
                    <p>Gross: +{day.grossYield.toFixed(3)}%</p>
                    <p>Net: +{day.netYield.toFixed(3)}%</p>
                  </div>
                </div>
                {/* Gross yield bar */}
                <div
                  className="w-full bg-crimson/30 rounded-t transition-all group-hover:bg-crimson/50"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Net yield overlay */}
                  <div
                    className="w-full bg-crimson rounded-t"
                    style={{ height: `${(netHeightPercent / heightPercent) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
          <span>{pnlData[0]?.date}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded bg-crimson" />
              Net Yield
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded bg-crimson/30" />
              Fees
            </span>
          </div>
          <span>{pnlData[pnlData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Fee Transparency</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gross Yield Generated</span>
            <span className="text-sm font-mono text-foreground">
              +{totalGrossYield.toFixed(3)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance Fee (10%)</span>
            <span className="text-sm font-mono text-warning">
              -{totalFees.toFixed(3)}%
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Net Yield to LPs</span>
            <span className="text-sm font-mono font-bold text-success">
              +{totalNetYield.toFixed(3)}%
            </span>
          </div>
        </div>
      </div>

      {/* Strategy Disclosure */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Strategy Disclosure</h3>
        <div className="space-y-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-crimson mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <span className="font-medium text-foreground">Delta-Neutral Basis Trading:</span>{" "}
              Simultaneously holding spot and perp positions to harvest funding rates while
              maintaining zero directional exposure.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-crimson mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <span className="font-medium text-foreground">AI-Powered Execution:</span>{" "}
              AgentSentry monitors funding rates 24/7 and executes trades when conditions
              meet confidence thresholds.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-crimson mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <span className="font-medium text-foreground">Delegated Signing:</span>{" "}
              Your funds never leave your wallet. CrimsonArb can only execute trades,
              not withdraw or transfer assets.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Disclosure */}
      <div className="p-4 bg-muted/20">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>
            <span className="font-medium text-warning">Risk Disclosure:</span> Past performance
            does not guarantee future results. Basis trading carries risks including funding
            rate reversals, liquidation in extreme market conditions, and smart contract
            vulnerabilities. Only deposit funds you can afford to lose.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-muted/10 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          Report generated: {new Date().toLocaleString()}
        </span>
        <button className="flex items-center gap-1 text-xs text-crimson hover:text-crimson-dark transition-colors">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PDF
        </button>
      </div>
    </div>
  )
}
