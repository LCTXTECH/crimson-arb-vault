/**
 * ATSP v1.0.1 — Canonical Protocol Schema
 * Agent-to-Sentry Trust Protocol
 * 
 * The single source of truth for Zod validation and BigInt math across the repo.
 * Handles the shift to BigInt-safe string amounts, ipiVerificationHash for 
 * proof-of-state auditing, and discriminated union for 7 action types.
 */

import { z } from 'zod'
import { createHash } from 'crypto'

// ═══════════════════════════════════════════════════════════════════════════
// PROTOCOL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const ATSP_VERSION = '1.0' as const
export const ATSP_TTL_MS = 60_000 // 60 second TTL for intent declarations
export const ATSP_MAX_LATENCY_MS = 100 // Target latency for X-ATSP-Latency header

// Circuit breaker states
export const CIRCUIT_STATES = {
  CLOSED: 'CLOSED',       // Normal operation
  OPEN: 'OPEN',           // All requests blocked
  HALF_OPEN: 'HALF_OPEN', // Testing recovery
} as const

export type CircuitState = typeof CIRCUIT_STATES[keyof typeof CIRCUIT_STATES]

// ═══════════════════════════════════════════════════════════════════════════
// BIGINT UTILITIES (Lamport Precision)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse a string amount to BigInt (lamport precision)
 * Handles both integer strings and decimal notation
 */
export function parseAmount(amount: string, decimals: number = 9): bigint {
  // Validate format
  if (!/^\d+(\.\d+)?$/.test(amount)) {
    throw new Error(`Invalid amount format: ${amount}`)
  }

  const [whole, fraction = ''] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + paddedFraction)
}

/**
 * Format a BigInt lamport amount to human-readable string
 */
export function formatAmount(lamports: bigint, decimals: number = 9): string {
  const str = lamports.toString().padStart(decimals + 1, '0')
  const whole = str.slice(0, -decimals) || '0'
  const fraction = str.slice(-decimals).replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole
}

/**
 * Safe BigInt multiplication for percentage calculations
 */
export function multiplyByPercent(amount: bigint, percent: number): bigint {
  const basisPoints = BigInt(Math.round(percent * 100))
  return (amount * basisPoints) / 10000n
}

// ═══════════════════════════════════════════════════════════════════════════
// INTENT HASH GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a deterministic hash of the intent declaration
 * Used for audit trails and verification
 */
export function createIntentHash(intent: {
  agentId: string
  action: { type: string }
  amount: string
  timestamp: number
}): string {
  const payload = JSON.stringify({
    agentId: intent.agentId,
    actionType: intent.action.type,
    amount: intent.amount,
    timestamp: intent.timestamp,
  })
  return createHash('sha256').update(payload).digest('hex')
}

/**
 * Create IPI (Intent Pre-Image) verification hash
 * Proves the agent scanned specific context before making a decision
 */
export function createIpiVerificationHash(context: {
  scannedTokens: string[]
  scannedProtocols: string[]
  marketConditions: Record<string, unknown>
  timestamp: number
}): string {
  const payload = JSON.stringify({
    tokens: context.scannedTokens.sort(),
    protocols: context.scannedProtocols.sort(),
    conditions: context.marketConditions,
    ts: context.timestamp,
  })
  return createHash('sha256').update(payload).digest('hex')
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION SCHEMAS (7-Variant Discriminated Union)
// ═══════════════════════════════════════════════════════════════════════════

const SwapActionSchema = z.object({
  type: z.literal('SWAP'),
  fromToken: z.string(),
  toToken: z.string(),
  slippageBps: z.number().int().min(0).max(10000),
  route: z.string().optional(), // Jupiter route identifier
})

const TransferActionSchema = z.object({
  type: z.literal('TRANSFER'),
  token: z.string(),
  recipient: z.string().length(44), // Solana pubkey
  memo: z.string().max(256).optional(),
})

const LpActionSchema = z.object({
  type: z.literal('LP'),
  pool: z.string(),
  tokenA: z.string(),
  tokenB: z.string(),
  amountA: z.string().regex(/^\d+$/),
  amountB: z.string().regex(/^\d+$/),
})

const StakeActionSchema = z.object({
  type: z.literal('STAKE'),
  validator: z.string().length(44),
  lockupPeriodDays: z.number().int().min(0).optional(),
})

const UnstakeActionSchema = z.object({
  type: z.literal('UNSTAKE'),
  validator: z.string().length(44),
  immediate: z.boolean().default(false),
})

const VoteActionSchema = z.object({
  type: z.literal('VOTE'),
  proposal: z.string(),
  vote: z.enum(['FOR', 'AGAINST', 'ABSTAIN']),
  governance: z.string(), // Governance program address
})

const X402StreamActionSchema = z.object({
  type: z.literal('X402_STREAM'),
  recipient: z.string().length(44),
  ratePerSecond: z.string().regex(/^\d+$/), // Lamports per second
  durationSeconds: z.number().int().min(1),
  cancelable: z.boolean().default(true),
})

export const ATSPActionSchema = z.discriminatedUnion('type', [
  SwapActionSchema,
  TransferActionSchema,
  LpActionSchema,
  StakeActionSchema,
  UnstakeActionSchema,
  VoteActionSchema,
  X402StreamActionSchema,
])

export type ATSPAction = z.infer<typeof ATSPActionSchema>

// ═══════════════════════════════════════════════════════════════════════════
// DECISION TRACE SCHEMA (Causal Reasoning Chain)
// ═══════════════════════════════════════════════════════════════════════════

export const DecisionTraceSchema = z.object({
  // "Because X showed Y, agent concluded Z"
  causalReasoningChain: z.string().min(10).max(2000),
  
  // Confidence level (0-1)
  confidence: z.number().min(0).max(1),
  
  // Factors considered
  factors: z.array(z.object({
    name: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
    weight: z.number().min(0).max(1),
  })).optional(),
  
  // Risk assessment
  riskScore: z.number().min(0).max(100).optional(),
  
  // MiCA Article 14 compliance marker
  micaCompliant: z.boolean().default(true),
})

export type DecisionTrace = z.infer<typeof DecisionTraceSchema>

// ═══════════════════════════════════════════════════════════════════════════
// INTENT DECLARATION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const ATSPIntentDeclarationSchema = z.object({
  // Protocol version
  version: z.literal('1.0'),
  
  // Non-Human Identity (NHI) identifier
  agentId: z.string().min(1).max(128),
  
  // Amount in lamport precision (string for BigInt safety)
  amount: z.string().regex(/^\d+$/, 'Amount must be a numeric string'),
  
  // Proof of scanned context (64-char hex hash)
  ipiVerificationHash: z.string().length(64).regex(/^[a-f0-9]+$/i),
  
  // The intended action
  action: ATSPActionSchema,
  
  // Causal reasoning for audit trails
  decisionTrace: DecisionTraceSchema,
  
  // Timestamp of intent creation
  timestamp: z.number().int().positive(),
  
  // Time-to-live in milliseconds
  ttl: z.number().int().positive().default(ATSP_TTL_MS),
  
  // Optional: Squads V4 multisig reference
  squadsVaultPda: z.string().length(44).optional(),
  
  // Optional: Parent intent for chained operations
  parentIntentHash: z.string().length(64).optional(),
})

export type ATSPIntentDeclaration = z.infer<typeof ATSPIntentDeclarationSchema>

// ═══════════════════════════════════════════════════════════════════════════
// VERDICT RESPONSE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const VerdictType = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  DEFERRED: 'DEFERRED',
  GUARD: 'GUARD',
} as const

export type VerdictType = typeof VerdictType[keyof typeof VerdictType]

export const ATSPVerdictResponseSchema = z.object({
  // Echo back the intent hash
  intentHash: z.string().length(64),
  
  // The verdict
  verdict: z.enum(['APPROVED', 'DENIED', 'DEFERRED', 'GUARD']),
  
  // Reason for the verdict
  reason: z.string().max(500),
  
  // Processing latency in milliseconds
  latencyMs: z.number().int().min(0),
  
  // Sentry log ID for audit trail
  sentryLogId: z.string().uuid().optional(),
  
  // Webacy DD score if screening was performed
  webacyDdScore: z.number().min(0).max(100).optional(),
  
  // Risk flags triggered
  riskFlags: z.array(z.string()).optional(),
  
  // Circuit breaker state at time of decision
  circuitState: z.enum(['CLOSED', 'OPEN', 'HALF_OPEN']),
  
  // Timestamp of verdict
  timestamp: z.number().int().positive(),
  
  // Expiry timestamp for DEFERRED verdicts
  expiresAt: z.number().int().positive().optional(),
  
  // Policy violations if DENIED
  policyViolations: z.array(z.object({
    policy: z.string(),
    violation: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  })).optional(),
})

export type ATSPVerdictResponse = z.infer<typeof ATSPVerdictResponseSchema>

// ═══════════════════════════════════════════════════════════════════════════
// POLICY SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const PolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  
  // Policy type
  type: z.enum([
    'VOLUME_LIMIT',
    'BLACKOUT_WINDOW',
    'TOKEN_WHITELIST',
    'TOKEN_BLACKLIST',
    'RECIPIENT_WHITELIST',
    'MAX_SLIPPAGE',
    'RATE_LIMIT',
  ]),
  
  // Policy parameters (type-specific)
  params: z.record(z.unknown()),
  
  // Action on violation
  violationAction: z.enum(['DENY', 'DEFER', 'GUARD', 'WARN']),
})

export type Policy = z.infer<typeof PolicySchema>

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOG SCHEMA (For Supabase)
// ═══════════════════════════════════════════════════════════════════════════

export const ATSPAuditLogSchema = z.object({
  id: z.string().uuid(),
  intentHash: z.string().length(64),
  agentId: z.string(),
  actionType: z.string(),
  amount: z.string(),
  verdict: z.enum(['APPROVED', 'DENIED', 'DEFERRED', 'GUARD']),
  reason: z.string(),
  latencyMs: z.number(),
  webacyDdScore: z.number().optional(),
  causalReasoningChain: z.string(),
  confidence: z.number(),
  circuitState: z.enum(['CLOSED', 'OPEN', 'HALF_OPEN']),
  policyViolations: z.array(z.unknown()).optional(),
  createdAt: z.string().datetime(),
})

export type ATSPAuditLog = z.infer<typeof ATSPAuditLogSchema>

// ═══════════════════════════════════════════════════════════════════════════
// ATSP v1.1 PREVIEW TYPES (Future)
// ═══════════════════════════════════════════════════════════════════════════

export const ATSP_V1_1_PREVIEW = {
  TRUST_THRESHOLD: {
    description: 'Dynamic trust scoring between agents and sentries',
    schema: z.object({
      agentTrustScore: z.number().min(0).max(100),
      requiredThreshold: z.number().min(0).max(100),
      historicalPerformance: z.number().min(0).max(1),
    }),
  },
  HANDSHAKE_PROTOCOL: {
    description: 'Bi-directional verification before intent processing',
    schema: z.object({
      sentryChallenge: z.string().length(64),
      agentResponse: z.string().length(64),
      verifiedAt: z.number(),
    }),
  },
} as const

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate an intent declaration and return typed result
 */
export function validateIntent(data: unknown): {
  success: boolean
  data?: ATSPIntentDeclaration
  error?: z.ZodError
} {
  const result = ATSPIntentDeclarationSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Check if an intent has expired based on TTL
 */
export function isIntentExpired(intent: ATSPIntentDeclaration): boolean {
  const expiresAt = intent.timestamp + intent.ttl
  return Date.now() > expiresAt
}

/**
 * Create a SKIP declaration for Proof of No-Trade
 */
export function createSkipDeclaration(params: {
  agentId: string
  reason: string
  scannedContext: {
    tokens: string[]
    protocols: string[]
    conditions: Record<string, unknown>
  }
  confidence: number
}): ATSPIntentDeclaration {
  const timestamp = Date.now()
  
  return {
    version: '1.0',
    agentId: params.agentId,
    amount: '0', // No capital at risk
    ipiVerificationHash: createIpiVerificationHash({
      scannedTokens: params.scannedContext.tokens,
      scannedProtocols: params.scannedContext.protocols,
      marketConditions: params.scannedContext.conditions,
      timestamp,
    }),
    action: {
      type: 'TRANSFER',
      token: 'USDC',
      recipient: '11111111111111111111111111111111', // System program (null transfer)
      memo: 'SKIP_DECLARATION',
    },
    decisionTrace: {
      causalReasoningChain: params.reason,
      confidence: params.confidence,
      micaCompliant: true,
    },
    timestamp,
    ttl: ATSP_TTL_MS,
  }
}
