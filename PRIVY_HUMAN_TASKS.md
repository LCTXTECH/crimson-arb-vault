# Privy OAuth Setup - Human Task List

CrimsonARB uses Privy for Web2-to-Web3 authentication. This file documents everything you need to configure on the Privy dashboard before the auth system works.

## Status: STUB MODE
The auth components are currently in stub mode. They will display alerts instead of the Privy modal until configured.

---

## Step 1: Create Privy App (5 minutes)

1. Go to **https://console.privy.io**
2. Sign in or create account
3. Click **"Create App"**
4. Configure:
   - **App name:** CrimsonARB
   - **App type:** Web
   - **Description:** AI-governed delta-neutral yield vault on Solana

---

## Step 2: Configure Login Methods

In Privy Dashboard > **Login Methods**:

### Enable:
- [x] **Google** - Primary for Web2 users
- [x] **Email** - Fallback option
- [x] **Wallet** - For crypto-native users (Phantom, Solflare)

### Disable:
- [ ] Twitter/X
- [ ] Discord
- [ ] Apple
- [ ] Farcaster
- [ ] Telegram

---

## Step 3: Configure Embedded Wallets

In Privy Dashboard > **Embedded Wallets**:

- [x] **Create on login:** All users
- [x] **Network:** Solana
- [x] **Cluster:** Devnet (change to Mainnet-beta at launch)
- [ ] **Require password on create:** No (reduce friction)
- [ ] **Require confirmation on sign:** No (we handle via AgentSentry)

---

## Step 4: Configure Appearance

In Privy Dashboard > **Appearance**:

- **Theme:** Dark
- **Accent color:** #DC2626 (CrimsonARB red)
- **Logo URL:** https://crimsonarb.com/logo.png
- **Landing header:** "Access Your Yield Vault"
- **Login message:** "Sign in to deposit USDC and start earning"
- **Show wallet login first:** No (Google first for Web2 users)

---

## Step 5: Configure Allowed Origins

In Privy Dashboard > **Settings** > **Allowed Origins**:

Add these domains:
```
https://crimsonarb.com
https://www.crimsonarb.com
http://localhost:3000
```

For v0 preview, also add:
```
https://*.vercel.app
https://*.v0.dev
```

---

## Step 6: Get API Keys

In Privy Dashboard > **Settings** > **API Keys**:

Copy these values:
- **App ID** (starts with `cm...`)
- **App Secret** (keep this secure, server-side only)

---

## Step 7: Add Environment Variables to Vercel

Go to your Vercel project > **Settings** > **Environment Variables**

Add:
```
NEXT_PUBLIC_PRIVY_APP_ID=cm... (your App ID)
PRIVY_APP_SECRET=... (your App Secret)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

**Note:** In v0, click the settings gear (top right) > **Vars** to add these.

---

## Step 8: Install Privy Package

Run in your local terminal:
```bash
npm install @privy-io/react-auth
```

Or add to package.json:
```json
"dependencies": {
  "@privy-io/react-auth": "^2.14.3"
}
```

---

## Step 9: Enable Full Privy Provider

After completing steps 1-8, update these files:

### `/components/providers/privy-provider.tsx`
Replace the stub with the full implementation:

```tsx
'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
})

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#DC2626',
          logo: 'https://crimsonarb.com/logo.png',
          landingHeader: 'Access Your Yield Vault',
          loginMessage: 'Sign in to deposit USDC and start earning',
          showWalletLoginFirst: false,
        },
        loginMethods: ['google', 'email', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users',
          noPromptOnSignature: false,
          requireUserPasswordOnCreate: false,
        },
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
        defaultChain: {
          id: 'solana',
          network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
```

### `/contexts/auth-context.tsx`
Replace the stub with the full implementation that uses `usePrivy()` and `useSolanaWallets()` hooks.

---

## Step 10: Test the Flow

1. Deploy to Vercel (or run locally)
2. Click "Get Started" button
3. Privy modal should appear
4. Sign in with Google
5. Embedded wallet should be created
6. User should be synced to Supabase profiles table
7. Onboarding flow should appear for new users

---

## Verification Checklist

After completing all steps:

- [ ] Privy modal appears when clicking "Get Started"
- [ ] Google OAuth works
- [ ] Embedded Solana wallet is created
- [ ] User appears in `profiles` table in Supabase
- [ ] Founder status is detected from `founders_waitlist` table
- [ ] Onboarding flow shows for new users
- [ ] Dashboard shows wallet address

---

## Troubleshooting

### "Invalid App ID" error
- Check NEXT_PUBLIC_PRIVY_APP_ID is set correctly
- Make sure you're using the App ID, not the App Secret

### "Origin not allowed" error
- Add your domain to Allowed Origins in Privy dashboard
- Include both www and non-www versions

### Wallet not created
- Check Embedded Wallets is enabled in Privy dashboard
- Check "Create on login" is set to "All users"

### Google login fails
- Ensure Google is enabled in Login Methods
- Check OAuth consent screen in Google Cloud Console

---

## Files Created for Privy Integration

```
/components/providers/privy-provider.tsx  - Privy context provider (stub)
/contexts/auth-context.tsx                - Auth state management (stub)
/components/auth/sign-in-button.tsx       - Reusable sign-in button
/components/auth/auth-gate.tsx            - Auth-required wrapper
/components/auth/onboarding-flow.tsx      - 3-step new user onboarding
/app/api/auth/sync/route.ts               - Supabase user sync endpoint
/app/layout.tsx                           - Updated with providers
```

---

## Database Schema Added

The following columns were added to the `profiles` table:

```sql
privy_id TEXT UNIQUE
google_id TEXT
display_name TEXT
email TEXT
is_founder BOOLEAN DEFAULT FALSE
performance_fee_rate NUMERIC DEFAULT 0.20
sentry_points INTEGER DEFAULT 0
deposited_usdc NUMERIC DEFAULT 0
last_login_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## Contact

If you have issues with Privy setup:
- Privy docs: https://docs.privy.io
- Privy Discord: https://discord.gg/privy
- CrimsonARB: info@bcblock.net
