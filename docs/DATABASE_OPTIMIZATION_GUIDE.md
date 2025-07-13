# Database Optimization Guide - Addressing Supabase Advisor Warnings

## Overview
This guide provides comprehensive solutions for addressing Supabase advisor warnings, improving query performance, and maintaining database health.

## Table of Contents
1. [Common Supabase Advisor Warnings](#common-warnings)
2. [Performance Optimization](#performance-optimization)
3. [Index Management](#index-management)
4. [Query Optimization](#query-optimization)
5. [Security Improvements](#security-improvements)
6. [Monitoring and Maintenance](#monitoring-maintenance)
7. [Best Practices](#best-practices)

## Common Supabase Advisor Warnings {#common-warnings}

### 1. Missing Indexes
**Warning**: "Table scans detected on large tables"
**Solution**: 
- Run the optimization migration: `20250110000000-database-optimization.sql`
- Add indexes on frequently queried columns
- Use composite indexes for multi-column queries

### 2. Slow Queries
**Warning**: "Queries taking >1000ms detected"
**Solution**:
```sql
-- Check slow queries
SELECT * FROM get_slow_queries();

-- Optimize with indexes or query restructuring
-- See Query Optimization section below
```

### 3. Missing RLS Policies
**Warning**: "Tables without Row Level Security policies"
**Solution**:
```sql
-- Enable RLS on all tables
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Add appropriate policies
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (tenant_id = get_user_tenant_id(auth.uid()));
```

### 4. Unused Indexes
**Warning**: "Unused indexes consuming space"
**Solution**:
```sql
-- Find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Drop unused indexes
DROP INDEX IF EXISTS unused_index_name;
```

### 5. Large Table Scans
**Warning**: "Sequential scans on large tables"
**Solution**:
- Add appropriate indexes
- Use LIMIT clauses
- Implement pagination
- Consider partitioning for very large tables

## Performance Optimization {#performance-optimization}

### 1. Index Strategy
```sql
-- Single column indexes for frequent WHERE clauses
CREATE INDEX idx_table_column ON table_name(column_name);

-- Composite indexes for multi-column queries
CREATE INDEX idx_table_composite ON table_name(col1, col2, col3);

-- Partial indexes for filtered queries
CREATE INDEX idx_table_active ON table_name(column) WHERE is_active = true;

-- Full-text search indexes
CREATE INDEX idx_table_fts ON table_name USING gin(to_tsvector('english', content));
```

### 2. Query Optimization Techniques
```sql
-- Use EXISTS instead of IN for better performance
SELECT * FROM people p 
WHERE EXISTS (
    SELECT 1 FROM applications a 
    WHERE a.person_id = p.id
);

-- Use LIMIT for pagination
SELECT * FROM people 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

-- Use covering indexes
CREATE INDEX idx_people_covering ON people(tenant_id, created_at) 
INCLUDE (full_name, email);
```

### 3. Materialized Views for Complex Queries
```sql
-- Create materialized views for expensive queries
CREATE MATERIALIZED VIEW people_summary AS
SELECT 
    tenant_id,
    COUNT(*) as total_people,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_people
FROM people
GROUP BY tenant_id;

-- Refresh regularly
REFRESH MATERIALIZED VIEW CONCURRENTLY people_summary;
```

## Index Management {#index-management}

### 1. Index Monitoring
```sql
-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check index sizes
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 2. Index Maintenance
```sql
-- Rebuild fragmented indexes
REINDEX INDEX CONCURRENTLY index_name;

-- Update table statistics
ANALYZE table_name;

-- Auto-vacuum settings
ALTER TABLE table_name SET (
    autovacuum_vacuum_threshold = 100,
    autovacuum_vacuum_scale_factor = 0.1
);
```

## Query Optimization {#query-optimization}

### 1. Query Analysis
```sql
-- Use EXPLAIN ANALYZE for query planning
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM people 
WHERE tenant_id = 'uuid' 
AND created_at >= '2024-01-01';

-- Check for sequential scans
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) your_query;
```

### 2. Common Optimization Patterns
```sql
-- 1. Use appropriate JOINs
SELECT p.*, c.name as company_name
FROM people p
LEFT JOIN person_companies pc ON p.id = pc.person_id AND pc.is_current = true
LEFT JOIN companies c ON pc.company_id = c.id
WHERE p.tenant_id = 'uuid';

-- 2. Avoid N+1 queries with proper JOINs
SELECT p.*, array_agg(c.name) as company_names
FROM people p
LEFT JOIN person_companies pc ON p.id = pc.person_id
LEFT JOIN companies c ON pc.company_id = c.id
WHERE p.tenant_id = 'uuid'
GROUP BY p.id;

-- 3. Use window functions for ranking
SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at DESC) as rn
FROM people
WHERE tenant_id = 'uuid'
QUALIFY rn <= 10;
```

### 3. Pagination Best Practices
```sql
-- Cursor-based pagination (better for large datasets)
SELECT * FROM people 
WHERE tenant_id = 'uuid' 
AND created_at < '2024-01-01T00:00:00Z'
ORDER BY created_at DESC
LIMIT 20;

-- Offset pagination (for smaller datasets)
SELECT * FROM people 
WHERE tenant_id = 'uuid'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

## Security Improvements {#security-improvements}

### 1. Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY "tenant_isolation" ON people
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Admin access policy
CREATE POLICY "admin_access" ON people
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_tenants ut
      WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = people.tenant_id
      AND ut.role = 'admin'
    )
  );
```

### 2. Function Security
```sql
-- Create secure functions
CREATE OR REPLACE FUNCTION secure_people_count(tenant_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify user has access to tenant
    IF NOT EXISTS (
        SELECT 1 FROM user_tenants 
        WHERE user_id = auth.uid() 
        AND tenant_id = tenant_uuid
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    RETURN (SELECT COUNT(*) FROM people WHERE tenant_id = tenant_uuid);
END;
$$;
```

## Monitoring and Maintenance {#monitoring-maintenance}

### 1. Performance Monitoring
```sql
-- Monitor slow queries
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC;

-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Automated Maintenance
```sql
-- Schedule regular maintenance
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
BEGIN
    -- Update statistics
    PERFORM update_table_statistics();
    
    -- Refresh materialized views
    PERFORM refresh_materialized_views();
    
    -- Cleanup old data
    PERFORM cleanup_old_audit_logs();
    PERFORM cleanup_old_user_interactions();
END;
$$ LANGUAGE plpgsql;

-- Run maintenance (can be scheduled via cron)
SELECT daily_maintenance();
```

## Best Practices {#best-practices}

### 1. Query Design
- Always include `tenant_id` in WHERE clauses for multi-tenant queries
- Use appropriate JOINs instead of subqueries when possible
- Implement pagination for large result sets
- Use prepared statements to prevent SQL injection

### 2. Index Strategy
- Create indexes on foreign keys
- Use composite indexes for multi-column queries
- Consider partial indexes for filtered queries
- Monitor and remove unused indexes regularly

### 3. Performance Monitoring
- Regularly check slow query logs
- Monitor table and index sizes
- Update table statistics after bulk operations
- Use EXPLAIN ANALYZE for query optimization

### 4. Maintenance Schedule
- Daily: Update statistics, refresh materialized views
- Weekly: Check for slow queries, monitor index usage
- Monthly: Cleanup old data, review and optimize queries
- Quarterly: Review and optimize database schema

## Implementation Steps

1. **Run the optimization migration**:
   ```bash
   supabase db reset --linked
   # or
   supabase migration up
   ```

2. **Monitor the results**:
   - Check Supabase dashboard for advisor warnings
   - Run slow query analysis
   - Monitor query performance

3. **Iterate and optimize**:
   - Address remaining warnings
   - Fine-tune indexes based on usage patterns
   - Optimize specific slow queries

4. **Set up monitoring**:
   - Schedule regular maintenance
   - Monitor performance metrics
   - Set up alerts for slow queries

## Troubleshooting Common Issues

### Issue: Migration fails due to missing tables
**Solution**: Check table names in your schema and adjust the migration accordingly.

### Issue: Concurrent index creation fails
**Solution**: Run index creation during low-traffic periods or use standard index creation.

### Issue: RLS policies block legitimate queries
**Solution**: Review and test RLS policies thoroughly, ensure proper tenant isolation.

### Issue: Materialized views become stale
**Solution**: Set up regular refresh schedule or use incremental refresh patterns.

---

For specific issues or questions, refer to the Supabase documentation or contact your database administrator. 