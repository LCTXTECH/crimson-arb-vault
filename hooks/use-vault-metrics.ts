'use client'
import { useState, useEffect } from 'react'
import { VAULT } from '@/lib/vault-constants'

export interface VaultMetrics {
  tvl_usdc: number
  deployed_usdc: number
  current_apy: number
  max_drawdown: number
  sharpe_ratio: number
  total_evaluations: number
  total_executed: number
  skip_rate: number
  win_rate: number
  allocation: {
    current: typeof VAULT.ALLOCATION_CURRENT
    limits: typeof VAULT.ALLOCATION_LIMITS
  }
  cumulative_yield_usdc: number
  daily_yield_usdc: number
  annual_yield_usdc: number
  last_decision: {
    created_at: string
    market: string
    decision_type: string
    webacy_dd_score: number
    funding_rate: number
  } | null
  last_updated: string
  network: string
  is_simulation: boolean
  disclaimer: string
  simulation_active: boolean
  cycles_run: number
}

export function useVaultMetrics() {
  const [metrics, setMetrics] = useState<VaultMetrics>({
    tvl_usdc: VAULT.STARTING_AUM_USDC,
    deployed_usdc: VAULT.STARTING_AUM_USDC * (100 - VAULT.ALLOCATION_CURRENT.FREE) / 100,
    current_apy: VAULT.APY,
    max_drawdown: VAULT.MAX_DRAWDOWN,
    sharpe_ratio: VAULT.SHARPE_RATIO,
    total_evaluations: VAULT.TOTAL_EVALUATIONS,
    total_executed: VAULT.TOTAL_EXECUTED,
    skip_rate: VAULT.SKIP_RATE,
    win_rate: VAULT.WIN_RATE,
    allocation: {
      current: VAULT.ALLOCATION_CURRENT,
      limits: VAULT.ALLOCATION_LIMITS,
    },
    cumulative_yield_usdc: 0,
    daily_yield_usdc: VAULT.STARTING_AUM_USDC * (VAULT.APY / 100) / 365,
    annual_yield_usdc: VAULT.STARTING_AUM_USDC * (VAULT.APY / 100),
    last_decision: null,
    last_updated: new Date().toISOString(),
    network: 'devnet',
    is_simulation: true,
    disclaimer: VAULT.DISCLAIMER,
    simulation_active: false,
    cycles_run: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  
  async function fetchMetrics() {
    try {
      const res = await fetch('/api/vault/metrics')
      if (res.ok) {
        const data = await res.json()
        setMetrics(data)
        setLastRefresh(new Date())
      }
    } catch {
      // Silent fallback to constants — always show something
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30_000)
    return () => clearInterval(interval)
  }, [])
  
  return { metrics, loading, lastRefresh, refetch: fetchMetrics }
}

// Also export a Realtime decisions hook
export function useLiveDecisions(limit = 10) {
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Lazy import to avoid SSR issues
    import('@supabase/supabase-js').then(({ createClient }) => {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Load initial decisions
      client
        .from('ai_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
        .then(({ data }) => {
          if (data) setDecisions(data)
          setLoading(false)
        })
      
      // Subscribe to new decisions
      const channel = client
        .channel('live_decisions')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_decisions',
        }, (payload) => {
          setDecisions(prev => 
            [payload.new, ...prev].slice(0, limit * 2)
          )
        })
        .subscribe()
      
      return () => { client.removeChannel(channel) }
    })
  }, [limit])
  
  return { decisions, loading }
}
