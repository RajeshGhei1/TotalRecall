
// Module name mapping between technical names and display names
export const MODULE_NAME_MAPPING = {
  // Technical name -> Display name
  'business_contacts_data_access': 'Business Contacts',
  'company_database': 'Company Database',
  'ats_core': 'ATS Core',
  'user_management': 'User Management',
  'talent_database': 'Talent Database',
  'core_dashboard': 'Core Dashboard',
  'smart_talent_analytics': 'Smart Talent Analytics',
  'document_management': 'Document Management',
  'ai_orchestration': 'AI Orchestration',
  'custom_field_management': 'Custom Field Management'
} as const;

// Reverse mapping for display name -> technical name
export const DISPLAY_TO_TECHNICAL_MAPPING = Object.fromEntries(
  Object.entries(MODULE_NAME_MAPPING).map(([tech, display]) => [display, tech])
) as Record<string, string>;

/**
 * Get display name from technical module name
 */
export const getDisplayName = (technicalName: string): string => {
  return MODULE_NAME_MAPPING[technicalName as keyof typeof MODULE_NAME_MAPPING] || technicalName;
};

/**
 * Get technical name from display name
 */
export const getTechnicalName = (displayName: string): string => {
  return DISPLAY_TO_TECHNICAL_MAPPING[displayName] || displayName;
};

/**
 * Check if a module name is a technical name
 */
export const isTechnicalName = (name: string): boolean => {
  return name in MODULE_NAME_MAPPING;
};

/**
 * Check if a module name is a display name
 */
export const isDisplayName = (name: string): boolean => {
  return name in DISPLAY_TO_TECHNICAL_MAPPING;
};
