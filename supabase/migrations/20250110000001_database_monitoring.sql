-- Database Monitoring and Health Check Script
-- This script provides comprehensive monitoring for database health and performance

-- ====================
-- DATABASE HEALTH CHECK FUNCTIONS
-- ====================

-- Function to check table sizes and identify large tables
CREATE OR REPLACE FUNCTION check_table_sizes()
RETURNS TABLE (
    schema_name text,
    table_name text,
    row_count bigint,
    total_size text,
    table_size text,
    index_size text,
    toast_size text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::text,
        tablename::text,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                      pg_relation_size(schemaname||'.'||tablename) - 
                      pg_indexes_size(schemaname||'.'||tablename)) as toast_size
    FROM pg_tables pt
    LEFT JOIN pg_stat_user_tables st ON pt.tablename = st.relname
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check index usage and identify unused indexes
CREATE OR REPLACE FUNCTION check_index_usage()
RETURNS TABLE (
    schema_name text,
    table_name text,
    index_name text,
    index_scans bigint,
    tuples_read bigint,
    tuples_fetched bigint,
    index_size text,
    usage_status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::text,
        tablename::text,
        indexname::text,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        CASE 
            WHEN idx_scan = 0 THEN 'UNUSED'
            WHEN idx_scan < 100 THEN 'LOW_USAGE'
            WHEN idx_scan < 1000 THEN 'MODERATE_USAGE'
            ELSE 'HIGH_USAGE'
        END as usage_status
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to identify missing indexes (tables without indexes on foreign keys)
CREATE OR REPLACE FUNCTION check_missing_indexes()
RETURNS TABLE (
    table_name text,
    column_name text,
    constraint_type text,
    referenced_table text,
    recommendation text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.table_name::text,
        kcu.column_name::text,
        tc.constraint_type::text,
        ccu.table_name::text as referenced_table,
        ('CREATE INDEX idx_' || tc.table_name || '_' || kcu.column_name || 
         ' ON ' || tc.table_name || '(' || kcu.column_name || ');')::text as recommendation
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = tc.table_name 
        AND indexdef LIKE '%' || kcu.column_name || '%'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check RLS policies
CREATE OR REPLACE FUNCTION check_rls_policies()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean,
    policy_count bigint,
    recommendation text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename::text,
        t.rowsecurity as rls_enabled,
        COALESCE(p.policy_count, 0) as policy_count,
        CASE 
            WHEN NOT t.rowsecurity THEN 'Enable RLS: ALTER TABLE ' || t.tablename || ' ENABLE ROW LEVEL SECURITY;'
            WHEN t.rowsecurity AND COALESCE(p.policy_count, 0) = 0 THEN 'Add RLS policies for table ' || t.tablename
            ELSE 'RLS properly configured'
        END as recommendation
    FROM pg_tables t
    LEFT JOIN (
        SELECT 
            tablename,
            COUNT(*) as policy_count
        FROM pg_policies
        WHERE schemaname = 'public'
        GROUP BY tablename
    ) p ON t.tablename = p.tablename
    WHERE t.schemaname = 'public'
    ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql;

-- Function to identify slow queries
CREATE OR REPLACE FUNCTION check_slow_queries()
RETURNS TABLE (
    query_hash text,
    query_text text,
    calls bigint,
    total_exec_time double precision,
    mean_exec_time double precision,
    max_exec_time double precision,
    rows_returned bigint,
    performance_issue text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        LEFT(MD5(query), 8) as query_hash,
        LEFT(query, 100) as query_text,
        calls,
        total_exec_time,
        mean_exec_time,
        max_exec_time,
        rows,
        CASE 
            WHEN mean_exec_time > 5000 THEN 'CRITICAL - >5s average'
            WHEN mean_exec_time > 1000 THEN 'HIGH - >1s average'
            WHEN mean_exec_time > 500 THEN 'MEDIUM - >500ms average'
            ELSE 'LOW'
        END as performance_issue
    FROM pg_stat_statements
    WHERE calls > 10
    ORDER BY mean_exec_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Function to check database bloat
CREATE OR REPLACE FUNCTION check_database_bloat()
RETURNS TABLE (
    table_name text,
    table_size text,
    bloat_ratio numeric,
    bloat_size text,
    recommendation text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        ROUND(100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)), 2) as bloat_ratio,
        pg_size_pretty(pg_stat_get_dead_tuples(c.oid) * 
                      (SELECT setting::int FROM pg_settings WHERE name = 'block_size')) as bloat_size,
        CASE 
            WHEN 100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)) > 20 
            THEN 'Consider VACUUM FULL on ' || schemaname||'.'||tablename
            WHEN 100 * (n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0)) > 10 
            THEN 'Consider VACUUM on ' || schemaname||'.'||tablename
            ELSE 'No action needed'
        END as recommendation
    FROM pg_stat_user_tables s
    JOIN pg_class c ON s.relid = c.oid
    WHERE schemaname = 'public'
    AND n_live_tup + n_dead_tup > 0
    ORDER BY bloat_ratio DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to check connection and query statistics
CREATE OR REPLACE FUNCTION check_connection_stats()
RETURNS TABLE (
    metric text,
    value text,
    recommendation text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Active Connections'::text as metric,
        COUNT(*)::text as value,
        CASE 
            WHEN COUNT(*) > 80 THEN 'HIGH - Consider connection pooling'
            WHEN COUNT(*) > 50 THEN 'MEDIUM - Monitor connection usage'
            ELSE 'OK'
        END as recommendation
    FROM pg_stat_activity
    WHERE state = 'active'
    
    UNION ALL
    
    SELECT 
        'Idle Connections'::text as metric,
        COUNT(*)::text as value,
        CASE 
            WHEN COUNT(*) > 100 THEN 'HIGH - Check for connection leaks'
            WHEN COUNT(*) > 50 THEN 'MEDIUM - Monitor idle connections'
            ELSE 'OK'
        END as recommendation
    FROM pg_stat_activity
    WHERE state = 'idle'
    
    UNION ALL
    
    SELECT 
        'Long Running Queries'::text as metric,
        COUNT(*)::text as value,
        CASE 
            WHEN COUNT(*) > 5 THEN 'HIGH - Investigate long-running queries'
            WHEN COUNT(*) > 2 THEN 'MEDIUM - Monitor query performance'
            ELSE 'OK'
        END as recommendation
    FROM pg_stat_activity
    WHERE state = 'active' 
    AND query_start < NOW() - INTERVAL '1 minute'
    AND query NOT LIKE '%pg_stat_activity%';
END;
$$ LANGUAGE plpgsql;

-- Comprehensive health check function
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE (
    check_category text,
    check_name text,
    status text,
    details text,
    recommendation text,
    priority text
) AS $$
BEGIN
    -- Check for tables without indexes on foreign keys
    RETURN QUERY
    SELECT 
        'Indexes'::text as check_category,
        'Missing FK Indexes'::text as check_name,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status,
        COUNT(*)::text || ' foreign keys without indexes' as details,
        CASE WHEN COUNT(*) = 0 THEN 'No action needed' ELSE 'Add indexes on foreign key columns' END as recommendation,
        'HIGH'::text as priority
    FROM check_missing_indexes();
    
    -- Check for unused indexes
    RETURN QUERY
    SELECT 
        'Indexes'::text as check_category,
        'Unused Indexes'::text as check_name,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARNING' END as status,
        COUNT(*)::text || ' indexes with zero scans' as details,
        CASE WHEN COUNT(*) = 0 THEN 'No action needed' ELSE 'Consider dropping unused indexes' END as recommendation,
        'MEDIUM'::text as priority
    FROM check_index_usage()
    WHERE usage_status = 'UNUSED';
    
    -- Check for tables without RLS
    RETURN QUERY
    SELECT 
        'Security'::text as check_category,
        'Row Level Security'::text as check_name,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status,
        COUNT(*)::text || ' tables without RLS enabled' as details,
        CASE WHEN COUNT(*) = 0 THEN 'No action needed' ELSE 'Enable RLS on all tables' END as recommendation,
        'HIGH'::text as priority
    FROM check_rls_policies()
    WHERE NOT rls_enabled;
    
    -- Check for database bloat
    RETURN QUERY
    SELECT 
        'Maintenance'::text as check_category,
        'Database Bloat'::text as check_name,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARNING' END as status,
        COUNT(*)::text || ' tables with >20% bloat' as details,
        CASE WHEN COUNT(*) = 0 THEN 'No action needed' ELSE 'Run VACUUM on bloated tables' END as recommendation,
        'MEDIUM'::text as priority
    FROM check_database_bloat()
    WHERE bloat_ratio > 20;
    
    -- Check for slow queries
    RETURN QUERY
    SELECT 
        'Performance'::text as check_category,
        'Slow Queries'::text as check_name,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARNING' END as status,
        COUNT(*)::text || ' queries with >1s average execution time' as details,
        CASE WHEN COUNT(*) = 0 THEN 'No action needed' ELSE 'Optimize slow queries' END as recommendation,
        'HIGH'::text as priority
    FROM check_slow_queries()
    WHERE mean_exec_time > 1000;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- MAINTENANCE AND OPTIMIZATION FUNCTIONS
-- ====================

-- Function to generate index recommendations
CREATE OR REPLACE FUNCTION generate_index_recommendations()
RETURNS TABLE (
    table_name text,
    recommended_index text,
    reason text,
    priority text
) AS $$
BEGIN
    -- Recommendations based on missing FK indexes
    RETURN QUERY
    SELECT 
        mi.table_name::text,
        mi.recommendation::text,
        ('Missing index on foreign key column: ' || mi.column_name)::text as reason,
        'HIGH'::text as priority
    FROM check_missing_indexes() mi;
    
    -- Additional recommendations can be added here
    -- For example, based on query patterns, table sizes, etc.
END;
$$ LANGUAGE plpgsql;

-- Function to generate optimization report
CREATE OR REPLACE FUNCTION generate_optimization_report()
RETURNS TABLE (
    section text,
    finding text,
    impact text,
    action_required text,
    sql_command text
) AS $$
BEGIN
    -- Table size analysis
    RETURN QUERY
    SELECT 
        'Table Sizes'::text as section,
        ('Large table: ' || ts.table_name || ' (' || ts.total_size || ')')::text as finding,
        'Performance impact on queries'::text as impact,
        'Consider archiving old data or partitioning'::text as action_required,
        ('-- Consider implementing data retention policy for ' || ts.table_name)::text as sql_command
    FROM check_table_sizes() ts
    WHERE ts.row_count > 100000
    LIMIT 5;
    
    -- Index recommendations
    RETURN QUERY
    SELECT 
        'Index Optimization'::text as section,
        ('Missing index on ' || ir.table_name || '.' || split_part(ir.recommended_index, '(', 2))::text as finding,
        'Slow queries on foreign key joins'::text as impact,
        'Add recommended index'::text as action_required,
        ir.recommended_index::text as sql_command
    FROM generate_index_recommendations() ir;
    
    -- RLS policy recommendations
    RETURN QUERY
    SELECT 
        'Security'::text as section,
        ('Table without RLS: ' || rls.table_name)::text as finding,
        'Potential security vulnerability'::text as impact,
        'Enable RLS and add appropriate policies'::text as action_required,
        ('ALTER TABLE ' || rls.table_name || ' ENABLE ROW LEVEL SECURITY;')::text as sql_command
    FROM check_rls_policies() rls
    WHERE NOT rls.rls_enabled;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- HELPER FUNCTIONS
-- ====================

-- Function to get database configuration recommendations
CREATE OR REPLACE FUNCTION get_config_recommendations()
RETURNS TABLE (
    setting_name text,
    current_value text,
    recommended_value text,
    reason text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'shared_buffers'::text as setting_name,
        current_setting('shared_buffers') as current_value,
        '25% of available RAM'::text as recommended_value,
        'Improve cache hit ratio'::text as reason
    
    UNION ALL
    
    SELECT 
        'work_mem'::text as setting_name,
        current_setting('work_mem') as current_value,
        '4MB-16MB per connection'::text as recommended_value,
        'Optimize sort and hash operations'::text as reason
    
    UNION ALL
    
    SELECT 
        'maintenance_work_mem'::text as setting_name,
        current_setting('maintenance_work_mem') as current_value,
        '256MB-2GB'::text as recommended_value,
        'Faster VACUUM, CREATE INDEX operations'::text as reason;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- COMMENTS AND DOCUMENTATION
-- ====================

COMMENT ON FUNCTION check_table_sizes IS 'Analyze table sizes and identify large tables that may need optimization';
COMMENT ON FUNCTION check_index_usage IS 'Check index usage statistics and identify unused indexes';
COMMENT ON FUNCTION check_missing_indexes IS 'Identify missing indexes on foreign key columns';
COMMENT ON FUNCTION check_rls_policies IS 'Check Row Level Security configuration for all tables';
COMMENT ON FUNCTION check_slow_queries IS 'Identify slow queries that need optimization';
COMMENT ON FUNCTION check_database_bloat IS 'Check for database bloat and recommend maintenance';
COMMENT ON FUNCTION database_health_check IS 'Comprehensive database health check with recommendations';
COMMENT ON FUNCTION generate_optimization_report IS 'Generate comprehensive optimization report with actionable recommendations'; 