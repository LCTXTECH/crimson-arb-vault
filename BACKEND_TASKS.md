# CrimsonArb Backend Task List

**Last Updated:** March 14, 2026  
**Status:** Intelligence Layer Complete - Ready for Judge Demo

---

## Progress Overview

| Section | Status | Completion |
|---------|--------|------------|
| 1. Authentication Setup | In Progress | 40% |
| 2. Solana Program Development | Complete | 100% |
| 3. AgentSentry Integration | In Progress | 30% |
| 4. Database Setup | **COMPLETE** | 100% |
| 5. SEO & Search Indexing | Complete | 90% |
| 6. Monitoring & Observability | Pending | 0% |
| 7. Security Hardening | In Progress | 30% |
| 8. CI/CD Pipeline | Pending | 0% |
| **9. Devnet Sandbox** | **COMPLETE** | **100%** |

---

## Priority Legend
- **P0**: Critical - Blocks launch
- **P1**: High - Required for MVP
- **P2**: Medium - Post-MVP enhancement
- **P3**: Low - Nice to have

---

## 9. DEVNET SANDBOX (P0) - 100% COMPLETE

### Strategy: "Institutional Alpha" Pivot
We deploy to Devnet first to demonstrate high-TVL strategies with mock capital, battle-test the Predictive Decay Engine, and invite Drift/Ranger devs to "break" the system before real funds are at stake.

### 9.1 Sandbox Infrastructure
- [x] **Sandbox Dashboard** (`/app/sandbox/page.tsx`)
  - Large "DEVNET - TESTING MODE" banner
  - $100,000 Mock USDC balance display
  - "Mint Mock Alpha" button (+$50k on click)
  - Whale-sized position visualization
  - Real-time developer feedback widget
- [x] **Dev Control Panel** (`/components/dev-control-panel.tsx`)
  - Simulate Funding Spike (adjust UI to test AI triggers)
  - View Raw SDK Logs (Drift/Ranger transaction payloads)
  - Direct Feedback (saves to Supabase `dev_feedback` table)
  - Reset Sandbox button
  - Monospace, high-tech aesthetic
- [x] **Sandbox Layout** (`/app/sandbox/layout.tsx`)
  - SEO metadata for devnet testing
  - Proper OpenGraph tags

### 9.2 Devnet Configuration
- [x] **Environment Template** (`/.env.local.example`)
  - `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
  - `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`
  - `NEXT_PUBLIC_DRIFT_PROGRAM_ID=dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH`
  - `NEXT_PUBLIC_DRIFT_STATS_ID=6W9yiHDCZ9d9f52fQ6JpU13yidU5mH63bNo1vL9C3H9G`
  - `NEXT_PUBLIC_RANGER_STRATEGY_ID=vo1tWgqZMjG89MPASr4TT4aBECxKHys5XEbisLhJ27K`
  - Cobo Sandbox API for MPC simulation
- [x] **Solana Config Helper** (`/lib/solana-config.ts`)
  - Network detection (devnet/mainnet)
  - Program ID resolution per network
  - Connection factory

### 9.3 Drift Devnet Faucet
- [x] **Faucet Library** (`/lib/drift/faucet.ts`)
  - `airdropDevnetSol()` - Request 2 SOL from faucet
  - `mintMockUSDC()` - Mint devnet USDC via Drift faucet
  - `onboardSandboxTester()` - Full onboarding flow
  - `fundWhaleTester()` - Fund with $1M mock USDC
  - `createDelegatedSubaccount()` - Set up Sentry delegation

### 9.4 Database Tables (Migration: `add_dev_feedback_table`)
- [x] **`public.dev_feedback`** table
  - id, message, category, source
  - wallet_address, network, user_agent
  - resolved, resolution_notes
  - created_at, resolved_at
  - RLS: Anyone can submit and view feedback
- [x] **`public.sandbox_sessions`** table
  - id, wallet_address
  - initial/current SOL/USDC balances
  - total_trades, total_pnl
  - session_start, last_activity
  - RLS: Publicly viewable, anyone can create

### 9.5 Feedback API
- [x] **Feedback Endpoint** (`/app/api/feedback/route.ts`)
  - POST: Submit developer feedback
  - GET: Retrieve feedback history
  - Category filtering (bug, suggestion, question, praise)

### 9.6 Weekly Data Capture Goals
| Week | Phase | Goal |
|------|-------|------|
| Week 1 | Devnet Blitz | Capture 7 days of "High-TVL" devnet trades. Optimize the Predictive Decay Engine. |
| Week 2 | Dev Review | Share data logs with Ranger devs. Refine the Custom Adaptor based on feedback. |
| Week 3 | Mainnet Pivot | Flip to Mainnet with verified, dev-vetted "History of PnL" from Devnet. |

### Key Data Points to Capture
- **Funding Capture Efficiency**: (Realized Funding) / (Theoretical Max Funding)
- **Sentry Brain Accuracy**: Correct "Alpha Decay" predictions vs. false positives
- **Delegated Signer Latency**: Time from AI "Thought" to on-chain execution

---

## 1. Authentication Setup (P0) - 40% Complete

### 1.1 Google OAuth Configuration
- [ ] Create project in [Google Cloud Console](https://console.cloud.google.com)
- [ ] Enable Google+ API and OAuth consent screen
- [ ] Create OAuth 2.0 credentials (Web application)
- [ ] Add authorized redirect URI: `https://crimsonarb.com/api/auth/callback/google`
- [ ] Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel env vars
- [ ] Test OAuth flow end-to-end

### 1.2 X (Twitter) OAuth Configuration
- [ ] Create app in [Twitter Developer Portal](https://developer.twitter.com/en/portal)
- [ ] Enable OAuth 2.0 with PKCE
- [ ] Add callback URL: `https://crimsonarb.com/api/auth/callback/x`
- [ ] Copy `X_CLIENT_ID` and `X_CLIENT_SECRET` to Vercel env vars
- [ ] Test OAuth flow end-to-end

### 1.3 Session Security
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Set `JWT_SECRET` in Vercel env vars
- [ ] Verify HTTP-only cookie settings in production

### Completed:
- [x] Auth API routes created (`/api/auth/[provider]`, `/api/auth/callback/[provider]`)
- [x] Auth config library (`/lib/auth-config.ts`)
- [x] useAuth hook (`/lib/use-auth.ts`)
- [x] Onboarding modal with OAuth UI

---

## 2. Solana Program Development (P0) - 100% Complete

### 2.1 Local Development Setup
- [x] Anchor workspace configured (`Anchor.toml`)
- [x] Cargo workspace configured (`Cargo.toml`)
- [x] Program dependencies defined

### 2.2 Programs Created (Ranger Workshop 02 Architecture)
- [x] **cToken Market Program** (`/programs/ctoken-market-program/src/lib.rs`)
  - Liquidity pool with cToken mint/burn
  - Exchange rate calculation
  - Deposit/withdraw with proper accounting
- [x] **Custom Adaptor Program** (`/programs/custom-adaptor-program/src/lib.rs`)
  - Initialize, deposit, withdraw instructions
  - Returns u64 position value (per Voltr SDK spec)
  - CPI integration with cToken Market
- [x] Test suite (`/tests/custom-adaptor-program.ts`)
- [x] Transaction helper library (`/lib/transaction.ts`)

### 2.3 Deployment Commands
```bash
# Install dependencies
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/v2.1.0/install)"
cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.1 anchor-cli

# Build and test
anchor build
anchor test

# Deploy to devnet
solana config set --url devnet
solana airdrop 5  # Get devnet SOL for deployment
anchor deploy --program-name ctoken_market_program
anchor deploy --program-name custom_adaptor_program
```

---

## 3. AgentSentry Integration (P1) - 30% Complete

### 3.1 API Configuration
- [ ] Obtain AgentSentry API credentials from team
- [ ] Set `AGENTSENTRY_API_KEY` in Vercel env vars
- [ ] Configure webhook endpoint for trade notifications

### 3.2 Delegation Wallet Setup
- [x] Drift delegation library created (`/lib/drift/delegation.ts`)
- [x] Drift faucet library created (`/lib/drift/faucet.ts`)
- [ ] Generate AgentSentry delegate keypair
- [ ] Set `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` in Vercel env vars
- [ ] Test delegate authority on devnet

### 3.3 Webhook Integration
- [ ] Create `/api/webhooks/agentsentry` endpoint
- [ ] Set `AGENTSENTRY_WEBHOOK_SECRET` for signature verification
- [ ] Handle trade execution notifications

### Completed:
- [x] AI Reasoning Generator (`/lib/ai-reasoning.ts`)
- [x] Open Claw Execute API (`/api/claw/execute/route.ts`)

---

## 4. Database Setup (P1) - 100% COMPLETE

### 4.1 Supabase Integration
- [x] Supabase project connected (Project ID: `yvctjdhzytvmvlcfuypk`)
- [x] Environment variables configured in Vercel
- [x] Real-time publication enabled

### 4.2 Schema Created (Migration: `initial_schema`)
- [x] **`public.profiles`** table
- [x] **`public.trade_actions`** table (Audit Trail)
- [x] **`public.vault_state`** table (Ranger Leaderboard)

### 4.3 Sandbox Tables (Migration: `add_dev_feedback_table`)
- [x] **`public.dev_feedback`** table
- [x] **`public.sandbox_sessions`** table

### 4.4 AI Decisions Table (Migration: `add_ai_decisions_table`) - NEW
- [x] **`public.ai_decisions`** table - Logs ALL AI reasoning including non-trades
  - `decision_type`: EXECUTE, SKIP, GUARD, DEFER
  - `decision_reason`: Human-readable explanation
  - Market context: funding_rate, predicted_funding, basis_spread, spot/perp prices
  - AI data: confidence_score, risk_score, alpha_decay_hours, thought_process[]
  - Skip data: skip_reasons[], risk_factors (JSONB)
  - Trade data: trade_id (FK), proposed_side/size/leverage, expected_yield
- [x] Added `decision_id` foreign key to `trade_actions`
- [x] RLS enabled: publicly viewable, service can insert
- [x] Indexes on type, symbol, created_at, confidence

### 4.5 AI Decision Logging Library (`/lib/ai-decision-logger.ts`)
- [x] `logAIDecision()` - Full decision logging
- [x] `logSkipDecision()` - Log when AI skips a trade opportunity
- [x] `logGuardDecision()` - Log when risk guard triggers
- [x] `logExecuteDecision()` - Log executed trades with decision context
- [x] `getRecentDecisions()` - Fetch decision history
- [x] `getDecisionAnalytics()` - Get stats for investor reports
- [x] `SKIP_REASONS` constants for consistency

### 4.6 Decisions API (`/app/api/decisions/route.ts`)
- [x] GET: Fetch recent decisions with filtering
- [x] GET with `?analytics=true`: Get decision statistics
- [x] POST: Log new AI decisions (EXECUTE, SKIP, GUARD, DEFER)

### 4.7 Security & Performance
- [x] Row Level Security (RLS) enabled on all tables
- [x] Indexes for query optimization
- [x] Real-time enabled for `trade_actions`, `dev_feedback`, and `ai_decisions`

### 4.5 Usage Example:
```typescript
// Insert a new trade action
const { data, error } = await supabase
  .from('trade_actions')
  .insert({
    type: 'OPEN_BASIS',
    symbol: 'SOL-PERP',
    side: 'LONG',
    size: 10.5,
    entry_price: 142.85,
    funding_rate: 0.0248,
    status: 'SUCCESS',
    tx_hash: '5abc...xyz',
    ai_reasoning: 'High funding predicted for next 12h...',
    confidence_score: 87
  })

// Submit sandbox feedback
const { data, error } = await supabase
  .from('dev_feedback')
  .insert({
    message: 'Execution latency looks good on devnet',
    category: 'suggestion',
    source: '@driftprotocol',
    network: 'devnet'
  })
```

---

## 5. SEO & Search Indexing (P1) - 90% Complete

### 5.1 Infrastructure Complete
- [x] Sitemap generated (`/app/sitemap.ts`) - 116 URLs (includes /sandbox)
- [x] Robots.txt configured (`/app/robots.ts`)
- [x] Structured data (JSON-LD)
- [x] Hreflang alternates for 10 geo regions

### 5.2 Pending
- [ ] Submit sitemap to Google Search Console
- [ ] Set `GOOGLE_SITE_VERIFICATION` env var

---

## Environment Variables Summary

| Variable | Status | Where to Get |
|----------|--------|--------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | **SET** | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | **SET** | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_DRIFT_PROGRAM_ID` | **SET** | `dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH` |
| `SUPABASE_URL` | **SET** | Vercel Integration |
| `SUPABASE_ANON_KEY` | **SET** | Vercel Integration |
| `GOOGLE_CLIENT_ID` | Pending | Google Cloud Console |
| `X_CLIENT_ID` | Pending | Twitter Developer Portal |
| `JWT_SECRET` | Pending | `openssl rand -base64 32` |
| `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` | Pending | AgentSentry team |
| `COBO_API_KEY` | Pending | Cobo Sandbox |

---

## Files Reference (Updated)

| Purpose | File Path |
|---------|-----------|
| **Sandbox Dashboard** | `/app/sandbox/page.tsx` |
| **Dev Control Panel** | `/components/dev-control-panel.tsx` |
| **Drift Faucet** | `/lib/drift/faucet.ts` |
| **Solana Config** | `/lib/solana-config.ts` |
| **Feedback API** | `/app/api/feedback/route.ts` |
| **AI Decision Logger** | `/lib/ai-decision-logger.ts` |
| **Decisions API** | `/app/api/decisions/route.ts` |
| **Decisions Seed API** | `/app/api/decisions/seed/route.ts` |
| **Sentry Decision Matrix** | `/components/sentry-decision-matrix.tsx` |
| **Seed Script** | `/scripts/seed-ai-decisions.ts` |
| **Devnet Env Template** | `/.env.local.example` |
| Database Migration | `/scripts/001-initial-schema.sql` |
| Anchor Config | `/Anchor.toml` |
| cToken Market Program | `/programs/ctoken-market-program/src/lib.rs` |
| Custom Adaptor Program | `/programs/custom-adaptor-program/src/lib.rs` |
| Test Suite | `/tests/custom-adaptor-program.ts` |

---

## Human Task Checklist: Final Pre-Launch (Updated)

### Immediate (P0)
- [ ] **Seed Intelligence Data** - `POST /api/decisions/seed` to populate 13 AI decisions
- [ ] **Verify Decision Matrix** - Visit `/sandbox` and confirm hex grid displays decisions
- [ ] **Enable Real-time** - Supabase Dashboard: Toggle 'Real-time' for `ai_decisions` table

### Environment Setup
- [ ] **Step 1: Vercel Env Switch** - Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet` in Vercel
- [ ] **Step 2: Deploy Anchor Programs** - Run `anchor deploy` on devnet
- [ ] **Step 3: Seed the Sentry** - Use Drift faucet to fund vault with $1M mock USDC
- [ ] **Step 4: Test Sandbox** - Visit `crimsonarb.com/sandbox` and verify UI
- [ ] **Step 5: Reach Out** - Share sandbox link in Drift/Ranger Discord `#dev-chat`

### Intelligence Layer Demo (For Judges)
The Sentry Decision Matrix proves the AI has **Discipline** by visualizing:
- **Amber (SKIP)**: Trades avoided due to funding decay, low confidence
- **Crimson (GUARD)**: Risk circuit breaker activations
- **Green (EXECUTE)**: High-conviction basis captures
- **Gray (DEFER)**: Borderline setups awaiting signal convergence

**API Endpoints:**
- `GET /api/decisions` - Fetch recent AI decisions
- `GET /api/decisions?analytics=true` - Decision statistics
- `POST /api/decisions/seed` - Populate demo data (13 decisions)

**Pitch Template:**
> "Hey @DriftLabs team, we've built an AI-augmented basis vault on Devnet. Our Sentry Brain shows *why* it skipped 72% of opportunities—visualized in real-time. Check it out at crimsonarb.com/sandbox."

---

## E2E Devnet Test Protocol (05:30 AM Major League Dry Run)

### Test 1: Database/API Pipe Test
```bash
curl -X POST https://crimsonarb.com/api/decisions/seed
```
**PASS:** Decision Matrix Hex Grid pulses with Green/Amber/Crimson colors

### Test 2: Jobu Gas Test (Treasury Transfer)
- **Action:** Type "JOBU" on keyboard in Sandbox, click "Offer Rum"
- **PASS:** Receive 0.01 SOL in wallet, Jobu Supply Monitor ticks down
- **Confirms:** `JOBU_TREASURY_SECRET_KEY` loaded correctly

### Test 3: Drift Delegated Signer Test
- **Action:** Click "Enable Sentry Shield" in Sandbox
- **PASS:** Wallet prompts to delegate to `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY`
- **Confirms:** AI now has "the keys to the car"

### Test 4: AI Reasoning Loop
- **Action:** Click "Simulate Funding Spike" in Dev Control Panel
- **PASS:** `ai_decisions` table logs a SKIP or EXECUTE entry with confidence score
- **Confirms:** Full AI reasoning pipeline is operational

---

## Vercel Deployment Checklist

| Setting | Location | Value |
|---------|----------|-------|
| **Function Region** | Settings > Functions | `iad1` (Washington DC) or `sfo1` |
| **Real-time Tables** | Supabase > Database > Replication | `ai_decisions`, `trade_actions` enabled |
| **CORS Whitelist** | Supabase > API Settings | `https://crimsonarb.com` |

---

## Master .env Reference

See `/.env.local.example` for the complete manifest. Critical P0 variables:

| Variable | Purpose | Source |
|----------|---------|--------|
| `JOBU_TREASURY_SECRET_KEY` | Gas wallet for devnet airdrops | `solana-keygen new` |
| `JWT_SECRET` | Auth token signing | `openssl rand -base64 32` |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend DB access | Vercel Integration |
| `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` | AI execution wallet | Generate & fund on devnet |
