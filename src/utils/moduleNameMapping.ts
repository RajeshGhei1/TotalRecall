
// Module name mapping utilities for display names and normalization

/**
 * Mapping of technical module names to display names
 */
const MODULE_DISPLAY_NAMES: Record<string, string> = {
  // Core modules
  'user_management': 'User Management',
  'core_dashboard': 'Core Dashboard',
  'ai_orchestration': 'AI Orchestration',
  'document_management': 'Document Management',
  'custom_field_management': 'Custom Field Management',
  
  // Business modules
  'company_database': 'Company Database',
  'business_contacts_data_access': 'Business Contacts & Data Access',
  'talent_database': 'Talent Database',
  'smart_talent_analytics': 'Smart Talent Analytics',
  
  // ATS modules
  'ats_core': 'ATS Core',
  'candidate_management': 'Candidate Management',
  'job_posting_management': 'Job Posting Management',
  'interview_scheduling': 'Interview Scheduling',
  
  // Communication modules
  'email_management': 'Email Management',
  'notification_system': 'Notification System',
  'collaboration_tools': 'Collaboration Tools',
  
  // Analytics modules
  'reporting_analytics': 'Reporting & Analytics',
  'business_intelligence': 'Business Intelligence',
  'performance_metrics': 'Performance Metrics',
  
  // Integration modules
  'api_integrations': 'API Integrations',
  'third_party_connectors': 'Third Party Connectors',
  'data_sync_services': 'Data Sync Services'
};

/**
 * Get display name for a module
 */
export const getDisplayName = (moduleName: string): string => {
  const normalizedName = normalizeModuleName(moduleName);
  return MODULE_DISPLAY_NAMES[normalizedName] || formatModuleName(moduleName);
};

/**
 * Normalize module name to technical format
 */
export const normalizeModuleName = (moduleName: string): string => {
  if (!moduleName) return '';
  
  return moduleName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Format module name for display (fallback)
 */
const formatModuleName = (moduleName: string): string => {
  if (!moduleName) return 'Unknown Module';
  
  return moduleName
    .split(/[_\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get technical name from display name
 */
export const getTechnicalName = (displayName: string): string => {
  const reverseMap = Object.entries(MODULE_DISPLAY_NAMES)
    .find(([_, display]) => display === displayName);
  
  return reverseMap ? reverseMap[0] : normalizeModuleName(displayName);
};
