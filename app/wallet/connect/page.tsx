'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth'
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
  const { ready, authenticated, user, login } = usePrivy()
  const { wallets } = useSolanaWallets()
  const [state, setState] = useState<PageState>('loading')
  const [connectionRequest, setConnectionRequest] = useState<any>(null)
  const [requesterHost, setRequesterHost] = useState<string>('An app')
  const [error, setError] = useState<string | null>(null)

  const primaryWallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0]
  const address = primaryWallet?.address
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
        setRequesterHost(new URL(req.callbackUrl).hostname)
      }
    } catch {
      setError('Could not parse connection request.')
      setState('error')
    }
  }, [])

  // Update page state when auth state settles
  useEffect(() => {
    if (!ready || !connectionRequest) return
    if (authenticated) {
      setState('awaiting_approval')
    } else {
      setState('login_required')
    }
  }, [ready, authenticated, connectionRequest])

  const handleApprove = useCallback(async () => {
    if (!connectionRequest || !user || !address) return
    setState('approving')
    try {
      const accessToken = await user.getAccessToken?.()
      await connectClient.acceptConnection({
        accessToken,
        address,
        userId: user.id,
        connectionRequest,
      })
      setState('done')
    } catch (e) {
      setError('Connection failed. Please try again.')
      setState('error')
    }
  }, [connectionRequest, user, address])

  const handleDeny = useCallback(async () => {
    if (!connectionRequest || !user) return
    setState('denying')
    try {
      const accessToken = await user.getAccessToken?.()
      await connectClient.rejectConnection({
        accessToken,
        callbackUrl: connectionRequest.callbackUrl,
      })
      setState('done')
    } catch {
      setState('error')
    }
  }, [connectionRequest, user])

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
