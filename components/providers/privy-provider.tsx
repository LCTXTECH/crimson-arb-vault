'use client'

import { ReactNode } from 'react'

/**
 * Privy Provider - Stub mode
 * 
 * The @privy-io/react-auth package needs to be installed.
 * Once installed, this will be replaced with the full implementation.
 * 
 * To activate:
 * 1. Install: npm install @privy-io/react-auth
 * 2. Set NEXT_PUBLIC_PRIVY_APP_ID in Vercel env vars
 * 3. Replace this file with the full implementation
 */

export function PrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId) {
    console.warn('[Privy] NEXT_PUBLIC_PRIVY_APP_ID not set - auth disabled')
  }

  // Stub mode - just render children
  // When @privy-io/react-auth is installed, wrap with BasePrivyProvider
  return <>{children}</>
}
