'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { connectClient } from '@/lib/wallet-client'
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

export default function WalletConnectPage() {
  const { isAuthenticated, isLoading, walletAddress, login, user } = useAuth()
  const [state, setState] = useState<PageState>('loading')
  const [connectionRequest, setConnectionRequest] = useState<ReturnType<typeof connectClient.getConnectionRequestFromUrlParams>>(null)
  const [requesterHost, setRequesterHost] = useState<string>('An app')
  const [error, setError] = useState<string | null>(null)

  const address = walletAddress
  const short = address ? `${address.slice(0, 6)}...${address.slice(-6)}` : null

  // Parse connection request on mount
  useEffect(() => {
    try {
      const req = connectClient.getConnectionRequestFromUrlParams()
      if (!req) {
        setError('Invalid connection request.')
        setState('error')
        return
      }
      setConnectionRequest(req)
      if (req.callbackUrl) {
        try {
          setRequesterHost(new URL(req.callbackUrl).hostname)
        } catch {
          // Invalid URL, keep default
        }
      }
    } catch {
      setError('Could not parse connection request.')
      setState('error')
    }
  }, [])

  // Update page state when auth state settles
  useEffect(() => {
    if (isLoading || !connectionRequest) return
    if (isAuthenticated) {
      setState('awaiting_approval')
    } else {
      setState('login_required')
    }
  }, [isLoading, isAuthenticated, connectionRequest])

  const handleApprove = useCallback(async () => {
    if (!connectionRequest || !address) return
    setState('approving')
    try {
      await connectClient.acceptConnection({
        address,
        userId: user?.privyId || 'unknown',
        connectionRequest,
      })
      setState('done')
    } catch {
      setError('Connection failed. Please try again.')
      setState('error')
    }
  }, [connectionRequest, user, address])

  const handleDeny = useCallback(async () => {
    if (!connectionRequest) return
    setState('denying')
    try {
      await connectClient.rejectConnection({
        callbackUrl: connectionRequest.callbackUrl,
      })
      setState('done')
    } catch {
      setState('error')
    }
  }, [connectionRequest])

  return (
    <WalletShell>
      {state === 'loading' && <Spinner label="Loading..." />}

      {state === 'login_required' && (
        <div>
          <p className="text-gray-400 text-sm mb-2">
            <span className="text-white font-medium">{requesterHost}</span> wants to connect to your
            vault wallet.
          </p>
          <p className="text-gray-500 text-xs mb-6">Sign in to approve or deny this request.</p>
          <ActionButton onClick={login} label="Sign in with Google" variant="primary" />
        </div>
      )}

      {state === 'awaiting_approval' && (
        <div>
          <InfoRow label="Requesting app" value={requesterHost} />
          {short && <InfoRow label="Your vault wallet" value={short} mono />}

          <div className="space-y-2 my-5">
            <Permission granted text="View wallet address" />
            <Permission granted text="Request signatures" />
            <Permission granted={false} text="Move funds without approval" />
          </div>

          <div className="flex gap-3">
            <ActionButton onClick={handleApprove} label="Connect" variant="primary" />
            <ActionButton onClick={handleDeny} label="Deny" variant="ghost" />
          </div>
        </div>
      )}

      {(state === 'approving' || state === 'denying') && (
        <Spinner label={state === 'approving' ? 'Connecting...' : 'Declining...'} />
      )}

      {state === 'done' && <SuccessDisplay title="Done" subtitle="You can close this window." />}

      {state === 'error' && <ErrorDisplay message={error || 'An error occurred.'} />}
    </WalletShell>
  )
}
