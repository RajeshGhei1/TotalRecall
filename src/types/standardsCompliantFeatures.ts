/**
 * STANDARDS-COMPLIANT FEATURE TYPES
 * Aligns with TOTAL Platform Feature Definition & Design Standards
 */

import { JSONSchema7 } from 'json-schema';

// Core Standards-Compliant Feature Interface
export interface StandardsCompliantFeature {
  // Primary identifiers
  feature_id: string;
  name: string;
  description: string;
  version: string;
  is_active: boolean;
  
  // JSON Schema contracts (Principle 2: Interface-Driven)
  input_schema: JSONSchema7;
  output_schema: JSONSchema7;
  
  // Dynamic loading paths (Principle 3: Pluggability)
  ui_component_path: string;
  
  // Classification and discovery
  category: string;
  tags: string[];
  
  // Metadata
  created_by: string;
  updated_at: string;
  
  // Feature configuration
  feature_config: FeatureConfig;
  
  // Dependency management
  dependencies: string[];
  requirements: string[];
}

// Feature Configuration (Principle 1: Single Responsibility)
export interface FeatureConfig {
  // Principle 4: Feature Flag Ready
  isolated: boolean;
  stateless: boolean;
  pluggable: boolean;
  
  // Access control
  rolesRequired?: string[];
  permissionsRequired?: string[];
  
  // Performance and resource limits
  maxConcurrentInstances?: number;
  timeoutMs?: number;
  memoryLimitMB?: number;
  
  // UI behavior
  renderMode?: 'embedded' | 'modal' | 'standalone' | 'overlay';
  responsive?: boolean;
  offlineCapable?: boolean;
  
  // Integration settings
  eventsEnabled?: boolean;
  analyticsEnabled?: boolean;
  auditingEnabled?: boolean;
  
  // AI Enhancement support (Consolidated Feature System)
  hasAIEnhancement?: boolean;
}

// Feature Interface for dynamic loading
export interface FeatureInterface {
  id: string;
  feature_id: string;
  interface_type: 'component' | 'service' | 'hook' | 'api';
  interface_path: string;
  interface_props: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Event-driven communication (Principle 5: Minimal Cross-Talk)
export interface FeatureEvent {
  id: string;
  feature_id: string;
  event_name: string;
  event_schema: JSONSchema7;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Version control (Standard 3.5: Versionability)
export interface FeatureVersion {
  id: string;
  feature_id: string;
  version: string;
  changelog: ChangelogEntry[];
  is_stable: boolean;
  is_current: boolean;
  release_date: string;
  deprecated_date?: string;
  created_at: string;
}

export interface ChangelogEntry {
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  breaking_change?: boolean;
}

// Dependency management
export interface FeatureDependency {
  id: string;
  feature_id: string;
  depends_on_feature_id: string;
  dependency_type: 'required' | 'optional' | 'conflicts';
  min_version?: string;
  max_version?: string;
  created_at: string;
}

// Runtime feature execution interface (Principle 2: Interface-Driven)
export interface FeatureExecutor {
  execute(input: unknown): Promise<FeatureExecutionResult>;
  validate(input: unknown): ValidationResult;
  getSchema(): { input: JSONSchema7; output: JSONSchema7 };
  getMetadata(): FeatureMetadata;
}

export interface FeatureExecutionResult {
  success: boolean;
  data?: unknown;
  errors?: FeatureError[];
  warnings?: FeatureWarning[];
  executionTime?: number;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface FeatureError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  recoverable?: boolean;
}

export interface FeatureWarning {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Feature metadata for discoverability
export interface FeatureMetadata {
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  author: string;
  documentation_url?: string;
  support_url?: string;
  license?: string;
}

// Feature Context (runtime environment)
export interface FeatureContext {
  // User context
  userId?: string;
  userRole?: string;
  userPermissions?: string[];
  
  // Tenant context
  tenantId?: string;
  tenantPlan?: string;
  tenantFeatures?: string[];
  
  // Module context
  moduleName: string;
  moduleVersion?: string;
  
  // Entity context (what the feature is operating on)
  entityType?: string;
  entityId?: string;
  entityData?: Record<string, unknown>;
  
  // Execution context
  executionMode?: 'sync' | 'async' | 'background';
  requestId?: string;
  sessionId?: string;
  
  // Configuration overrides
  configOverrides?: Partial<FeatureConfig>;
}

// Feature Registry for dynamic loading
export interface FeatureRegistry {
  registerFeature(feature: StandardsCompliantFeature): Promise<void>;
  unregisterFeature(featureId: string): Promise<void>;
  getFeature(featureId: string): Promise<StandardsCompliantFeature | null>;
  listFeatures(filters?: FeatureFilters): Promise<StandardsCompliantFeature[]>;
  loadFeatureComponent(componentPath: string): Promise<React.ComponentType>;
  executeFeature(featureId: string, input: unknown, context: FeatureContext): Promise<FeatureExecutionResult>;
}

export interface FeatureFilters {
  category?: string;
  tags?: string[];
  isActive?: boolean;
  minVersion?: string;
  maxVersion?: string;
  search?: string;
}

// Event Bus for feature communication (Principle 5: Minimal Cross-Talk)
export interface FeatureEventBus {
  emit(eventName: string, payload: unknown, context?: FeatureContext): Promise<void>;
  subscribe(eventName: string, handler: FeatureEventHandler): string;
  unsubscribe(subscriptionId: string): void;
  listEvents(featureId?: string): Promise<FeatureEvent[]>;
}

export type FeatureEventHandler = (
  eventName: string,
  payload: unknown,
  context?: FeatureContext
) => Promise<void> | void;

// Analytics and Audit (Principle 6: Auditability)
export interface FeatureAuditLog {
  id: string;
  feature_id: string;
  event_type: 'executed' | 'loaded' | 'error' | 'warning';
  user_id?: string;
  tenant_id?: string;
  module_name: string;
  input_data?: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  execution_time_ms?: number;
  error_details?: FeatureError;
  timestamp: string;
  request_id?: string;
  session_id?: string;
}

// Feature Development Environment
export interface FeatureDevelopmentEnvironment {
  feature: StandardsCompliantFeature;
  sandbox: FeatureSandbox;
  testing: FeatureTestEnvironment;
  preview: FeaturePreviewEnvironment;
}

export interface FeatureSandbox {
  mockData: Record<string, unknown>;
  contextOverrides: Partial<FeatureContext>;
  configOverrides: Partial<FeatureConfig>;
}

export interface FeatureTestEnvironment {
  testSuites: FeatureTestSuite[];
  coverage?: FeatureTestCoverage;
  performance?: FeaturePerformanceMetrics;
}

export interface FeatureTestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  tests: FeatureTest[];
  status: 'pending' | 'running' | 'passed' | 'failed';
}

export interface FeatureTest {
  id: string;
  name: string;
  description: string;
  input: unknown;
  expectedOutput: unknown;
  context?: Partial<FeatureContext>;
  status: 'pending' | 'running' | 'passed' | 'failed';
  executionTime?: number;
  error?: string;
}

export interface FeatureTestCoverage {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

export interface FeaturePerformanceMetrics {
  averageExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  memoryUsage: number;
  errorRate: number;
}

export interface FeaturePreviewEnvironment {
  mode: 'isolated' | 'module-context' | 'full-context';
  scenarios: FeaturePreviewScenario[];
}

export interface FeaturePreviewScenario {
  id: string;
  name: string;
  description: string;
  input: unknown;
  context: FeatureContext;
  expectedBehavior: string;
}

// Export utility types
export type FeatureId = string;
export type FeatureVersionString = string;
export type ModuleName = string;
export type TenantId = string;
export type UserId = string; 