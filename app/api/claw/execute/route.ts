import { NextRequest, NextResponse } from "next/server"

/**
 * Open Claw Execute API
 * Bridges dashboard approvals to the Open Claw execution engine
 */

interface ClawExecuteRequest {
  tradeId: string
  type: "OPEN_BASIS" | "CLOSE_BASIS" | "REBALANCE" | "LIQUIDATION_GUARD" | "FUNDING_CAPTURE"
  symbol: string
  size: number
  direction: "LONG" | "SHORT"
  targetPrice?: number
  slippageTolerance?: number // Default 0.5%
  approvedBy: string // Wallet address or "AUTO" for automated
  signature?: string // Transaction signature for verification
  metadata?: {
    fundingRate?: number
    riskScore?: number
    aiConfidence?: "HIGH" | "MEDIUM" | "LOW"
    sentryApproval?: boolean
  }
}

interface ClawExecuteResponse {
  success: boolean
  executionId?: string
  status: "PENDING" | "SUBMITTED" | "CONFIRMED" | "FAILED"
  transactionHash?: string
  message: string
  timestamp: string
  details?: {
    entryPrice?: number
    filledSize?: number
    fees?: number
  }
}

// Validate trade parameters
function validateTradeRequest(trade: ClawExecuteRequest): { valid: boolean; error?: string } {
  if (!trade.tradeId || !trade.symbol || !trade.type) {
    return { valid: false, error: "Missing required fields: tradeId, symbol, or type" }
  }

  if (trade.size <= 0) {
    return { valid: false, error: "Invalid position size" }
  }

  if (!["LONG", "SHORT"].includes(trade.direction)) {
    return { valid: false, error: "Direction must be LONG or SHORT" }
  }

  // Risk checks for automated trades
  if (trade.approvedBy === "AUTO") {
    if (!trade.metadata?.sentryApproval) {
      return { valid: false, error: "Automated trades require Sentry approval" }
    }
    if (trade.metadata?.aiConfidence === "LOW") {
      return { valid: false, error: "Cannot auto-execute LOW confidence trades" }
    }
    if (trade.metadata?.riskScore && trade.metadata.riskScore > 70) {
      return { valid: false, error: "Risk score too high for auto-execution" }
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest): Promise<NextResponse<ClawExecuteResponse>> {
  try {
    const trade: ClawExecuteRequest = await request.json()

    // Validate API key
    const apiKey = request.headers.get("x-agentsentry-key")
    const expectedKey = process.env.AGENTSENTRY_API_KEY

    if (!apiKey || (expectedKey && apiKey !== expectedKey)) {
      return NextResponse.json(
        {
          success: false,
          status: "FAILED",
          message: "Unauthorized: Invalid or missing API key",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      )
    }

    // Validate trade parameters
    const validation = validateTradeRequest(trade)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          status: "FAILED",
          message: validation.error || "Invalid trade parameters",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // Generate execution ID
    const executionId = `claw-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Log the trade for auditing
    console.log(`[CLAW] Execution request: ${executionId}`, {
      type: trade.type,
      symbol: trade.symbol,
      size: trade.size,
      direction: trade.direction,
      approvedBy: trade.approvedBy,
      aiConfidence: trade.metadata?.aiConfidence,
    })

    // In production, this would:
    // 1. Connect to Drift Protocol via @drift-labs/sdk
    // 2. Submit the trade transaction
    // 3. Wait for confirmation
    // 4. Return the transaction hash

    // For now, simulate successful submission
    const mockTransactionHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`

    // Simulate execution delay
    // In production, this would be async with webhooks for status updates
    
    return NextResponse.json(
      {
        success: true,
        executionId,
        status: "SUBMITTED",
        transactionHash: mockTransactionHash,
        message: `${trade.type} order submitted for ${trade.symbol}`,
        timestamp: new Date().toISOString(),
        details: {
          entryPrice: trade.targetPrice || 0,
          filledSize: trade.size,
          fees: trade.size * 0.0005, // 0.05% taker fee estimate
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[CLAW] Execution error:", error)
    
    return NextResponse.json(
      {
        success: false,
        status: "FAILED",
        message: error instanceof Error ? error.message : "Internal execution error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// GET endpoint for checking execution status
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get("id")

  if (!executionId) {
    return NextResponse.json(
      { error: "Missing execution ID" },
      { status: 400 }
    )
  }

  // In production, this would query the execution status from database/blockchain
  return NextResponse.json({
    executionId,
    status: "CONFIRMED",
    message: "Trade execution confirmed on-chain",
    timestamp: new Date().toISOString(),
  })
}
