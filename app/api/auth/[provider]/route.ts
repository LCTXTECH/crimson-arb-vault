import { NextRequest, NextResponse } from 'next/server'
import { generateAuthUrl } from '@/lib/auth-config'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/[provider]
 * Initiates OAuth flow for Google or X
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params

  if (provider !== 'google' && provider !== 'x') {
    return NextResponse.json(
      { error: 'Invalid provider. Use "google" or "x".' },
      { status: 400 }
    )
  }

  // Generate a random state for CSRF protection
  const state = crypto.randomUUID()

  // Store state in cookie for verification
  const cookieStore = await cookies()
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  })

  // Generate OAuth URL and redirect
  const authUrl = generateAuthUrl(provider, state)

  return NextResponse.redirect(authUrl)
}
