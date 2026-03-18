import { PrivyProvider } from '@/components/providers/privy-provider'

export const metadata = {
  title: 'CrimsonARB Wallet',
  robots: 'noindex,nofollow',
}

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body className="bg-[#0A0F1E] min-h-screen flex items-center justify-center p-4">
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  )
}
