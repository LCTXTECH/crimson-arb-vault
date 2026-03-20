import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VAULT, COMPUTED } from '@/lib/vault-constants'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  // Try live vault_state first
  const { data: live } = await supabase
    .from('vault_state')
    .select('*')
    .eq('id', 'singleton')
    .single()
  
  // Get decision stats
  const { count: totalDecisions } = await supabase
    .from('ai_decisions')
    .select('*', { count: 'exact', head: true })
  
  const { count: executedCount } = await supabase
    .from('ai_decisions')
    .select('*', { count: 'exact', head: true })
    .eq('decision_type', 'EXECUTE')
  
  const { data: lastDecision } = await supabase
    .from('ai_decisions')
    .select('created_at, market, decision_type, webacy_dd_score, funding_rate')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  const currentApy = live?.current_apy || VAULT.APY
  const totalEvals = totalDecisions || VAULT.TOTAL_EVALUATIONS
  const execCount = executedCount || VAULT.TOTAL_EXECUTED
  const skipRate = totalEvals > 0
    ? Math.round((1 - execCount / totalEvals) * 100)
    : VAULT.SKIP_RATE
  
  return NextResponse.json({
    // Core vault metrics
    tvl_usdc: live?.tvl_usdc || VAULT.STARTING_AUM_USDC,
    deployed_usdc: live?.deployed_usdc || COMPUTED.deployedUsdc(),
    current_apy: parseFloat(Number(currentApy).toFixed(1)),
    max_drawdown: VAULT.MAX_DRAWDOWN,
    sharpe_ratio: VAULT.SHARPE_RATIO,
    
    // Decision statistics (live or fallback)
    total_evaluations: totalEvals,
    total_executed: execCount,
    skip_rate: skipRate,
    win_rate: VAULT.WIN_RATE,
    
    // Allocation
    allocation: {
      current: VAULT.ALLOCATION_CURRENT,
      limits: VAULT.ALLOCATION_LIMITS,
    },
    
    // Yield tracking
    cumulative_yield_usdc: live?.cumulative_yield_usdc || 0,
    daily_yield_usdc: COMPUTED.dailyYield(),
    annual_yield_usdc: COMPUTED.annualYield(),
    
    // Last activity
    last_decision: lastDecision || null,
    last_updated: live?.updated_at || new Date().toISOString(),
    
    // Network labels
    network: 'devnet',
    is_simulation: true,
    disclaimer: VAULT.DISCLAIMER,
    
    // Health
    simulation_active: !!live,
    cycles_run: live?.total_cycles || 0,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=30',
    }
  })
}
