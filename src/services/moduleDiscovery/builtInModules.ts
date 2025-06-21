
import { BuiltInModuleConfig } from './types';

export const BUILT_IN_MODULES: BuiltInModuleConfig[] = [
  {
    id: 'ats-core',
    name: 'ATS Core',
    path: '../modules/ats-core/index.tsx',
    category: 'recruitment',
    version: '1.0.0',
    description: 'Core Applicant Tracking System with job and candidate management',
    author: 'System',
    dependencies: [],
    loadOrder: 10
  },
  {
    id: 'talent-database',
    name: 'Talent Database',
    path: '../modules/talent-database/index.tsx',
    category: 'recruitment',
    version: '1.0.0',
    description: 'Comprehensive talent database with search, favorites, and analytics',
    author: 'System',
    dependencies: ['ats-core'],
    loadOrder: 20
  },
  {
    id: 'smart-talent-analytics',
    name: 'Smart Talent Analytics',
    path: '../modules/smart-talent-analytics/index.tsx',
    category: 'analytics',
    version: '1.0.0',
    description: 'AI-powered talent analytics with predictive insights, pattern analysis, and talent matching',
    author: 'System',
    dependencies: ['ats-core', 'talent-database'],
    loadOrder: 30
  },
  {
    id: 'companies',
    name: 'Companies',
    path: '../modules/companies/index.tsx',
    category: 'business',
    version: '1.0.0',
    description: 'Comprehensive company management and relationship tracking with advanced features including hierarchical relationships, bulk operations, and analytics',
    author: 'System',
    dependencies: [],
    loadOrder: 40
  },
  {
    id: 'people',
    name: 'People',
    path: '../modules/people/index.tsx',
    category: 'business',
    version: '1.0.0',
    description: 'Advanced people and contact management system with talent database, business contacts, and relationship tracking capabilities',
    author: 'System',
    dependencies: [],
    loadOrder: 50
  }
];
