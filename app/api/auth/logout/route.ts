import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_CONFIG } from '@/lib/auth-config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crimsonarb.com'

/**
 * POST /api/auth/logout
 * Clears the session and logs the user out
 */
export async function POST() {
  const cookieStore = await cookies()
  
  // Clear session cookie
  cookieStore.delete(SESSION_CONFIG.cookieName)

  return NextResponse.json({ success: true })
}

/**
 * GET /api/auth/logout
 * Clears the session and redirects to home
 */
export async function GET() {
  const cookieStore = await cookies()
  
  // Clear session cookie
  cookieStore.delete(SESSION_CONFIG.cookieName)

  return NextResponse.redirect(BASE_URL)
}
