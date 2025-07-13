-- RLS Policies for system_modules table
-- Run this in your Supabase SQL Editor

-- First, make sure RLS is enabled
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to read system_modules" ON public.system_modules;
DROP POLICY IF EXISTS "Allow authenticated users to insert system_modules" ON public.system_modules;
DROP POLICY IF EXISTS "Allow authenticated users to update system_modules" ON public.system_modules;
DROP POLICY IF EXISTS "Allow authenticated users to delete system_modules" ON public.system_modules;
DROP POLICY IF EXISTS "Allow anonymous users to read system_modules" ON public.system_modules;

-- Policy 1: Allow read access for authenticated users
CREATE POLICY "Allow authenticated users to read system_modules" 
ON public.system_modules 
FOR SELECT 
TO authenticated 
USING (true);

-- Policy 2: Allow read access for anonymous users (for app functionality)
CREATE POLICY "Allow anonymous users to read system_modules" 
ON public.system_modules 
FOR SELECT 
TO anon 
USING (true);

-- Policy 3: Allow insert for authenticated users
CREATE POLICY "Allow authenticated users to insert system_modules" 
ON public.system_modules 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy 4: Allow update for authenticated users  
CREATE POLICY "Allow authenticated users to update system_modules" 
ON public.system_modules 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy 5: Allow delete for authenticated users
CREATE POLICY "Allow authenticated users to delete system_modules" 
ON public.system_modules 
FOR DELETE 
TO authenticated 
USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.system_modules TO anon;
GRANT SELECT ON public.system_modules TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.system_modules TO authenticated;

-- Show created policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'system_modules';
