# CrimsonArb Backend Task List

**Last Updated:** March 13, 2026  
**Status:** Database Schema Complete, Frontend Deployed

---

## Progress Overview

| Section | Status | Completion |
|---------|--------|------------|
| 1. Authentication Setup | In Progress | 40% |
| 2. Solana Program Development | Complete | 100% |
| 3. AgentSentry Integration | Pending | 10% |
| 4. Database Setup | **COMPLETE** | 100% |
| 5. SEO & Search Indexing | Complete | 90% |
| 6. Monitoring & Observability | Pending | 0% |
| 7. Security Hardening | In Progress | 30% |
| 8. CI/CD Pipeline | Pending | 0% |

---

## Priority Legend
- **P0**: Critical - Blocks launch
- **P1**: High - Required for MVP
- **P2**: Medium - Post-MVP enhancement
- **P3**: Low - Nice to have

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

### 2.3 Deployment (Pending)
- [ ] Install Rust, Solana CLI v2.1+, Anchor CLI v0.31.1
- [ ] Run `anchor build` to compile programs
- [ ] Run `anchor test` on localnet
- [ ] Deploy to devnet
- [ ] Deploy to mainnet (post-audit)

---

## 3. AgentSentry Integration (P1) - 10% Complete

### 3.1 API Configuration
- [ ] Obtain AgentSentry API credentials from team
- [ ] Set `AGENTSENTRY_API_KEY` in Vercel env vars
- [ ] Configure webhook endpoint for trade notifications

### 3.2 Delegation Wallet Setup
- [x] Drift delegation library created (`/lib/drift/delegation.ts`)
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
  - id (UUID, references auth.users)
  - wallet_address (TEXT, UNIQUE)
  - is_delegated (BOOLEAN)
  - delegated_at (TIMESTAMPTZ)
  - created_at, updated_at
- [x] **`public.trade_actions`** table (Audit Trail)
  - id (UUID)
  - user_id (FK to profiles)
  - type (TEXT: OPEN_BASIS, CLOSE_BASIS, REBALANCE, GUARD)
  - symbol (TEXT: SOL-PERP, etc.)
  - side (TEXT: LONG, SHORT)
  - size, entry_price, exit_price (DECIMAL)
  - funding_rate, yield_captured (DECIMAL)
  - status (TEXT: PENDING, SUCCESS, FAILED, GUARDED)
  - tx_hash (TEXT, UNIQUE)
  - ai_reasoning (TEXT)
  - confidence_score (INTEGER)
  - created_at (TIMESTAMPTZ)
- [x] **`public.vault_state`** table (Ranger Leaderboard)
  - id (UUID)
  - symbol (TEXT, UNIQUE)
  - tvl, apy, total_profit (DECIMAL)
  - last_rebalance, updated_at (TIMESTAMPTZ)

### 4.3 Security & Performance
- [x] Row Level Security (RLS) enabled on all tables
- [x] RLS Policies:
  - Profiles: Users can only view their own profile
  - Trade Actions: Publicly viewable (Proof of PnL)
  - Vault State: Publicly viewable (Leaderboard)
- [x] Indexes created:
  - `idx_trade_actions_user`
  - `idx_trade_actions_status`
  - `idx_trade_actions_symbol`
- [x] Real-time enabled for `trade_actions` table

### 4.4 Usage Example (Supabase Client):
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
```

---

## 5. SEO & Search Indexing (P1) - 90% Complete

### 5.1 Infrastructure Complete
- [x] Sitemap generated (`/app/sitemap.ts`) - 115 URLs
- [x] Robots.txt configured (`/app/robots.ts`)
- [x] Structured data (JSON-LD) for Organization, FinancialProduct, FAQ
- [x] Meta tags and OpenGraph configured
- [x] Hreflang alternates for 10 geo regions

### 5.2 Google Search Console
- [ ] Add property: `crimsonarb.com`
- [ ] Verify domain ownership
- [ ] Submit sitemap: `https://crimsonarb.com/sitemap.xml`
- [ ] Set `GOOGLE_SITE_VERIFICATION` env var

### 5.3 Social Links Updated
- [x] X/Twitter: `https://x.com/bcblockhtx`
- [x] GitHub: `https://github.com/LCTXTECH`
- [x] Discord: `https://discord.gg/V2DksdSE`
- [x] Ecosystem: BCBlock.net, AgentSentry.net, Drift.trade

---

## 6. Monitoring & Observability (P2) - 0% Complete

### 6.1 Error Tracking
- [ ] Set up Sentry project
- [ ] Configure `SENTRY_DSN` in Vercel
- [ ] Add Sentry SDK to Next.js

### 6.2 Analytics
- [ ] Set up PostHog
- [ ] Configure `POSTHOG_API_KEY`
- [ ] Track key events (deposit, withdraw, trade approval)

---

## 7. Security Hardening (P1) - 30% Complete

### Completed:
- [x] Row Level Security on all database tables
- [x] HTTP-only cookies for session management
- [x] CORS configuration in middleware

### Pending:
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Complete smart contract security audit
- [ ] Implement emergency pause functionality

---

## 8. CI/CD Pipeline (P2) - 0% Complete

- [ ] GitHub Actions for Anchor build/test
- [ ] TypeScript/ESLint checks on PR
- [ ] Auto-deploy to Vercel preview
- [ ] Semantic versioning and changelog

---

## Environment Variables Summary

| Variable | Status | Where to Get |
|----------|--------|--------------|
| `NEXT_PUBLIC_SITE_URL` | Set | crimsonarb.com |
| `SUPABASE_URL` | **SET** | Vercel Integration |
| `SUPABASE_ANON_KEY` | **SET** | Vercel Integration |
| `SUPABASE_SERVICE_ROLE_KEY` | **SET** | Vercel Integration |
| `GOOGLE_CLIENT_ID` | Pending | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Pending | Google Cloud Console |
| `X_CLIENT_ID` | Pending | Twitter Developer Portal |
| `X_CLIENT_SECRET` | Pending | Twitter Developer Portal |
| `JWT_SECRET` | Pending | Generate with openssl |
| `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` | Pending | AgentSentry team |
| `AGENTSENTRY_API_KEY` | Pending | AgentSentry team |
| `GOOGLE_SITE_VERIFICATION` | Pending | Google Search Console |

---

## Quick Start Checklist (Updated)

1. [x] Database schema deployed to Supabase
2. [x] Frontend deployed to Vercel
3. [x] Solana programs written (Ranger Workshop 02 architecture)
4. [x] SEO infrastructure complete
5. [ ] Fill in Google OAuth credentials
6. [ ] Fill in X OAuth credentials
7. [ ] Generate and set JWT_SECRET
8. [ ] Run `anchor build && anchor test`
9. [ ] Deploy programs to devnet
10. [ ] Submit sitemap to Google Search Console

---

## Files Reference

| Purpose | File Path |
|---------|-----------|
| Database Migration | `/scripts/001-initial-schema.sql` |
| Environment Template | `/.env.example` |
| Anchor Config | `/Anchor.toml` |
| cToken Market Program | `/programs/ctoken-market-program/src/lib.rs` |
| Custom Adaptor Program | `/programs/custom-adaptor-program/src/lib.rs` |
| Test Suite | `/tests/custom-adaptor-program.ts` |
| AI Reasoning | `/lib/ai-reasoning.ts` |
| Drift Delegation | `/lib/drift/delegation.ts` |
| Auth Config | `/lib/auth-config.ts` |
