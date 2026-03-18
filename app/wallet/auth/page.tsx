'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
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
  const { ready, authenticated, user, login } = usePrivy()
  const [state, setState] = useState<PageState>('loading')
  const [req, setReq] = useState<any>(null)
  const [requesterHost, setRequesterHost] = useState<string>('An app')
  const [error, setError] = useState<string | null>(null)

  const displayEmail = user?.google?.email || user?.email?.address || null

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
        } catch {}
      }
    } catch {
      setError('Could not parse auth request.')
      setState('error')
    }
  }, [])

  useEffect(() => {
    if (!ready || !req) return
    setState(authenticated ? 'awaiting_approval' : 'login_required')
  }, [ready, authenticated, req])

  const handleApprove = useCallback(async () => {
    if (!req || !user) return
    setState('approving')
    try {
      const accessToken = await user.getAccessToken?.()
      await authClient.acceptConnection({
        accessToken,
        codeChallenge: req.codeChallenge!,
        codeChallengeMethod: req.codeChallengeMethod!,
        state: req.state,
        oauthClientId: req.oauthClientId,
      })
      setState('done')
    } catch {
      setError('Authorization failed. Please try again.')
      setState('error')
    }
  }, [req, user])

  const handleDeny = useCallback(async () => {
    if (!req || !user) return
    setState('denying')
    try {
      const accessToken = await user.getAccessToken?.()
      await authClient.rejectConnection({
        accessToken,
        codeChallenge: req.codeChallenge!,
        codeChallengeMethod: req.codeChallengeMethod!,
        state: req.state,
        oauthClientId: req.oauthClientId,
      })
      setState('done')
    } catch {
      setState('error')
    }
  }, [req, user])

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
