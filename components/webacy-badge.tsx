'use client'

interface WebacyBadgeProps {
  score?: number           // 0-100
  riskLevel?: string
  variant?: 'full' | 'compact' | 'icon'
  showScore?: boolean
  animated?: boolean       // pulse when screening
}

const RISK_COLORS: Record<string, string> = {
  SAFE: '#10B981',      // emerald
  LOW: '#6EE7B7',       // light emerald
  MEDIUM: '#F59E0B',    // amber
  HIGH: '#EF4444',      // red
  CRITICAL: '#DC2626',  // crimson
}

export function WebacyBadge({
  score,
  riskLevel = 'SAFE',
  variant = 'compact',
  showScore = true,
  animated = false,
}: WebacyBadgeProps) {
  const riskColor = RISK_COLORS[riskLevel] || '#10B981'

  // ICON ONLY — for decision cards, table cells
  if (variant === 'icon') {
    return (
      <span
        title={`Webacy DD.xyz — ${riskLevel}${score ? ` (${score}/100)` : ''}`}
        className={`inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded border ${animated ? 'animate-pulse' : ''}`}
        style={{
          color: riskColor,
          borderColor: `${riskColor}40`,
          backgroundColor: `${riskColor}10`,
        }}
      >
        <span>DD</span>
        {showScore && score !== undefined && (
          <span className="font-bold">{score}</span>
        )}
      </span>
    )
  }

  // COMPACT — for decision feed rows
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 border ${animated ? 'animate-pulse' : ''}`}
        style={{
          backgroundColor: `${riskColor}08`,
          borderColor: `${riskColor}30`,
        }}
      >
        <span className="text-gray-500">DD</span>
        {showScore && score !== undefined && (
          <>
            <span className="font-mono font-bold" style={{ color: riskColor }}>
              {score}/100
            </span>
            <span className="text-xs" style={{ color: riskColor }}>
              {riskLevel}
            </span>
          </>
        )}
      </div>
    )
  }

  // FULL — for /judges page, /transparency, hero sections
  return (
    <div
      className={`rounded-xl border p-4 ${animated ? 'animate-pulse' : ''}`}
      style={{
        backgroundColor: `${riskColor}06`,
        borderColor: `${riskColor}25`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${riskColor}20`, color: riskColor }}>
            DD
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Webacy DD.xyz</div>
            <div className="text-gray-500 text-xs">Third-Party Risk Intelligence</div>
          </div>
        </div>
        <a
          href="https://dd.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          dd.xyz
        </a>
      </div>

      {/* Score display */}
      {score !== undefined && (
        <div className="flex items-center gap-3 mb-3">
          {/* Score ring — SVG */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={riskColor}
                strokeWidth="3"
                strokeDasharray={`${score} ${100 - score}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold font-mono" style={{ color: riskColor }}>{score}</span>
            </div>
          </div>

          <div>
            <div className="font-bold text-lg font-mono" style={{ color: riskColor }}>{riskLevel}</div>
            <div className="text-gray-500 text-xs">DD Score: {score}/100</div>
          </div>
        </div>
      )}

      {/* Footer badge */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-gray-800">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor }} />
        <span className="text-gray-600 text-xs">Powered by Webacy DD.xyz</span>
      </div>
    </div>
  )
}

// Standalone "Secured By" footer badge for pages
export function WebacySecuredBadge() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">DD</div>
      <span>Risk intelligence by</span>
      <a
        href="https://dd.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-300 font-medium transition-colors"
      >
        Webacy DD.xyz
      </a>
    </div>
  )
}

// Status indicator for system status panels
export function WebacyStatusIndicator({ connected = true }: { connected?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-500 text-sm">Webacy DD.xyz</span>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-600'}`} />
        <span className={`text-sm font-mono ${connected ? 'text-emerald-400' : 'text-gray-600'}`}>
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </span>
      </div>
    </div>
  )
}
