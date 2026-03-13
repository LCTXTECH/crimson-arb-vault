"use client"

import { useState, useEffect } from "react"

interface LiquidityNode {
  id: string
  name: string
  region: string
  x: number // percentage position
  y: number // percentage position
  volume24h: number
  activeAgents: number
  inefficiencies: number
  status: "active" | "moderate" | "low"
}

interface ArbitrageInefficiency {
  id: string
  pair: string
  spread: number
  venue: string
  timestamp: Date
  captured: boolean
}

const LIQUIDITY_NODES: LiquidityNode[] = [
  { id: "sg", name: "Singapore", region: "APAC", x: 75, y: 42, volume24h: 125000000, activeAgents: 12, inefficiencies: 8, status: "active" },
  { id: "hk", name: "Hong Kong", region: "APAC", x: 78, y: 38, volume24h: 89000000, activeAgents: 8, inefficiencies: 5, status: "active" },
  { id: "ae", name: "Dubai", region: "MENA", x: 58, y: 40, volume24h: 67000000, activeAgents: 6, inefficiencies: 4, status: "moderate" },
  { id: "us-ny", name: "New York", region: "NA", x: 25, y: 35, volume24h: 198000000, activeAgents: 15, inefficiencies: 12, status: "active" },
  { id: "us-sf", name: "San Francisco", region: "NA", x: 12, y: 38, volume24h: 45000000, activeAgents: 4, inefficiencies: 3, status: "moderate" },
  { id: "de", name: "Frankfurt", region: "EU", x: 50, y: 30, volume24h: 56000000, activeAgents: 5, inefficiencies: 3, status: "moderate" },
  { id: "uk", name: "London", region: "EU", x: 47, y: 28, volume24h: 112000000, activeAgents: 9, inefficiencies: 7, status: "active" },
  { id: "jp", name: "Tokyo", region: "APAC", x: 85, y: 36, volume24h: 134000000, activeAgents: 11, inefficiencies: 9, status: "active" },
]

const MOCK_INEFFICIENCIES: ArbitrageInefficiency[] = [
  { id: "1", pair: "SOL-PERP/SPOT", spread: 0.023, venue: "Drift/Raydium", timestamp: new Date(Date.now() - 120000), captured: true },
  { id: "2", pair: "BTC-PERP/SPOT", spread: 0.018, venue: "Drift/Orca", timestamp: new Date(Date.now() - 300000), captured: true },
  { id: "3", pair: "ETH-PERP/SPOT", spread: 0.031, venue: "Drift/Jupiter", timestamp: new Date(Date.now() - 600000), captured: true },
  { id: "4", pair: "SOL-PERP/SPOT", spread: 0.015, venue: "Drift/Phoenix", timestamp: new Date(Date.now() - 900000), captured: false },
  { id: "5", pair: "JTO-PERP/SPOT", spread: 0.042, venue: "Drift/Raydium", timestamp: new Date(Date.now() - 1200000), captured: true },
]

function formatVolume(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  return `$${(value / 1000).toFixed(0)}K`
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

export function LiquidityHeatmap() {
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState<LiquidityNode | null>(null)
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 3)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const totalVolume = LIQUIDITY_NODES.reduce((sum, node) => sum + node.volume24h, 0)
  const totalAgents = LIQUIDITY_NODES.reduce((sum, node) => sum + node.activeAgents, 0)
  const totalInefficiencies = MOCK_INEFFICIENCIES.filter(i => i.captured).length

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Global Liquidity Heatmap</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>24h Volume: <span className="text-foreground font-medium">{formatVolume(totalVolume)}</span></span>
            <span>Active Nodes: <span className="text-crimson font-medium">{totalAgents}</span></span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-muted/30 p-4">
        {/* Simplified world map outline */}
        <svg viewBox="0 0 100 50" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Dark background */}
          <rect width="100" height="50" fill="transparent" />
          
          {/* Simplified continent outlines - stylized for dark theme */}
          <g className="stroke-border fill-muted/50" strokeWidth="0.2">
            {/* North America */}
            <path d="M5,15 Q15,10 25,12 L30,18 Q28,25 22,30 L15,32 Q8,28 5,20 Z" />
            {/* South America */}
            <path d="M22,32 Q25,35 27,42 L25,48 Q20,50 18,45 L17,38 Q18,34 22,32 Z" />
            {/* Europe */}
            <path d="M45,18 Q50,15 55,17 L56,22 Q54,26 48,28 L44,25 Q43,21 45,18 Z" />
            {/* Africa */}
            <path d="M48,28 Q52,27 56,30 L58,38 Q55,45 50,46 L45,42 Q44,35 48,28 Z" />
            {/* Asia */}
            <path d="M56,15 Q65,10 80,15 L88,22 Q90,30 85,35 L75,38 Q65,35 60,28 L56,22 Z" />
            {/* Australia */}
            <path d="M80,40 Q85,38 90,42 L88,47 Q83,48 80,45 Z" />
          </g>

          {/* Grid lines */}
          <g className="stroke-border/30" strokeWidth="0.1" strokeDasharray="1 2">
            {[10, 20, 30, 40].map(y => (
              <line key={`h-${y}`} x1="0" y1={y} x2="100" y2={y} />
            ))}
            {[20, 40, 60, 80].map(x => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="50" />
            ))}
          </g>

          {/* Liquidity nodes */}
          {LIQUIDITY_NODES.map((node, index) => {
            const isActive = node.status === "active"
            const isPulsing = isActive && (index % 3 === pulsePhase)
            
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
              >
                {/* Outer pulse ring for active nodes */}
                {isPulsing && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="3"
                    className="fill-transparent stroke-crimson animate-ping"
                    strokeWidth="0.3"
                  />
                )}
                
                {/* Node glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="2"
                  className={`${
                    isActive ? "fill-crimson/30" : "fill-warning/30"
                  } blur-sm`}
                />
                
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="1.2"
                  className={`${
                    selectedNode?.id === node.id
                      ? "fill-white stroke-crimson"
                      : isActive
                        ? "fill-crimson stroke-crimson/50"
                        : "fill-warning stroke-warning/50"
                  } transition-all`}
                  strokeWidth="0.3"
                />
                
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y - 3}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[2px] font-mono"
                >
                  {node.name}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Selected node info card */}
        {selectedNode && mounted && (
          <div className="absolute top-4 right-4 rounded-lg border border-crimson/50 bg-card/95 backdrop-blur-sm p-3 w-48">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{selectedNode.name}</span>
              <span className={`h-2 w-2 rounded-full ${selectedNode.status === "active" ? "bg-crimson animate-pulse" : "bg-warning"}`} />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>24h Volume</span>
                <span className="text-foreground">{formatVolume(selectedNode.volume24h)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Active Agents</span>
                <span className="text-crimson">{selectedNode.activeAgents}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Inefficiencies</span>
                <span className="text-foreground">{selectedNode.inefficiencies}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inefficiencies Table */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Global Arbitrage Inefficiencies (24h)
          </p>
          <span className="text-xs text-muted-foreground">
            Captured: <span className="text-[#00FF88] font-medium">{totalInefficiencies}/{MOCK_INEFFICIENCIES.length}</span>
          </span>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {MOCK_INEFFICIENCIES.map((ineff) => (
            <div
              key={ineff.id}
              className="flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${ineff.captured ? "bg-[#00FF88]" : "bg-muted-foreground"}`} />
                <span className="text-foreground">{ineff.pair}</span>
                <span className="text-muted-foreground">{ineff.venue}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-crimson">+{(ineff.spread * 100).toFixed(2)}%</span>
                <span className="text-muted-foreground w-16 text-right">
                  {mounted ? formatTimeAgo(ineff.timestamp) : "--"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
