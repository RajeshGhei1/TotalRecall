-- Quick Database Health Check Script
-- Run this in your Supabase SQL Editor to get immediate insights

-- ==========================================
-- IMMEDIATE HEALTH CHECK SUMMARY
-- ==========================================

-- Quick overview of database health
SELECT 
    'DATABASE HEALTH OVERVIEW' as report_section,
    '' as table_name,
    '' as issue_type,
    'Run the health check queries below for detailed analysis' as recommendation;

-- ==========================================
-- 1. TABLE SIZES - Find large tables
-- ==========================================

SELECT 
    'TABLE SIZES' as report_section,
    schemaname||'.'||tablename as table_name,
    'Large Table' as issue_type,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
    'Consider optimization if query performance is slow' as recommendation
FROM pg_tables pt
JOIN pg_stat_user_tables st ON pt.tablename = st.relname
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- ==========================================
-- 2. MISSING INDEXES - Find tables needing indexes
-- ==========================================

SELECT 
    'MISSING INDEXES' as report_section,
    tc.table_name as table_name,
    'Missing FK Index' as issue_type,
    kcu.column_name as column_name,
    'CREATE INDEX idx_' || tc.table_name || '_' || kcu.column_name || 
    ' ON ' || tc.table_name || '(' || kcu.column_name || ');' as recommendation
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = tc.table_name 
    AND indexdef LIKE '%' || kcu.column_name || '%'
)
ORDER BY tc.table_name, kcu.column_name;

-- ==========================================
-- 3. UNUSED INDEXES - Find indexes that aren't being used
-- ==========================================

SELECT 
    'UNUSED INDEXES' as report_section,
    schemaname||'.'||tablename as table_name,
    'Unused Index' as issue_type,
    indexname as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    'Consider dropping: DROP INDEX ' || indexname || ';' as recommendation
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ==========================================
-- 4. ROW LEVEL SECURITY - Check RLS status
-- ==========================================

SELECT 
    'ROW LEVEL SECURITY' as report_section,
    tablename as table_name,
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled'
        ELSE 'RLS Disabled'
    END as issue_type,
    CASE 
        WHEN rowsecurity THEN 'Good - RLS is enabled'
        ELSE 'Enable RLS: ALTER TABLE ' || tablename || ' ENABLE ROW LEVEL SECURITY;'
    END as recommendation
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ==========================================
-- 5. DATABASE BLOAT - Check for maintenance needs
-- ==========================================

SELECT 
    'DATABASE BLOAT' as report_section,
    schemaname||'.'||tablename as table_name,
    'High Bloat' as issue_type,
    ROUND(100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)), 2) as bloat_percentage,
    CASE 
        WHEN 100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)) > 20 
        THEN 'Run VACUUM FULL on ' || schemaname||'.'||tablename
        WHEN 100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)) > 10 
        THEN 'Run VACUUM on ' || schemaname||'.'||tablename
        ELSE 'No action needed'
    END as recommendation
FROM pg_stat_user_tables
WHERE schemaname = 'public'
AND n_live_tup + n_dead_tup > 0
AND 100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)) > 10
ORDER BY bloat_percentage DESC;

-- ==========================================
-- 6. SLOW QUERIES - Find performance issues
-- ==========================================

-- Note: This requires pg_stat_statements extension
-- If you get an error, the extension needs to be enabled
SELECT 
    'SLOW QUERIES' as report_section,
    LEFT(query, 80) as query_text,
    'Slow Query' as issue_type,
    ROUND(mean_exec_time::numeric, 2) as avg_time_ms,
    calls as call_count,
    'Optimize this query - consider adding indexes' as recommendation
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- queries taking more than 1 second
AND calls > 10               -- called more than 10 times
ORDER BY mean_exec_time DESC
LIMIT 10;

-- ==========================================
-- 7. CONNECTION STATISTICS
-- ==========================================

SELECT 
    'CONNECTION STATS' as report_section,
    state as connection_state,
    'Connection Analysis' as issue_type,
    COUNT(*) as connection_count,
    CASE 
        WHEN state = 'active' AND COUNT(*) > 50 THEN 'High active connections - consider connection pooling'
        WHEN state = 'idle' AND COUNT(*) > 100 THEN 'High idle connections - check for connection leaks'
        ELSE 'Connection levels are normal'
    END as recommendation
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()  -- Exclude current connection
GROUP BY state
ORDER BY connection_count DESC;

-- ==========================================
-- SUMMARY AND NEXT STEPS
-- ==========================================

SELECT 
    'NEXT STEPS' as report_section,
    'Summary' as table_name,
    'Action Required' as issue_type,
    'Review the results above and implement the recommendations' as recommendation
UNION ALL
SELECT 
    'NEXT STEPS' as report_section,
    'Optimization' as table_name,
    'Run Migration' as issue_type,
    'Apply the optimization migration: 20250110000000-database-optimization.sql' as recommendation
UNION ALL
SELECT 
    'NEXT STEPS' as report_section,
    'Monitoring' as table_name,
    'Setup Monitoring' as issue_type,
    'Apply the monitoring migration: 20250110000001-database-monitoring.sql' as recommendation
UNION ALL
SELECT 
    'NEXT STEPS' as report_section,
    'Documentation' as table_name,
    'Reference Guide' as issue_type,
    'Read the DATABASE_OPTIMIZATION_GUIDE.md for detailed instructions' as recommendation;

-- ==========================================
-- QUICK FIXES YOU CAN RUN NOW
-- ==========================================

-- Uncomment and run these if you want to apply some quick fixes:

-- 1. Enable RLS on all tables (uncomment to run)
-- DO $$
-- DECLARE
--     table_name text;
-- BEGIN
--     FOR table_name IN 
--         SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity
--     LOOP
--         EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
--     END LOOP;
-- END $$;

-- 2. Update table statistics (uncomment to run)
-- ANALYZE;

-- 3. Simple vacuum (uncomment to run)
-- VACUUM;

-- ==========================================
-- PERFORMANCE BASELINE
-- ==========================================

SELECT 
    'PERFORMANCE BASELINE' as report_section,
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value,
    'Total database size' as description
UNION ALL
SELECT 
    'PERFORMANCE BASELINE' as report_section,
    'Table Count' as metric,
    COUNT(*)::text as value,
    'Total number of tables' as description
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'PERFORMANCE BASELINE' as report_section,
    'Index Count' as metric,
    COUNT(*)::text as value,
    'Total number of indexes' as description
FROM pg_indexes 
WHERE schemaname = 'public';

-- ==========================================
-- END OF HEALTH CHECK
-- ==========================================

SELECT 
    '========================================' as report_section,
    'HEALTH CHECK COMPLETE' as table_name,
    'Review all results above' as issue_type,
    'Focus on HIGH priority items first' as recommendation; 