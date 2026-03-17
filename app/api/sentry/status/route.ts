import { NextResponse } from "next/server"

/**
 * GET /api/sentry/status
 * Returns AgentSentry status - polls the real AgentSentry API
 * or returns simulated status for demo
 */
export async function GET() {
  try {
    // In production, call the real AgentSentry API
    const agentSentryUrl = process.env.AGENTSENTRY_API_URL || "https://agentsentry.net"
    const apiKey = process.env.AGENTSENTRY_API_KEY

    if (apiKey) {
      // Real API call
      const response = await fetch(`${agentSentryUrl}/api/sentry/check-in`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }).catch(() => null)

      if (response?.ok) {
        const data = await response.json()
        return NextResponse.json({
          status: data.status || "APPROVE",
          timestamp: new Date().toISOString(),
          blockedToday: data.blockedToday || 0,
          message: data.message || "AgentSentry operational",
        })
      }
    }

    // Simulated response for demo (no API key configured)
    return NextResponse.json({
      status: "APPROVE",
      timestamp: new Date().toISOString(),
      blockedToday: 0,
      message: "AgentSentry operational (simulated)",
    })
  } catch (error) {
    console.error("AgentSentry status check failed:", error)
    return NextResponse.json({
      status: "OFFLINE",
      timestamp: new Date().toISOString(),
      blockedToday: 0,
      message: "Unable to reach AgentSentry",
    })
  }
}

/**
 * POST /api/sentry/status
 * Check a specific transaction with AgentSentry before execution
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, symbol, size, confidence } = body

    const agentSentryUrl = process.env.AGENTSENTRY_API_URL || "https://agentsentry.net"
    const apiKey = process.env.AGENTSENTRY_API_KEY

    if (apiKey) {
      // Real API call to check transaction
      const response = await fetch(`${agentSentryUrl}/api/sentry/check-in`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          symbol,
          size,
          confidence,
          source: "crimsonarb",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null)

      if (response?.ok) {
        const data = await response.json()
        return NextResponse.json({
          approved: data.status === "APPROVE",
          status: data.status,
          message: data.message || "Transaction reviewed",
        })
      }
    }

    // Simulated approval for demo
    // In production, this would be a real security check
    const simulatedApproval = confidence >= 60 && size <= 50000

    return NextResponse.json({
      approved: simulatedApproval,
      status: simulatedApproval ? "APPROVE" : "BLOCK",
      message: simulatedApproval 
        ? "Transaction approved (simulated)" 
        : "Transaction blocked: Low confidence or excessive size (simulated)",
    })
  } catch (error) {
    console.error("AgentSentry transaction check failed:", error)
    return NextResponse.json({
      approved: false,
      status: "BLOCK",
      message: "AgentSentry check failed - blocking for safety",
    }, { status: 500 })
  }
}
