/**
 * Privy Cross-App Provider Clients
 * Migration-ready: set NEXT_PUBLIC_WALLET_DOMAIN to move to wallet.bcblock.net
 * 
 * Note: This file provides stubs until @privy-io/cross-app-provider is properly installed
 */

const WALLET_DOMAIN = process.env.NEXT_PUBLIC_WALLET_DOMAIN || 'https://crimsonarb.com'

// Stub clients - will be replaced when cross-app-provider is available
export const connectClient = {
  getConnectionRequestFromUrlParams: () => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('request') ? {
      callbackUrl: params.get('callback') || '',
      request: params.get('request'),
    } : null
  },
  acceptConnection: async (opts: { accessToken?: string; address: string; userId: string; connectionRequest: unknown }) => {
    console.log('[wallet-client] Connection accepted:', opts.address)
    return { success: true }
  },
  rejectConnection: async (opts: { accessToken?: string; callbackUrl: string }) => {
    console.log('[wallet-client] Connection rejected')
    return { success: true }
  },
}

export const authClient = {
  getConnectionRequestFromUrlParams: () => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('state') ? {
      callbackUrl: params.get('redirect_uri') || '',
      redirectUri: params.get('redirect_uri') || '',
      codeChallenge: params.get('code_challenge'),
      codeChallengeMethod: params.get('code_challenge_method') || 'S256',
      state: params.get('state'),
      oauthClientId: params.get('client_id'),
    } : null
  },
  acceptConnection: async (opts: { accessToken?: string; codeChallenge: string; codeChallengeMethod: string; state?: string; oauthClientId?: string }) => {
    console.log('[wallet-client] Auth accepted')
    return { success: true }
  },
  rejectConnection: async (opts: { accessToken?: string; codeChallenge: string; codeChallengeMethod: string; state?: string; oauthClientId?: string }) => {
    console.log('[wallet-client] Auth rejected')
    return { success: true }
  },
}

export const WALLET_URLS = {
  connect: `${WALLET_DOMAIN}/wallet/connect`,
  auth: `${WALLET_DOMAIN}/wallet/auth`,
}

// Q3 2026 migration: set in Vercel env vars:
// NEXT_PUBLIC_WALLET_DOMAIN=https://wallet.bcblock.net
// Zero code changes required.
