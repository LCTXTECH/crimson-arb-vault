"use client"

import Link from "next/link"
import { useState } from "react"

interface SiteHeaderProps {
  region?: string
  onGetStarted?: () => void
}

function CrimsonArbLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
      {/* Outer flame/C shape */}
      <path
        d="M20 4C11.16 4 4 11.16 4 20c0 8.84 7.16 16 16 16 4.42 0 8.42-1.8 11.32-4.68"
        stroke="var(--crimson)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner flame accent */}
      <path
        d="M28 8c2.5 3 4 7 4 12 0 2-0.3 3.9-0.9 5.7"
        stroke="var(--crimson)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye shape */}
      <ellipse cx="18" cy="20" rx="6" ry="4" stroke="var(--crimson)" strokeWidth="2" fill="none" />
      {/* Eye pupil */}
      <circle cx="18" cy="20" r="1.5" fill="var(--crimson)" />
      {/* Flame tip */}
      <path
        d="M30 6c1 2 1.5 4 1.5 6"
        stroke="var(--crimson)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SiteHeader({ region, onGetStarted }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const basePath = region ? `/${region}` : ""

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href={basePath || "/"} className="flex items-center gap-3 group">
          <CrimsonArbLogo />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-crimson transition-colors">
              CrimsonArb
            </span>
            {region && (
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {region}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href={`${basePath}/vault`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Vault
          </Link>
          <Link 
            href={`${basePath}/analytics`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Analytics
          </Link>
          <div className="relative group">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Markets
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link href="/markets/sol-perp" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                SOL-PERP
              </Link>
              <Link href="/markets/btc-perp" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                BTC-PERP
              </Link>
              <Link href="/markets/eth-perp" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                ETH-PERP
              </Link>
              <Link href="/markets/jto-perp" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                JTO-PERP
              </Link>
              <Link href="/markets/wif-perp" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                WIF-PERP
              </Link>
            </div>
          </div>
          <Link 
            href={`${basePath}/docs`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* CTA + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onGetStarted}
            className="hidden sm:flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col p-4 gap-4">
            <Link href={`${basePath}/vault`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Vault
            </Link>
            <Link href={`${basePath}/analytics`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Analytics
            </Link>
            <Link href="/markets/sol-perp" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              SOL-PERP Market
            </Link>
            <Link href="/markets/btc-perp" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              BTC-PERP Market
            </Link>
            <Link href={`${basePath}/docs`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <button
              onClick={onGetStarted}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson-dark transition-colors"
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
