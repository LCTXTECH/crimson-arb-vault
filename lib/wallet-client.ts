/**
 * Privy Cross-App Provider Clients
 * Migration-ready: set NEXT_PUBLIC_WALLET_DOMAIN to move to wallet.bcblock.net
 */

import { createClient as createConnectClient } from '@privy-io/cross-app-provider/connect'
import { createClient as createAuthClient } from '@privy-io/cross-app-provider/auth'

const WALLET_DOMAIN = process.env.NEXT_PUBLIC_WALLET_DOMAIN || 'https://crimsonarb.com'

export const connectClient = createConnectClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appClientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
  privyDomain: WALLET_DOMAIN,
})

export const authClient = createAuthClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appClientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
  privyDomain: WALLET_DOMAIN,
})

export const WALLET_URLS = {
  connect: `${WALLET_DOMAIN}/wallet/connect`,
  auth: `${WALLET_DOMAIN}/wallet/auth`,
}

// Q3 2026 migration: set in Vercel env vars:
// NEXT_PUBLIC_WALLET_DOMAIN=https://wallet.bcblock.net
// Zero code changes required.
