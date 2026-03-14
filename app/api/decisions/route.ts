import { NextRequest, NextResponse } from "next/server"
import { 
  logAIDecision, 
  logSkipDecision, 
  logGuardDecision,
  getRecentDecisions,
  getDecisionAnalytics,
  type AIDecisionInput,
  type DecisionType 
} from "@/lib/ai-decision-logger"

/**
 * GET /api/decisions
 * Fetch recent AI decisions with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const types = searchParams.get("types")?.split(",") as DecisionType[] | undefined
    const analytics = searchParams.get("analytics") === "true"
    const symbol = searchParams.get("symbol")
    const days = parseInt(searchParams.get("days") || "7")
    
    if (analytics) {
      const analyticsData = await getDecisionAnalytics(symbol || undefined, days)
      return NextResponse.json({
        success: true,
        data: analyticsData,
      })
    }
    
    const decisions = await getRecentDecisions(limit, types)
    
    return NextResponse.json({
      success: true,
      data: decisions,
      count: decisions.length,
    })
  } catch (error) {
    console.error("[API /decisions] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch decisions" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/decisions
 * Log a new AI decision (execute, skip, guard, or defer)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      type,
      marketContext,
      confidenceScore,
      riskScore,
      expectedYield,
      thoughtProcess,
      skipReasons,
      guardReason,
      riskFactors,
      tradeId,
      side,
      size,
      leverage,
    } = body
    
    if (!type || !marketContext) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, marketContext" },
        { status: 400 }
      )
    }
    
    let result: { id: string } | null = null
    
    switch (type) {
      case "SKIP":
        result = await logSkipDecision(
          marketContext,
          skipReasons || ["Unspecified reason"],
          confidenceScore || 0,
          riskScore || 50,
          expectedYield || 0,
          thoughtProcess || []
        )
        break
        
      case "GUARD":
        result = await logGuardDecision(
          marketContext,
          guardReason || "Risk threshold exceeded",
          riskFactors || {},
          thoughtProcess || []
        )
        break
        
      case "EXECUTE":
        if (!tradeId || !side || !size) {
          return NextResponse.json(
            { success: false, error: "EXECUTE requires tradeId, side, and size" },
            { status: 400 }
          )
        }
        // For EXECUTE, we use the full logAIDecision function
        result = await logAIDecision({
          decisionType: "EXECUTE",
          decisionReason: `Executing ${side} ${size} ${marketContext.symbol}`,
          marketContext,
          confidenceScore: confidenceScore || 75,
          riskScore: riskScore || 25,
          alphaDecayHours: expectedYield > 0.5 ? 12 : 6,
          aiReasoningJson: body,
          thoughtProcess: thoughtProcess || [],
          tradeId,
          proposedSide: side,
          proposedSize: size,
          proposedLeverage: leverage || 1,
          expectedYield: expectedYield || 0,
        })
        break
        
      case "DEFER":
        result = await logAIDecision({
          decisionType: "DEFER",
          decisionReason: body.reason || "Awaiting better conditions",
          marketContext,
          confidenceScore: confidenceScore || 50,
          riskScore: riskScore || 50,
          alphaDecayHours: body.deferHours || 4,
          aiReasoningJson: body,
          thoughtProcess: thoughtProcess || [],
        })
        break
        
      default:
        return NextResponse.json(
          { success: false, error: `Invalid decision type: ${type}` },
          { status: 400 }
        )
    }
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Failed to log decision" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      decisionId: result.id,
      type,
      symbol: marketContext.symbol,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[API /decisions] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to log decision" },
      { status: 500 }
    )
  }
}
