
-- Phase 1: Remove the tenant_module_assignments table and related structures

-- First, drop the table that stores manual override assignments
DROP TABLE IF EXISTS public.tenant_module_assignments CASCADE;

-- Remove the module_access_logs table entries related to overrides
DELETE FROM public.module_access_logs WHERE access_source = 'override';

-- Remove developer_overrides table as it's part of the override system
DROP TABLE IF EXISTS public.developer_overrides CASCADE;

-- Clean up any remaining references
-- Note: module_access_logs and other tables will remain but override-related data is removed
