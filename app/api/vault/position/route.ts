import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json(
      { error: 'Missing wallet parameter' },
      { status: 400 }
    )
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('deposited_usdc, is_founder, sentry_points, performance_fee_rate')
      .eq('wallet_address', wallet)
      .single()

    if (error || !profile) {
      // Return empty position for new users
      return NextResponse.json({
        position: {
          depositedUsdc: 0,
          currentValueUsdc: 0,
          yieldEarnedUsdc: 0,
          actualApy: 23.4,
          isFounder: false,
          performanceFeeRate: 0.20,
          sentryPoints: 0,
          note: 'Devnet simulation - no deposits yet',
        },
      })
    }

    const depositedUsdc = Number(profile.deposited_usdc) || 0

    // Simulate devnet yield: 23.4% APY, calculate daily
    const dailyYieldRate = 0.234 / 365
    const yieldEarned = depositedUsdc * dailyYieldRate
    const currentValue = depositedUsdc + yieldEarned

    return NextResponse.json({
      position: {
        depositedUsdc,
        currentValueUsdc: currentValue,
        yieldEarnedUsdc: yieldEarned,
        actualApy: 23.4,
        isFounder: profile.is_founder || false,
        performanceFeeRate: Number(profile.performance_fee_rate) || 0.20,
        sentryPoints: profile.sentry_points || 0,
        note: 'Devnet simulation',
      },
    })
  } catch (err) {
    console.error('[v0] Vault position error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch position' },
      { status: 500 }
    )
  }
}
