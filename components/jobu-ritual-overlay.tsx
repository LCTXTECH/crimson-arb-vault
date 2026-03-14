"use client"

import { useState, useEffect, useCallback } from "react"
import { offerRum, getJobuWisdom } from "@/lib/drift/faucet"

interface JobuRitualOverlayProps {
  walletAddress?: string
}

export function JobuRitualOverlay({ walletAddress }: JobuRitualOverlayProps) {
  const [isActive, setIsActive] = useState(false)
  const [jobuMessage, setJobuMessage] = useState("")
  const [isOfferingRum, setIsOfferingRum] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [confidenceOverride, setConfidenceOverride] = useState(false)
  const [keySequence, setKeySequence] = useState("")

  // Listen for "JOBU" keyboard sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key.toUpperCase()).slice(-4)
      setKeySequence(newSequence)
      
      if (newSequence === "JOBU") {
        activateJobuMode()
        setKeySequence("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keySequence])

  const activateJobuMode = useCallback(() => {
    setIsActive(true)
    setJobuMessage("Sentry is taking fear from the bats. Alpha capture initiated.")
    setConfidenceOverride(true)
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (!isOfferingRum) {
        setIsActive(false)
        setConfidenceOverride(false)
      }
    }, 30000)
  }, [isOfferingRum])

  const handleOfferRum = async () => {
    if (!walletAddress) {
      setToastMessage("Connect wallet to offer rum to Jobu")
      setTimeout(() => setToastMessage(null), 3000)
      return
    }

    setIsOfferingRum(true)
    const result = await offerRum(walletAddress)
    
    setJobuMessage(result.message)
    setToastMessage(result.success 
      ? "Jobu thanks you for the rum. Gas fees replenished." 
      : "Jobu is displeased. Try again later."
    )
    
    setTimeout(() => {
      setToastMessage(null)
      setIsOfferingRum(false)
    }, 4000)
  }

  const getRandomWisdom = () => {
    setJobuMessage(getJobuWisdom())
  }

  if (!isActive) return null

  return (
    <>
      {/* Ritual Overlay Background */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23422006' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          opacity: 0.9,
        }}
      />

      {/* Jobu Panel */}
      <div className="fixed bottom-24 right-6 z-50 w-80 pointer-events-auto">
        <div 
          className="rounded-xl border-2 border-amber-600/50 bg-gradient-to-b from-amber-950/95 to-stone-950/95 p-4 shadow-2xl backdrop-blur-sm"
          style={{
            boxShadow: "0 0 40px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Header with Jobu Icon */}
          <div className="flex items-center gap-3 mb-4">
            {/* 8-bit Style Jobu Icon */}
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-2xl animate-pulse"
                style={{ 
                  imageRendering: "pixelated",
                  boxShadow: "0 0 20px rgba(217, 119, 6, 0.5)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-200" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5v9z"/>
                </svg>
              </div>
              {/* Confidence 101% Badge */}
              {confidenceOverride && (
                <div className="absolute -top-2 -right-2 bg-crimson text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  101%
                </div>
              )}
            </div>
            <div>
              <h3 className="text-amber-400 font-bold text-sm tracking-wide">DIGITAL JOBU</h3>
              <p className="text-amber-600/80 text-xs">Sentry Protocol Active</p>
            </div>
            <button 
              onClick={() => setIsActive(false)}
              className="ml-auto text-amber-600/50 hover:text-amber-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Jobu's Message */}
          <div className="bg-stone-900/80 rounded-lg p-3 mb-4 border border-amber-900/30">
            <p className="text-amber-100/90 text-sm italic leading-relaxed">
              "{jobuMessage}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleOfferRum}
              disabled={isOfferingRum}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium py-2 px-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isOfferingRum ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Offering...
                </>
              ) : (
                <>
                  <span className="text-lg">🥃</span>
                  Offer Rum
                </>
              )}
            </button>
            <button
              onClick={getRandomWisdom}
              className="flex items-center justify-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-400 font-medium py-2 px-3 rounded-lg transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Wisdom
            </button>
          </div>

          {/* Footer */}
          <p className="text-amber-700/60 text-xs mt-3 text-center">
            Type "JOBU" to summon • Bayou City Blockchain
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-amber-900/95 border border-amber-600/50 text-amber-100 px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm flex items-center gap-3">
            <span className="text-xl">🥃</span>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hex Grid Pulse Effect - Applied via CSS class */}
      <style jsx global>{`
        .jobu-active .hex-cell {
          animation: jobu-pulse 2s ease-in-out infinite;
        }
        @keyframes jobu-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(217, 119, 6, 0.3); }
          50% { box-shadow: 0 0 25px rgba(217, 119, 6, 0.6); }
        }
      `}</style>
    </>
  )
}
