-- Debug script to check relationship types data
-- Run this in your Supabase SQL Editor to verify the data

-- Check if table exists and has RLS enabled
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'company_relationship_types';

-- Check if there are any relationship types in the table
SELECT 'Total relationship types:' as info, COUNT(*) as count
FROM company_relationship_types;

-- Show all relationship types
SELECT 
    id,
    name,
    description,
    is_hierarchical,
    allows_percentage,
    color,
    icon,
    created_at
FROM company_relationship_types
ORDER BY name;

-- Check RLS policies for this table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'company_relationship_types'
ORDER BY policyname; 