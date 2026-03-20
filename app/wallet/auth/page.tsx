'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { authClient } from '@/lib/wallet-client'
import {
  WalletShell,
  InfoRow,
  Permission,
  ActionButton,
  Spinner,
  ErrorDisplay,
  SuccessDisplay,
} from '../_components'

type PageState =
  | 'loading'
  | 'login_required'
  | 'awaiting_approval'
  | 'approving'
  | 'denying'
  | 'done'
  | 'error'

export default function WalletAuthPage() {
  const { isAuthenticated, isLoading, login, user } = useAuth()
  const [state, setState] = useState<PageState>('loading')
  const [req, setReq] = useState<ReturnType<typeof authClient.getConnectionRequestFromUrlParams>>(null)
  const [requesterHost, setRequesterHost] = useState<string>('An app')
  const [error, setError] = useState<string | null>(null)

  const displayEmail = user?.email || null

  useEffect(() => {
    try {
      const connectionReq = authClient.getConnectionRequestFromUrlParams()
      if (!connectionReq) {
        setError('Invalid auth request.')
        setState('error')
        return
      }
      setReq(connectionReq)
      const cb = connectionReq.callbackUrl || connectionReq.redirectUri
      if (cb) {
        try {
          setRequesterHost(new URL(cb).hostname)
        } catch {
          // Invalid URL, keep default
        }
      }
    } catch {
      setError('Could not parse auth request.')
      setState('error')
    }
  }, [])

  useEffect(() => {
    if (isLoading || !req) return
    setState(isAuthenticated ? 'awaiting_approval' : 'login_required')
  }, [isLoading, isAuthenticated, req])

  const handleApprove = useCallback(async () => {
    if (!req) return
    setState('approving')
    try {
      await authClient.acceptConnection({
        codeChallenge: req.codeChallenge!,
        codeChallengeMethod: req.codeChallengeMethod!,
        state: req.state ?? undefined,
        oauthClientId: req.oauthClientId ?? undefined,
      })
      setState('done')
    } catch {
      setError('Authorization failed. Please try again.')
      setState('error')
    }
  }, [req])

  const handleDeny = useCallback(async () => {
    if (!req) return
    setState('denying')
    try {
      await authClient.rejectConnection({
        codeChallenge: req.codeChallenge!,
        codeChallengeMethod: req.codeChallengeMethod!,
        state: req.state ?? undefined,
        oauthClientId: req.oauthClientId ?? undefined,
      })
      setState('done')
    } catch {
      setState('error')
    }
  }, [req])

  return (
    <WalletShell>
      {state === 'loading' && <Spinner label="Loading..." />}

      {state === 'login_required' && (
        <div>
          <p className="text-gray-400 text-sm mb-6">
            <span className="text-white font-medium">{requesterHost}</span> wants to sign you in
            using your CrimsonARB identity.
          </p>
          <ActionButton onClick={login} label="Sign in with Google" variant="primary" />
        </div>
      )}

      {state === 'awaiting_approval' && (
        <div>
          {displayEmail && <InfoRow label="Signing in as" value={displayEmail} />}
          <InfoRow label="Authorizing" value={requesterHost} />

          <div className="space-y-2 my-5">
            <Permission granted text="Share email address" />
            <Permission granted text="Share wallet address" />
            <Permission granted={false} text="Access funds or sign transactions" />
          </div>

          <div className="flex gap-3">
            <ActionButton onClick={handleApprove} label="Authorize" variant="primary" />
            <ActionButton onClick={handleDeny} label="Cancel" variant="ghost" />
          </div>
        </div>
      )}

      {(state === 'approving' || state === 'denying') && (
        <Spinner label={state === 'approving' ? 'Authorizing...' : 'Cancelling...'} />
      )}

      {state === 'done' && (
        <SuccessDisplay title="Authorized" subtitle="You can close this window." />
      )}

      {state === 'error' && <ErrorDisplay message={error || 'An error occurred.'} />}
    </WalletShell>
  )
}
