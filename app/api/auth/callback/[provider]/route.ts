import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, fetchUserInfo, SESSION_CONFIG } from '@/lib/auth-config'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crimsonarb.com'

/**
 * GET /api/auth/callback/[provider]
 * Handles OAuth callback from Google or X
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    console.error(`OAuth error from ${provider}:`, error)
    return NextResponse.redirect(`${BASE_URL}?auth_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${BASE_URL}?auth_error=no_code`)
  }

  // Verify state
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${BASE_URL}?auth_error=invalid_state`)
  }

  // Clear the state cookie
  cookieStore.delete('oauth_state')

  try {
    if (provider !== 'google' && provider !== 'x') {
      return NextResponse.redirect(`${BASE_URL}?auth_error=invalid_provider`)
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(provider, code)

    // Fetch user info
    const userInfo = await fetchUserInfo(provider, tokens.accessToken)

    // Create session (simplified - in production use proper JWT)
    const sessionData = {
      userId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.avatar,
      provider,
      accessToken: tokens.accessToken,
      expiresAt: Date.now() + (tokens.expiresIn * 1000),
    }

    // Set session cookie
    cookieStore.set(SESSION_CONFIG.cookieName, JSON.stringify(sessionData), {
      httpOnly: SESSION_CONFIG.httpOnly,
      secure: SESSION_CONFIG.secure,
      sameSite: SESSION_CONFIG.sameSite,
      maxAge: SESSION_CONFIG.maxAge,
      path: '/',
    })

    // Redirect to dashboard
    return NextResponse.redirect(`${BASE_URL}/vault?auth_success=true`)

  } catch (err) {
    console.error(`Error during ${provider} OAuth callback:`, err)
    return NextResponse.redirect(`${BASE_URL}?auth_error=callback_failed`)
  }
}
