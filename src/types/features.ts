/**
 * FEATURE DEVELOPMENT SYSTEM
 * Comprehensive types for independent feature development and testing
 */

export interface FeatureImplementation {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  
  // Implementation details
  implementation: {
    component?: React.ComponentType<any>;
    hook?: () => any;
    service?: any;
    styles?: string;
    dependencies?: string[];
  };
  
  // Development metadata
  development: {
    status: 'draft' | 'development' | 'testing' | 'stable' | 'deprecated';
    author: string;
    createdAt: string;
    updatedAt: string;
    repository?: string;
    documentation?: string;
  };
  
  // Testing configuration
  testing: {
    testCoverage?: number;
    lastTestRun?: string;
    testStatus: 'passing' | 'failing' | 'not-tested';
    testSuites: FeatureTestSuite[];
    mockData?: Record<string, unknown>;
  };
  
  // API definition
  api: {
    props?: Record<string, FeatureProperty>;
    events?: Record<string, FeatureEvent>;
    methods?: Record<string, FeatureMethod>;
    slots?: string[];
  };
  
  // Usage and compatibility
  compatibility: {
    moduleTypes: string[];
    minVersion?: string;
    maxVersion?: string;
    conflicts?: string[];
    requirements?: string[];
  };
  
  // Analytics
  usage: {
    adopters: number;
    modules: string[];
    lastUsed?: string;
    rating?: number;
    feedback?: FeatureFeedback[];
  };
}

export interface FeatureProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
  required: boolean;
  default?: any;
  description: string;
  validation?: FeatureValidation;
}

export interface FeatureEvent {
  description: string;
  payload?: Record<string, any>;
  example?: string;
}

export interface FeatureMethod {
  description: string;
  parameters?: Record<string, FeatureProperty>;
  returns?: FeatureProperty;
  example?: string;
}

export interface FeatureTestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'visual' | 'performance';
  tests: FeatureTest[];
}

export interface FeatureTest {
  id: string;
  name: string;
  description: string;
  testCode: string;
  expectedResult: any;
  status: 'passing' | 'failing' | 'skipped';
  duration?: number;
  lastRun?: string;
}

export interface FeatureValidation {
  pattern?: string;
  min?: number;
  max?: number;
  custom?: string;
}

export interface FeatureFeedback {
  userId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface FeatureDevelopmentEnvironment {
  feature: FeatureImplementation;
  sandbox: {
    props: Record<string, any>;
    context: Record<string, any>;
    mockData: Record<string, any>;
  };
  editor: {
    activeFile: string;
    files: Record<string, string>;
    language: string;
  };
  preview: {
    mode: 'isolated' | 'module-context' | 'comparison';
    moduleId?: string;
    testScenarios: FeatureTestScenario[];
  };
}

export interface FeatureTestScenario {
  id: string;
  name: string;
  description: string;
  props: Record<string, any>;
  context: Record<string, any>;
  expectedBehavior: string;
  interactive: boolean;
}

export interface FeatureLibraryEntry {
  feature: FeatureImplementation;
  variants?: FeatureImplementation[];
  examples: FeatureExample[];
  documentation: FeatureDocumentation;
}

export interface FeatureExample {
  id: string;
  name: string;
  description: string;
  code: string;
  result: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

export interface FeatureDocumentation {
  overview: string;
  gettingStarted: string;
  apiReference: string;
  examples: string;
  troubleshooting: string;
  changelog: FeatureChangelog[];
}

export interface FeatureChangelog {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
  }[];
} 