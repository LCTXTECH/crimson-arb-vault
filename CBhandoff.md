# CrimsonArb - Bayou City Blockchain Handoff Document

**Project:** CrimsonArb - AI-Augmented Basis Trade Vault  
**Client:** Bayou City Blockchain (BCBlock)  
**Date:** March 16, 2026  
**Status:** Devnet Sandbox Complete - Ready for Ranger Finance Hackathon Demo

---

## Executive Summary

CrimsonArb is an institutional-grade delta-neutral yield vault that uses AI ("Sentry Brain") to intelligently capture funding rate arbitrage on Drift Protocol while avoiding alpha decay. The system is built on the Ranger Finance architecture (Voltr SDK) and is currently deployed on Solana Devnet for testing and judge evaluation.

**Live URLs:**
- Dashboard: `https://crimsonarb.com`
- Devnet Sandbox: `https://crimsonarb.com/sandbox`
- Transparency Report: `https://crimsonarb.com/transparency`
- API Docs: `https://crimsonarb.com/docs/api`

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

## File Structure

### Frontend Pages (14 pages)
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Main dashboard with Sentry Brain, positions, approval queue |
| `/sandbox` | `app/sandbox/page.tsx` | Devnet testing environment ($100k mock USDC) |
| `/transparency` | `app/transparency/page.tsx` | Investor report with charts + lead gen form |
| `/analytics` | `app/analytics/page.tsx` | Performance analytics |
| `/vault` | `app/vault/page.tsx` | Vault details and deposit/withdraw |
| `/markets/[symbol]` | `app/markets/[symbol]/page.tsx` | Individual market pages |
| `/docs/*` | `app/docs/*/page.tsx` | API docs, getting started, Sentry AI docs |
| `/about` | `app/about/page.tsx` | About BCBlock |
| `/security` | `app/security/page.tsx` | Security practices |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |

### Components (16 components)
| Component | Purpose |
|-----------|---------|
| `sentry-brain.tsx` | AI visualization with neural network animation |
| `sentry-decision-matrix.tsx` | Hex grid showing AI EXECUTE/SKIP/GUARD decisions |
| `approval-queue.tsx` | Trade approval interface with countdown timers |
| `audit-trail-drawer.tsx` | Expandable execution log |
| `depth-chart.tsx` | Order book depth visualization |
| `liquidity-heatmap.tsx` | Market liquidity visualization |
| `dev-control-panel.tsx` | Sandbox testing controls |
| `jobu-ritual-overlay.tsx` | Easter egg (type "JOBU" to activate) |
| `jobu-supply-monitor.tsx` | Treasury gas level monitor |
| `investor-transparency-report.tsx` | PDF-ready investor report |
| `geo-selector.tsx` | Region selector for compliance |
| `onboarding-modal.tsx` | User onboarding flow |
| `execution-success-toast.tsx` | Trade confirmation notifications |
| `site-header.tsx` | Navigation header |
| `site-footer.tsx` | Footer with social links |
| `structured-data.tsx` | SEO JSON-LD schemas |

### API Routes (9 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/decisions` | GET/POST | AI decision logging and retrieval |
| `/api/decisions/seed` | POST | Populate demo data (13 AI decisions) |
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
| `seo-config.ts` | SEO metadata and structured data |
| `auth-config.ts` | OAuth provider configuration |
| `use-auth.ts` / `use-geo.ts` | React hooks |

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

### Key Migrations Applied
1. `initial_schema` - Core tables (profiles, trade_actions, vault_state)
2. `add_dev_feedback_table` - Sandbox tables
3. `add_ai_decisions_table` - Intelligence layer
4. `add_contact_inquiries_table` - Lead generation

---

## Environment Variables

See `/.env.local.example` for the complete manifest. Critical variables:

### P0 - Critical (Blocks Launch)
```bash
JOBU_TREASURY_SECRET_KEY=           # Gas wallet for devnet airdrops
JWT_SECRET=                         # Auth token signing
SUPABASE_URL=                       # Auto-configured via integration
SUPABASE_SERVICE_ROLE_KEY=          # Auto-configured via integration
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Auto-configured via integration
```

### P1 - Network Configuration
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_DRIFT_PROGRAM_ID=dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH
NEXT_PUBLIC_CRIMSON_DELEGATE_PUBKEY=  # AI execution wallet
```

---

## Demo Checklist (For Judges)

### Quick Start
1. Visit `https://crimsonarb.com/sandbox`
2. Click "Devnet" button in header (or go directly to `/sandbox`)
3. See $100k mock USDC balance
4. Click "Mint Mock Alpha" to add $50k more

### Intelligence Layer Demo
1. Call `POST /api/decisions/seed` to populate 13 AI decisions
2. View the **Sentry Decision Matrix** hex grid
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
- **Institutional UI**: Hex grid, heatmaps, depth charts

---

## Social Links

- **X (Twitter):** https://x.com/bcblockhtx
- **GitHub:** https://github.com/LCTXTECH
- **Discord:** https://discord.gg/V2DksdSE
- **Contact:** info@bcblock.net

---

## Next Steps (Post-Hackathon)

### Week 1-2: Devnet Validation
- [ ] Run 7 days of simulated trades on devnet
- [ ] Collect feedback from Drift/Ranger devs
- [ ] Optimize Predictive Decay Engine based on data

### Week 3: Security Audit
- [ ] Complete AgentSentry integration
- [ ] Implement proper session management
- [ ] Add rate limiting to API endpoints

### Week 4: Mainnet Preparation
- [ ] Deploy Anchor programs to mainnet-beta
- [ ] Configure production RPC (Helius/Triton)
- [ ] Enable real deposits with caps ($10k initial)

---

## Technical Contacts

**Bayou City Blockchain**
- Email: info@bcblock.net
- X: @bcblockhtx

---

*"Jobu says: The bats are no longer sick. The Sentry guards the treasury."*
