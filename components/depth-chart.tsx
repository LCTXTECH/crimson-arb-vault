"use client"

import { useState, useEffect, useMemo } from "react"

interface OrderLevel {
  price: number
  size: number
  cumulative: number
}

interface DepthChartProps {
  symbol?: string
  sentryTargetPrice?: number
  sentryTargetSide?: "BUY" | "SELL"
}

// Generate mock orderbook data
function generateOrderbookData(midPrice: number): { bids: OrderLevel[]; asks: OrderLevel[] } {
  const bids: OrderLevel[] = []
  const asks: OrderLevel[] = []
  
  let bidCumulative = 0
  let askCumulative = 0
  
  // Generate 25 levels each side
  for (let i = 0; i < 25; i++) {
    // Bids (below mid price)
    const bidPrice = midPrice - (i + 1) * 0.15 - Math.random() * 0.05
    const bidSize = 50 + Math.random() * 200 + (i < 5 ? Math.random() * 300 : 0) // Larger walls near spread
    bidCumulative += bidSize
    bids.push({ price: bidPrice, size: bidSize, cumulative: bidCumulative })
    
    // Asks (above mid price)
    const askPrice = midPrice + (i + 1) * 0.15 + Math.random() * 0.05
    const askSize = 50 + Math.random() * 200 + (i < 5 ? Math.random() * 300 : 0)
    askCumulative += askSize
    asks.push({ price: askPrice, size: askSize, cumulative: askCumulative })
  }
  
  return { bids, asks }
}

export function DepthChart({ 
  symbol = "SOL-PERP", 
  sentryTargetPrice = 142.85,
  sentryTargetSide = "SELL"
}: DepthChartProps) {
  const [mounted, setMounted] = useState(false)
  const [midPrice, setMidPrice] = useState(142.35)
  const [hoveredLevel, setHoveredLevel] = useState<{ side: "bid" | "ask"; level: OrderLevel } | null>(null)
  const [orderbook, setOrderbook] = useState(() => generateOrderbookData(142.35))

  useEffect(() => {
    setMounted(true)
    
    // Simulate price updates
    const interval = setInterval(() => {
      setMidPrice((prev) => {
        const newPrice = prev + (Math.random() - 0.5) * 0.2
        setOrderbook(generateOrderbookData(newPrice))
        return newPrice
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const chartDimensions = useMemo(() => {
    const width = 600
    const height = 300
    const padding = { top: 30, right: 60, bottom: 40, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    
    return { width, height, padding, chartWidth, chartHeight }
  }, [])

  const scales = useMemo(() => {
    const { bids, asks } = orderbook
    const allPrices = [...bids.map(b => b.price), ...asks.map(a => a.price)]
    const maxCumulative = Math.max(
      bids[bids.length - 1]?.cumulative || 0,
      asks[asks.length - 1]?.cumulative || 0
    )
    
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    
    return {
      minPrice,
      maxPrice,
      maxCumulative,
      priceToX: (price: number) => {
        const { chartWidth, padding } = chartDimensions
        return padding.left + ((price - minPrice) / (maxPrice - minPrice)) * chartWidth
      },
      cumulativeToY: (cumulative: number) => {
        const { chartHeight, padding } = chartDimensions
        return padding.top + chartHeight - (cumulative / maxCumulative) * chartHeight
      }
    }
  }, [orderbook, chartDimensions])

  // Generate SVG paths for depth curves
  const bidPath = useMemo(() => {
    const { bids } = orderbook
    const { priceToX, cumulativeToY } = scales
    const { chartHeight, padding } = chartDimensions
    
    if (bids.length === 0) return ""
    
    // Start from mid price at bottom
    let path = `M ${priceToX(midPrice)} ${padding.top + chartHeight}`
    
    // Step through each bid level (right to left)
    bids.forEach((level, i) => {
      const x = priceToX(level.price)
      const y = cumulativeToY(level.cumulative)
      if (i === 0) {
        path += ` L ${priceToX(midPrice)} ${y}`
      }
      path += ` L ${x} ${y}`
    })
    
    // Close path back to bottom
    const lastBid = bids[bids.length - 1]
    path += ` L ${priceToX(lastBid.price)} ${padding.top + chartHeight} Z`
    
    return path
  }, [orderbook, scales, midPrice, chartDimensions])

  const askPath = useMemo(() => {
    const { asks } = orderbook
    const { priceToX, cumulativeToY } = scales
    const { chartHeight, padding } = chartDimensions
    
    if (asks.length === 0) return ""
    
    // Start from mid price at bottom
    let path = `M ${priceToX(midPrice)} ${padding.top + chartHeight}`
    
    // Step through each ask level (left to right)
    asks.forEach((level, i) => {
      const x = priceToX(level.price)
      const y = cumulativeToY(level.cumulative)
      if (i === 0) {
        path += ` L ${priceToX(midPrice)} ${y}`
      }
      path += ` L ${x} ${y}`
    })
    
    // Close path back to bottom
    const lastAsk = asks[asks.length - 1]
    path += ` L ${priceToX(lastAsk.price)} ${padding.top + chartHeight} Z`
    
    return path
  }, [orderbook, scales, midPrice, chartDimensions])

  const sentryTargetX = scales.priceToX(sentryTargetPrice)
  const isTargetInRange = sentryTargetPrice >= scales.minPrice && sentryTargetPrice <= scales.maxPrice

  const { width, height, padding, chartHeight } = chartDimensions

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{symbol} Depth Chart</h3>
          <p className="text-xs text-muted-foreground">Drift Protocol Orderbook</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#00FF88]/60"></span>
            <span className="text-muted-foreground">Bids</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-crimson/60"></span>
            <span className="text-muted-foreground">Asks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 bg-gradient-to-r from-crimson to-warning"></span>
            <span className="text-muted-foreground">Sentry Target</span>
          </div>
        </div>
      </div>

      {/* Mid Price Display */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">Mid Price:</span>
        <span className="font-mono text-lg font-semibold text-foreground">
          ${mounted ? midPrice.toFixed(2) : "---"}
        </span>
        <span className="text-xs text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground">Sentry Target:</span>
        <span className={`font-mono text-sm font-medium ${sentryTargetSide === "SELL" ? "text-crimson" : "text-[#00FF88]"}`}>
          ${sentryTargetPrice.toFixed(2)} ({sentryTargetSide})
        </span>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ maxHeight: "300px" }}
        >
          {/* Gradient Definitions */}
          <defs>
            {/* Bid gradient (green) */}
            <linearGradient id="bidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0.05" />
            </linearGradient>
            
            {/* Ask gradient (crimson) */}
            <linearGradient id="askGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e63946" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e63946" stopOpacity="0.05" />
            </linearGradient>
            
            {/* Sentry target glow */}
            <linearGradient id="sentryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e63946" stopOpacity="1" />
              <stop offset="50%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e63946" stopOpacity="0.3" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="sentryGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + chartHeight * ratio}
              x2={width - padding.right}
              y2={padding.top + chartHeight * ratio}
              stroke="#21262d"
              strokeDasharray="4 4"
              opacity={0.5}
            />
          ))}

          {/* Bid depth area */}
          <path
            d={bidPath}
            fill="url(#bidGradient)"
            stroke="#00FF88"
            strokeWidth="1.5"
            opacity={0.9}
          />

          {/* Ask depth area */}
          <path
            d={askPath}
            fill="url(#askGradient)"
            stroke="#e63946"
            strokeWidth="1.5"
            opacity={0.9}
          />

          {/* Mid price line */}
          <line
            x1={scales.priceToX(midPrice)}
            y1={padding.top}
            x2={scales.priceToX(midPrice)}
            y2={padding.top + chartHeight}
            stroke="#8b949e"
            strokeWidth="1"
            strokeDasharray="4 2"
          />

          {/* Sentry Target Line */}
          {isTargetInRange && (
            <g filter="url(#sentryGlow)">
              <line
                x1={sentryTargetX}
                y1={padding.top}
                x2={sentryTargetX}
                y2={padding.top + chartHeight}
                stroke="url(#sentryGradient)"
                strokeWidth="2"
              />
              {/* Target marker */}
              <circle
                cx={sentryTargetX}
                cy={padding.top + 10}
                r="6"
                fill="#0f1419"
                stroke="#e63946"
                strokeWidth="2"
              />
              <circle
                cx={sentryTargetX}
                cy={padding.top + 10}
                r="2"
                fill="#e63946"
              />
              {/* Crosshair icon */}
              <line
                x1={sentryTargetX - 10}
                y1={padding.top + 10}
                x2={sentryTargetX - 4}
                y2={padding.top + 10}
                stroke="#e63946"
                strokeWidth="1.5"
              />
              <line
                x1={sentryTargetX + 4}
                y1={padding.top + 10}
                x2={sentryTargetX + 10}
                y2={padding.top + 10}
                stroke="#e63946"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Price axis labels */}
          {[scales.minPrice, midPrice, scales.maxPrice].map((price, i) => (
            <text
              key={i}
              x={scales.priceToX(price)}
              y={height - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              ${price.toFixed(2)}
            </text>
          ))}

          {/* Y-axis labels (cumulative size) */}
          {[0, 0.5, 1].map((ratio) => (
            <text
              key={ratio}
              x={padding.left - 8}
              y={padding.top + chartHeight * (1 - ratio) + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {((scales.maxCumulative * ratio) / 1000).toFixed(1)}K
            </text>
          ))}

          {/* Interactive hover areas for bids */}
          {orderbook.bids.map((level, i) => (
            <rect
              key={`bid-${i}`}
              x={scales.priceToX(level.price) - 5}
              y={scales.cumulativeToY(level.cumulative)}
              width={10}
              height={padding.top + chartHeight - scales.cumulativeToY(level.cumulative)}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredLevel({ side: "bid", level })}
              onMouseLeave={() => setHoveredLevel(null)}
            />
          ))}

          {/* Interactive hover areas for asks */}
          {orderbook.asks.map((level, i) => (
            <rect
              key={`ask-${i}`}
              x={scales.priceToX(level.price) - 5}
              y={scales.cumulativeToY(level.cumulative)}
              width={10}
              height={padding.top + chartHeight - scales.cumulativeToY(level.cumulative)}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredLevel({ side: "ask", level })}
              onMouseLeave={() => setHoveredLevel(null)}
            />
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredLevel && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg border border-border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-lg z-10">
            <div className="flex items-center gap-3 text-xs">
              <span className={hoveredLevel.side === "bid" ? "text-[#00FF88]" : "text-crimson"}>
                {hoveredLevel.side.toUpperCase()}
              </span>
              <span className="text-muted-foreground">Price:</span>
              <span className="font-mono text-foreground">${hoveredLevel.level.price.toFixed(2)}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Size:</span>
              <span className="font-mono text-foreground">{hoveredLevel.level.size.toFixed(1)}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Cumulative:</span>
              <span className="font-mono text-foreground">{hoveredLevel.level.cumulative.toFixed(0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sentry Analysis */}
      <div className="mt-4 rounded-lg border border-crimson/20 bg-crimson/5 p-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5">
            <svg className="h-4 w-4 text-crimson" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-crimson font-medium mb-1">Sentry Analysis</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Targeting <span className="text-foreground font-medium">${sentryTargetPrice.toFixed(2)}</span> for basis entry. 
              Buy wall at ${(midPrice - 0.5).toFixed(2)} shows {orderbook.bids[3]?.size.toFixed(0)} SOL support. 
              Optimal entry conditions: funding rate elevated, spread favorable for delta-neutral position.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
