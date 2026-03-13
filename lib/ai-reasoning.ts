/**
 * AI Reasoning Generator
 * Transforms Drift protocol trading data into human-readable sentences for the dashboard
 */

export interface DriftTradeData {
  type: "OPEN_BASIS" | "CLOSE_BASIS" | "REBALANCE" | "LIQUIDATION_GUARD" | "FUNDING_CAPTURE"
  symbol: string // e.g., "SOL-PERP", "BTC-PERP"
  size: number // Position size in base units
  entryPrice: number
  fundingRate: number // Annualized funding rate as decimal (e.g., 0.248 = 24.8%)
  direction?: "LONG" | "SHORT"
  spotPrice?: number
  perpPrice?: number
  liquidityDepth?: number // 0-100 score
  predictedDecay?: number // Expected basis decay in hours
  riskScore?: number // 0-100 risk assessment
  timestamp?: Date
}

export interface DriftMarketContext {
  marketCondition: "BULLISH" | "BEARISH" | "NEUTRAL" | "VOLATILE"
  avgFundingRate24h?: number
  openInterest?: number
  volatilityIndex?: number // 0-100
}

export interface ReasoningOutput {
  summary: string // One-line summary for cards
  detailed: string // Full reasoning paragraph
  confidence: "HIGH" | "MEDIUM" | "LOW"
  riskAssessment: string
  actionVerb: string // e.g., "Opening", "Closing", "Rebalancing"
}

/**
 * Formats a number as a percentage string
 */
function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formats a number as USD currency
 */
function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats position size with appropriate units
 */
function formatSize(size: number, symbol: string): string {
  const baseAsset = symbol.replace("-PERP", "")
  if (Math.abs(size) >= 1000) {
    return `${(size / 1000).toFixed(2)}K ${baseAsset}`
  }
  return `${size.toFixed(4)} ${baseAsset}`
}

/**
 * Determines funding rate sentiment
 */
function getFundingSentiment(rate: number): { label: string; isAttractive: boolean } {
  const annualizedPercent = rate * 100
  if (annualizedPercent > 20) {
    return { label: "exceptionally high", isAttractive: true }
  } else if (annualizedPercent > 10) {
    return { label: "elevated", isAttractive: true }
  } else if (annualizedPercent > 5) {
    return { label: "moderate", isAttractive: true }
  } else if (annualizedPercent > 0) {
    return { label: "low positive", isAttractive: false }
  } else if (annualizedPercent > -5) {
    return { label: "slightly negative", isAttractive: false }
  } else {
    return { label: "deeply negative", isAttractive: false }
  }
}

/**
 * Generates human-readable AI reasoning from Drift trade data
 */
export function generateAIReasoning(
  trade: DriftTradeData,
  context?: DriftMarketContext
): ReasoningOutput {
  const baseAsset = trade.symbol.replace("-PERP", "")
  const fundingSentiment = getFundingSentiment(trade.fundingRate)
  const positionValue = trade.size * trade.entryPrice

  let summary: string
  let detailed: string
  let confidence: "HIGH" | "MEDIUM" | "LOW"
  let riskAssessment: string
  let actionVerb: string

  switch (trade.type) {
    case "OPEN_BASIS":
      actionVerb = "Opening"
      summary = `Opening delta-neutral basis trade on ${baseAsset} to capture ${formatPercent(trade.fundingRate)} funding yield.`
      
      detailed = `The AI Brain detected ${fundingSentiment.label} funding rates on ${trade.symbol} at ${formatPercent(trade.fundingRate)} annualized. `
      detailed += `Executing a delta-neutral basis trade by going ${trade.direction === "LONG" ? "long spot / short perp" : "short spot / long perp"} with ${formatSize(trade.size, trade.symbol)} (${formatUSD(positionValue)} notional). `
      
      if (trade.spotPrice && trade.perpPrice) {
        const basisSpread = ((trade.perpPrice - trade.spotPrice) / trade.spotPrice) * 100
        detailed += `Current basis spread: ${basisSpread.toFixed(3)}%. `
      }
      
      if (trade.liquidityDepth !== undefined) {
        detailed += `Liquidity depth score: ${trade.liquidityDepth}/100. `
      }
      
      if (context?.marketCondition) {
        detailed += `Market condition: ${context.marketCondition.toLowerCase()}. `
      }
      
      detailed += `This position is designed to harvest funding payments while remaining market-neutral to ${baseAsset} price movements.`
      
      confidence = fundingSentiment.isAttractive && (trade.liquidityDepth ?? 70) > 60 ? "HIGH" : "MEDIUM"
      riskAssessment = trade.riskScore !== undefined && trade.riskScore > 70 
        ? "Elevated risk due to market conditions. Position size reduced accordingly."
        : "Risk within acceptable parameters for basis strategy."
      break

    case "CLOSE_BASIS":
      actionVerb = "Closing"
      summary = `Closing ${baseAsset} basis position as funding rates have normalized to ${formatPercent(trade.fundingRate)}.`
      
      detailed = `The AI Brain is unwinding the ${trade.symbol} basis trade. `
      detailed += `Funding rates have ${fundingSentiment.isAttractive ? "remained attractive but" : ""} declined to ${formatPercent(trade.fundingRate)}, `
      
      if (trade.predictedDecay !== undefined) {
        detailed += `with predicted basis decay within ${trade.predictedDecay} hours. `
      }
      
      detailed += `Closing ${formatSize(trade.size, trade.symbol)} position to lock in accumulated yield. `
      detailed += `The delta-neutral structure ensured minimal exposure to ${baseAsset} price volatility during the holding period.`
      
      confidence = "HIGH"
      riskAssessment = "Exiting position eliminates basis trade exposure. Capital returned to vault."
      break

    case "REBALANCE":
      actionVerb = "Rebalancing"
      summary = `Rebalancing ${baseAsset} hedge to maintain delta-neutral exposure.`
      
      detailed = `Delta drift detected in ${trade.symbol} position requiring rebalance. `
      
      if (trade.spotPrice && trade.perpPrice) {
        const drift = ((trade.perpPrice - trade.spotPrice) / trade.spotPrice) * 100
        detailed += `Spot-perp divergence: ${drift.toFixed(3)}%. `
      }
      
      detailed += `Adjusting position by ${trade.size > 0 ? "+" : ""}${formatSize(trade.size, trade.symbol)} to restore hedge ratio. `
      detailed += `This maintains the vault's market-neutral positioning while continuing to capture ${formatPercent(trade.fundingRate)} funding yield. `
      detailed += `Rebalancing cost factored into yield calculations.`
      
      confidence = "HIGH"
      riskAssessment = "Standard maintenance operation. Delta exposure minimized."
      break

    case "LIQUIDATION_GUARD":
      actionVerb = "Guarding"
      summary = `AgentSentry activated: Reducing ${baseAsset} exposure to prevent liquidation risk.`
      
      detailed = `ALERT: AgentSentry has detected elevated liquidation risk on ${trade.symbol}. `
      detailed += `Preemptively reducing position by ${formatSize(Math.abs(trade.size), trade.symbol)} to maintain safe margin levels. `
      
      if (trade.riskScore !== undefined) {
        detailed += `Risk score spiked to ${trade.riskScore}/100. `
      }
      
      if (context?.volatilityIndex !== undefined) {
        detailed += `Market volatility index: ${context.volatilityIndex}/100. `
      }
      
      detailed += `This protective action prioritizes capital preservation over yield optimization. Position will be rebuilt when conditions stabilize.`
      
      confidence = "HIGH"
      riskAssessment = "CRITICAL: Defensive measures activated. Vault security prioritized."
      break

    case "FUNDING_CAPTURE":
      actionVerb = "Capturing"
      summary = `Funding payment captured: ${formatPercent(trade.fundingRate)} on ${baseAsset} position.`
      
      detailed = `Funding epoch completed for ${trade.symbol}. `
      detailed += `Successfully captured ${formatPercent(trade.fundingRate)} funding payment on ${formatSize(trade.size, trade.symbol)} position. `
      detailed += `Position value: ${formatUSD(positionValue)}. `
      
      if (context?.avgFundingRate24h !== undefined) {
        detailed += `24h average funding: ${formatPercent(context.avgFundingRate24h)}. `
      }
      
      detailed += `Yield accrued to vault. Maintaining position for continued funding capture.`
      
      confidence = "HIGH"
      riskAssessment = "Funding successfully harvested. Position remains delta-neutral."
      break

    default:
      actionVerb = "Processing"
      summary = `Processing ${trade.symbol} trade action.`
      detailed = `Trade executed on ${trade.symbol} with ${formatSize(trade.size, trade.symbol)} at ${formatUSD(trade.entryPrice)}.`
      confidence = "MEDIUM"
      riskAssessment = "Standard trade execution."
  }

  return {
    summary,
    detailed,
    confidence,
    riskAssessment,
    actionVerb,
  }
}

/**
 * Generates a short status message for the execution log
 */
export function generateLogMessage(trade: DriftTradeData): string {
  const baseAsset = trade.symbol.replace("-PERP", "")
  const fundingPercent = (trade.fundingRate * 100).toFixed(2)
  
  switch (trade.type) {
    case "OPEN_BASIS":
      return `BASIS_OPEN: ${baseAsset} | Size: ${trade.size.toFixed(4)} | Funding: ${fundingPercent}% APY`
    case "CLOSE_BASIS":
      return `BASIS_CLOSE: ${baseAsset} | Size: ${trade.size.toFixed(4)} | Final Rate: ${fundingPercent}%`
    case "REBALANCE":
      return `REBALANCE: ${baseAsset} | Delta Adj: ${trade.size > 0 ? "+" : ""}${trade.size.toFixed(4)}`
    case "LIQUIDATION_GUARD":
      return `SENTRY_GUARD: ${baseAsset} | Risk Mitigation | Reduced: ${Math.abs(trade.size).toFixed(4)}`
    case "FUNDING_CAPTURE":
      return `FUNDING_CAPTURED: ${baseAsset} | Rate: ${fundingPercent}% | Epoch Complete`
    default:
      return `TRADE: ${baseAsset} | ${trade.type} | Size: ${trade.size.toFixed(4)}`
  }
}

/**
 * Generates reasoning for the Decision Brain visualization metrics
 */
export function generateBrainMetrics(trade: DriftTradeData, context?: DriftMarketContext): {
  fundingYieldIntensity: number // 0-100
  liquidityDepth: number // 0-100
  predictedDecay: number // 0-100 (inverted - higher is better/slower decay)
  overallScore: number // 0-100
} {
  // Funding yield intensity (based on annualized rate)
  const fundingYieldIntensity = Math.min(100, Math.max(0, (trade.fundingRate * 100) * 4))
  
  // Liquidity depth (use provided or estimate)
  const liquidityDepth = trade.liquidityDepth ?? 75
  
  // Predicted decay score (inverted - slower decay = higher score)
  const decayHours = trade.predictedDecay ?? 48
  const predictedDecay = Math.min(100, Math.max(0, (decayHours / 72) * 100))
  
  // Overall score weighted average
  const overallScore = Math.round(
    (fundingYieldIntensity * 0.4) + 
    (liquidityDepth * 0.35) + 
    (predictedDecay * 0.25)
  )

  return {
    fundingYieldIntensity: Math.round(fundingYieldIntensity),
    liquidityDepth: Math.round(liquidityDepth),
    predictedDecay: Math.round(predictedDecay),
    overallScore,
  }
}
