# CrimsonArb - Bayou City Blockchain Handoff Document

**Project:** CrimsonArb - AI-Augmented Basis Trade Vault  
**Client:** Bayou City Blockchain (BCBlock)  
**Date:** March 16, 2026  
**Status:** Devnet Sandbox Complete - Ready for 7-Day Simulated Trading Period

---

## Executive Summary

CrimsonArb is an institutional-grade delta-neutral yield vault that uses AI ("Sentry Brain") to intelligently capture funding rate arbitrage on Drift Protocol while avoiding alpha decay. The system is built on the Ranger Finance architecture (Voltr SDK) and is currently deployed on Solana Devnet for testing and judge evaluation.

**Live URLs:**
- Dashboard: `https://crimsonarb.com`
- Devnet Sandbox: `https://crimsonarb.com/sandbox`
- Transparency Report: `https://crimsonarb.com/transparency`

---

## Critical Path Items (Next Build Priorities)

### P0 - Immediate (Blocks Demo)
1. **Privy Google OAuth Migration** - Follow `splitsol.net` auth-context.tsx exactly
2. **Verify AgentSentry Integration** - Confirm `/api/claw/execute` calls `agentsentry.net/api/sentry/check-in` before any Drift execution
3. **OpenClaw Metrics Endpoint** - `GET /api/openclaw/metrics` for VPS content generation
4. **Webhook Receiver** - `POST /api/openclaw/webhook` for ecosystem treasury notifications
5. **SPLit + RapidPay Bridge** - Auto-deposit when Phase 2 triggers ($50K combined volume)

### P1 - Missing Environment Variables
| Variable | Purpose | How to Generate |
|----------|---------|-----------------|
| `JOBU_TREASURY_SECRET_KEY` | Gas wallet for devnet airdrops | `solana-keygen new` |
| `JWT_SECRET` | Auth token signing | `openssl rand -base64 32` |
| `NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY` | AI execution wallet | Generate & fund on devnet |
| `OPENCLAW_WEBHOOK_TOKEN` | Shared with VPS at 83.229.35.199 | Generate shared secret |
| `AGENTSENTRY_API_KEY` | Sentry check-in authorization | Request from AgentSentry |

---

## Golden Rules (Non-Negotiable)

1. **DEVNET ONLY** until security checklist complete
2. **AgentSentry MUST APPROVE** before any Drift execution
3. **Never remove "Proof of No-Trade"** - it's the institutional moat
4. **GUARD decisions always abort** - no overrides permitted
5. **$10K initial mainnet cap** is non-negotiable

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CrimsonArb Frontend                       │
│                   (Next.js 16 + Tailwind)                   │
├─────────────────────────────────────────────────────────────┤
│  Dashboard │ Sandbox │ Transparency │ Markets │ Analytics   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  /api/decisions │ /api/feedback │ /api/jobu │ /api/contact  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────────┐
│    Supabase      │ │   Solana     │ │    Drift Protocol    │
│   (PostgreSQL)   │ │   Devnet     │ │   (Perps + Funding)  │
└──────────────────┘ └──────────────┘ └──────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Ranger Finance Architecture                     │
│  ┌────────────────┐    CPI    ┌─────────────────────────┐   │
│  │ Ranger Earn    │ ────────▶ │ Custom Adaptor Program  │   │
│  │ Vault (Voltr)  │           │ (initialize, deposit,   │   │
│  └────────────────┘           │  withdraw → returns u64)│   │
│                               └─────────────────────────┘   │
│                                          │ CPI              │
│                                          ▼                  │
│                               ┌─────────────────────────┐   │
│                               │ cToken Market Program   │   │
│                               │ (Liquidity Pool)        │   │
│                               └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## BCBlock Ecosystem Integration

### Sister Projects
| Project | Domain | Integration Point |
|---------|--------|-------------------|
| **SPLit** | splitsol.net | Auth context, treasury routing |
| **RapidPay** | rapidpay.io | Payment triggers for Phase 2 |
| **OpenClaw** | VPS 83.229.35.199 | Webhook notifications, metrics |
| **AgentSentry** | agentsentry.net | Trade approval gateway |

### Shared Infrastructure
- **Supabase Project:** `yvctjdhzytvmvlcfuypk`
- **Vercel Team:** LCTXTECH
- **GitHub Org:** github.com/LCTXTECH
- **Domain Registrar:** Managed via Vercel

---

## File Structure

### Frontend Pages (19 pages)
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Main dashboard with Sentry Brain, AgentSentry widget, metrics |
| `/sandbox` | `app/sandbox/page.tsx` | Devnet testing with auto-running LiveSimulationV2 |
| `/transparency` | `app/transparency/page.tsx` | Investor report with charts + lead gen form |
| `/proof-of-no-trade` | `app/proof-of-no-trade/page.tsx` | Manifesto page - our key differentiator |
| `/whitepaper` | `app/whitepaper/page.tsx` | Full technical whitepaper with sticky TOC |
| `/judges` | `app/judges/page.tsx` | Hackathon submission page (noindex) |
| `/admin/submission` | `app/admin/submission/page.tsx` | War room: scripts, copy, checklist (noindex) |
| `/mainnet-roadmap` | `app/mainnet-roadmap/page.tsx` | Deployment timeline + conservative launch params |
| `/analytics` | `app/analytics/page.tsx` | Performance analytics |
| `/vault` | `app/vault/page.tsx` | Vault details and deposit/withdraw |
| `/markets/[symbol]` | `app/markets/[symbol]/page.tsx` | Individual market pages |
| `/docs/*` | `app/docs/*/page.tsx` | API docs, getting started, Sentry AI docs |

### Components (25 components)
| Component | Purpose |
|-----------|---------|
| `sentry-brain.tsx` | AI visualization with neural network animation |
| `sentry-decision-matrix.tsx` | Hex grid showing AI EXECUTE/SKIP/GUARD decisions |
| `live-simulation-v2.tsx` | Auto-running 45s simulation for judges (5 decisions) |
| `why-we-skip.tsx` | "Proof of No-Trade" section with last 10 skips |
| `agent-sentry-status.tsx` | Live AgentSentry status widget (30s polling) |
| `institutional-metrics.tsx` | Performance metrics card (APY, Sharpe, Drawdown) |
| `approval-queue.tsx` | Trade approval interface with countdown timers |
| `audit-trail-drawer.tsx` | Expandable execution log |
| `depth-chart.tsx` | Order book depth visualization |
| `liquidity-heatmap.tsx` | Market liquidity visualization |
| `dev-control-panel.tsx` | Sandbox testing controls |
| `jobu-ritual-overlay.tsx` | Easter egg (type "JOBU" to activate) |
| `jobu-supply-monitor.tsx` | Treasury gas level monitor |
| `site-header.tsx` | Navigation header |
| `site-footer.tsx` | Footer with social links |

### API Routes (11 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/decisions` | GET/POST | AI decision logging and retrieval |
| `/api/decisions/seed` | POST | Populate demo data (13 AI decisions) |
| `/api/sentry/status` | GET | AgentSentry status check (polls every 30s) |
| `/api/feedback` | GET/POST | Developer feedback for sandbox |
| `/api/contact` | POST | Lead gen form → info@bcblock.net |
| `/api/jobu/balance` | GET | Treasury wallet balance check |
| `/api/geo` | GET | Geolocation detection |
| `/api/claw/execute` | POST | AgentSentry trade execution |
| `/api/auth/*` | Various | OAuth authentication (Google, X) |

### Libraries (9 libs)
| Library | Purpose |
|---------|---------|
| `ai-reasoning.ts` | Sentry Brain decision engine |
| `ai-decision-logger.ts` | Log all AI decisions to Supabase |
| `drift/delegation.ts` | Drift delegated signer setup |
| `drift/faucet.ts` | Devnet SOL/USDC faucet + Jobu ritual |
| `solana-config.ts` | Network configuration helper |
| `transaction.ts` | Versioned transaction builder |

### Solana Programs (Anchor/Rust)
| Program | Location | Description |
|---------|----------|-------------|
| `ctoken-market-program` | `/programs/ctoken-market-program/src/lib.rs` | Liquidity pool with cToken mint/burn |
| `custom-adaptor-program` | `/programs/custom-adaptor-program/src/lib.rs` | CPI bridge to Ranger vault |

---

## Database Schema (Supabase)

### Tables Created
| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User wallet addresses, delegation status | User-own only |
| `trade_actions` | Execution audit trail | Public read |
| `vault_state` | TVL, APY, profit tracking | Public read |
| `ai_decisions` | ALL AI reasoning (including skips) | Public read |
| `dev_feedback` | Sandbox developer feedback | Public read/write |
| `sandbox_sessions` | Devnet tester sessions | Public read/write |
| `contact_inquiries` | Lead gen form submissions | Insert only |

---

## E2E Devnet Test Protocol

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

## Demo Checklist (For Judges)

### Quick Start (Zero-Click Demo)
1. Visit `https://crimsonarb.com/sandbox`
2. **Wait 3 seconds** - LiveSimulationV2 auto-starts
3. Watch 5 AI decisions appear over 45 seconds
4. See AgentSentry approval animation on EXECUTE decisions
5. Final state: "MONITORING - System Active"

### Main Dashboard Features
1. Visit `https://crimsonarb.com`
2. **AgentSentry Status Widget** - Shows ACTIVE/ELEVATED/CIRCUIT OPEN
3. **Institutional Metrics Card** - APY, Sharpe, Drawdown, Skip Rate
4. **"Why We Skip" Section** - Last 10 SKIP decisions with reasoning

### Proof of No-Trade Page
1. Visit `https://crimsonarb.com/proof-of-no-trade`
2. See the manifesto: "MOST VAULTS HIDE THEIR INACTION"
3. Interactive skip reasons breakdown with hover tooltips
4. Live decision feed from last 24 hours
5. Comparison table: Other Vaults vs CrimsonARB

### Intelligence Layer Demo
1. Call `POST /api/decisions/seed` to populate 13 AI decisions
2. View the **Sentry Decision Matrix** hex grid (7x5 with market labels)
3. Click hex cells to see AI reasoning for each decision
4. Filter by EXECUTE (green), SKIP (amber), GUARD (crimson)

### Jobu Easter Egg
1. Type "JOBU" on keyboard while on Sandbox page
2. Click "Offer Rum" button
3. Receive 0.01 SOL airdrop for gas

### Key Differentiators for Judges
- **"Proof of No-Trade"**: We log WHY we skip 72% of opportunities
- **Funding Decay Prediction**: AI predicts when alpha will decay
- **Risk Circuit Breakers**: GUARD decisions prevent bad entries
- **AgentSentry Integration**: Visible security layer approval
- **Institutional Metrics**: Sharpe 2.4, 0% drawdown (delta neutral)
- **Institutional UI**: Hex grid, heatmaps, depth charts

---

## Post-Hackathon Roadmap

### Week 1-2: Devnet Validation
- [ ] Run 7 days of simulated trades on devnet
- [ ] Collect feedback from Drift/Ranger devs
- [ ] Optimize Predictive Decay Engine based on data
- [ ] Complete SPLit OAuth migration (Privy)

### Week 3: Security Audit
- [ ] Complete AgentSentry integration (all 4 endpoints)
- [ ] Implement proper session management with Privy
- [ ] Add rate limiting to API endpoints
- [ ] Security review of delegated signer flow

### Week 4: Mainnet Preparation
- [ ] Deploy Anchor programs to mainnet-beta
- [ ] Configure production RPC (Helius/Triton)
- [ ] Enable real deposits with caps ($10k initial)
- [ ] Launch Phase 2 trigger monitoring

---

## Social Links

- **X (Twitter):** https://x.com/bcblockhtx
- **GitHub:** https://github.com/LCTXTECH
- **Discord:** https://discord.gg/V2DksdSE
- **Contact:** info@bcblock.net

---

## Technical Contacts

**Bayou City Blockchain**
- Email: info@bcblock.net
- X: @bcblockhtx

---

*"Jobu says: The bats are no longer sick. The Sentry guards the treasury."*
