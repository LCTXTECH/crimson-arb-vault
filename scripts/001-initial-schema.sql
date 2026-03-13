-- CrimsonArb Vault Database Schema
-- Migration: 001-initial-schema
-- Description: Core tables for profiles, trade actions, and vault state

-- 1. ENABLE EXTENSIONS
-- Required for generating UUIDs and real-time triggers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE USER PROFILES
-- Tracks wallets and delegation status
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    is_delegated BOOLEAN DEFAULT FALSE,
    delegated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE TRADE ACTIONS (The Audit Trail)
-- This feeds your "Audit Trail Drawer" and "Execution Log"
CREATE TABLE IF NOT EXISTS public.trade_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    type TEXT NOT NULL, -- 'OPEN_BASIS', 'CLOSE_BASIS', 'REBALANCE', 'GUARD'
    symbol TEXT NOT NULL, -- e.g., 'SOL-PERP'
    side TEXT NOT NULL, -- 'LONG', 'SHORT'
    size DECIMAL NOT NULL,
    entry_price DECIMAL,
    exit_price DECIMAL,
    funding_rate DECIMAL, -- The rate captured at execution
    yield_captured DECIMAL DEFAULT 0,
    status TEXT DEFAULT 'PENDING', -- 'SUCCESS', 'FAILED', 'GUARDED'
    tx_hash TEXT UNIQUE,
    ai_reasoning TEXT, -- Stores the JSON or string from lib/ai-reasoning.ts
    confidence_score INTEGER, -- 0 to 100
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE VAULT STATE
-- Tracks the institutional metrics for the Ranger Leaderboard
CREATE TABLE IF NOT EXISTS public.vault_state (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL, -- 'SOL-PERP'
    tvl DECIMAL DEFAULT 0,
    apy DECIMAL DEFAULT 0,
    total_profit DECIMAL DEFAULT 0,
    last_rebalance TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE REAL-TIME
-- Allow the dashboard to listen for new trade actions automatically
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_actions;

-- 6. SET UP ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_state ENABLE ROW LEVEL SECURITY;

-- Policies: Profiles (Users can only see their own profile)
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Policies: Trade Actions (Publicly readable for "Proof of PnL", only authenticated users can insert their own)
CREATE POLICY "Trade actions are publicly viewable" 
ON public.trade_actions FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own trade actions"
ON public.trade_actions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policies: Vault State (Publicly readable for the Leaderboard)
CREATE POLICY "Vault state is publicly viewable" 
ON public.vault_state FOR SELECT 
USING (true);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_trade_actions_user ON public.trade_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_actions_status ON public.trade_actions(status);
CREATE INDEX IF NOT EXISTS idx_trade_actions_symbol ON public.trade_actions(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_actions_created ON public.trade_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_state_symbol ON public.vault_state(symbol);

-- 8. SEED INITIAL VAULT STATE
INSERT INTO public.vault_state (symbol, tvl, apy, total_profit)
VALUES 
    ('SOL-PERP', 0, 0, 0),
    ('BTC-PERP', 0, 0, 0),
    ('ETH-PERP', 0, 0, 0),
    ('JTO-PERP', 0, 0, 0),
    ('WIF-PERP', 0, 0, 0)
ON CONFLICT (symbol) DO NOTHING;
