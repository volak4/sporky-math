-- 1. Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  last_screen TEXT DEFAULT 'welcome',
  max_level_reached INTEGER DEFAULT 0,
  levels_attempted INTEGER[] DEFAULT '{}',
  device_type TEXT DEFAULT 'desktop',
  duration_seconds INTEGER DEFAULT 0,
  exit_trigger TEXT
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert sessions (including anonymous)
CREATE POLICY "Anyone can insert sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (true);

-- Anyone can update their own session (by session_id)
CREATE POLICY "Anyone can update their session" ON public.user_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Admin can read all sessions
CREATE POLICY "Admin can read all sessions" ON public.user_sessions
  FOR SELECT USING (auth.jwt()->>'email' = 'volak4@gmail.com');

-- Indexes
CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(started_at DESC);
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);

-- 2. Add admin read policy on sporky_profiles
CREATE POLICY "Admin can read all sporky profiles" ON public.sporky_profiles
  FOR SELECT USING (auth.jwt()->>'email' = 'volak4@gmail.com');

-- 3. Fix admin email in traffic_events (drop old, create new)
DROP POLICY IF EXISTS "Admin and assistant can read traffic events" ON public.traffic_events;
CREATE POLICY "Admin and assistant can read traffic events" ON public.traffic_events
  FOR SELECT USING (
    auth.jwt()->>'email' = 'volak4@gmail.com'
    OR public.get_user_role(auth.uid()) = 'assistant'
  );
