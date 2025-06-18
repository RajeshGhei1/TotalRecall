
// Export all modules for easy importing
export { default as AtsCore } from './ats-core';
export { default as TalentDatabase } from './talent-database';
export { default as SmartTalentAnalytics } from './smart-talent-analytics';

// Module metadata exports
import ATSCoreModule from './ats-core';
import TalentDatabaseModule from './talent-database';
import SmartTalentAnalyticsModule from './smart-talent-analytics';

export const modules = {
  'ats-core': ATSCoreModule,
  'talent-database': TalentDatabaseModule,
  'smart-talent-analytics': SmartTalentAnalyticsModule
};

export const moduleMetadata = {
  'ats-core': (ATSCoreModule as any).moduleMetadata,
  'talent-database': (TalentDatabaseModule as any).moduleMetadata,
  'smart-talent-analytics': (SmartTalentAnalyticsModule as any).moduleMetadata
};
