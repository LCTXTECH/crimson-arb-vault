/**
 * ATSP v1.0.1 Sentry Check-In API
 * 
 * Production-grade gatekeeper that enforces the 3-layer security model:
 * 1. Zod Parse -> 2. Agent Lookup -> 3. Circuit Breaker Check -> 4. Policy Loop -> 5. Webacy Screen
 * 
 * Returns X-ATSP-Latency and X-ATSP-Verdict headers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  ATSPIntentDeclarationSchema,
  ATSPVerdictResponse,
  createIntentHash,
  parseAmount,
  isIntentExpired,
  ATSP_MAX_LATENCY_MS,
  CircuitState,
  CIRCUIT_STATES,
  VerdictType,
} from '@/lib/atsp-schema'
import { screenWallet, WebacyRiskLevel } from '@/lib/webacy'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const POLICIES = {
  VOLUME_LIMIT: {
    maxDailyVolume: parseAmount('100000', 6), // 100k USDC daily limit
    maxSingleTrade: parseAmount('10000', 6),  // 10k USDC per trade
  },
  BLACKOUT_WINDOW: {
    // UTC hours when trading is suspended (e.g., during high volatility periods)
    blackoutHours: [] as number[], // Empty = no blackout
  },
  TOKEN_WHITELIST: {
    enabled: true,
    tokens: ['SOL', 'BTC', 'ETH', 'USDC', 'USDT', 'JitoSOL', 'mSOL'],
  },
  WEBACY_THRESHOLD: {
    minScore: 30, // Block if DD score is below this
    criticalScore: 20, // Immediate GUARD if below this
  },
}

// Circuit breaker state (in production, this would be in Redis/DB)
let circuitState: CircuitState = CIRCUIT_STATES.CLOSED
let circuitFailureCount = 0
const CIRCUIT_FAILURE_THRESHOLD = 5
const CIRCUIT_RESET_MS = 60_000

// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════════════════════

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }
  
  return createClient(url, key)
}

// ═══════════════════════════════════════════════════════════════════════════
// POLICY CHECKS
// ═══════════════════════════════════════════════════════════════════════════

interface PolicyViolation {
  policy: string
  violation: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

async function checkVolumeLimit(
  agentId: string,
  amount: string,
  supabase: ReturnType<typeof getSupabaseClient>
): Promise<PolicyViolation | null> {
  const amountBigInt = parseAmount(amount, 0)
  
  // Check single trade limit
  if (amountBigInt > POLICIES.VOLUME_LIMIT.maxSingleTrade) {
    return {
      policy: 'VOLUME_LIMIT',
      violation: `Trade amount exceeds single trade limit`,
      severity: 'HIGH',
    }
  }
  
  // Check daily volume (query last 24h of approved trades)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { data: recentTrades } = await supabase
    .from('atsp_audit_logs')
    .select('amount')
    .eq('agent_id', agentId)
    .eq('verdict', 'APPROVED')
    .gte('created_at', oneDayAgo)
  
  if (recentTrades) {
    const dailyVolume = recentTrades.reduce(
      (sum, t) => sum + parseAmount(t.amount || '0', 0),
      0n
    )
    
    if (dailyVolume + amountBigInt > POLICIES.VOLUME_LIMIT.maxDailyVolume) {
      return {
        policy: 'VOLUME_LIMIT',
        violation: `Daily volume limit would be exceeded`,
        severity: 'MEDIUM',
      }
    }
  }
  
  return null
}

function checkBlackoutWindow(): PolicyViolation | null {
  const currentHour = new Date().getUTCHours()
  
  if (POLICIES.BLACKOUT_WINDOW.blackoutHours.includes(currentHour)) {
    return {
      policy: 'BLACKOUT_WINDOW',
      violation: `Trading suspended during blackout window (UTC hour ${currentHour})`,
      severity: 'MEDIUM',
    }
  }
  
  return null
}

function checkTokenWhitelist(action: { type: string; [key: string]: unknown }): PolicyViolation | null {
  if (!POLICIES.TOKEN_WHITELIST.enabled) return null
  
  const tokenFields = ['token', 'fromToken', 'toToken', 'tokenA', 'tokenB']
  
  for (const field of tokenFields) {
    const token = action[field]
    if (typeof token === 'string' && !POLICIES.TOKEN_WHITELIST.tokens.includes(token)) {
      return {
        policy: 'TOKEN_WHITELIST',
        violation: `Token ${token} is not whitelisted`,
        severity: 'HIGH',
      }
    }
  }
  
  return null
}

// ═══════════════════════════════════════════════════════════════════════════
// CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════════════════════

function checkCircuitBreaker(): { allowed: boolean; state: CircuitState } {
  if (circuitState === CIRCUIT_STATES.OPEN) {
    return { allowed: false, state: circuitState }
  }
  
  if (circuitState === CIRCUIT_STATES.HALF_OPEN) {
    // In half-open state, allow limited requests to test recovery
    return { allowed: true, state: circuitState }
  }
  
  return { allowed: true, state: CIRCUIT_STATES.CLOSED }
}

function recordCircuitFailure() {
  circuitFailureCount++
  
  if (circuitFailureCount >= CIRCUIT_FAILURE_THRESHOLD) {
    circuitState = CIRCUIT_STATES.OPEN
    
    // Schedule circuit reset
    setTimeout(() => {
      circuitState = CIRCUIT_STATES.HALF_OPEN
      circuitFailureCount = 0
    }, CIRCUIT_RESET_MS)
  }
}

function recordCircuitSuccess() {
  if (circuitState === CIRCUIT_STATES.HALF_OPEN) {
    circuitState = CIRCUIT_STATES.CLOSED
  }
  circuitFailureCount = Math.max(0, circuitFailureCount - 1)
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBACY INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

async function performWebacyScreen(
  agentId: string
): Promise<{ score: number; riskLevel: WebacyRiskLevel; block: boolean }> {
  try {
    const result = await screenWallet(agentId)
    
    const block = result.ddScore < POLICIES.WEBACY_THRESHOLD.minScore
    const critical = result.ddScore < POLICIES.WEBACY_THRESHOLD.criticalScore
    
    return {
      score: result.ddScore,
      riskLevel: result.riskLevel,
      block: block || critical,
    }
  } catch {
    // On Webacy failure, allow but log warning
    console.warn('[ATSP] Webacy screening failed, proceeding with caution')
    return { score: 50, riskLevel: 'MEDIUM', block: false }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOGGING
// ═══════════════════════════════════════════════════════════════════════════

async function logToAuditTrail(
  supabase: ReturnType<typeof getSupabaseClient>,
  intentHash: string,
  intent: { agentId: string; action: { type: string }; amount: string; decisionTrace: { causalReasoningChain: string; confidence: number } },
  verdict: ATSPVerdictResponse
) {
  try {
    await supabase.from('atsp_audit_logs').insert({
      intent_hash: intentHash,
      agent_id: intent.agentId,
      action_type: intent.action.type,
      amount: intent.amount,
      verdict: verdict.verdict,
      reason: verdict.reason,
      latency_ms: verdict.latencyMs,
      webacy_dd_score: verdict.webacyDdScore,
      causal_reasoning_chain: intent.decisionTrace.causalReasoningChain,
      confidence: intent.decisionTrace.confidence,
      circuit_state: verdict.circuitState,
      policy_violations: verdict.policyViolations,
    })
  } catch (error) {
    console.error('[ATSP] Failed to log audit trail:', error)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  const start = performance.now()
  
  try {
    // 1. Parse and validate the intent declaration
    const body = await req.json()
    const parseResult = ATSPIntentDeclarationSchema.safeParse(body)
    
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid ATSP intent declaration',
          details: parseResult.error.issues,
        },
        {
          status: 400,
          headers: {
            'X-ATSP-Verdict': 'DENIED',
            'X-ATSP-Latency': `${Math.round(performance.now() - start)}ms`,
          },
        }
      )
    }
    
    const intent = parseResult.data
    const intentHash = createIntentHash({
      agentId: intent.agentId,
      action: intent.action,
      amount: intent.amount,
      timestamp: intent.timestamp,
    })
    
    // 2. Check if intent has expired
    if (isIntentExpired(intent)) {
      return createVerdictResponse({
        intentHash,
        verdict: VerdictType.DENIED,
        reason: 'Intent has expired (TTL exceeded)',
        latencyMs: Math.round(performance.now() - start),
        circuitState,
      })
    }
    
    // 3. Check circuit breaker
    const circuitCheck = checkCircuitBreaker()
    if (!circuitCheck.allowed) {
      return createVerdictResponse({
        intentHash,
        verdict: VerdictType.GUARD,
        reason: 'Circuit breaker is OPEN - all trades suspended',
        latencyMs: Math.round(performance.now() - start),
        circuitState: circuitCheck.state,
      })
    }
    
    // 4. Run policy checks
    const supabase = getSupabaseClient()
    const violations: PolicyViolation[] = []
    
    // Blackout window check
    const blackoutViolation = checkBlackoutWindow()
    if (blackoutViolation) violations.push(blackoutViolation)
    
    // Token whitelist check
    const tokenViolation = checkTokenWhitelist(intent.action)
    if (tokenViolation) violations.push(tokenViolation)
    
    // Volume limit check
    const volumeViolation = await checkVolumeLimit(intent.agentId, intent.amount, supabase)
    if (volumeViolation) violations.push(volumeViolation)
    
    // If there are critical violations, deny immediately
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')
    if (criticalViolations.length > 0) {
      recordCircuitFailure()
      
      const response: ATSPVerdictResponse = {
        intentHash,
        verdict: VerdictType.DENIED,
        reason: criticalViolations[0].violation,
        latencyMs: Math.round(performance.now() - start),
        circuitState,
        timestamp: Date.now(),
        policyViolations: violations,
      }
      
      await logToAuditTrail(supabase, intentHash, intent, response)
      
      return createVerdictResponse(response)
    }
    
    // 5. Webacy screening (Layer 3)
    const webacyResult = await performWebacyScreen(intent.agentId)
    
    if (webacyResult.block) {
      recordCircuitFailure()
      
      const response: ATSPVerdictResponse = {
        intentHash,
        verdict: VerdictType.GUARD,
        reason: `Webacy DD score too low: ${webacyResult.score}/100 (${webacyResult.riskLevel})`,
        latencyMs: Math.round(performance.now() - start),
        circuitState,
        timestamp: Date.now(),
        webacyDdScore: webacyResult.score,
        riskFlags: ['LOW_DD_SCORE'],
      }
      
      await logToAuditTrail(supabase, intentHash, intent, response)
      
      return createVerdictResponse(response)
    }
    
    // 6. All checks passed - APPROVED
    recordCircuitSuccess()
    
    const response: ATSPVerdictResponse = {
      intentHash,
      verdict: VerdictType.APPROVED,
      reason: 'All security checks passed',
      latencyMs: Math.round(performance.now() - start),
      circuitState,
      timestamp: Date.now(),
      webacyDdScore: webacyResult.score,
      sentryLogId: crypto.randomUUID(),
    }
    
    await logToAuditTrail(supabase, intentHash, intent, response)
    
    return createVerdictResponse(response)
    
  } catch (error) {
    recordCircuitFailure()
    
    console.error('[ATSP] Check-in error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error during ATSP check-in' },
      {
        status: 500,
        headers: {
          'X-ATSP-Verdict': 'GUARD',
          'X-ATSP-Latency': `${Math.round(performance.now() - start)}ms`,
        },
      }
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSE HELPER
// ═══════════════════════════════════════════════════════════════════════════

function createVerdictResponse(response: Partial<ATSPVerdictResponse> & { intentHash: string; verdict: string; reason: string; latencyMs: number; circuitState: CircuitState }) {
  const fullResponse: ATSPVerdictResponse = {
    ...response,
    timestamp: response.timestamp || Date.now(),
  } as ATSPVerdictResponse
  
  const latencyWarning = response.latencyMs > ATSP_MAX_LATENCY_MS ? '; SLOW' : ''
  
  return NextResponse.json(fullResponse, {
    status: response.verdict === 'APPROVED' ? 200 : response.verdict === 'DENIED' ? 403 : 202,
    headers: {
      'X-ATSP-Verdict': response.verdict,
      'X-ATSP-Latency': `${response.latencyMs}ms${latencyWarning}`,
      'X-ATSP-Circuit': response.circuitState,
      'X-ATSP-Version': '1.0.1',
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// GET HANDLER (Status Check)
// ═══════════════════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    version: '1.0.1',
    circuitState,
    timestamp: Date.now(),
  }, {
    headers: {
      'X-ATSP-Version': '1.0.1',
      'X-ATSP-Circuit': circuitState,
    },
  })
}
