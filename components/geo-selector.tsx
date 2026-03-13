"use client"

import { useState, useRef, useEffect } from "react"
import { useGeo } from "@/lib/use-geo"
import type { GeoRegion } from "@/lib/seo-config"

const REGION_FLAGS: Record<string, string> = {
  global: "🌐",
  us: "🇺🇸",
  uk: "🇬🇧",
  sg: "🇸🇬",
  hk: "🇭🇰",
  ae: "🇦🇪",
  de: "🇩🇪",
  jp: "🇯🇵",
  cn: "🇨🇳",
  kr: "🇰🇷",
}

export function GeoSelector() {
  const { geoData, isLoading, setRegion } = useGeo()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (isLoading || !geoData) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="h-4 w-4 animate-pulse rounded bg-muted"></span>
        <span>Loading...</span>
      </div>
    )
  }

  const currentFlag = REGION_FLAGS[geoData.activeRegion] || "🌐"
  const currentName = geoData.regionInfo.name

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-crimson/50 hover:text-foreground transition-colors"
        aria-label="Select region"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm" role="img" aria-label={currentName}>
          {currentFlag}
        </span>
        <span>{currentName}</span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-card/95 backdrop-blur-xl shadow-lg shadow-black/20"
          role="listbox"
          aria-label="Available regions"
        >
          <div className="p-1">
            {geoData.availableRegions.map((region) => {
              const isActive = region.key === geoData.activeRegion
              return (
                <button
                  key={region.key}
                  onClick={() => {
                    setRegion(region.key as GeoRegion)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-crimson/20 text-crimson"
                      : "text-foreground hover:bg-muted"
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="text-base" role="img" aria-label={region.name}>
                    {REGION_FLAGS[region.key] || "🌐"}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-xs text-muted-foreground">{region.currency}</span>
                  </div>
                  {isActive && (
                    <svg
                      className="ml-auto h-4 w-4 text-crimson"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Detected location info */}
          <div className="border-t border-border px-3 py-2">
            <p className="text-[10px] text-muted-foreground">
              Detected: {geoData.detected.city ? `${geoData.detected.city}, ` : ""}
              {geoData.detected.country}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
