-- Run this in your Supabase SQL Editor to fix the Admin Users page

-- 1. Create a security definer function to check if a user is an admin
-- This allows checking admin status without causing an infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT is_admin INTO is_admin_user FROM public.user_profiles WHERE id = auth.uid();
  RETURN COALESCE(is_admin_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop the old restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- 3. Create new policies that allow admins to view and update all profiles
CREATE POLICY "Users can view profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users and admins can update profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Also add a delete policy for admins (optional depending on future features)
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;
CREATE POLICY "Admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());
