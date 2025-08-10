-- Allocate Custom Fields Feature to Companies Module
-- This creates the relationship between the feature and module

INSERT INTO module_features (
    module_name,
    feature_id,
    feature_name,
    feature_description,
    feature_category,
    is_enabled_by_default,
    is_premium_feature,
    sort_order,
    -- Standards-compliant columns
    ui_component_path,
    input_schema,
    output_schema,
    tags,
    version,
    is_active,
    feature_config,
    dependencies,
    requirements
) VALUES (
    'companies',
    'custom-fields',
    'Custom Fields Management',
    'Create and manage custom fields for company records',
    'Data Management',
    true,
    false,
    1,
    -- Standards-compliant data
    '@/components/features/atomic/CustomFieldsFeature',
    '{"type":"object","properties":{"entityType":{"type":"string","default":"company"},"entityId":{"type":"string"},"fieldScope":{"enum":["global","tenant"]},"context":{"type":"object"}},"required":["entityType"]}'::jsonb,
    '{"type":"object","properties":{"customFields":{"type":"array","items":{"type":"object"}},"validationErrors":{"type":"array"},"success":{"type":"boolean"},"fieldCount":{"type":"number"}},"required":["success"]}'::jsonb,
    ARRAY['data', 'management', 'crud', 'companies', 'fields'],
    'v1.0.0',
    true,
    '{"isolated":true,"stateless":true,"pluggable":true,"renderMode":"embedded","eventsEnabled":true,"analyticsEnabled":true,"auditingEnabled":true}'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[]
)
ON CONFLICT (module_name, feature_id) 
DO UPDATE SET
    feature_name = EXCLUDED.feature_name,
    feature_description = EXCLUDED.feature_description,
    ui_component_path = EXCLUDED.ui_component_path,
    input_schema = EXCLUDED.input_schema,
    output_schema = EXCLUDED.output_schema,
    tags = EXCLUDED.tags,
    feature_config = EXCLUDED.feature_config,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Also allocate Form Builder and Dashboard Builder to Companies
INSERT INTO module_features (
    module_name,
    feature_id,
    feature_name,
    feature_description,
    feature_category,
    is_enabled_by_default,
    is_premium_feature,
    sort_order,
    ui_component_path,
    input_schema,
    output_schema,
    tags,
    version,
    is_active,
    feature_config
) VALUES 
(
    'companies',
    'form-builder',
    'Form Builder',
    'Build custom forms for company data collection',
    'Workflow',
    true,
    false,
    2,
    '@/components/features/atomic/FormBuilderFeature',
    '{"type":"object","properties":{"formId":{"type":"string"},"mode":{"enum":["create","edit","view"]},"context":{"type":"object"}}}'::jsonb,
    '{"type":"object","properties":{"formDefinition":{"type":"object"},"validationResult":{"type":"object"},"success":{"type":"boolean"}}}'::jsonb,
    ARRAY['forms', 'builder', 'workflow', 'companies'],
    'v1.0.0',
    true,
    '{"isolated":true,"stateless":true,"pluggable":true,"renderMode":"embedded"}'::jsonb
),
(
    'companies',
    'dashboard-builder',
    'Dashboard Builder',
    'Create custom dashboards for company analytics',
    'Reporting',
    true,
    false,
    3,
    '@/components/features/atomic/DashboardBuilderFeature',
    '{"type":"object","properties":{"dashboardId":{"type":"string"},"mode":{"enum":["create","edit","view"]},"context":{"type":"object"}}}'::jsonb,
    '{"type":"object","properties":{"dashboardConfig":{"type":"object"},"widgets":{"type":"array"},"success":{"type":"boolean"}}}'::jsonb,
    ARRAY['dashboard', 'analytics', 'reporting', 'companies'],
    'v1.0.0',
    true,
    '{"isolated":true,"stateless":true,"pluggable":true,"renderMode":"embedded"}'::jsonb
)
ON CONFLICT (module_name, feature_id) DO NOTHING;

-- Verify the allocation
SELECT 
    module_name,
    feature_id,
    feature_name,
    feature_category,
    is_enabled_by_default,
    ui_component_path,
    tags,
    version
FROM module_features 
WHERE module_name = 'companies' 
ORDER BY sort_order; 