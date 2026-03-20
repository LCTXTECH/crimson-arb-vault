import { NextRequest, NextResponse } from 'next/server'
import { runSimulationCycle } from '@/lib/simulation-engine'

export const maxDuration = 30
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Verify Vercel cron or manual trigger
  const authHeader = req.headers.get('authorization')
  const isVercelCron = req.headers.get('x-vercel-cron')
  
  if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    )
  }
  
  try {
    const result = await runSimulationCycle()
    
    return NextResponse.json({
      success: true,
      cycleId: result.cycleId,
      decisions: result.decisions.length,
      executed: result.decisions.filter(d => d.decision_type === 'EXECUTE').length,
      skipped: result.decisions.filter(d => d.decision_type === 'SKIP').length,
      guarded: result.decisions.filter(d => d.decision_type === 'GUARD').length,
      vaultTvl: result.vaultUpdate.tvl_usdc,
      currentApy: result.vaultUpdate.current_apy,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[SimTick] Failed:', error)
    return NextResponse.json(
      { error: 'Simulation cycle failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(req: NextRequest) {
  return GET(req)
}
