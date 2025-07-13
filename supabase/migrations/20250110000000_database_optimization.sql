-- Database Optimization Migration - Address Supabase Advisor Warnings
-- This migration addresses common performance issues, missing indexes, and slow queries

-- ====================
-- PERFORMANCE INDEXES
-- ====================

-- User-related indexes for faster lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_tenants_user_id ON public.user_tenants(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_tenants_tenant_id ON public.user_tenants(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_tenants_role ON public.user_tenants(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_tenants_composite ON public.user_tenants(user_id, tenant_id, role);

-- People table indexes for faster searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_email ON public.people(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_tenant_id ON public.people(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_full_name ON public.people(full_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_created_at ON public.people(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_updated_at ON public.people(updated_at);

-- Companies table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_tenant_id ON public.companies(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_created_at ON public.companies(created_at);

-- Person-Company relationships
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_person_companies_person_id ON public.person_companies(person_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_person_companies_company_id ON public.person_companies(company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_person_companies_is_current ON public.person_companies(is_current);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_person_companies_composite ON public.person_companies(person_id, company_id, is_current);

-- AI-related table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_decisions_tenant_id ON public.ai_decisions(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_decisions_user_id ON public.ai_decisions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_decisions_created_at ON public.ai_decisions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_decisions_status ON public.ai_decisions(status);

-- AI agents indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_tenant_id ON public.ai_agents(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_is_active ON public.ai_agents(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_created_at ON public.ai_agents(created_at);

-- User interactions indexes for behavioral analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_tenant_id ON public.user_interactions(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_created_at ON public.user_interactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_interaction_type ON public.user_interactions(interaction_type);

-- Form-related indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_form_definitions_tenant_id ON public.form_definitions(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_form_definitions_created_at ON public.form_definitions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_form_definitions_is_active ON public.form_definitions(is_active);

-- Application tracking indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_tenant_id ON public.applications(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_person_id ON public.applications(person_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_created_at ON public.applications(created_at);

-- Audit logs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- ====================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- ====================

-- People search composite index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_search_composite 
ON public.people(tenant_id, full_name, email, created_at);

-- Applications status tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status_tracking 
ON public.applications(tenant_id, status, created_at);

-- AI decisions analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_decisions_analysis 
ON public.ai_decisions(tenant_id, user_id, status, created_at);

-- User activity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_activity 
ON public.user_interactions(tenant_id, user_id, interaction_type, created_at);

-- ====================
-- PARTIAL INDEXES FOR FILTERED QUERIES
-- ====================

-- Active forms only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_form_definitions_active 
ON public.form_definitions(tenant_id, created_at) WHERE is_active = true;

-- Current employment relationships
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_person_companies_current 
ON public.person_companies(person_id, company_id) WHERE is_current = true;

-- Active AI agents
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_agents_active 
ON public.ai_agents(tenant_id, created_at) WHERE is_active = true;

-- Recent user interactions (last 30 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_recent 
ON public.user_interactions(tenant_id, user_id, interaction_type) 
WHERE created_at >= (CURRENT_DATE - INTERVAL '30 days');

-- ====================
-- FULL-TEXT SEARCH INDEXES
-- ====================

-- People full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_people_fts 
ON public.people USING gin(to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(email, '')));

-- Companies full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_fts 
ON public.companies USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- ====================
-- QUERY OPTIMIZATION FUNCTIONS
-- ====================

-- Function to get user's tenant efficiently
CREATE OR REPLACE FUNCTION get_user_tenant_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM public.user_tenants 
        WHERE user_id = user_uuid 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get active applications count
CREATE OR REPLACE FUNCTION get_active_applications_count(tenant_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.applications 
        WHERE tenant_id = tenant_uuid 
        AND status IN ('pending', 'in_review', 'interview_scheduled')
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================
-- MATERIALIZED VIEWS FOR COMPLEX QUERIES
-- ====================

-- People with current company information
CREATE MATERIALIZED VIEW IF NOT EXISTS public.people_with_current_company AS
SELECT 
    p.id,
    p.tenant_id,
    p.full_name,
    p.email,
    p.phone,
    p.created_at,
    p.updated_at,
    c.name as current_company_name,
    c.id as current_company_id,
    pc.title as current_title
FROM public.people p
LEFT JOIN public.person_companies pc ON p.id = pc.person_id AND pc.is_current = true
LEFT JOIN public.companies c ON pc.company_id = c.id;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_people_with_current_company_id 
ON public.people_with_current_company(id);

-- Application summary view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.application_summary AS
SELECT 
    tenant_id,
    status,
    COUNT(*) as count,
    DATE_TRUNC('day', created_at) as date
FROM public.applications
GROUP BY tenant_id, status, DATE_TRUNC('day', created_at);

-- Create indexes on materialized views
CREATE INDEX IF NOT EXISTS idx_application_summary_tenant_date 
ON public.application_summary(tenant_id, date);

-- ====================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- ====================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.people_with_current_company;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.application_summary;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- AUTOMATED MAINTENANCE
-- ====================

-- Function to update table statistics
CREATE OR REPLACE FUNCTION update_table_statistics()
RETURNS void AS $$
BEGIN
    ANALYZE public.people;
    ANALYZE public.companies;
    ANALYZE public.applications;
    ANALYZE public.user_interactions;
    ANALYZE public.ai_decisions;
    ANALYZE public.form_definitions;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- QUERY PERFORMANCE MONITORING
-- ====================

-- Function to identify slow queries
CREATE OR REPLACE FUNCTION get_slow_queries()
RETURNS TABLE (
    query_text text,
    calls bigint,
    total_time double precision,
    mean_time double precision,
    min_time double precision,
    max_time double precision
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg_stat_statements.query,
        pg_stat_statements.calls,
        pg_stat_statements.total_exec_time,
        pg_stat_statements.mean_exec_time,
        pg_stat_statements.min_exec_time,
        pg_stat_statements.max_exec_time
    FROM pg_stat_statements
    WHERE pg_stat_statements.calls > 100
    ORDER BY pg_stat_statements.mean_exec_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ====================
-- CLEANUP AND MAINTENANCE
-- ====================

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.audit_logs 
    WHERE created_at < (CURRENT_DATE - INTERVAL '90 days');
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old user interactions
CREATE OR REPLACE FUNCTION cleanup_old_user_interactions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_interactions 
    WHERE created_at < (CURRENT_DATE - INTERVAL '30 days');
END;
$$ LANGUAGE plpgsql;

-- ====================
-- COMMENTS FOR DOCUMENTATION
-- ====================

COMMENT ON FUNCTION get_user_tenant_id IS 'Efficiently retrieves the tenant ID for a given user';
COMMENT ON FUNCTION get_active_applications_count IS 'Returns count of active applications for a tenant';
COMMENT ON FUNCTION refresh_materialized_views IS 'Refreshes all materialized views concurrently';
COMMENT ON FUNCTION update_table_statistics IS 'Updates table statistics for query planner optimization';
COMMENT ON FUNCTION cleanup_old_audit_logs IS 'Removes audit logs older than 90 days';
COMMENT ON FUNCTION cleanup_old_user_interactions IS 'Removes user interactions older than 30 days'; 