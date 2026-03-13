/**
 * CrimsonArb Authentication Configuration
 * 
 * This file contains the OAuth configuration for Google and X (Twitter) authentication.
 * Environment variables must be set in Vercel project settings.
 */

export const AUTH_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crimsonarb.com'}/api/auth/callback/google`,
    scopes: ['openid', 'email', 'profile'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  x: {
    clientId: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crimsonarb.com'}/api/auth/callback/x`,
    scopes: ['tweet.read', 'users.read', 'offline.access'],
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me',
  },
} as const

export const SESSION_CONFIG = {
  cookieName: 'crimsonarb_session',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
}

// JWT configuration (for session tokens)
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: '7d',
}

/**
 * Generate OAuth authorization URL
 */
export function generateAuthUrl(provider: 'google' | 'x', state: string): string {
  const config = AUTH_CONFIG[provider]
  
  const params = new URLSearchParams({
    client_id: config.clientId || '',
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    ...(provider === 'x' && {
      code_challenge: 'challenge', // Implement PKCE for production
      code_challenge_method: 'plain',
    }),
  })

  return `${config.authUrl}?${params.toString()}`
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  provider: 'google' | 'x',
  code: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }> {
  const config = AUTH_CONFIG[provider]

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId || '',
    client_secret: config.clientSecret || '',
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(provider === 'x' && {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      }),
    },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  }
}

/**
 * Fetch user info from provider
 */
export async function fetchUserInfo(
  provider: 'google' | 'x',
  accessToken: string
): Promise<{ id: string; email?: string; name?: string; avatar?: string }> {
  const config = AUTH_CONFIG[provider]

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`)
  }

  const data = await response.json()

  if (provider === 'google') {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    }
  } else {
    // X/Twitter
    return {
      id: data.data.id,
      name: data.data.name,
      avatar: data.data.profile_image_url,
    }
  }
}
