-- Migration: Grant assistant role SELECT access to traffic_events
--
-- Problem: The original SELECT policy on traffic_events was hardcoded to a
-- single admin email (volak4@yahoo.com). When the administrative assistant
-- (role = 'assistant') opens the Traffic Sources dashboard, Supabase RLS
-- silently returns zero rows — making the dashboard appear empty/broken.
--
-- Fix: Replace the single-email policy with one that allows both the admin
-- AND any user with the 'assistant' role to read traffic events.
-- Uses the existing public.get_user_role() SECURITY DEFINER function to
-- avoid RLS recursion on the profiles table.

-- Step 1: Drop the original admin-only policy
DROP POLICY IF EXISTS "Only admin can read traffic events" ON traffic_events;

-- Step 2: Create a new policy that grants SELECT to admin OR assistant
CREATE POLICY "Admin and assistant can read traffic events"
    ON traffic_events FOR SELECT
    USING (
        auth.jwt() ->> 'email' = 'volak4@yahoo.com'
        OR public.get_user_role(auth.uid()) = 'assistant'
    );
