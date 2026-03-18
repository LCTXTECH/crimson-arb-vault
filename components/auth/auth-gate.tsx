'use client'

import { useAuth } from '@/contexts/auth-context'

interface AuthGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  message?: string
}

export function AuthGate({ children, fallback, message = 'Sign in to access your vault' }: AuthGateProps) {
  const { isAuthenticated, isLoading, login } = useAuth()

  if (isLoading) {
    return <div className="animate-pulse bg-muted/30 rounded-xl p-6 min-h-[200px]" />
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="bg-card/50 border border-border rounded-xl p-8 text-center">
          <div className="text-muted-foreground text-sm mb-2">{message}</div>
          <div className="text-xs text-muted-foreground/70 mb-6">
            Sign in with Google. No wallet setup required.
          </div>
          <button
            onClick={login}
            className="bg-destructive text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-all text-sm"
          >
            Sign in with Google
          </button>
        </div>
      )
    )
  }

  return <>{children}</>
}
