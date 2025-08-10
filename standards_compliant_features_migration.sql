-- TOTAL Platform - Standards-Compliant Features Migration
-- Enhances module_features table to align with Feature Definition Standards

-- Add standards-compliant columns to module_features table
ALTER TABLE module_features 
ADD COLUMN IF NOT EXISTS input_schema JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS output_schema JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ui_component_path TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT 'v1.0.0',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS feature_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dependencies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}';

-- Create feature_interfaces table for dynamic loading
CREATE TABLE IF NOT EXISTS feature_interfaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id TEXT NOT NULL,
    interface_type TEXT NOT NULL CHECK (interface_type IN ('component', 'service', 'hook', 'api')),
    interface_path TEXT NOT NULL,
    interface_props JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(feature_id, interface_type)
);

-- Create feature_events table for event-driven architecture
CREATE TABLE IF NOT EXISTS feature_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_schema JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(feature_id, event_name)
);

-- Update existing features with standards-compliant data
UPDATE module_features 
SET 
    ui_component_path = CASE feature_id
        WHEN 'custom-fields' THEN '@/components/features/atomic/CustomFieldsFeature'
        WHEN 'form-builder' THEN '@/components/features/atomic/FormBuilderFeature'
        WHEN 'dashboard-builder' THEN '@/components/features/atomic/DashboardBuilderFeature'
        WHEN 'report-builder' THEN '@/components/features/atomic/ReportBuilderFeature'
        WHEN 'bulk-upload-download' THEN '@/components/features/atomic/BulkOperationsFeature'
        WHEN 'linkedin-enrichment' THEN '@/components/features/atomic/LinkedInEnrichmentFeature'
        WHEN 'ai-email-response-generator' THEN '@/components/features/atomic/AIEmailResponseFeature'
        WHEN 'dropdown-options-management' THEN '@/components/features/atomic/DropdownOptionsFeature'
        ELSE CONCAT('@/components/features/atomic/', REPLACE(feature_id, '-', '_'), 'Feature')
    END,
    tags = CASE feature_category
        WHEN 'Data Management' THEN ARRAY['data', 'management', 'crud']
        WHEN 'Reporting' THEN ARRAY['reporting', 'analytics', 'visualization']
        WHEN 'Communication' THEN ARRAY['communication', 'integration', 'external']
        WHEN 'AI' THEN ARRAY['ai', 'automation', 'intelligence']
        WHEN 'Workflow' THEN ARRAY['workflow', 'process', 'automation']
        ELSE ARRAY['general']
    END,
    input_schema = CASE feature_id
        WHEN 'custom-fields' THEN '{"type":"object","properties":{"entityType":{"type":"string"},"entityId":{"type":"string"},"fieldScope":{"enum":["global","tenant"]},"context":{"type":"object"}},"required":["entityType"]}'::jsonb
        WHEN 'form-builder' THEN '{"type":"object","properties":{"formId":{"type":"string"},"mode":{"enum":["create","edit","view"]},"context":{"type":"object"}},"required":[]}'::jsonb
        WHEN 'dashboard-builder' THEN '{"type":"object","properties":{"dashboardId":{"type":"string"},"mode":{"enum":["create","edit","view"]},"context":{"type":"object"}},"required":[]}'::jsonb
        ELSE '{"type":"object","properties":{"context":{"type":"object"}},"required":[]}'::jsonb
    END,
    output_schema = CASE feature_id
        WHEN 'custom-fields' THEN '{"type":"object","properties":{"customFields":{"type":"array"},"validationErrors":{"type":"array"},"success":{"type":"boolean"}}}'::jsonb
        WHEN 'form-builder' THEN '{"type":"object","properties":{"formDefinition":{"type":"object"},"validationResult":{"type":"object"},"success":{"type":"boolean"}}}'::jsonb
        WHEN 'dashboard-builder' THEN '{"type":"object","properties":{"dashboardConfig":{"type":"object"},"widgets":{"type":"array"},"success":{"type":"boolean"}}}'::jsonb
        ELSE '{"type":"object","properties":{"result":{"type":"object"},"success":{"type":"boolean"}}}'::jsonb
    END,
    feature_config = '{"isolated":true,"stateless":true,"pluggable":true}'::jsonb
WHERE ui_component_path IS NULL; 