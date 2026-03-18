'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface SignInButtonProps {
  variant?: 'primary' | 'ghost' | 'nav'
  label?: string
  redirectTo?: string
  className?: string
  showWeb2Message?: boolean
}

export function SignInButton({
  variant = 'primary',
  label = 'Get Started',
  redirectTo = '/dashboard',
  className = '',
  showWeb2Message = false,
}: SignInButtonProps) {
  const { isAuthenticated, isLoading, login, user } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <button disabled className={`opacity-50 cursor-not-allowed ${className}`}>
        <span className="animate-pulse">Loading...</span>
      </button>
    )
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() => router.push(redirectTo)}
        className={`bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all ${className}`}
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          {user?.displayName || 'My Vault'}
        </span>
      </button>
    )
  }

  const baseStyles = {
    primary: `bg-destructive hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200`,
    ghost: `border border-destructive text-destructive hover:bg-destructive hover:text-white px-6 py-3 rounded-lg transition-all`,
    nav: `text-muted-foreground hover:text-foreground px-3 py-1.5 text-sm rounded transition-colors`,
  }

  if (showWeb2Message) {
    return (
      <div className="text-center">
        <div className="text-muted-foreground text-sm mb-3">
          Sign in with Google. We handle the rest.
        </div>
        <div className="text-xs text-muted-foreground/70 mb-4">
          No wallet setup. No seed phrases. No crypto knowledge required.
        </div>
        <button onClick={login} className={`${baseStyles[variant]} ${className}`}>
          {label}
        </button>
      </div>
    )
  }

  return (
    <button onClick={login} className={`${baseStyles[variant]} ${className}`}>
      {label}
    </button>
  )
}

// Compact version for nav
export function NavAuthButton() {
  const { isAuthenticated, isLoading, login, logout, user } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return <div className="w-20 h-8 bg-muted/30 rounded animate-pulse" />
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          {user?.displayName?.split(' ')[0] || 'Dashboard'}
        </button>
        <button
          onClick={logout}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Sign in
    </button>
  )
}
