-- Test relationship insert script
-- Run this in your Supabase SQL Editor to test if relationships can be inserted

-- First, let's get some companies to work with
SELECT 
    'Available companies for testing:' as info,
    id,
    name
FROM companies
ORDER BY name
LIMIT 5;

-- Get relationship types
SELECT 
    'Available relationship types:' as info,
    id,
    name
FROM company_relationship_types
ORDER BY name;

-- Test manual insert (replace IDs with actual ones from above queries)
-- DON'T RUN THIS YET - just for reference structure

/*
INSERT INTO company_relationships_advanced (
    parent_company_id,
    child_company_id,
    relationship_type_id,
    ownership_percentage,
    effective_date,
    end_date,
    is_active,
    metadata,
    notes,
    created_by
) VALUES (
    'YOUR_PARENT_COMPANY_ID_HERE',  -- Replace with actual company ID
    'YOUR_CHILD_COMPANY_ID_HERE',   -- Replace with actual company ID  
    'YOUR_RELATIONSHIP_TYPE_ID_HERE', -- Replace with actual relationship type ID (like Supplier)
    null,                           -- ownership_percentage
    '2024-01-15',                   -- effective_date
    null,                           -- end_date
    true,                           -- is_active
    '{}',                           -- metadata (empty json)
    'Test relationship',            -- notes
    auth.uid()                      -- created_by
);
*/

-- Check if we can read the current user
SELECT 
    'Current authentication status:' as info,
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'Authenticated' 
        ELSE 'Not authenticated' 
    END as auth_status;

-- Check if table has RLS enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'company_relationships_advanced';

-- Show any existing policies
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'company_relationships_advanced'; 