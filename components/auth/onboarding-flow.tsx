'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

type OnboardingStep = 'welcome' | 'fund' | 'vault'

export function OnboardingFlow() {
  const { user, walletAddress, isAuthenticated } = useAuth()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [show, setShow] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const isNewUser = new Date(user.createdAt) > new Date(Date.now() - 5 * 60 * 1000) // 5 min

    if (isNewUser && user.depositedUsdc === 0) {
      setShow(true)
    }
  }, [isAuthenticated, user])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-destructive/30 rounded-2xl max-w-lg w-full p-8">
        {/* Step indicators */}
        <div className="flex gap-2 mb-8">
          {(['welcome', 'fund', 'vault'] as const).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                step === s || ['welcome', 'fund', 'vault'].indexOf(step) > i ? 'bg-destructive' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {step === 'welcome' && (
          <WelcomeStep
            walletAddress={walletAddress}
            displayName={user?.displayName}
            isFounder={user?.isFounder}
            onNext={() => setStep('fund')}
          />
        )}

        {step === 'fund' && (
          <FundingStep walletAddress={walletAddress} onNext={() => setStep('vault')} onSkip={() => setStep('vault')} />
        )}

        {step === 'vault' && (
          <VaultIntroStep
            isFounder={user?.isFounder}
            onComplete={() => {
              setShow(false)
              router.push('/dashboard')
            }}
          />
        )}
      </div>
    </div>
  )
}

function WelcomeStep({
  walletAddress,
  displayName,
  isFounder,
  onNext,
}: {
  walletAddress: string | null
  displayName?: string
  isFounder?: boolean
  onNext: () => void
}) {
  return (
    <div>
      <div className="text-center mb-6">
        {isFounder && (
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1 rounded-full mb-4">
            Sentry OG - Founder Access
          </div>
        )}
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome, {displayName?.split(' ')[0] || 'there'}.</h2>
        <p className="text-muted-foreground">Your Solana wallet was created automatically. You don&apos;t need to manage it.</p>
      </div>

      {/* Wallet display */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-border">
        <div className="text-xs text-muted-foreground mb-1">Your Vault Wallet</div>
        <div className="font-mono text-sm text-foreground flex items-center justify-between">
          <span>{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}` : 'Creating...'}</span>
          <button
            onClick={() => navigator.clipboard.writeText(walletAddress || '')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="text-xs text-muted-foreground/60 mt-2">Secured by Privy. You control this wallet.</div>
      </div>

      {isFounder && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
          <div className="text-amber-400 font-semibold text-sm mb-1">Founder Status Confirmed</div>
          <div className="text-muted-foreground text-sm">
            You&apos;re on the founders waitlist. When the vault launches, your performance fee is permanently 0%. Forever.
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full bg-destructive hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all min-h-[44px]"
      >
        Set Up Your Vault
      </button>
    </div>
  )
}

function FundingStep({
  walletAddress,
  onNext,
  onSkip,
}: {
  walletAddress: string | null
  onNext: () => void
  onSkip: () => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-2">Add USDC to start earning</h2>
      <p className="text-muted-foreground text-sm mb-6">CrimsonARB earns yield in USDC. Choose how you want to fund your vault.</p>

      {/* Option A - MoonPay */}
      <button
        onClick={() => {
          window.open(`https://buy.moonpay.com?walletAddress=${walletAddress}&currencyCode=usdc_sol`, '_blank')
          onNext()
        }}
        className="w-full bg-muted/30 hover:bg-muted/50 border border-border hover:border-destructive/50 rounded-xl p-4 mb-3 text-left transition-all min-h-[44px]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-foreground font-medium">Buy USDC with card or bank</div>
            <div className="text-muted-foreground text-sm mt-0.5">Visa, Mastercard, Apple Pay, ACH transfer</div>
          </div>
          <div className="text-muted-foreground">&rarr;</div>
        </div>
      </button>

      {/* Option B - Transfer */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(walletAddress || '')
          onNext()
        }}
        className="w-full bg-muted/30 hover:bg-muted/50 border border-border hover:border-destructive/50 rounded-xl p-4 mb-3 text-left transition-all min-h-[44px]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-foreground font-medium">Transfer from exchange or wallet</div>
            <div className="text-muted-foreground text-sm mt-0.5">Coinbase, Kraken, Phantom - send USDC on Solana</div>
          </div>
          <div className="text-muted-foreground">&rarr;</div>
        </div>
      </button>

      {/* Skip */}
      <button onClick={onSkip} className="w-full text-muted-foreground hover:text-foreground py-3 text-sm transition-colors min-h-[44px]">
        I&apos;ll fund later - show me the vault
      </button>
    </div>
  )
}

function VaultIntroStep({ isFounder, onComplete }: { isFounder?: boolean; onComplete: () => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-2">Your vault is ready.</h2>
      <p className="text-muted-foreground text-sm mb-6">The Sentry Brain is monitoring SOL, BTC, and ETH funding rates right now.</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 text-sm">
          <span className="text-emerald-400 mt-0.5">&#10003;</span>
          <div>
            <span className="text-foreground">Every trade decision documented</span>
            <div className="text-muted-foreground">You can audit every EXECUTE, SKIP, and GUARD.</div>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <span className="text-emerald-400 mt-0.5">&#10003;</span>
          <div>
            <span className="text-foreground">AgentSentry screens every execution</span>
            <div className="text-muted-foreground">Circuit-breaker fires before capital moves.</div>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <span className="text-emerald-400 mt-0.5">&#10003;</span>
          <div>
            <span className="text-foreground">{isFounder ? '0% performance fee - forever' : 'Withdraw anytime'}</span>
            <div className="text-muted-foreground">
              {isFounder ? 'Founder status confirmed. No fees. Ever.' : 'No lockups. Your capital stays yours.'}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-destructive hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all min-h-[44px]"
      >
        Open My Dashboard
      </button>
    </div>
  )
}
