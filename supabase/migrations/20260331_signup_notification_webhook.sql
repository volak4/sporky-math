-- Migration: Create a database trigger to notify on new user signups
-- This fires the signup-notification Edge Function on INSERT and UPDATE to profiles

-- Ensure pg_net is available for async HTTP calls from the database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ──────────────────────────────────────────────────────────────
-- Trigger function: fires our Edge Function via pg_net
-- Uses the service role key for auth so the Edge Function
-- gets the full record payload.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_signup_edge_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
DECLARE
  _payload jsonb;
  _url text;
  _service_key text;
BEGIN
  -- Build the payload to match the format our Edge Function expects
  IF TG_OP = 'INSERT' THEN
    _payload := jsonb_build_object(
      'type', 'INSERT',
      'table', TG_TABLE_NAME,
      'record', to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    _payload := jsonb_build_object(
      'type', 'UPDATE',
      'table', TG_TABLE_NAME,
      'record', to_jsonb(NEW),
      'old_record', to_jsonb(OLD)
    );
  END IF;

  -- Resolve the project URL and service role key from environment
  _url := 'https://cztqwihnjatckruyzvjw.supabase.co/functions/v1/signup-notification';

  -- Use the service_role key that Supabase auto-injects into PostgreSQL config
  _service_key := current_setting('supabase.service_role_key', true);

  -- If the setting is unavailable, fall back to the hard-coded key
  IF _service_key IS NULL OR _service_key = '' THEN
    _service_key := current_setting('app.settings.service_role_key', true);
  END IF;

  -- Fire-and-forget HTTP POST via pg_net (async, won't block the transaction)
  PERFORM net.http_post(
    url    := _url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(_service_key, '')
    ),
    body   := _payload
  );

  RETURN NEW;
END;
$$;

-- ──────────────────────────────────────────────────────────────
-- Triggers on the profiles table
-- INSERT: fires when a new user profile is created
-- UPDATE: fires when a profile is updated (e.g. course_path set)
-- ──────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_profile_insert_notify ON public.profiles;
CREATE TRIGGER on_profile_insert_notify
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_signup_edge_function();

DROP TRIGGER IF EXISTS on_profile_update_notify ON public.profiles;
CREATE TRIGGER on_profile_update_notify
  AFTER UPDATE OF course_path ON public.profiles
  FOR EACH ROW
  WHEN (OLD.course_path IS DISTINCT FROM NEW.course_path)
  EXECUTE FUNCTION public.notify_signup_edge_function();
