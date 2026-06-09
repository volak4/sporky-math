-- Migration: Create traffic_events table for conversion funnel analytics
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS traffic_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,           -- 'page_visit', 'element_click', 'unlock_click', 'stripe_redirect', 'purchase_complete'
    event_data JSONB DEFAULT '{}',      -- flexible metadata (page URL, element ID, UTM params, referrer, etc.)
    session_id TEXT,                     -- anonymous session identifier (generated client-side)
    user_id UUID REFERENCES auth.users(id), -- NULL for anonymous visitors
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast time-range queries on the admin dashboard
CREATE INDEX IF NOT EXISTS idx_traffic_events_created_at
    ON traffic_events(created_at DESC);

-- Index for filtering by event type
CREATE INDEX IF NOT EXISTS idx_traffic_events_type
    ON traffic_events(event_type);

-- Enable RLS
ALTER TABLE traffic_events ENABLE ROW LEVEL SECURITY;

-- Permissive INSERT policy: anyone (including anonymous visitors) can log events
CREATE POLICY "Anyone can insert traffic events"
    ON traffic_events FOR INSERT
    WITH CHECK (true);

-- Restrictive SELECT policy: only the admin can read events
-- Using the admin email check via auth.jwt() for simplicity
CREATE POLICY "Only admin can read traffic events"
    ON traffic_events FOR SELECT
    USING (auth.jwt() ->> 'email' = 'volak4@yahoo.com');
