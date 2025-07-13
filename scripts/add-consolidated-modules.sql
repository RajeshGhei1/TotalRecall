-- Add all 16 consolidated modules to the database
-- This script handles the complete consolidation from 29 modules to 16 modules

-- ==========================================
-- TIER 1: SUPER ADMIN MODULES (3 modules)
-- ==========================================

INSERT INTO system_modules (
  name, category, type, description, dependencies, ai_capabilities, 
  required_permissions, subscription_tiers, maturity_status, is_active, ai_level, created_at, updated_at
) VALUES 
(
  'System Administration Suite',
  'administration',
  'super_admin',
  'Comprehensive system administration including user management, security policies, and global configuration',
  ARRAY[]::text[],
  ARRAY['Behavioral authentication', 'Intelligent role suggestions', 'Anomaly detection', 'Adaptive permissions']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Module Registry & Deployment',
  'platform',
  'super_admin',
  'Module discovery, registration, deployment, and lifecycle management across the platform',
  ARRAY[]::text[],
  ARRAY['Intelligent module recommendations', 'Automated dependency resolution', 'Predictive performance analysis']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
),
(
  'Enterprise Monitoring & Audit',
  'monitoring',
  'super_admin',
  'System-wide monitoring, audit trails, compliance reporting, and security analytics',
  ARRAY[]::text[],
  ARRAY['Anomaly detection', 'Predictive failure analysis', 'Compliance insights', 'Security analytics']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
);

-- ==========================================
-- TIER 2: FOUNDATION MODULES (5 modules)
-- ==========================================

INSERT INTO system_modules (
  name, category, type, description, dependencies, ai_capabilities, 
  required_permissions, subscription_tiers, maturity_status, is_active, ai_level, created_at, updated_at
) VALUES 
(
  'AI Core Foundation',
  'ai_infrastructure',
  'foundation',
  'Core AI infrastructure providing agent orchestration, cognitive services, and machine learning capabilities',
  ARRAY[]::text[],
  ARRAY['Agent orchestration', 'Cognitive processing', 'Knowledge synthesis', 'Decision support', 'Learning algorithms']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Communication Foundation',
  'communication',
  'foundation',
  'Core communication infrastructure for email, messaging, notifications, and multi-channel communication',
  ARRAY[]::text[],
  ARRAY['Smart template suggestions', 'Communication optimization', 'Sentiment analysis', 'Automated response suggestions']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
),
(
  'Integration Foundation',
  'integration_infrastructure',
  'foundation',
  'Core integration infrastructure providing API management, data synchronization, and third-party connectivity',
  ARRAY[]::text[],
  ARRAY['Intelligent data mapping', 'Automated integration setup', 'Error prediction and resolution', 'Performance optimization']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
),
(
  'Analytics Foundation',
  'analytics_infrastructure',
  'foundation',
  'Core analytics infrastructure providing dashboards, reporting, and data visualization capabilities',
  ARRAY[]::text[],
  ARRAY['Automated insights generation', 'Intelligent dashboard layouts', 'Predictive analytics', 'Anomaly detection in data']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Form & Template Foundation',
  'content_infrastructure',
  'foundation',
  'Core form building, template management, and dynamic content creation infrastructure for all business modules',
  ARRAY[]::text[],
  ARRAY['Smart form field suggestions', 'Automated form layout optimization', 'Intelligent validation rules', 'Template recommendations', 'Form performance optimization']::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
);

-- ==========================================
-- TIER 3: BUSINESS MODULES (8 modules)
-- ==========================================

INSERT INTO system_modules (
  name, category, type, description, dependencies, ai_capabilities, 
  required_permissions, subscription_tiers, maturity_status, is_active, ai_level, created_at, updated_at
) VALUES 
(
  'Advanced Business Analytics',
  'analytics',
  'business',
  'Advanced business analytics with AI-powered insights, predictive modeling, and business intelligence',
  ARRAY['AI Core Foundation', 'Analytics Foundation']::text[],
  ARRAY['Predictive forecasting', 'Business insights generation', 'Trend analysis', 'Risk assessment', 'Opportunity identification']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Sales & CRM Suite',
  'sales',
  'business',
  'Comprehensive sales and customer relationship management with pipeline tracking and analytics',
  ARRAY['AI Core Foundation', 'Communication Foundation', 'Analytics Foundation', 'Form & Template Foundation']::text[],
  ARRAY['Lead scoring algorithms', 'Sales forecasting', 'Customer behavior analysis', 'Opportunity prioritization', 'Churn prediction']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Marketing Automation Suite',
  'marketing',
  'business',
  'Comprehensive marketing automation with campaigns, social media, and market intelligence',
  ARRAY['Communication Foundation', 'Integration Foundation', 'AI Core Foundation', 'Form & Template Foundation']::text[],
  ARRAY['Campaign optimization', 'Content personalization', 'Market trend analysis', 'Social media insights', 'Automated segmentation']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Enterprise Integration Suite',
  'integrations',
  'business',
  'Specialized business integrations including LinkedIn, CRM systems, and communication platforms',
  ARRAY['Integration Foundation', 'Communication Foundation']::text[],
  ARRAY['Intelligent data matching', 'Automated sync optimization', 'Integration health monitoring', 'Smart connector recommendations']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
),
(
  'Operations Management Suite',
  'operations',
  'business',
  'Comprehensive operations management including inventory, supply chain, and operational analytics',
  ARRAY['Analytics Foundation', 'AI Core Foundation']::text[],
  ARRAY['Demand forecasting', 'Supply chain optimization', 'Inventory optimization', 'Supplier risk assessment', 'Operational insights']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Financial Operations Suite',
  'finance',
  'business',
  'Comprehensive financial management including billing, invoicing, and purchase order processing',
  ARRAY['Analytics Foundation', 'Integration Foundation']::text[],
  ARRAY['Financial forecasting', 'Expense categorization', 'Fraud detection', 'Budget optimization', 'Payment prediction']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
),
(
  'Project & Resource Management',
  'project_management',
  'business',
  'Comprehensive project management with resource planning, workflow design, and collaboration tools',
  ARRAY['AI Core Foundation', 'Communication Foundation', 'Analytics Foundation', 'Form & Template Foundation']::text[],
  ARRAY['Project timeline optimization', 'Resource allocation optimization', 'Risk prediction', 'Workload balancing', 'Performance insights']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
),
(
  'Enterprise Workflow Engine',
  'automation',
  'business',
  'Advanced workflow automation and business process management with AI-powered optimization',
  ARRAY['AI Core Foundation', 'Integration Foundation', 'Form & Template Foundation']::text[],
  ARRAY['Process optimization', 'Bottleneck detection', 'Intelligent routing', 'Workflow recommendations', 'Performance prediction']::text[],
  '["read", "write"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'high',
  NOW(),
  NOW()
);

-- Show the results
SELECT 
  name,
  type,
  category,
  maturity_status,
  is_active,
  ARRAY_LENGTH(dependencies, 1) as dependency_count
FROM system_modules 
ORDER BY 
  CASE type
    WHEN 'super_admin' THEN 1
    WHEN 'foundation' THEN 2
    WHEN 'business' THEN 3
  END,
  name; 