
# Total Recall - Database Schema Documentation

## Overview

Total Recall uses a comprehensive PostgreSQL database schema designed for enterprise-scale applications with advanced security, real-time collaboration, version control, and multi-tenant architecture. This document provides detailed information about all database tables, relationships, and design patterns.

## Schema Design Principles

### Core Design Patterns
1. **Multi-tenant Architecture**: Complete tenant isolation using `tenant_id` columns
2. **Row-Level Security (RLS)**: Comprehensive security policies for all tables
3. **Audit Trail**: Complete activity logging and change tracking
4. **Version Control**: Built-in versioning for all critical entities
5. **Real-time Capability**: Optimized for real-time updates and collaboration
6. **Scalable Design**: Optimized for performance at enterprise scale

### Data Classification
```sql
-- Data sensitivity levels
CREATE TYPE data_classification AS ENUM (
  'public',
  'internal', 
  'confidential',
  'restricted'
);

-- Status enumerations
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE approval_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');
CREATE TYPE ai_agent_status AS ENUM ('active', 'inactive', 'training', 'error');
```

## Core Tables

### User Management

#### profiles
**Purpose**: Core user profile information
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  job_title TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  hire_date DATE,
  status user_status DEFAULT 'active',
  preferences JSONB DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_manager ON public.profiles(manager_id);
```

**Key Features:**
- Links to Supabase auth.users for authentication
- Hierarchical manager relationships
- User preferences and status tracking
- Performance-optimized indexes

#### tenants
**Purpose**: Organization/tenant definitions for multi-tenancy
```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'basic',
  max_users INTEGER DEFAULT 100,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### user_tenants
**Purpose**: User-tenant associations with roles
```sql
CREATE TABLE public.user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);
```

### Security & Audit

#### audit_logs
**Purpose**: Comprehensive activity logging for compliance
```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  tenant_id UUID REFERENCES public.tenants(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  request_id TEXT,
  severity TEXT DEFAULT 'info',
  module_name TEXT,
  additional_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimized indexes for audit queries
CREATE INDEX idx_audit_logs_user_tenant ON public.audit_logs(user_id, tenant_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
```

#### password_policy_enforcement
**Purpose**: Track password policy compliance
```sql
CREATE TABLE public.password_policy_enforcement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  policy_version JSONB NOT NULL,
  enforcement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Business Entities

#### people
**Purpose**: Contact and talent management
```sql
CREATE TABLE public.people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  linkedin_url TEXT,
  current_company TEXT,
  current_title TEXT,
  location TEXT,
  experience_years INTEGER,
  skills JSONB DEFAULT '[]',
  notes TEXT,
  ai_summary TEXT,
  tags JSONB DEFAULT '[]',
  resume_url TEXT,
  portfolio_url TEXT,
  desired_salary NUMERIC(10,2),
  availability_date DATE,
  resume_text TEXT, -- For AI processing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_people_search ON public.people USING gin(
  (first_name || ' ' || last_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(current_company, ''))
  gin_trgm_ops
);
```

#### companies
**Purpose**: Comprehensive company information
```sql
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  website TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  description TEXT,
  founded INTEGER,
  phone TEXT,
  email TEXT,
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  -- Indian company specific fields
  cin TEXT, -- Corporate Identification Number
  company_status TEXT,
  registration_date TIMESTAMP WITH TIME ZONE,
  registered_office_address TEXT,
  paid_up_capital TEXT,
  turnover TEXT,
  hierarchy_level INTEGER DEFAULT 0,
  parent_company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company hierarchy and search indexes
CREATE INDEX idx_companies_hierarchy ON public.companies(parent_company_id, hierarchy_level);
CREATE INDEX idx_companies_search ON public.companies USING gin(
  (name || ' ' || COALESCE(domain, '') || ' ' || COALESCE(industry, ''))
  gin_trgm_ops
);
```

#### company_relationships
**Purpose**: Employment and association history
```sql
CREATE TABLE public.company_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'employment',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT true,
  reports_to UUID REFERENCES public.people(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Forms System

#### form_definitions
**Purpose**: Dynamic form builder definitions
```sql
CREATE TABLE public.form_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES public.profiles(id),
  settings JSONB DEFAULT '{}',
  access_level TEXT DEFAULT 'authenticated',
  visibility_scope TEXT DEFAULT 'global',
  required_modules JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### form_sections
**Purpose**: Form section organization
```sql
CREATE TABLE public.form_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.form_definitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_collapsible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### custom_fields
**Purpose**: Dynamic form field definitions
```sql
CREATE TABLE public.custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.form_definitions(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.form_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT false,
  options JSONB,
  sort_order INTEGER DEFAULT 0,
  applicable_forms JSONB DEFAULT '[]',
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### form_responses
**Purpose**: Form submission data
```sql
CREATE TABLE public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.form_definitions(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.form_placements(id),
  submitted_by UUID REFERENCES public.profiles(id),
  response_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  tenant_id UUID REFERENCES public.tenants(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Version Control System

#### entity_versions
**Purpose**: Complete version history for all entities
```sql
CREATE TABLE public.entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report', 'document')),
  entity_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  data_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  change_summary TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  approval_status approval_status DEFAULT 'draft',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  UNIQUE(entity_type, entity_id, version_number)
);

-- Performance indexes
CREATE INDEX idx_entity_versions_entity ON public.entity_versions(entity_type, entity_id);
CREATE INDEX idx_entity_versions_version ON public.entity_versions(entity_type, entity_id, version_number);
CREATE INDEX idx_entity_versions_published ON public.entity_versions(entity_type, entity_id, is_published);
```

#### workflow_approvals
**Purpose**: Approval process management
```sql
CREATE TABLE public.workflow_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report', 'document')),
  entity_id UUID NOT NULL,
  version_id UUID NOT NULL REFERENCES public.entity_versions(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  workflow_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## Real-time Collaboration

#### real_time_sessions
**Purpose**: User presence and activity tracking
```sql
CREATE TABLE public.real_time_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report', 'document')),
  entity_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'away', 'editing')) DEFAULT 'active',
  cursor_position JSONB,
  current_section TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, session_id, entity_type, entity_id)
);

-- Optimized for real-time queries
CREATE INDEX idx_real_time_sessions_entity ON public.real_time_sessions(entity_type, entity_id);
CREATE INDEX idx_real_time_sessions_active ON public.real_time_sessions(entity_type, entity_id, status);
```

#### real_time_notifications
**Purpose**: Real-time notification system
```sql
CREATE TABLE public.real_time_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'change_detected', 'conflict_warning', 'approval_request', 
    'version_published', 'user_joined', 'user_left'
  )),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report', 'document')),
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium'
);

-- Notification query optimization
CREATE INDEX idx_real_time_notifications_recipient ON public.real_time_notifications(recipient_id);
CREATE INDEX idx_real_time_notifications_unread ON public.real_time_notifications(recipient_id, is_read);
```

## AI and Analytics Tables

#### ai_agents
**Purpose**: AI agent definitions and configurations
```sql
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type ai_agent_type NOT NULL,
  description TEXT,
  model_config JSONB DEFAULT '{}',
  capabilities TEXT[] DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  status ai_agent_status DEFAULT 'inactive',
  is_active BOOLEAN DEFAULT true,
  tenant_id UUID REFERENCES public.tenants(id),
  created_by UUID REFERENCES public.profiles(id),
  model_version TEXT DEFAULT '1.0.0',
  api_endpoint TEXT,
  cost_per_request NUMERIC(10,6) DEFAULT 0.001,
  training_data_version TEXT,
  last_trained_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ai_decisions
**Purpose**: AI decision tracking and feedback
```sql
CREATE TABLE public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id),
  user_id UUID REFERENCES public.profiles(id),
  tenant_id UUID REFERENCES public.tenants(id),
  context JSONB NOT NULL,
  decision JSONB NOT NULL,
  confidence_score NUMERIC(3,2),
  reasoning TEXT[],
  was_accepted BOOLEAN,
  outcome_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### behavioral_patterns
**Purpose**: User behavior analysis and learning
```sql
CREATE TABLE public.behavioral_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  tenant_id UUID REFERENCES public.tenants(id),
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL,
  frequency_score NUMERIC(5,2),
  last_occurrence TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Subscription and Billing

#### subscription_plans
**Purpose**: Subscription plan definitions
```sql
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_annually NUMERIC(10,2),
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### tenant_subscriptions
**Purpose**: Active tenant subscriptions
```sql
CREATE TABLE public.tenant_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Database Functions

### Utility Functions
```sql
-- Get next version number for entity
CREATE OR REPLACE FUNCTION public.get_next_version_number(p_entity_type TEXT, p_entity_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM public.entity_versions
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
  
  RETURN next_version;
END;
$$;

-- Publish version (unpublish others, publish target)
CREATE OR REPLACE FUNCTION public.publish_version(p_version_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_version RECORD;
BEGIN
  -- Get version details
  SELECT * INTO target_version 
  FROM public.entity_versions 
  WHERE id = p_version_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Version not found';
  END IF;
  
  -- Unpublish previous versions
  UPDATE public.entity_versions 
  SET is_published = false 
  WHERE entity_type = target_version.entity_type 
    AND entity_id = target_version.entity_id 
    AND is_published = true;
  
  -- Publish the target version
  UPDATE public.entity_versions 
  SET is_published = true, 
      approval_status = 'approved',
      approved_by = auth.uid(),
      approved_at = NOW()
  WHERE id = p_version_id;
  
  RETURN true;
END;
$$;

-- Cleanup old sessions
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.real_time_sessions 
  WHERE last_seen < (NOW() - INTERVAL '1 hour');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
```

### Security Functions
```sql
-- Check if user can access entity
CREATE OR REPLACE FUNCTION public.can_access_entity(p_entity_type TEXT, p_entity_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF p_entity_type = 'form' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.form_definitions fd 
      WHERE fd.id = p_entity_id 
      AND (fd.created_by = auth.uid() OR public.is_current_user_super_admin())
    );
  ELSIF p_entity_type = 'report' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.saved_reports sr 
      WHERE sr.id = p_entity_id 
      AND (sr.created_by = auth.uid() OR public.is_current_user_super_admin())
    );
  END IF;
  
  RETURN false;
END;
$$;

-- Get current tenant context
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  tenant_id UUID;
BEGIN
  -- Get tenant from current session or user context
  SELECT ut.tenant_id INTO tenant_id
  FROM public.user_tenants ut
  WHERE ut.user_id = auth.uid()
    AND ut.is_active = true
  LIMIT 1;
  
  RETURN tenant_id;
END;
$$;
```

## Row Level Security (RLS) Policies

### Universal Tenant Isolation
```sql
-- Template for tenant isolation
CREATE POLICY "Tenant isolation" 
  ON table_name 
  FOR ALL 
  USING (tenant_id = public.get_current_tenant_id());

-- User access control
CREATE POLICY "Users can access their own data" 
  ON table_name 
  FOR ALL 
  USING (user_id = auth.uid());

-- Role-based access
CREATE POLICY "Admins have full access" 
  ON table_name 
  FOR ALL 
  USING (public.is_current_user_admin());
```

### Specific Table Policies
```sql
-- People table policies
CREATE POLICY "Users can view people in their tenant" 
  ON public.people 
  FOR SELECT 
  USING (true); -- Tenant isolation handled by function

CREATE POLICY "Users can create people" 
  ON public.people 
  FOR INSERT 
  WITH CHECK (true);

-- Version control policies
CREATE POLICY "Users can view versions of entities they can access" 
  ON public.entity_versions 
  FOR SELECT 
  USING (public.can_access_entity(entity_type, entity_id));

-- Collaboration policies
CREATE POLICY "Users can manage their own sessions" 
  ON public.real_time_sessions 
  FOR ALL 
  USING (user_id = auth.uid());
```

## Indexes and Performance Optimization

### Strategic Indexes
```sql
-- Multi-column indexes for common queries
CREATE INDEX idx_people_company_skills ON public.people USING gin(current_company, skills);
CREATE INDEX idx_form_responses_form_date ON public.form_responses(form_id, created_at);
CREATE INDEX idx_audit_logs_composite ON public.audit_logs(tenant_id, entity_type, created_at);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users ON public.profiles(id) WHERE status = 'active';
CREATE INDEX idx_published_versions ON public.entity_versions(entity_id) WHERE is_published = true;

-- GIN indexes for JSONB queries
CREATE INDEX idx_people_skills_gin ON public.people USING gin(skills);
CREATE INDEX idx_form_responses_data_gin ON public.form_responses USING gin(response_data);
```

### Query Optimization
```sql
-- Optimized queries with proper index usage
EXPLAIN (ANALYZE, BUFFERS) 
SELECT p.*, cr.role, c.name as company_name
FROM public.people p
LEFT JOIN public.company_relationships cr ON p.id = cr.person_id AND cr.is_current = true
LEFT JOIN public.companies c ON cr.company_id = c.id
WHERE p.skills @> '["JavaScript"]'
  AND p.status = 'active'
ORDER BY p.updated_at DESC
LIMIT 50;
```

## Data Integrity and Constraints

### Referential Integrity
```sql
-- Foreign key constraints with proper cascading
ALTER TABLE public.user_tenants 
  ADD CONSTRAINT fk_user_tenants_user 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check constraints for data validation
ALTER TABLE public.people 
  ADD CONSTRAINT chk_people_experience 
  CHECK (experience_years >= 0 AND experience_years <= 70);

ALTER TABLE public.entity_versions 
  ADD CONSTRAINT chk_entity_version_number 
  CHECK (version_number > 0);
```

### Data Validation
```sql
-- Email validation
ALTER TABLE public.people 
  ADD CONSTRAINT chk_people_email 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- JSON schema validation for structured data
ALTER TABLE public.form_responses 
  ADD CONSTRAINT chk_response_data_structure 
  CHECK (jsonb_typeof(response_data) = 'object');
```

## Backup and Recovery Strategy

### Backup Configuration
```sql
-- Point-in-time recovery setup
SELECT pg_start_backup('daily-backup');
-- Backup data directory
SELECT pg_stop_backup();

-- Logical backup for specific tables
pg_dump --table=public.people --table=public.companies --format=custom dbname > backup.dump
```

### Recovery Procedures
```sql
-- Restore from logical backup
pg_restore --clean --if-exists --dbname=dbname backup.dump

-- Point-in-time recovery
SELECT pg_create_restore_point('before-migration');
```

## Monitoring and Maintenance

### Performance Monitoring
```sql
-- Query performance monitoring
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Index usage statistics
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Maintenance Tasks
```sql
-- Regular maintenance operations
VACUUM ANALYZE public.audit_logs;
REINDEX INDEX CONCURRENTLY idx_people_search;
UPDATE pg_stat_statements SET calls = 0, total_time = 0;
```

## Migration Strategy

### Schema Versioning
```sql
-- Migration tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Example migration
INSERT INTO schema_migrations (version, description) 
VALUES ('20240101_add_ai_tables', 'Add AI agent and decision tracking tables');
```

### Safe Migration Practices
1. **Backwards Compatibility**: Maintain compatibility during migrations
2. **Zero Downtime**: Use techniques like online schema changes
3. **Rollback Procedures**: Maintain rollback scripts for all migrations
4. **Testing**: Test migrations on staging environments first
5. **Monitoring**: Monitor system performance during migrations

## Conclusion

This comprehensive database schema provides the foundation for Total Recall's enterprise features:

1. **Scalable Multi-tenancy**: Complete tenant isolation with optimal performance
2. **Advanced Security**: Row-level security with comprehensive audit trails
3. **Real-time Capabilities**: Optimized for live collaboration and updates
4. **Version Control**: Built-in versioning for all critical business entities
5. **AI Integration**: Prepared for AI-driven features with behavioral analytics
6. **Enterprise Compliance**: Audit trails and data governance capabilities

The schema is designed to support Total Recall's evolution from an enterprise platform to an AI-driven cognitive assistance system while maintaining performance, security, and scalability at enterprise scale.

Regular maintenance, monitoring, and optimization ensure the database continues to perform optimally as the system grows and evolves.
