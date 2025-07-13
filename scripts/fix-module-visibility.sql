-- Fix module visibility issues
-- Ensure consolidated modules are active and have correct type values

-- First, let's see what we have
SELECT name, type, is_active, maturity_status 
FROM system_modules 
WHERE name LIKE '%Suite%' OR name LIKE '%Foundation%' OR name LIKE '%Analytics%' OR name LIKE '%Registry%'
ORDER BY type, name;

-- Update to ensure all consolidated modules are active
UPDATE system_modules 
SET is_active = true
WHERE name IN (
  'System Administration Suite',
  'Module Registry & Deployment',
  'Enterprise Monitoring & Audit',
  'AI Core Foundation',
  'Communication Foundation',
  'Integration Foundation',
  'Analytics Foundation',
  'Advanced Business Analytics',
  'Sales & CRM Suite',
  'Marketing Automation Suite',
  'Enterprise Integration Suite',
  'Operations Management Suite',
  'Financial Operations Suite',
  'Project & Resource Management',
  'Enterprise Workflow Engine'
);

-- Verify the fix
SELECT name, type, is_active, maturity_status 
FROM system_modules 
WHERE name IN (
  'System Administration Suite',
  'Module Registry & Deployment',
  'Enterprise Monitoring & Audit',
  'AI Core Foundation',
  'Communication Foundation',
  'Integration Foundation',
  'Analytics Foundation',
  'Advanced Business Analytics',
  'Sales & CRM Suite',
  'Marketing Automation Suite',
  'Enterprise Integration Suite',
  'Operations Management Suite',
  'Financial Operations Suite',
  'Project & Resource Management',
  'Enterprise Workflow Engine'
)
ORDER BY type, name; 