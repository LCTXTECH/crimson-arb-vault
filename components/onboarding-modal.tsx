"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/use-auth"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: () => void
  onClose: () => void
}

type OnboardingStep = 1 | 2 | 3

const STEPS = [
  { id: 1, title: "Secure Login", description: "Connect with your preferred provider" },
  { id: 2, title: "Create Your Institutional Vault", description: "Setting up your secure trading environment" },
  { id: 3, title: "Enable Sentry Shield", description: "Delegate trading authority to the AI" },
] as const

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WalletAnimation({ isActive }: { isActive: boolean }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4)
    }, 400)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Wallet base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`relative transition-all duration-300 ${isActive ? "scale-100" : "scale-90 opacity-50"}`}
        >
          {/* Wallet body */}
          <div className="w-24 h-16 bg-muted rounded-lg border-2 border-crimson/50 relative overflow-hidden">
            {/* Shimmer effect */}
            {isActive && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-crimson/20 to-transparent"
                style={{
                  transform: `translateX(${(frame - 2) * 50}%)`,
                  transition: "transform 0.3s ease-out",
                }}
              />
            )}
            {/* Wallet flap */}
            <div 
              className={`absolute -top-1 left-2 right-2 h-5 bg-card border-2 border-crimson/50 rounded-t-lg transition-transform duration-300 origin-bottom ${
                isActive && frame % 2 === 0 ? "-rotate-12" : "rotate-0"
              }`}
            />
          </div>
          
          {/* Floating coins/tokens */}
          {isActive && (
            <>
              <div 
                className={`absolute -top-4 -right-2 w-4 h-4 bg-crimson rounded-full transition-all duration-300 ${
                  frame === 0 ? "opacity-100 translate-y-0" : 
                  frame === 1 ? "opacity-80 -translate-y-2" : 
                  frame === 2 ? "opacity-40 -translate-y-4" : "opacity-0 -translate-y-6"
                }`}
              />
              <div 
                className={`absolute -top-6 left-0 w-3 h-3 bg-[#00FF88] rounded-full transition-all duration-300 delay-100 ${
                  frame === 1 ? "opacity-100 translate-y-0" : 
                  frame === 2 ? "opacity-80 -translate-y-2" : 
                  frame === 3 ? "opacity-40 -translate-y-4" : "opacity-0 -translate-y-6"
                }`}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Loading ring */}
      {isActive && (
        <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "3s" }}>
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="var(--crimson)"
            strokeWidth="2"
            strokeDasharray="100 265"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      )}
    </div>
  )
}

function SentryShieldIcon({ enabled }: { enabled: boolean }) {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Shield outline */}
        <path
          d="M50 10 L85 25 L85 50 Q85 75 50 90 Q15 75 15 50 L15 25 Z"
          fill="none"
          stroke={enabled ? "var(--crimson)" : "var(--border)"}
          strokeWidth="3"
          className="transition-all duration-500"
        />
        {/* Shield fill */}
        <path
          d="M50 15 L80 28 L80 50 Q80 72 50 85 Q20 72 20 50 L20 28 Z"
          fill={enabled ? "var(--crimson)" : "var(--muted)"}
          className="transition-all duration-500"
          opacity={enabled ? 0.2 : 0.5}
        />
        {/* Eye */}
        <ellipse
          cx="50"
          cy="48"
          rx={enabled ? 18 : 12}
          ry={enabled ? 10 : 6}
          fill="none"
          stroke={enabled ? "var(--crimson)" : "var(--muted-foreground)"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <circle
          cx="50"
          cy="48"
          r={enabled ? 5 : 3}
          fill={enabled ? "var(--crimson)" : "var(--muted-foreground)"}
          className="transition-all duration-500"
        />
        {/* Checkmark (when enabled) */}
        {enabled && (
          <path
            d="M38 65 L46 73 L62 57"
            fill="none"
            stroke="var(--success)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        )}
      </svg>
      {/* Glow effect */}
      {enabled && (
        <div className="absolute inset-0 bg-crimson/20 rounded-full blur-xl animate-pulse" />
      )}
    </div>
  )
}

export function OnboardingModal({ isOpen, onComplete, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [walletCreating, setWalletCreating] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [sentryEnabled, setSentryEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signIn, authenticated, user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // If user is already authenticated, skip to step 2
  useEffect(() => {
    if (authenticated && user && currentStep === 1) {
      setCurrentStep(2)
      setWalletCreating(true)
      setTimeout(() => {
        setWalletCreating(false)
        setWalletCreated(true)
      }, 2000)
    }
  }, [authenticated, user, currentStep])

  if (!isOpen || !mounted) return null

  const handleSocialLogin = (provider: "google" | "x") => {
    setIsLoading(true)
    // Redirect to OAuth flow
    signIn(provider)
  }

  const handleCreateVault = () => {
    if (walletCreated) {
      setCurrentStep(3)
    }
  }

  const handleEnableSentry = () => {
    setSentryEnabled(true)
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  const handleSkipSentry = () => {
    onComplete()
  }

  const progressPercent = ((currentStep - 1) / 2) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-crimson to-crimson-dark transition-all duration-500 ease-out"
            style={{ width: `${progressPercent + 33}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3 pt-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-medium transition-all duration-300 ${
                currentStep === step.id
                  ? "border-crimson bg-crimson/20 text-crimson"
                  : currentStep > step.id
                  ? "border-[#00FF88] bg-[#00FF88]/20 text-[#00FF88]"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Secure Login */}
          {currentStep === 1 && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Secure Login</h2>
                <p className="text-sm text-muted-foreground">
                  Connect with your preferred provider to get started
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin("x")}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-lg bg-muted border border-border text-foreground font-medium hover:bg-muted/80 hover:border-crimson/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XIcon />
                  <span>Continue with X</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}

          {/* Step 2: Create Vault */}
          {currentStep === 2 && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Create Your Institutional Vault
                </h2>
                <p className="text-sm text-muted-foreground">
                  {walletCreating 
                    ? "Generating your secure trading wallet..."
                    : walletCreated
                    ? "Your vault is ready!"
                    : "Setting up your secure trading environment"
                  }
                </p>
              </div>

              <WalletAnimation isActive={walletCreating} />

              {walletCreated && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-[#00FF88]/30">
                    <div className="flex items-center gap-2 text-[#00FF88] text-sm font-medium mb-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Vault Created Successfully
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      0x7F4d...8E9c
                    </p>
                  </div>

                  <button
                    onClick={handleCreateVault}
                    className="w-full h-12 rounded-lg bg-crimson text-white font-medium hover:bg-crimson-dark transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              {walletCreating && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
                  Initializing secure enclave...
                </div>
              )}
            </div>
          )}

          {/* Step 3: Enable Sentry Shield */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Enable Sentry Shield
                </h2>
                <p className="text-sm text-muted-foreground">
                  Delegate trading authority to the AI for automated basis trading
                </p>
              </div>

              <SentryShieldIcon enabled={sentryEnabled} />

              <div className="space-y-4">
                {/* Toggle switch */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">AI Trading Authority</p>
                    <p className="text-xs text-muted-foreground">Allow Sentry to execute trades</p>
                  </div>
                  <button
                    onClick={() => setSentryEnabled(!sentryEnabled)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      sentryEnabled ? "bg-crimson" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        sentryEnabled ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {sentryEnabled && (
                  <div className="p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-left">
                    <p className="text-xs text-crimson">
                      Sentry Shield will monitor markets 24/7 and execute delta-neutral basis trades within your risk parameters.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSkipSentry}
                    className="flex-1 h-12 rounded-lg border border-border text-muted-foreground font-medium hover:border-crimson/50 hover:text-foreground transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={handleEnableSentry}
                    disabled={!sentryEnabled}
                    className="flex-1 h-12 rounded-lg bg-crimson text-white font-medium hover:bg-crimson-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
