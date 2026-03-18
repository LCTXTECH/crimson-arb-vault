'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { ReactNode } from 'react'

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
})

export function PrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId) {
    console.warn('[v0] NEXT_PUBLIC_PRIVY_APP_ID not set - auth disabled')
    return <>{children}</>
  }

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#DC2626',
          logo: 'https://crimsonarb.com/logo.png',
          landingHeader: 'Access Your Yield Vault',
          loginMessage: 'Sign in to start earning with the Sentry Brain',
          showWalletLoginFirst: false,
        },
        loginMethods: ['google', 'email', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users',
          noPromptOnSignature: false,
          requireUserPasswordOnCreate: false,
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        solanaClusters: [
          {
            name: process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'mainnet-beta' : 'devnet',
            rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
          },
        ],
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
