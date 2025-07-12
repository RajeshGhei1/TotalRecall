
// Export all modules for easy importing
export { default as AtsCore } from './ats-core';
export { default as TalentDatabase } from './talent-database';
export { default as SmartTalentAnalytics } from './smart-talent-analytics';
export { default as Companies } from './companies';
export { default as People } from './people';

// Module metadata exports
import ATSCoreModule from './ats-core';
import TalentDatabaseModule from './talent-database';
import SmartTalentAnalyticsModule from './smart-talent-analytics';
import CompaniesModule from './companies';
import PeopleModule from './people';

export const modules = {
  'ats-core': ATSCoreModule,
  'talent-database': TalentDatabaseModule,
  'smart-talent-analytics': SmartTalentAnalyticsModule,
  'companies': CompaniesModule,
  'people': PeopleModule
};

export const moduleMetadata = {
  'ats-core': (ATSCoreModule as unknown).moduleMetadata,
  'talent-database': (TalentDatabaseModule as unknown).moduleMetadata,
  'smart-talent-analytics': (SmartTalentAnalyticsModule as unknown).moduleMetadata,
  'companies': (CompaniesModule as unknown).moduleMetadata,
  'people': (PeopleModule as unknown).moduleMetadata
};
