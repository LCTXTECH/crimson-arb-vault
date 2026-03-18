-- Create founders_waitlist table for CrimsonARB Founders Vault
CREATE TABLE IF NOT EXISTS founders_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  wallet TEXT,
  amount_intended INTEGER NOT NULL CHECK (amount_intended >= 1000 AND amount_intended <= 5000),
  source TEXT DEFAULT 'direct',
  position INTEGER NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  deposited_at TIMESTAMPTZ,
  actual_amount INTEGER
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_founders_waitlist_email ON founders_waitlist(email);

-- Create index on position for ordering
CREATE INDEX IF NOT EXISTS idx_founders_waitlist_position ON founders_waitlist(position);

-- Enable RLS
ALTER TABLE founders_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated service role
CREATE POLICY "Service role can manage founders_waitlist" ON founders_waitlist
  FOR ALL USING (true);

-- Comment on table
COMMENT ON TABLE founders_waitlist IS 'CrimsonARB Founders Vault waitlist - first 100 depositors with 0% fees';
