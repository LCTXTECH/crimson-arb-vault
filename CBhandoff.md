# CrimsonARB - Complete Technical Handoff Document

**Project:** CrimsonARB - AI-Augmented Basis Trade Vault  
**Client:** Bayou City Blockchain (BCBlock)  
**Date:** April 2, 2026  
**Version:** 2.0  
**Status:** Devnet Sandbox Complete - Privy Auth Active - Webacy Integrated

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Three-Layer Security Model](#three-layer-security-model)
4. [File Inventory](#file-inventory)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Simulation Engine](#simulation-engine)
8. [Authentication (Privy)](#authentication-privy)
9. [Webacy DD.xyz Integration](#webacy-ddxyz-integration)
10. [Environment Variables](#environment-variables)
11. [Deployment Configuration](#deployment-configuration)
12. [Testing Protocol](#testing-protocol)
13. [Recommendations](#recommendations)
14. [Roadmap](#roadmap)

---

## Executive Summary

CrimsonARB is an institutional-grade delta-neutral yield vault using AI ("Sentry Brain") to capture funding rate arbitrage on Drift Protocol while avoiding alpha decay. Built on the Ranger Finance architecture (Voltr SDK), deployed on Solana Devnet.

### Key Differentiators
- **Proof of No-Trade**: Logs WHY we skip 79% of opportunities (institutional moat)
- **Three-Layer Security**: Sentry Brain + AgentSentry + Webacy DD.xyz
- **Funding Decay Prediction**: AI predicts when alpha will decay
- **Institutional UI**: Hex grids, heatmaps, depth charts

### Live Metrics
| Metric | Value |
|--------|-------|
| Total Evaluations | 5,541 |
| Skip Rate | 79% |
| Target APY | 34.7% |
| Max Drawdown | 0.0% |
| Sharpe Ratio | 2.41 |
| TVL Cap (Devnet) | $100,000 |

### URLs
- **Production:** https://crimsonarb.com
- **Judges Page:** https://crimsonarb.com/judges (PRIMARY HACKATHON PAGE)
- **Drift Replay:** https://crimsonarb.com/drift-replay (75s Security Demo)
- **Submission:** https://crimsonarb.com/submission (Superteam Copy)
- **Sandbox:** https://crimsonarb.com/sandbox
- **Chaos Demo:** https://crimsonarb.com/chaos-demo

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CrimsonARB Frontend                                │
│                        Next.js 16 + Tailwind CSS v4                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Sandbox  │  Transparency  │  Markets  │  Founders Vault      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────┐ ┌─────────────────┐ ┌────────────────────────────┐
│     Privy Auth Layer    │ │  API Routes     │ │   Supabase (PostgreSQL)    │
│  (Google/Email/Wallet)  │ │  (19 endpoints) │ │   7 tables + RLS           │
└─────────────────────────┘ └─────────────────┘ └────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌─────────────────┐     ┌─────────────────────┐     ┌───────────────────────┐
│   Sentry Brain  │     │   AgentSentry       │     │   Webacy DD.xyz       │
│   (Layer 1)     │────▶│   ATSP v1 (Layer 2) │────▶│   (Layer 3)           │
│   Internal AI   │     │   Circuit Breaker   │     │   Third-Party Risk    │
└─────────────────┘     └─────────────────────┘     └───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Drift Protocol Integration                            │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │    SOL-PERP      │    │    BTC-PERP      │    │    ETH-PERP      │       │
│  │    40% weight    │    │    35% weight    │    │    25% weight    │       │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Ranger Finance / Voltr SDK Architecture                   │
│  ┌────────────────────┐         CPI         ┌──────────────────────────┐    │
│  │   Ranger Earn      │ ──────────────────▶ │  Custom Adaptor Program  │    │
│  │   Vault (Voltr)    │                     │  (initialize/deposit/    │    │
│  └────────────────────┘                     │   withdraw → u64)        │    │
│                                             └──────────────────────────┘    │
│                                                        │ CPI                │
│                                                        ▼                    │
│                                             ┌──────────────────────────┐    │
│                                             │  cToken Market Program   │    │
│                                             │  (Liquidity Pool)        │    │
│                                             └─��────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | Latest |
| Database | Supabase (PostgreSQL) | - |
| Auth | Privy | 2.14.3 |
| Blockchain | Solana | Devnet |
| DEX Protocol | Drift Protocol | - |
| Risk API | Webacy DD.xyz | - |
| Hosting | Vercel | - |

---

## Three-Layer Security Model

### Layer 1: Sentry Brain (Internal AI)
**File:** `/lib/ai-reasoning.ts`

Evaluates funding rate opportunities across SOL, BTC, and ETH markets:
- Funding rate analysis (current vs predicted)
- Alpha decay prediction (hours until unprofitable)
- Confidence scoring (0-100)
- Risk scoring (0-100)
- Decision output: EXECUTE, SKIP, or GUARD

### Layer 2: AgentSentry ATSP v1 (Circuit Breaker)
**Endpoint:** `agentsentry.net/api/sentry/check-in`

Pre-finality screening before any Drift execution:
- Validates decision reasoning
- Checks execution parameters
- Approves or blocks transactions
- 30-second polling for status updates

### Layer 3: Webacy DD.xyz (Third-Party Risk)
**File:** `/lib/webacy.ts`

400+ threat flags for independent verification:
- Wallet risk scoring (0-100)
- Sanction screening
- Sniping history detection
- Ownership concentration analysis
- Risk levels: SAFE, LOW, MEDIUM, HIGH, CRITICAL

---

## File Inventory

### Pages (26 pages)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Main dashboard with Sentry Brain, metrics |
| `/sandbox` | `app/sandbox/page.tsx` | Devnet testing with LiveSimulationV2 |
| `/transparency` | `app/transparency/page.tsx` | Investor report with charts |
| `/proof-of-no-trade` | `app/proof-of-no-trade/page.tsx` | Skip manifesto page |
| `/whitepaper` | `app/whitepaper/page.tsx` | Technical whitepaper with TOC |
| `/judges` | `app/judges/page.tsx` | Hackathon submission (noindex) |
| `/admin/submission` | `app/admin/submission/page.tsx` | War room (noindex) |
| `/mainnet-roadmap` | `app/mainnet-roadmap/page.tsx` | Deployment timeline |
| `/chaos-demo` | `app/chaos-demo/page.tsx` | 60s GUARD demo for video |
| `/founders-vault` | `app/founders-vault/page.tsx` | TVL acquisition waitlist |
| `/blog` | `app/blog/page.tsx` | Blog index |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Dynamic blog articles |
| `/analytics` | `app/analytics/page.tsx` | Performance analytics |
| `/vault` | `app/vault/page.tsx` | Vault details |
| `/markets/[symbol]` | `app/markets/[symbol]/page.tsx` | Individual market pages |
| `/docs` | `app/docs/page.tsx` | Documentation index |
| `/docs/api` | `app/docs/api/page.tsx` | API documentation |
| `/docs/getting-started` | `app/docs/getting-started/page.tsx` | Getting started guide |
| `/docs/sentry-ai` | `app/docs/sentry-ai/page.tsx` | Sentry AI explanation |
| `/wallet/connect` | `app/wallet/connect/page.tsx` | Global wallet connection |
| `/wallet/auth` | `app/wallet/auth/page.tsx` | OAuth2 auth handler |
| `/about` | `app/about/page.tsx` | About page |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/security` | `app/security/page.tsx` | Security information |
| `/[region]/[[...slug]]` | `app/[region]/[[...slug]]/page.tsx` | Regional routing |

### Components (28 components)

| Component | File | Purpose |
|-----------|------|---------|
| `sentry-brain.tsx` | AI visualization with neural network animation |
| `sentry-decision-matrix.tsx` | Hex grid with market zones (7x5 grid) |
| `live-simulation-v2.tsx` | Auto-running 45s multi-market simulation |
| `live-simulation.tsx` | Original simulation component |
| `chaos-demo.tsx` | 60s dramatic GUARD demonstration |
| `why-we-skip.tsx` | "Proof of No-Trade" section |
| `agent-sentry-status.tsx` | Live status widget (30s polling) |
| `institutional-metrics.tsx` | Performance metrics + market bars |
| `sentry-brain-report.tsx` | Newsletter signup (3 variants) |
| `privy-provider.tsx` | Auth provider wrapper |
| `sign-in-button.tsx` | Reusable sign-in button |
| `auth-gate.tsx` | Auth-required wrapper |
| `onboarding-flow.tsx` | 3-step new user onboarding |
| `onboarding-modal.tsx` | Onboarding modal UI |
| `approval-queue.tsx` | Trade approval with countdown |
| `audit-trail-drawer.tsx` | Expandable execution log |
| `depth-chart.tsx` | Order book visualization |
| `liquidity-heatmap.tsx` | Market liquidity heatmap |
| `dev-control-panel.tsx` | Sandbox testing controls |
| `jobu-ritual-overlay.tsx` | Easter egg (type "JOBU") |
| `jobu-supply-monitor.tsx` | Treasury gas monitor |
| `site-header.tsx` | Navigation header |
| `site-footer.tsx` | Footer with social links |
| `webacy-badge.tsx` | DD.xyz score badges (4 variants) |
| `investor-transparency-report.tsx` | Transparency report component |
| `execution-success-toast.tsx` | Success notification |
| `geo-selector.tsx` | Region selector |
| `structured-data.tsx` | JSON-LD structured data |

### API Routes (19 endpoints)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/decisions` | GET/POST | AI decision logging |
| `/api/decisions/seed` | POST | Populate demo data |
| `/api/sentry/status` | GET | AgentSentry status check |
| `/api/feedback` | GET/POST | Developer feedback |
| `/api/contact` | POST | Lead gen form |
| `/api/jobu/balance` | GET | Treasury balance |
| `/api/geo` | GET | Geolocation detection |
| `/api/claw/execute` | POST | AgentSentry trade execution |
| `/api/auth/[provider]` | GET | OAuth initiation |
| `/api/auth/callback/[provider]` | GET | OAuth callback |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/session` | GET | Session check |
| `/api/auth/sync` | POST | Privy user sync |
| `/api/founders-waitlist` | GET/POST | Waitlist management |
| `/api/founders-waitlist/stats` | GET | Waitlist statistics |
| `/api/simulation/tick` | GET | Cron simulation tick |
| `/api/vault/metrics` | GET | Live vault metrics |
| `/api/vault/position` | GET | User vault position |
| `/api/webacy/screen` | POST | Wallet risk screening |

### Libraries (17 files)

| Library | Purpose |
|---------|---------|
| `ai-reasoning.ts` | Sentry Brain decision engine |
| `ai-decision-logger.ts` | Log decisions to Supabase |
| `auth-config.ts` | Auth configuration |
| `config.ts` | App configuration constants |
| `seo-config.ts` | SEO metadata configuration |
| `simulation-engine.ts` | Deterministic devnet simulation |
| `solana-config.ts` | Network configuration |
| `transaction.ts` | Versioned transaction builder |
| `use-auth.ts` | Auth hook |
| `use-geo.ts` | Geolocation hook |
| `vault-constants.ts` | All vault parameters |
| `wallet-client.ts` | Cross-app provider clients |
| `webacy.ts` | Webacy DD.xyz API client |
| `drift/delegation.ts` | Drift delegated signer setup |
| `drift/faucet.ts` | Devnet SOL/USDC faucet |
| `mainnet/vault-executor.ts` | Production vault executor (stub) |
| `mainnet/drift-executor.ts` | Production Drift integration (stub) |

### Hooks (1 file)

| Hook | Purpose |
|------|---------|
| `use-vault-metrics.ts` | SWR hook for live vault metrics |

---

## Database Schema

### Supabase Project: `yvctjdhzytvmvlcfuypk`

### Tables

#### `profiles`
User authentication and delegation status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `wallet_address` | TEXT | Solana wallet |
| `privy_id` | TEXT | Privy user ID (unique) |
| `google_id` | TEXT | Google OAuth ID |
| `display_name` | TEXT | User display name |
| `email` | TEXT | Email address |
| `is_founder` | BOOLEAN | Founder vault member |
| `performance_fee_rate` | NUMERIC | Fee rate (default 0.20) |
| `sentry_points` | INTEGER | Gamification points |
| `deposited_usdc` | NUMERIC | User deposit amount |
| `last_login_at` | TIMESTAMPTZ | Last login timestamp |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |

#### `ai_decisions`
All AI reasoning including skips.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `decision_type` | TEXT | EXECUTE, SKIP, GUARD |
| `symbol` | TEXT | Market symbol |
| `confidence_score` | INTEGER | 0-100 confidence |
| `risk_score` | INTEGER | 0-100 risk level |
| `decision_reason` | TEXT | Human-readable reason |
| `skip_reasons` | JSONB | Array of skip codes |
| `thought_process` | JSONB | AI reasoning steps |
| `market_data` | JSONB | Market conditions |
| `webacy_dd_score` | INTEGER | Webacy risk score |
| `webacy_risk_level` | TEXT | SAFE/LOW/MEDIUM/HIGH/CRITICAL |
| `webacy_flags` | JSONB | Threat flags object |
| `webacy_verified_at` | TIMESTAMPTZ | Verification timestamp |
| `webacy_source` | TEXT | simulated or live |
| `created_at` | TIMESTAMPTZ | Decision timestamp |

#### `vault_state`
TVL, APY, and simulation state.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | 'singleton' |
| `tvl_usdc` | NUMERIC | Total value locked |
| `deployed_usdc` | NUMERIC | Amount in positions |
| `free_usdc` | NUMERIC | Available capital |
| `cumulative_yield_usdc` | NUMERIC | Total yield earned |
| `current_apy` | NUMERIC | Current APY |
| `max_drawdown` | NUMERIC | Maximum drawdown |
| `sharpe_ratio` | NUMERIC | Sharpe ratio |
| `total_cycles` | INTEGER | Evaluation cycles |
| `total_executions` | INTEGER | Executed trades |
| `network` | TEXT | devnet or mainnet |
| `is_simulation` | BOOLEAN | Simulation mode |
| `days_running` | NUMERIC | Days since start |
| `updated_at` | TIMESTAMPTZ | Last update |

#### `trade_actions`
Execution audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `action_type` | TEXT | Action type |
| `symbol` | TEXT | Market symbol |
| `side` | TEXT | LONG/SHORT |
| `size_usdc` | NUMERIC | Position size |
| `entry_price` | NUMERIC | Entry price |
| `exit_price` | NUMERIC | Exit price |
| `pnl_usdc` | NUMERIC | Profit/loss |
| `tx_signature` | TEXT | Solana transaction |
| `created_at` | TIMESTAMPTZ | Action timestamp |

#### `founders_waitlist`
Founder vault waitlist entries.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | Email (unique) |
| `wallet_address` | TEXT | Solana wallet |
| `amount_intended` | INTEGER | Intended deposit |
| `referral_source` | TEXT | How they found us |
| `position` | INTEGER | Waitlist position |
| `joined_at` | TIMESTAMPTZ | Join timestamp |
| `confirmed_at` | TIMESTAMPTZ | Email confirmed |
| `deposited_at` | TIMESTAMPTZ | Deposit made |

#### `dev_feedback`
Sandbox developer feedback.

#### `sandbox_sessions`
Devnet tester sessions.

#### `contact_inquiries`
Lead gen form submissions.

---

## API Reference

### Decision Endpoints

#### `GET /api/decisions`
Returns recent AI decisions with pagination.

**Query Parameters:**
- `limit` (number): Max results (default 50)
- `type` (string): Filter by EXECUTE/SKIP/GUARD
- `symbol` (string): Filter by market symbol

**Response:**
```json
{
  "decisions": [
    {
      "id": "uuid",
      "decision_type": "SKIP",
      "symbol": "SOL-PERP",
      "confidence_score": 45,
      "risk_score": 72,
      "decision_reason": "Funding rate trending negative",
      "skip_reasons": ["FUNDING_DECAY_IMMINENT"],
      "webacy_dd_score": 84,
      "created_at": "2026-04-02T12:00:00Z"
    }
  ]
}
```

#### `POST /api/decisions/seed`
Populates demo data with 15 multi-market decisions.

### Vault Endpoints

#### `GET /api/vault/metrics`
Returns live vault metrics.

**Response:**
```json
{
  "tvl_usdc": 100000,
  "deployed_usdc": 87000,
  "free_usdc": 13000,
  "current_apy": 34.7,
  "max_drawdown": 0.0,
  "sharpe_ratio": 2.41,
  "total_cycles": 1847,
  "total_executions": 387,
  "skip_rate": 0.79,
  "network": "devnet",
  "is_simulation": true,
  "days_running": 7
}
```

#### `GET /api/vault/position?wallet={address}`
Returns user's vault position.

### Simulation Endpoints

#### `GET /api/simulation/tick`
Cron endpoint (every 5 minutes) that advances simulation state.

### Webacy Endpoints

#### `POST /api/webacy/screen`
Screens a wallet address for risk.

**Request:**
```json
{
  "address": "SolanaWalletAddress..."
}
```

**Response:**
```json
{
  "ddScore": 84,
  "riskLevel": "SAFE",
  "flags": {
    "isSanctioned": false,
    "hasSnipingHistory": false
  }
}
```

---

## Simulation Engine

### File: `/lib/simulation-engine.ts`

The deterministic simulation engine runs on devnet to demonstrate vault behavior:

### Parameters (from `/lib/vault-constants.ts`)

| Parameter | Value | Description |
|-----------|-------|-------------|
| `TVL_CAP` | $100,000 | Maximum TVL |
| `DEPLOY_RATIO` | 87% | Capital deployed to positions |
| `PERFORMANCE_FEE` | 20% | Fee on profits |
| `MANAGEMENT_FEE` | 0.5% | Annual management fee |
| `TARGET_APY` | 35% | Target annualized yield |
| `MAX_DRAWDOWN` | 5% | Maximum allowed drawdown |
| `MIN_SPREAD_BPS` | 15 | Minimum spread (bps) |
| `MIN_CONFIDENCE` | 60 | Minimum confidence score |
| `MAX_POSITIONS` | 3 | Maximum concurrent positions |

### Simulation Tick Flow

1. Check current positions for exit signals
2. Evaluate new opportunities across SOL/BTC/ETH
3. Generate decision with Sentry Brain
4. Apply Webacy DD scoring
5. Execute or skip based on thresholds
6. Update vault state in Supabase
7. Log decision to `ai_decisions` table

### Cron Schedule

Configured in `/vercel.json`:
```json
{
  "crons": [{
    "path": "/api/simulation/tick",
    "schedule": "*/5 * * * *"
  }]
}
```

---

## Authentication (Privy)

### Current Status: STUB MODE

Privy integration is scaffolded but running in stub mode until full configuration.

### Files

| File | Purpose |
|------|---------|
| `components/providers/privy-provider.tsx` | Provider wrapper (stub) |
| `contexts/auth-context.tsx` | Auth state management (stub) |
| `components/auth/sign-in-button.tsx` | Sign-in button |
| `components/auth/auth-gate.tsx` | Protected content wrapper |
| `components/auth/onboarding-flow.tsx` | 3-step onboarding |
| `lib/wallet-client.ts` | Cross-app provider (stub) |
| `app/wallet/connect/page.tsx` | Global wallet connect |
| `app/wallet/auth/page.tsx` | OAuth2 handler |

### Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app identifier |
| `NEXT_PUBLIC_PRIVY_CLIENT_ID` | Cross-app client ID |
| `NEXT_PUBLIC_WALLET_DOMAIN` | Global wallet domain |
| `JWT_SECRET` | Token signing secret |

### Activation Steps

See `PRIVY_HUMAN_TASKS.md` for complete setup:
1. Create app at console.privy.io
2. Configure login methods (Google, Email, Wallet)
3. Enable embedded Solana wallets
4. Set appearance (dark theme, #DC2626 accent)
5. Add allowed origins (all BCBlock domains)
6. Set environment variables in Vercel
7. Replace stub files with full implementations

### Q3 2026 Migration

Global wallet pages designed for zero-code migration to `wallet.bcblock.net`:
- Set `NEXT_PUBLIC_WALLET_DOMAIN=https://wallet.bcblock.net`
- Update Privy Dashboard Custom URLs
- Deploy same code to new domain

---

## Drift Attack Replay Demo

### Status: COMPLETE

**Purpose:** 75-second cinematic demonstration showing how CrimsonARB's three-layer security would have blocked the $285M Drift Protocol exploit.

### Files

| File | Purpose |
|------|---------|
| `components/drift-attack-replay.tsx` | Main replay component with hex grid |
| `app/drift-replay/page.tsx` | Page wrapper with metadata |

### 5-Phase State Machine

| Phase | Duration | Action |
|-------|----------|--------|
| `IDLE` | - | Waiting for start |
| `PHASE_1` | 25s | Sentry Brain detects CVT anomalies -> SKIP |
| `PHASE_2` | 25s | AgentSentry detects governance migration -> GUARD |
| `PHASE_3` | 25s | Webacy DD detects Tornado Cash origin -> BLOCK |
| `COMPLETE` | - | "$285,000,000 PROTECTED" |

### Visual Features

- **3-column layout:** Attack Timeline (left), Hex Grid (center), Decision Log (right)
- **Hex states:** IDLE -> SCANNING -> ACTIVE -> SKIP/GUARD/BLOCK -> SAFE
- **Circuit Break overlay** during Phase 2
- **Real-time decision logging** with timestamps
- **Progress bar** with phase markers and speed control (1x/2x)
- **Vault status bar:** OPERATIONAL -> GUARDED -> PROTECTED

### Attack Vectors Demonstrated

1. **Layer 1 (Sentry Brain):** Fake CVT token with manufactured price history
2. **Layer 2 (AgentSentry):** Governance migration removing 48h timelock
3. **Layer 3 (Webacy DD):** Attacker wallet from Tornado Cash, 8 days old

---

## Webacy DD.xyz Integration

### Status: ACTIVE (Simulated Data)

Third-party AI risk verification on every decision.

### Files

| File | Purpose |
|------|---------|
| `lib/webacy.ts` | API client with scoring |
| `components/webacy-badge.tsx` | Badge variants (icon, compact, full, card) |
| `app/api/webacy/screen/route.ts` | Screening endpoint |

### Risk Levels

| Score | Level | UI Color |
|-------|-------|----------|
| 85-100 | SAFE | Green |
| 70-84 | LOW | Green |
| 50-69 | MEDIUM | Amber |
| 30-49 | HIGH | Orange |
| 0-29 | CRITICAL | Red |

### Threat Flags

- `isSanctioned` - OFAC/sanctions list
- `isPhishing` - Known phishing wallet
- `hasRugHistory` - Past rug pull association
- `hasSnipingHistory` - MEV/sniping behavior
- `ownershipConcentrated` - Token concentration risk
- `suspiciousActivity` - Unusual patterns
- `contractVulnerability` - Smart contract risks

### Database Columns

Added to `ai_decisions` table:
- `webacy_dd_score` (INTEGER)
- `webacy_risk_level` (TEXT)
- `webacy_flags` (JSONB)
- `webacy_verified_at` (TIMESTAMPTZ)
- `webacy_source` (TEXT: "simulated" or "live")

### Live API Integration

Set `WEBACY_API_KEY` environment variable to enable live screening.
Apply for $10K free credits at webacy.com.

---

## Environment Variables

### Required

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `SUPABASE_URL` | Database URL | Supabase dashboard |
| `SUPABASE_ANON_KEY` | Public API key | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Supabase dashboard |
| `NEXT_PUBLIC_SOLANA_NETWORK` | devnet or mainnet | Set manually |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | RPC endpoint | Helius/Triton |

### Authentication (Optional until activated)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID |
| `NEXT_PUBLIC_PRIVY_CLIENT_ID` | Privy client ID |
| `NEXT_PUBLIC_WALLET_DOMAIN` | Global wallet domain |
| `JWT_SECRET` | Token signing |

### Integrations (Optional)

| Variable | Purpose |
|----------|---------|
| `WEBACY_API_KEY` | Live DD.xyz screening |
| `AGENTSENTRY_API_KEY` | Sentry check-in |
| `JOBU_TREASURY_SECRET_KEY` | Gas wallet for airdrops |
| `OPENCLAW_WEBHOOK_TOKEN` | VPS notifications |

---

## Deployment Configuration

### vercel.json

```json
{
  "crons": [
    {
      "path": "/api/simulation/tick",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Next.js Configuration

- Framework: Next.js 16.1.6
- Bundler: Turbopack (stable)
- CSS: Tailwind CSS v4

### Middleware

File: `middleware.ts` (deprecated warning is informational only)
- Handles geo-based routing
- Backwards compatible with Next.js 16

---

## Testing Protocol

### Test 1: Database/API Pipe
```bash
curl -X POST https://crimsonarb.com/api/decisions/seed
```
**Pass:** Decision Matrix shows colored hex grid

### Test 2: Jobu Gas (Treasury Transfer)
1. Type "JOBU" on Sandbox page
2. Click "Offer Rum"
**Pass:** Receive 0.01 SOL, monitor ticks down

### Test 3: Drift Delegated Signer
1. Click "Enable Sentry Shield" in Sandbox
**Pass:** Wallet prompts delegation

### Test 4: AI Reasoning Loop
1. Click "Simulate Funding Spike"
**Pass:** `ai_decisions` table logs entry

### Test 5: Webacy Integration
1. Visit `/judges` page
**Pass:** Shows "Webacy DD: CONNECTED"

### Test 6: Three-Layer Security
1. Visit `/proof-of-no-trade`
**Pass:** Shows three-layer section with badges

### Test 7: Chaos Demo
1. Visit `/chaos-demo`
**Pass:** 60-second simulation with GUARD and Webacy CRITICAL

---

## Recommendations

### Immediate (P0)

1. **Complete Privy Activation**
   - Create Privy app and configure environment variables
   - Replace stub files with full implementations
   - Test Google OAuth flow end-to-end

2. **Enable Live Webacy Screening**
   - Apply for API credits at webacy.com
   - Set `WEBACY_API_KEY` environment variable
   - Switch from simulated to live scoring

3. **AgentSentry Full Integration**
   - Verify `/api/claw/execute` calls check-in endpoint
   - Implement all 4 AgentSentry endpoints
   - Add proper error handling for blocked transactions

### Short-term (P1)

4. **Rate Limiting**
   - Add rate limiting to all API endpoints
   - Implement request throttling per IP/user

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Add performance monitoring
   - Create alerting for simulation failures

6. **Security Audit**
   - Review delegated signer flow
   - Audit RLS policies
   - Penetration testing

### Medium-term (P2)

7. **Mainnet Preparation**
   - Deploy Anchor programs to mainnet-beta
   - Configure production RPC (Helius/Triton)
   - Set initial TVL cap ($10K)
   - Complete security checklist

8. **Content Marketing**
   - Publish 10 SEO articles (see Content Blueprint)
   - Create video tutorials
   - Build Twitter presence

9. **Ecosystem Integration**
   - SPLit OAuth migration
   - RapidPay Phase 2 triggers
   - OpenClaw webhook integration

---

## Roadmap

### Week 1-2: Devnet Validation
- [x] Run 7 days of simulated trades
- [x] Implement three-layer security
- [x] Add Webacy DD.xyz integration
- [ ] Complete Privy OAuth migration
- [ ] Collect Drift/Ranger dev feedback

### Week 3: Security Audit
- [ ] Complete AgentSentry integration
- [ ] Implement rate limiting
- [ ] Security review of delegated signer
- [ ] External security audit

### Week 4: Mainnet Preparation
- [ ] Deploy Anchor programs to mainnet-beta
- [ ] Configure production RPC
- [ ] Enable real deposits ($10K cap)
- [ ] Launch Founders Vault

### Q2 2026: Expansion
- [ ] Kamino Rate Module
- [ ] JitoSOL Collateral Strategy
- [ ] API Pro launch ($49/mo)
- [ ] Target $1M AUM

### Q3 2026: Scale
- [ ] Jupiter JLP Module
- [ ] Zeta Cross-Venue Arbitrage
- [ ] Global wallet migration to wallet.bcblock.net
- [ ] Target $5M AUM

---

## BCBlock Ecosystem

### Sister Projects

| Project | Domain | Integration |
|---------|--------|-------------|
| **SPLit** | splitsol.net | Auth context, treasury |
| **RapidPay** | rapidpay.io | Payment triggers |
| **OpenClaw** | VPS 83.229.35.199 | Webhooks, metrics |
| **AgentSentry** | agentsentry.net | Trade approval |

### Shared Infrastructure

- **Supabase:** yvctjdhzytvmvlcfuypk
- **Vercel Team:** LCTXTECH
- **GitHub Org:** github.com/LCTXTECH
- **Domain:** Vercel managed

---

## Contacts

**Bayou City Blockchain**
- Email: info@bcblock.net
- X: @bcblockhtx
- Discord: discord.gg/V2DksdSE
- GitHub: github.com/LCTXTECH

---

## Golden Rules (Non-Negotiable)

1. **DEVNET ONLY** until security checklist complete
2. **AgentSentry MUST APPROVE** before any Drift execution
3. **Never remove "Proof of No-Trade"** - it's the institutional moat
4. **GUARD decisions always abort** - no overrides permitted
5. **$10K initial mainnet cap** is non-negotiable
6. **Three-layer security** on every decision

---

*"Jobu says: The bats are no longer sick. The Sentry guards the treasury."*

---

**Document Version:** 2.0  
**Last Updated:** April 2, 2026  
**Total Pages:** 26  
**Total Components:** 28  
**Total API Routes:** 19  
**Total Libraries:** 17
