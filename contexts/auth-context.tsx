'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Stub auth context - works without Privy installed
// When Privy is configured, replace with full implementation
// See PRIVY_HUMAN_TASKS.md for complete setup instructions

export interface VaultUser {
  privyId: string
  email: string | null
  walletAddress: string | null
  displayName: string
  isFounder: boolean
  depositedUsdc: number
  performanceFeeRate: number
  sentryPoints: number
  createdAt: string
}

export interface VaultPosition {
  depositedUsdc: number
  currentValue: number
  pendingYield: number
  ctokenBalance: number
}

interface AuthContextType {
  user: VaultUser | null
  isAuthenticated: boolean
  isLoading: boolean
  walletAddress: string | null
  login: () => void
  logout: () => void
  connectWallet: () => void
  vaultPosition: VaultPosition | null
  refreshPosition: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VaultUser | null>(null)
  const [isLoading] = useState(false)
  const [vaultPosition, setVaultPosition] = useState<VaultPosition | null>(null)

  const refreshPosition = useCallback(async () => {
    // Stub - will fetch from /api/vault/position when Privy is configured
  }, [])

  // Stub login - shows alert until Privy is configured
  const login = useCallback(() => {
    alert(
      'Privy authentication not configured.\n\n' +
        'To enable login:\n' +
        '1. Create app at console.privy.io\n' +
        '2. Add NEXT_PUBLIC_PRIVY_APP_ID to Vercel\n' +
        '3. See PRIVY_HUMAN_TASKS.md for details'
    )
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setVaultPosition(null)
  }, [])

  const connectWallet = useCallback(() => {
    login()
  }, [login])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        walletAddress: user?.walletAddress || null,
        login,
        logout,
        connectWallet,
        vaultPosition,
        refreshPosition,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
