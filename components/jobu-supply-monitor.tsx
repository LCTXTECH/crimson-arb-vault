"use client"

import { useEffect, useState } from "react"

interface JobuBalanceData {
  balance: number
  address: string
  network: string
  timestamp: string
}

export function JobuSupplyMonitor() {
  const [data, setData] = useState<JobuBalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/jobu/balance")
        if (!res.ok) throw new Error("Failed to fetch balance")
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError("Jobu's spirits are restless")
        console.error("Jobu balance error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
    // Update every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 bg-black/40 border border-amber-900/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500/50 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
            Consulting Jobu...
          </span>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-black/40 border border-red-900/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-red-500">!</span>
          <span className="text-[10px] uppercase tracking-widest text-red-400">
            {error || "Jobu is displeased"}
          </span>
        </div>
      </div>
    )
  }

  // Assume 20 SOL is "Full" (100% Rum)
  const MAX_RUM = 20
  const rumPercentage = Math.min((data.balance / MAX_RUM) * 100, 100)
  const isLowRum = data.balance < 1
  const isCriticalRum = data.balance < 0.5

  return (
    <div className="p-4 bg-black/40 border border-amber-900/30 rounded-lg space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="rum">🥃</span>
          <span className="text-[10px] uppercase tracking-widest text-amber-200/70">
            Jobu&apos;s Rum Supply
          </span>
        </div>
        <span
          className={`text-sm font-mono font-bold ${
            isCriticalRum
              ? "text-red-500 animate-pulse"
              : isLowRum
              ? "text-amber-500"
              : "text-amber-200"
          }`}
        >
          {data.balance.toFixed(4)} SOL
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            isCriticalRum
              ? "bg-gradient-to-r from-red-700 to-red-500"
              : isLowRum
              ? "bg-gradient-to-r from-amber-700 to-amber-500"
              : "bg-gradient-to-r from-amber-800 to-amber-500"
          }`}
          style={{ width: `${rumPercentage}%` }}
        />
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Status Row */}
      <div className="flex justify-between items-center text-[9px] text-zinc-500">
        <span className="truncate max-w-[140px]" title={data.address}>
          Treasury: {data.address.slice(0, 8)}...{data.address.slice(-4)}
        </span>
        <span className="flex items-center gap-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              data.network === "devnet" ? "bg-amber-500" : "bg-green-500"
            }`}
          />
          {data.network}
        </span>
      </div>

      {/* Low Rum Warning */}
      {isLowRum && (
        <div className="pt-2 border-t border-amber-900/30">
          <p className="text-[9px] text-amber-400/80 italic text-center">
            {isCriticalRum
              ? '"Is very bad to steal Jobu\'s rum. Is very bad."'
              : '"Bats, they are getting sick. More rum needed."'}
          </p>
        </div>
      )}
    </div>
  )
}
