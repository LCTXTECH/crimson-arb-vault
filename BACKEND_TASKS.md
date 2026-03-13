# CrimsonArb Backend Task List

## Priority Legend
- **P0**: Critical - Blocks launch
- **P1**: High - Required for MVP
- **P2**: Medium - Post-MVP enhancement
- **P3**: Low - Nice to have

---

## 1. Authentication Setup (P0)

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

---

## 2. Solana Program Deployment (P0)

### 2.1 Local Development Setup
- [ ] Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- [ ] Install Solana CLI v2.1+: `sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`
- [ ] Install Anchor CLI v0.31.1: `cargo install --git https://github.com/coral-xyz/anchor avm --locked`
- [ ] Configure Solana for devnet: `solana config set --url devnet`
- [ ] Create/import wallet: `solana-keygen new` or import existing

### 2.2 Build & Test Programs
- [ ] Run `anchor build` to compile programs
- [ ] Run `anchor test` to execute test suite
- [ ] Verify cToken Market Program compiles
- [ ] Verify Custom Adaptor Program compiles
- [ ] Test CPI calls between programs

### 2.3 Devnet Deployment
- [ ] Airdrop SOL for deployment: `solana airdrop 5`
- [ ] Deploy cToken Market Program: `anchor deploy --program-name ctoken_market_program`
- [ ] Deploy Custom Adaptor Program: `anchor deploy --program-name custom_adaptor_program`
- [ ] Record program IDs and update Anchor.toml
- [ ] Verify programs on Solscan devnet

### 2.4 Mainnet Deployment (Post-Audit)
- [ ] Complete security audit
- [ ] Transfer SOL to deployment wallet
- [ ] Deploy to mainnet-beta
- [ ] Update `NEXT_PUBLIC_DRIFT_PROGRAM_ID` and other program IDs
- [ ] Verify programs on Solscan mainnet

---

## 3. AgentSentry Integration (P1)

### 3.1 API Configuration
- [ ] Obtain AgentSentry API credentials from team
- [ ] Set `AGENTSENTRY_API_KEY` in Vercel env vars
- [ ] Set `NEXT_PUBLIC_AGENTSENTRY_API_KEY` for client-side calls
- [ ] Configure webhook endpoint for trade notifications

### 3.2 Delegation Wallet Setup
- [ ] Generate AgentSentry delegate keypair
- [ ] Set `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` in Vercel env vars
- [ ] Implement delegation flow in `/lib/drift/delegation.ts`
- [ ] Test delegate authority on devnet

### 3.3 Webhook Integration
- [ ] Create `/api/webhooks/agentsentry` endpoint
- [ ] Set `AGENTSENTRY_WEBHOOK_SECRET` for signature verification
- [ ] Handle trade execution notifications
- [ ] Update UI via real-time events (SWR mutate)

---

## 4. Database Setup (P1)

### 4.1 Supabase Integration
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` for server-side operations

### 4.2 Schema Creation
- [ ] Create `users` table (id, wallet_address, email, created_at)
- [ ] Create `trade_actions` table (id, user_id, type, symbol, size, funding_rate, ai_reasoning, tx_hash, created_at)
- [ ] Create `vault_positions` table (id, user_id, deposit_amount, lp_tokens, status)
- [ ] Enable Row Level Security (RLS) policies
- [ ] Create indexes for common queries

### 4.3 API Integration
- [ ] Update Audit Trail Drawer to fetch from Supabase
- [ ] Implement trade logging on execution
- [ ] Add user session management with Supabase Auth (optional)

---

## 5. SEO & Search Indexing (P1)

### 5.1 Google Search Console
- [ ] Add property: `crimsonarb.com` at [Search Console](https://search.google.com/search-console)
- [ ] Verify domain via DNS TXT record or HTML file
- [ ] Submit sitemap: `https://crimsonarb.com/sitemap.xml`
- [ ] Copy verification token to `GOOGLE_SITE_VERIFICATION`

### 5.2 Bing Webmaster Tools
- [ ] Add site at [Bing Webmaster](https://www.bing.com/webmasters)
- [ ] Verify ownership
- [ ] Submit sitemap
- [ ] Copy verification to `BING_SITE_VERIFICATION`

### 5.3 Monitor Indexing
- [ ] Check coverage report in Search Console
- [ ] Fix any crawl errors
- [ ] Monitor Core Web Vitals
- [ ] Track keyword rankings

---

## 6. Monitoring & Observability (P2)

### 6.1 Error Tracking
- [ ] Set up Sentry project
- [ ] Configure `SENTRY_DSN` in Vercel
- [ ] Add Sentry SDK to Next.js
- [ ] Set up alerting rules

### 6.2 Analytics
- [ ] Set up PostHog or similar
- [ ] Configure `POSTHOG_API_KEY`
- [ ] Track key user events (deposit, withdraw, trade approval)
- [ ] Create conversion funnels

### 6.3 Uptime Monitoring
- [ ] Set up status page (Vercel Status or custom)
- [ ] Configure uptime checks for API endpoints
- [ ] Set up PagerDuty/Slack alerts

---

## 7. Security Hardening (P1)

### 7.1 API Security
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Validate all user inputs
- [ ] Sanitize AI reasoning outputs

### 7.2 Smart Contract Security
- [ ] Complete internal code review
- [ ] Run Soteria/Sec3 automated audit
- [ ] Schedule professional audit (if budget allows)
- [ ] Implement emergency pause functionality

### 7.3 Infrastructure
- [ ] Enable Vercel DDoS protection
- [ ] Configure WAF rules
- [ ] Set up IP allowlisting for admin endpoints
- [ ] Rotate secrets quarterly

---

## 8. CI/CD Pipeline (P2)

### 8.1 GitHub Actions
- [ ] Create workflow for Anchor build/test on PR
- [ ] Add TypeScript/ESLint checks
- [ ] Run Lighthouse CI for performance
- [ ] Auto-deploy to Vercel preview on PR

### 8.2 Release Process
- [ ] Tag releases with semantic versioning
- [ ] Generate changelogs automatically
- [ ] Create deployment checklist
- [ ] Document rollback procedures

---

## Environment Variables Summary

| Variable | Required | Where to Get |
|----------|----------|--------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your domain |
| `GOOGLE_CLIENT_ID` | Yes | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | Google Cloud Console |
| `X_CLIENT_ID` | Yes | Twitter Developer Portal |
| `X_CLIENT_SECRET` | Yes | Twitter Developer Portal |
| `JWT_SECRET` | Yes | Generate with openssl |
| `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` | Yes | AgentSentry team |
| `AGENTSENTRY_API_KEY` | Yes | AgentSentry team |
| `NEXT_PUBLIC_AGENTSENTRY_API_KEY` | Yes | AgentSentry team |
| `GOOGLE_SITE_VERIFICATION` | Yes | Google Search Console |
| `SUPABASE_URL` | Optional | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Optional | Supabase Dashboard |
| `SENTRY_DSN` | Optional | Sentry Dashboard |

---

## Quick Start Checklist

1. [ ] Copy `.env.example` to `.env.local`
2. [ ] Fill in Google OAuth credentials
3. [ ] Fill in X OAuth credentials
4. [ ] Generate and set JWT_SECRET
5. [ ] Set up Solana wallet and airdrop devnet SOL
6. [ ] Run `anchor build && anchor test`
7. [ ] Deploy to Vercel with env vars
8. [ ] Verify Google Search Console
9. [ ] Submit sitemap
10. [ ] Test full auth flow in production
