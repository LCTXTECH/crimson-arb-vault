import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_CONFIG } from '@/lib/auth-config'

/**
 * GET /api/auth/session
 * Returns the current user session
 */
export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_CONFIG.cookieName)

  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false, user: null })
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      cookieStore.delete(SESSION_CONFIG.cookieName)
      return NextResponse.json({ authenticated: false, user: null, reason: 'expired' })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        avatar: session.avatar,
        provider: session.provider,
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false, user: null, reason: 'invalid_session' })
  }
}
