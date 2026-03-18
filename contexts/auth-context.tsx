'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'

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
  const { ready, authenticated, user: privyUser, login, logout: privyLogout } = usePrivy()
  const { wallets } = useSolanaWallets()
  
  const [user, setUser] = useState<VaultUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vaultPosition, setVaultPosition] = useState<VaultPosition | null>(null)

  // Get primary wallet (prefer Privy embedded, fall back to first connected)
  const primaryWallet = wallets.find(w => w.walletClientType === 'privy') || wallets[0] || null
  const walletAddress = primaryWallet?.address || null

  const refreshPosition = useCallback(async () => {
    if (!walletAddress) return
    try {
      const res = await fetch(`/api/vault/position?wallet=${walletAddress}`)
      if (res.ok) {
        const data = await res.json()
        setVaultPosition(data.position)
      }
    } catch (err) {
      console.error('[v0] Failed to refresh position:', err)
    }
  }, [walletAddress])

  const syncUserToSupabase = useCallback(async () => {
    if (!privyUser) return
    setIsLoading(true)
    try {
      const email = privyUser.google?.email || privyUser.email?.address || null
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privyId: privyUser.id,
          email,
          walletAddress,
          googleId: privyUser.google?.subject || null,
          displayName: privyUser.google?.name || email?.split('@')[0] || 'Vault User',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        if (walletAddress) await refreshPosition()
      }
    } catch (err) {
      console.error('[v0] Auth sync failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [privyUser, walletAddress, refreshPosition])

  // Sync user when auth state changes
  useEffect(() => {
    if (!ready) return
    if (authenticated && privyUser) {
      syncUserToSupabase()
    } else {
      setUser(null)
      setVaultPosition(null)
      setIsLoading(false)
    }
  }, [ready, authenticated, privyUser?.id, walletAddress, syncUserToSupabase])

  const logout = useCallback(() => {
    privyLogout()
    setUser(null)
    setVaultPosition(null)
  }, [privyLogout])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authenticated && !!user,
        isLoading: !ready || isLoading,
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
