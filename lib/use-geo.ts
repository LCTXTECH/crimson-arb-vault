"use client"

import { useState, useEffect, useCallback } from "react"
import { GEO_REGIONS, GEO_CONTENT, type GeoRegion } from "./seo-config"

interface GeoData {
  detected: {
    country: string
    city: string
    region: string
  }
  activeRegion: GeoRegion
  regionInfo: (typeof GEO_REGIONS)[GeoRegion]
  content: (typeof GEO_CONTENT)[GeoRegion]
  availableRegions: Array<{
    key: string
    code: string
    name: string
    currency: string
  }>
}

interface UseGeoReturn {
  geoData: GeoData | null
  isLoading: boolean
  error: Error | null
  setRegion: (region: GeoRegion) => Promise<void>
}

export function useGeo(): UseGeoReturn {
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch geo data on mount
  useEffect(() => {
    async function fetchGeoData() {
      try {
        const response = await fetch("/api/geo")
        if (!response.ok) throw new Error("Failed to fetch geo data")
        const data = await response.json()
        setGeoData(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        // Fallback to global region
        setGeoData({
          detected: { country: "US", city: "", region: "" },
          activeRegion: "global",
          regionInfo: GEO_REGIONS.global,
          content: GEO_CONTENT.global,
          availableRegions: Object.entries(GEO_REGIONS).map(([key, value]) => ({
            key,
            ...value,
          })),
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  // Set region preference
  const setRegion = useCallback(async (region: GeoRegion) => {
    try {
      const response = await fetch("/api/geo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region }),
      })

      if (!response.ok) throw new Error("Failed to set region")

      const data = await response.json()
      setGeoData((prev) =>
        prev
          ? {
              ...prev,
              activeRegion: region,
              regionInfo: data.regionInfo,
              content: data.content,
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    }
  }, [])

  return { geoData, isLoading, error, setRegion }
}
