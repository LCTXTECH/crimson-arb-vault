import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { privyId, email, walletAddress, googleId, displayName } = await req.json()

    if (!privyId) {
      return NextResponse.json({ error: 'privyId required' }, { status: 400 })
    }

    // Check if on founders waitlist
    let isFounder = false
    if (email) {
      const { data: waitlistEntry } = await supabase
        .from('founders_waitlist')
        .select('id, amount_intended')
        .eq('email', email)
        .single()

      isFounder = !!waitlistEntry
    }

    // Upsert profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(
        {
          privy_id: privyId,
          email,
          wallet_address: walletAddress,
          google_id: googleId,
          display_name: displayName,
          is_founder: isFounder,
          performance_fee_rate: isFounder ? 0 : 0.2,
          sentry_points: 0,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'privy_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (error) throw error

    // Fire ecosystem event to bcblock.net (fire and forget)
    fetch('https://bcblock.net/api/admin/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'lead',
        source: 'crimsonarb',
        data: {
          wallet: walletAddress,
          is_founder: isFounder,
          via: 'privy_oauth',
        },
      }),
    }).catch(() => {})

    // Issue JWT for session
    const jwt = await issueJWT(profile.id, privyId, walletAddress)

    return NextResponse.json({
      user: {
        privyId: profile.privy_id,
        email: profile.email,
        walletAddress: profile.wallet_address,
        displayName: profile.display_name,
        isFounder: profile.is_founder,
        depositedUsdc: profile.deposited_usdc || 0,
        performanceFeeRate: profile.performance_fee_rate,
        sentryPoints: profile.sentry_points || 0,
        createdAt: profile.created_at,
      },
      token: jwt,
    })
  } catch (error) {
    console.error('Auth sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

async function issueJWT(userId: string, privyId: string, walletAddress: string | null) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production')

  return new SignJWT({
    sub: userId,
    privyId,
    walletAddress,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
}
