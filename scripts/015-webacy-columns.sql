-- Add Webacy DD.xyz columns to ai_decisions table
-- Layer 3 security integration

ALTER TABLE ai_decisions
  ADD COLUMN IF NOT EXISTS webacy_dd_score INTEGER,
  ADD COLUMN IF NOT EXISTS webacy_risk_level TEXT,
  ADD COLUMN IF NOT EXISTS webacy_flags JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS webacy_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS webacy_source TEXT DEFAULT 'simulated';

-- Index for fast lookups by DD score
CREATE INDEX IF NOT EXISTS idx_decisions_webacy_score 
  ON ai_decisions(webacy_dd_score);

-- Index for filtering by risk level
CREATE INDEX IF NOT EXISTS idx_decisions_webacy_risk
  ON ai_decisions(webacy_risk_level);

COMMENT ON COLUMN ai_decisions.webacy_dd_score IS 'Webacy DD.xyz score 0-100 (higher = safer)';
COMMENT ON COLUMN ai_decisions.webacy_risk_level IS 'SAFE | LOW | MEDIUM | HIGH | CRITICAL';
COMMENT ON COLUMN ai_decisions.webacy_flags IS 'JSON flags: isSanctioned, isPhishing, hasSnipingHistory, etc.';
COMMENT ON COLUMN ai_decisions.webacy_source IS 'webacy-dd for live API, simulated for devnet';
