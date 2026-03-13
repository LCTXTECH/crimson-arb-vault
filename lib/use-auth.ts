"use client"

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  provider: 'google' | 'x'
}

interface AuthState {
  authenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useAuth() {
  const { data, error, mutate, isLoading } = useSWR('/api/auth/session', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (error) {
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
        error: 'Failed to fetch session',
      })
    } else if (data) {
      setAuthState({
        authenticated: data.authenticated,
        user: data.user,
        loading: false,
        error: null,
      })
    } else if (!isLoading) {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [data, error, isLoading])

  const signIn = useCallback((provider: 'google' | 'x') => {
    // Redirect to OAuth endpoint
    window.location.href = `/api/auth/${provider}`
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      await mutate({ authenticated: false, user: null }, false)
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
        error: null,
      })
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }, [mutate])

  const refresh = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    ...authState,
    signIn,
    signOut,
    refresh,
  }
}
