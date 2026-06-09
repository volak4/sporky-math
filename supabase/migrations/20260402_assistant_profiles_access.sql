-- HOTFIX: Replace recursive assistant policy with non-recursive version
-- The previous policy caused infinite recursion (error 42P17) by querying
-- the profiles table from within its own RLS policy.

-- Step 1: Drop the broken policy
DROP POLICY IF EXISTS "Assistants can read all profiles" ON profiles;

-- Step 2: Create a security definer function that bypasses RLS to check role
-- This avoids the recursion because SECURITY DEFINER functions run with
-- the privileges of the function owner, not the calling user.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM profiles WHERE id = user_id;
$$;

-- Step 3: Recreate the policy using the function instead of a subquery
CREATE POLICY "Assistants can read all profiles"
    ON profiles FOR SELECT
    USING (
        public.get_user_role(auth.uid()) = 'assistant'
    );
