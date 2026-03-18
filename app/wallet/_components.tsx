'use client'

import { ReactNode } from 'react'

export function WalletShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-[#DC2626] font-mono font-bold text-lg tracking-widest mb-1">
          CRIMSON ARB
        </div>
        <div className="text-xs text-gray-600">Bayou City Blockchain LLC</div>
      </div>

      {/* Card */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl">
        {children}
      </div>

      {/* Footer */}
      <div className="text-center mt-5 space-y-1">
        <div className="text-xs text-gray-700">Secured by Privy</div>
        <div className="text-xs text-gray-800">
          {process.env.NEXT_PUBLIC_WALLET_DOMAIN || 'crimsonarb.com'}
        </div>
      </div>
    </div>
  )
}

export function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="bg-gray-900/60 rounded-xl p-4 mb-3 border border-gray-800">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-sm text-gray-200 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</div>
    </div>
  )
}

export function Permission({ granted, text }: { granted: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className={granted ? 'text-emerald-400' : 'text-red-500'}>{granted ? '✓' : '✗'}</span>
      <span className={granted ? 'text-gray-300' : 'text-gray-500'}>{text}</span>
    </div>
  )
}

export function ActionButton({
  onClick,
  label,
  variant,
  disabled = false,
}: {
  onClick: () => void
  label: string
  variant: 'primary' | 'ghost'
  disabled?: boolean
}) {
  const base = 'flex-1 py-3 rounded-xl font-semibold text-sm transition-all min-h-[48px]'
  const styles = {
    primary: `${base} bg-[#DC2626] hover:bg-red-700 text-white disabled:opacity-50`,
    ghost: `${base} bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50`,
  }
  return (
    <button onClick={onClick} className={styles[variant]} disabled={disabled}>
      {label}
    </button>
  )
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="text-center py-4">
      <div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

export function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-3">&#9888;</div>
      <p className="text-[#DC2626] text-sm">{message}</p>
    </div>
  )
}

export function SuccessDisplay({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-3">&#10003;</div>
      <p className="text-white font-semibold">{title}</p>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  )
}
