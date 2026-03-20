/**
 * Webacy DD.xyz Integration
 * Third-party AI risk intelligence - Layer 3 of CrimsonARB security stack
 */

export interface WebacyDDScore {
  ddScore: number           // 0-100 (lower = more risky)
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flags: {
    isSanctioned: boolean
    isPhishing: boolean
    hasSnipingHistory: boolean
    ownershipConcentrated: boolean
    addressPoisoning: boolean
    maliciousContract: boolean
  }
  verifiedAt: string        // ISO timestamp
  source: 'webacy-dd' | 'simulated'
  verifiedBy: 'Webacy DD.xyz'
}

function scoreToRiskLevel(score: number): WebacyDDScore['riskLevel'] {
  if (score >= 85) return 'SAFE'
  if (score >= 70) return 'LOW'
  if (score >= 50) return 'MEDIUM'
  if (score >= 30) return 'HIGH'
  return 'CRITICAL'
}

// Simulated scores for demo/devnet
// Generates deterministic scores based on address
function simulateWebacyScore(address: string): WebacyDDScore {
  const hash = address.split('').reduce(
    (acc, char) => acc + char.charCodeAt(0), 0
  )
  const score = 72 + (hash % 25) // 72-96 range = mostly safe
  
  return {
    ddScore: score,
    riskLevel: scoreToRiskLevel(score),
    flags: {
      isSanctioned: false,
      isPhishing: false,
      hasSnipingHistory: score < 78,
      ownershipConcentrated: false,
      addressPoisoning: false,
      maliciousContract: false,
    },
    verifiedAt: new Date().toISOString(),
    source: 'simulated',
    verifiedBy: 'Webacy DD.xyz',
  }
}

// Primary function: screen any address before interaction
export async function ddScreenAddress(
  address: string,
  chain: 'sol' | 'eth' | 'base' = 'sol'
): Promise<WebacyDDScore> {
  const apiKey = process.env.WEBACY_API_KEY

  // Simulated response for devnet / no API key
  if (!apiKey) {
    return simulateWebacyScore(address)
  }

  try {
    // Real Webacy API call
    const response = await fetch(`https://api.webacy.com/v1/address/${address}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Chain': chain.toUpperCase(),
      },
    })

    if (!response.ok) {
      console.warn('[Webacy] API error:', response.status)
      return simulateWebacyScore(address)
    }

    const result = await response.json()
    const score = 100 - (result.overallRisk || 0)
    
    return {
      ddScore: score,
      riskLevel: scoreToRiskLevel(score),
      flags: {
        isSanctioned: result.flags?.sanctioned || false,
        isPhishing: result.flags?.phishing || false,
        hasSnipingHistory: result.flags?.sniping || false,
        ownershipConcentrated: result.flags?.ownershipConcentration || false,
        addressPoisoning: result.flags?.addressPoisoning || false,
        maliciousContract: result.flags?.maliciousContract || false,
      },
      verifiedAt: new Date().toISOString(),
      source: 'webacy-dd',
      verifiedBy: 'Webacy DD.xyz',
    }
  } catch (error) {
    // Fail open — never block on API errors
    console.warn('[Webacy] API error, failing open:', error)
    return simulateWebacyScore(address)
  }
}

// Hard block thresholds for AgentSentry integration
export function webacyShouldBlock(score: WebacyDDScore): boolean {
  return (
    score.flags.isSanctioned ||
    score.flags.isPhishing ||
    score.flags.maliciousContract ||
    score.riskLevel === 'CRITICAL'
  )
}

export function webacyShouldWarn(score: WebacyDDScore): boolean {
  return (
    score.flags.hasSnipingHistory ||
    score.flags.ownershipConcentrated ||
    score.riskLevel === 'HIGH'
  )
}

// Generate a CRITICAL score for GUARD scenarios
export function generateCriticalScore(): WebacyDDScore {
  return {
    ddScore: 18,
    riskLevel: 'CRITICAL',
    flags: {
      isSanctioned: false,
      isPhishing: false,
      hasSnipingHistory: true,
      ownershipConcentrated: true,
      addressPoisoning: false,
      maliciousContract: false,
    },
    verifiedAt: new Date().toISOString(),
    source: 'simulated',
    verifiedBy: 'Webacy DD.xyz',
  }
}
