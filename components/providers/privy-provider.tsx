'use client'

import { ReactNode } from 'react'

// Stub provider that passes through children
// The real Privy integration requires:
// 1. npm install @privy-io/react-auth
// 2. NEXT_PUBLIC_PRIVY_APP_ID environment variable
//
// See PRIVY_HUMAN_TASKS.md for complete setup instructions

interface PrivyProviderProps {
  children: ReactNode
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  // When Privy is configured, this will be replaced with the real provider
  // For now, just pass through children to allow the app to build
  return <>{children}</>
}
