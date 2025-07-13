-- Add Form & Template Foundation Module
INSERT INTO system_modules (
  name,
  category,
  type,
  description,
  dependencies,
  ai_capabilities,
  required_permissions,
  subscription_tiers,
  maturity_status,
  is_active,
  ai_level,
  created_at,
  updated_at
) VALUES (
  'Form & Template Foundation',
  'content_infrastructure',
  'foundation',
  'Core form building, template management, and dynamic content creation infrastructure for all business modules',
  ARRAY[]::text[],
  ARRAY[
    'Smart form field suggestions',
    'Automated form layout optimization',
    'Intelligent validation rules',
    'Template recommendations',
    'Form performance optimization'
  ]::text[],
  '["read", "write", "admin"]'::jsonb,
  '["enterprise", "professional"]'::jsonb,
  'planning',
  true,
  'medium',
  NOW(),
  NOW()
);

-- Update dependencies for modules that need forms
UPDATE system_modules 
SET dependencies = array_append(dependencies, 'Form & Template Foundation')
WHERE name IN (
  'Sales & CRM Suite',
  'Marketing Automation Suite',
  'Project & Resource Management',
  'Enterprise Workflow Engine'
);

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