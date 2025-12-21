-- Populate system_modules table with all TotalRecall modules
-- Run this in Supabase Dashboard → SQL Editor

-- First, clear existing modules to avoid duplicates
DELETE FROM public.system_modules;

-- Insert all modules
INSERT INTO public.system_modules (name, description, category, type, is_active, maturity_status, ai_level, ai_capabilities, dependencies)
VALUES
-- ==========================================
-- SUPER ADMIN MODULES (3 Core Platform Modules)
-- ==========================================
('System Administration Suite', 'Comprehensive system administration including user management, security policies, and global configuration', 'administration', 'super_admin', true, 'production', 'high', ARRAY['Behavioral authentication', 'Intelligent role suggestions', 'Anomaly detection'], ARRAY[]::text[]),

('Module Registry & Deployment', 'Central registry for all system modules with deployment, versioning, and lifecycle management', 'administration', 'super_admin', true, 'production', 'medium', ARRAY['Auto-deployment recommendations', 'Dependency analysis'], ARRAY[]::text[]),

('Enterprise Monitoring & Audit', 'Real-time system monitoring, audit trails, compliance tracking, and security analytics', 'monitoring', 'super_admin', true, 'production', 'high', ARRAY['Predictive analytics', 'Anomaly detection', 'Smart alerting'], ARRAY[]::text[]),

-- ==========================================
-- FOUNDATION MODULES
-- ==========================================
('Core Dashboard', 'Central dashboard with widgets, analytics, and customizable views', 'dashboard', 'foundation', true, 'production', 'medium', ARRAY['Smart widget recommendations', 'Predictive insights'], ARRAY[]::text[]),

('Dashboard Widget', 'Customizable widget system for building dynamic dashboards', 'dashboard', 'foundation', true, 'production', 'low', ARRAY['Widget suggestions'], ARRAY['Core Dashboard']),

('Companies', 'Company management with profiles, relationships, and organization tracking', 'crm', 'foundation', true, 'production', 'high', ARRAY['Company enrichment', 'Relationship mapping', 'Industry classification'], ARRAY[]::text[]),

('People', 'Contact and people management with profiles, skills, and relationship tracking', 'crm', 'foundation', true, 'production', 'high', ARRAY['Profile enrichment', 'Skill matching', 'LinkedIn integration'], ARRAY['Companies']),

('Cognitive Assistance', 'AI-powered assistance for decision making and recommendations', 'ai', 'foundation', true, 'beta', 'high', ARRAY['Natural language processing', 'Context-aware suggestions', 'Learning algorithms'], ARRAY[]::text[]),

('Knowledge Synthesis', 'Knowledge base management with AI-powered search and synthesis', 'ai', 'foundation', true, 'beta', 'high', ARRAY['Semantic search', 'Document analysis', 'Knowledge graphs'], ARRAY['Cognitive Assistance']),

('Communication Foundation', 'Core communication infrastructure for email, notifications, and messaging', 'communication', 'foundation', true, 'production', 'medium', ARRAY['Smart scheduling', 'Template suggestions'], ARRAY[]::text[]),

('Analytics Foundation', 'Core analytics infrastructure with reporting and visualization', 'analytics', 'foundation', true, 'production', 'high', ARRAY['Predictive analytics', 'Trend detection', 'Anomaly identification'], ARRAY[]::text[]),

('Forms & Templates', 'Dynamic form builder with templates and validation', 'forms', 'foundation', true, 'production', 'medium', ARRAY['Smart field suggestions', 'Auto-validation'], ARRAY[]::text[]),

('Integration Hub', 'Central hub for third-party integrations and API management', 'integration', 'foundation', true, 'beta', 'medium', ARRAY['API recommendations', 'Auto-mapping'], ARRAY[]::text[]),

-- ==========================================
-- BUSINESS MODULES
-- ==========================================
('Workflow Automation', 'Business process automation with visual workflow builder', 'automation', 'business', true, 'beta', 'high', ARRAY['Process optimization', 'Bottleneck detection', 'Smart routing'], ARRAY['Core Dashboard']),

('ATS Core', 'Applicant Tracking System for recruitment and hiring workflows', 'recruitment', 'business', true, 'production', 'high', ARRAY['Resume parsing', 'Candidate matching', 'Interview scheduling'], ARRAY['People', 'Companies']),

('Talent Analytics', 'Advanced talent analytics and workforce insights', 'analytics', 'business', true, 'beta', 'high', ARRAY['Skill gap analysis', 'Retention prediction', 'Performance forecasting'], ARRAY['People', 'Analytics Foundation']),

('Email Management', 'Email campaign management with templates and tracking', 'communication', 'business', true, 'production', 'high', ARRAY['Smart compose', 'Send time optimization', 'Response prediction'], ARRAY['Communication Foundation']),

('Sales Pipeline', 'Sales pipeline management with deal tracking and forecasting', 'sales', 'business', true, 'alpha', 'high', ARRAY['Deal scoring', 'Win probability', 'Next best action'], ARRAY['Companies', 'People']),

('Marketing Campaigns', 'Marketing campaign management with automation and analytics', 'marketing', 'business', true, 'alpha', 'high', ARRAY['Audience segmentation', 'Content optimization', 'ROI prediction'], ARRAY['Communication Foundation', 'Analytics Foundation']),

('Project Management', 'Project and task management with collaboration features', 'projects', 'business', true, 'alpha', 'medium', ARRAY['Resource optimization', 'Timeline prediction'], ARRAY['Workflow Automation']),

('Document Management', 'Document storage, versioning, and collaboration', 'documents', 'business', true, 'beta', 'medium', ARRAY['Auto-tagging', 'Content extraction', 'Smart search'], ARRAY[]::text[]),

('Reporting Builder', 'Custom report builder with scheduling and distribution', 'analytics', 'business', true, 'production', 'high', ARRAY['Natural language queries', 'Auto-visualization'], ARRAY['Analytics Foundation']),

('Security Dashboard', 'Security monitoring and threat detection dashboard', 'security', 'business', true, 'production', 'high', ARRAY['Threat detection', 'Risk scoring', 'Compliance monitoring'], ARRAY['Enterprise Monitoring & Audit']),

('Subscription Management', 'Subscription plans and billing management', 'billing', 'business', true, 'production', 'low', ARRAY['Usage prediction', 'Churn risk'], ARRAY[]::text[]),

('Tenant Management', 'Multi-tenant administration and configuration', 'administration', 'business', true, 'production', 'medium', ARRAY['Usage analytics', 'Resource optimization'], ARRAY['System Administration Suite']),

('User Activity Tracking', 'User behavior analytics and activity monitoring', 'analytics', 'business', true, 'production', 'high', ARRAY['Behavior patterns', 'Engagement scoring'], ARRAY['Analytics Foundation']),

('Audit Logs', 'Comprehensive audit logging and compliance tracking', 'compliance', 'business', true, 'production', 'medium', ARRAY['Anomaly detection', 'Pattern recognition'], ARRAY['Enterprise Monitoring & Audit']),

('API Gateway', 'API management and developer portal', 'integration', 'business', true, 'beta', 'medium', ARRAY['Rate limit optimization', 'Usage analytics'], ARRAY['Integration Hub']),

('Collaboration Tools', 'Team collaboration with chat, notes, and shared workspaces', 'collaboration', 'business', true, 'alpha', 'medium', ARRAY['Smart mentions', 'Content suggestions'], ARRAY['Communication Foundation']),

('Custom Fields', 'Dynamic custom field management for all entities', 'customization', 'business', true, 'production', 'low', ARRAY['Field recommendations'], ARRAY[]::text[]),

('Data Import/Export', 'Bulk data import and export with mapping and validation', 'data', 'business', true, 'production', 'medium', ARRAY['Smart mapping', 'Data quality checks'], ARRAY[]::text[]),

('Notifications Center', 'Centralized notification management across all channels', 'communication', 'business', true, 'production', 'medium', ARRAY['Priority scoring', 'Digest optimization'], ARRAY['Communication Foundation']),

('Search & Discovery', 'Global search across all modules with filters and facets', 'search', 'business', true, 'production', 'high', ARRAY['Semantic search', 'Personalized ranking', 'Query suggestions'], ARRAY['Knowledge Synthesis']);

-- Verify the insert
SELECT type, COUNT(*) as count FROM public.system_modules GROUP BY type ORDER BY type;

