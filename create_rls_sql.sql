-- Safe RLS Policies for system_modules and company relationship tables
-- Run this in your Supabase SQL Editor
-- This script only creates policies if they don't exist - no destructive operations

-- ============================================
-- RLS Policies for system_modules table (safe)
-- ============================================

-- Enable RLS only if not already enabled
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'system_modules' AND relnamespace = 'public'::regnamespace) THEN
        ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check and create read policy for authenticated users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_modules' 
        AND policyname = 'Allow authenticated users to read system_modules'
    ) THEN
        CREATE POLICY "Allow authenticated users to read system_modules" 
        ON public.system_modules 
        FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    -- Check and create read policy for anonymous users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_modules' 
        AND policyname = 'Allow anonymous users to read system_modules'
    ) THEN
        CREATE POLICY "Allow anonymous users to read system_modules" 
        ON public.system_modules 
        FOR SELECT 
        TO anon 
        USING (true);
    END IF;

    -- Check and create insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_modules' 
        AND policyname = 'Allow authenticated users to insert system_modules'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert system_modules" 
        ON public.system_modules 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;

    -- Check and create update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_modules' 
        AND policyname = 'Allow authenticated users to update system_modules'
    ) THEN
        CREATE POLICY "Allow authenticated users to update system_modules" 
        ON public.system_modules 
        FOR UPDATE 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
    END IF;

    -- Check and create delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'system_modules' 
        AND policyname = 'Allow authenticated users to delete system_modules'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete system_modules" 
        ON public.system_modules 
        FOR DELETE 
        TO authenticated 
        USING (true);
    END IF;
END $$;

-- Grant necessary permissions (safe - won't error if already granted)
GRANT SELECT ON public.system_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_modules TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- ============================================
-- RLS Policies for company_relationship_types table (safe)
-- ============================================

-- Enable RLS only if not already enabled
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'company_relationship_types' AND relnamespace = 'public'::regnamespace) THEN
        ALTER TABLE public.company_relationship_types ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check and create read policy for authenticated users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_types' 
        AND policyname = 'Allow authenticated users to read company_relationship_types'
    ) THEN
        CREATE POLICY "Allow authenticated users to read company_relationship_types" 
        ON public.company_relationship_types 
        FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    -- Check and create read policy for anonymous users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_types' 
        AND policyname = 'Allow anonymous users to read company_relationship_types'
    ) THEN
        CREATE POLICY "Allow anonymous users to read company_relationship_types" 
        ON public.company_relationship_types 
        FOR SELECT 
        TO anon 
        USING (true);
    END IF;

    -- Check and create insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_types' 
        AND policyname = 'Allow authenticated users to insert company_relationship_types'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert company_relationship_types" 
        ON public.company_relationship_types 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;

    -- Check and create update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_types' 
        AND policyname = 'Allow authenticated users to update company_relationship_types'
    ) THEN
        CREATE POLICY "Allow authenticated users to update company_relationship_types" 
        ON public.company_relationship_types 
        FOR UPDATE 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
    END IF;

    -- Check and create delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_types' 
        AND policyname = 'Allow authenticated users to delete company_relationship_types'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete company_relationship_types" 
        ON public.company_relationship_types 
        FOR DELETE 
        TO authenticated 
        USING (true);
    END IF;
END $$;

-- Grant necessary permissions for company_relationship_types
GRANT SELECT ON public.company_relationship_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_relationship_types TO authenticated;

-- ============================================
-- RLS Policies for company_relationships_advanced table (safe)
-- ============================================

-- Enable RLS only if not already enabled
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'company_relationships_advanced' AND relnamespace = 'public'::regnamespace) THEN
        ALTER TABLE public.company_relationships_advanced ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check and create read policy for authenticated users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationships_advanced' 
        AND policyname = 'Allow authenticated users to read company_relationships_advanced'
    ) THEN
        CREATE POLICY "Allow authenticated users to read company_relationships_advanced" 
        ON public.company_relationships_advanced 
        FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    -- Check and create read policy for anonymous users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationships_advanced' 
        AND policyname = 'Allow anonymous users to read company_relationships_advanced'
    ) THEN
        CREATE POLICY "Allow anonymous users to read company_relationships_advanced" 
        ON public.company_relationships_advanced 
        FOR SELECT 
        TO anon 
        USING (true);
    END IF;

    -- Check and create insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationships_advanced' 
        AND policyname = 'Allow authenticated users to insert company_relationships_advanced'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert company_relationships_advanced" 
        ON public.company_relationships_advanced 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;

    -- Check and create update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationships_advanced' 
        AND policyname = 'Allow authenticated users to update company_relationships_advanced'
    ) THEN
        CREATE POLICY "Allow authenticated users to update company_relationships_advanced" 
        ON public.company_relationships_advanced 
        FOR UPDATE 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
    END IF;

    -- Check and create delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationships_advanced' 
        AND policyname = 'Allow authenticated users to delete company_relationships_advanced'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete company_relationships_advanced" 
        ON public.company_relationships_advanced 
        FOR DELETE 
        TO authenticated 
        USING (true);
    END IF;
END $$;

-- Grant necessary permissions for company_relationships_advanced
GRANT SELECT ON public.company_relationships_advanced TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_relationships_advanced TO authenticated;

-- Show what was created (optional - for verification)
SELECT 'RLS Policies created successfully' as status;
