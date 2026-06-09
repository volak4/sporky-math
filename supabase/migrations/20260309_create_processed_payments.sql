-- Migration: Create processed_payments table for Stripe webhook idempotency
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS processed_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_session_id TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    modules TEXT[] NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by stripe session ID (already enforced by UNIQUE, but explicit)
CREATE INDEX IF NOT EXISTS idx_processed_payments_session
    ON processed_payments(stripe_session_id);

-- Enable RLS (admin-only access via service role key)
ALTER TABLE processed_payments ENABLE ROW LEVEL SECURITY;

-- No RLS policies = only service_role can read/write (which is what the webhook uses)
