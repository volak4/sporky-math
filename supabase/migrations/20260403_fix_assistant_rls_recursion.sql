-- HOTFIX: Fix infinite recursion in profiles RLS policy (error 42P17)
-- The previous "Assistants can read all profiles" policy caused infinite
-- recursion by querying profiles from within its own RLS policy.
-- Fix: Use a SECURITY DEFINER function that bypasses RLS for the role lookup.

-- Step 1: Drop the broken recursive policy
DROP POLICY IF EXISTS "Assistants can read all profiles" ON profiles;

-- Step 2: Create a security definer function to check role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM profiles WHERE id = user_id;
$$;

-- Step 3: Recreate the policy using the non-recursive function
CREATE POLICY "Assistants can read all profiles"
    ON profiles FOR SELECT
    USING (
        public.get_user_role(auth.uid()) = 'assistant'
    );
