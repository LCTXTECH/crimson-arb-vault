'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/**
 * Auth Context - Stub mode
 * 
 * Provides auth state without Privy dependency.
 * Once @privy-io/react-auth is installed, replace with full implementation.
 */

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
  const [walletAddress] = useState<string | null>(null)

  const refreshPosition = useCallback(async () => {
    if (!walletAddress) return
    try {
      const res = await fetch(`/api/vault/position?wallet=${walletAddress}`)
      if (res.ok) {
        const data = await res.json()
        setVaultPosition(data.position)
      }
    } catch (err) {
      console.error('[Auth] Failed to refresh position:', err)
    }
  }, [walletAddress])

  const login = useCallback(() => {
    // Stub - show alert explaining Privy needs to be configured
    if (typeof window !== 'undefined') {
      alert('Authentication requires Privy to be configured. Please set NEXT_PUBLIC_PRIVY_APP_ID.')
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setVaultPosition(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        walletAddress,
        login,
        logout,
        connectWallet: login,
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
