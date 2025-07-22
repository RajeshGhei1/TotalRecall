-- Debug script for company relationships issue
-- Run this in your Supabase SQL Editor

-- Check if table exists and RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'company_relationships_advanced';

-- Check existing relationships
SELECT 'Total relationships in database:' as info, COUNT(*) as count
FROM company_relationships_advanced;

-- Check recent relationships (last 24 hours)
SELECT 
    cr.*,
    pc.name as parent_name,
    cc.name as child_name,
    rt.name as relationship_type
FROM company_relationships_advanced cr
LEFT JOIN companies pc ON cr.parent_company_id = pc.id
LEFT JOIN companies cc ON cr.child_company_id = cc.id  
LEFT JOIN company_relationship_types rt ON cr.relationship_type_id = rt.id
WHERE cr.created_at > NOW() - INTERVAL '24 hours'
ORDER BY cr.created_at DESC;

-- Check RLS policies for the table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as condition
FROM pg_policies 
WHERE tablename = 'company_relationships_advanced'
ORDER BY policyname;

-- Check if user can insert (test permissions)
SELECT 
    'Current user ID:' as info,
    auth.uid() as user_id,
    'Is authenticated:' as auth_status,
    CASE WHEN auth.uid() IS NOT NULL THEN 'YES' ELSE 'NO' END as authenticated;

## 🔍 **Root Cause:**
The **main relationship** might be getting created, but the **history trigger** is failing because the `company_relationship_history` table also needs RLS policies!

## 🔧 **Fix: Apply RLS Policies for History Table**

Run this script in your **Supabase SQL Editor**:

```sql
-- Apply RLS policies for company_relationship_history table
DO $$
BEGIN
    -- Enable RLS if not already enabled
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'company_relationship_history' AND relnamespace = 'public'::regnamespace) THEN
        ALTER TABLE public.company_relationship_history ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for the history table
DO $$
BEGIN
    -- Read policy for authenticated users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_history' 
        AND policyname = 'Allow authenticated users to read company_relationship_history'
    ) THEN
        CREATE POLICY "Allow authenticated users to read company_relationship_history" 
        ON public.company_relationship_history 
        FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    -- Insert policy for triggers (important!)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'company_relationship_history' 
        AND policyname = 'Allow system to insert history records'
    ) THEN
        CREATE POLICY "Allow system to insert history records" 
        ON public.company_relationship_history 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;
END $$;

-- Grant permissions
GRANT SELECT, INSERT ON public.company_relationship_history TO authenticated;

SELECT 'RLS policies applied successfully for company_relationship_history' as status;
```

## 🔍 **Let's Also Check if Relationships Were Created**

Run this in Supabase SQL Editor to see if any relationships exist:

```sql
-- Check if any relationships were actually created
SELECT 
    COUNT(*) as total_relationships,
    'Recent relationships:' as info
FROM company_relationships_advanced;

-- Show any recent relationships
SELECT 
    cr.id,
    pc.name as parent_company,
    cc.name as child_company,
    rt.name as relationship_type,
    cr.created_at
FROM company_relationships_advanced cr
LEFT JOIN companies pc ON cr.parent_company_id = pc.id
LEFT JOIN companies cc ON cr.child_company_id = cc.id
LEFT JOIN company_relationship_types rt ON cr.relationship_type_id = rt.id
ORDER BY cr.created_at DESC
LIMIT 10;
```

## 🎯 **Next Steps:**

1. **Run the history table RLS script** above
2. **Check if relationships exist** with the second script
3. **Try creating a new relationship** in your app
4. **Check console** for success messages

## 📋 **Expected Results:**
- ✅ History logging should now work
- ✅ Relationships should save completely
- ✅ You should see relationships appear in the Associations tab

**The issue was that the trigger trying to log changes couldn't write to the history table due to missing RLS policies!**