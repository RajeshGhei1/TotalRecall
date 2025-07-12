// Common TypeScript types to replace 'any' usage across the application

// Generic API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// Generic Error Type
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Common Event Handler Types
export type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type TextareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type SelectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => void;
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

// Common Form Field Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ value: string | number; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => boolean;
  };
}

// Common Database Record Types
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

// Generic List Response
export interface ListResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

// Generic Filter/Search Parameters
export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Modal/Dialog Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Loading State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: unknown;
}

// Async Operation State
export interface AsyncState<T = unknown> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
  isSuccess: boolean;
}

// File Upload Types
export interface FileUploadConfig {
  maxSize: number;
  acceptedTypes: string[];
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onError?: (error: string) => void;
}

// Chart/Analytics Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartData {
  [key: string]: string | number | unknown;
}

export interface MetricData {
  count?: number;
  value?: number;
  trend?: number;
  [key: string]: unknown;
}

export interface RevenueData {
  value?: number;
  change?: number;
  [key: string]: unknown;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area';
  data: ChartDataPoint[];
  options?: {
    responsive?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    colors?: string[];
  };
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxUploadSize: number;
    maxUsers: number;
    [key: string]: number;
  };
}

// User Session Types
export interface UserSession {
  id: string;
  userId: string;
  tenantId?: string;
  permissions: string[];
  preferences: Record<string, unknown>;
  expiresAt: Date;
}

// User interface for authentication
export interface User {
  id: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

// Generic Cache Entry
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

// Custom Fields Form Data Types
export interface CustomFormData {
  [fieldKey: string]: string | number | boolean | string[] | null | undefined;
}

// Dashboard and Widget Types
export interface DashboardWidget {
  id: string;
  widget_type: string;
  data_source_id: string;
  config: {
    title: string;
    [key: string]: unknown;
  };
}

export interface AvailableWidget {
  id: string;
  widget_type: string;
  name: string;
  category: string;
  description?: string;
  default_config: Record<string, unknown>;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  connection_config: Record<string, unknown>;
}

export interface DataSourceConfig {
  name: string;
  source_type: string;
  query_config: {
    table: string;
    operation: string;
    columns: string;
    filters: FilterConfig[];
    query: string;
  };
  refresh_interval: number;
  cache_duration: number;
}

export interface FilterConfig {
  column: string;
  operator: string;
  value: string;
}

export interface DashboardConfig {
  user_id: string;
  dashboard_name: string;
  layout_config: {
    columns: number;
    row_height: number;
    margin: [number, number];
  };
  widget_configs: DashboardWidget[];
  filters: Record<string, unknown>;
  is_default: boolean;
}

export interface WidgetConfig {
  title: string;
  [key: string]: unknown;
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & RequiredKeys<T, K>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};

// Generic function types
export type AsyncFunction<T = unknown, R = unknown> = (params: T) => Promise<R>;
export type EventHandler<T = unknown> = (event: T) => void;
export type Validator<T = unknown> = (value: T) => boolean | string;
export type Transformer<T = unknown, R = unknown> = (input: T) => R;

// AI Service Types
export interface AIServiceRequest {
  context: Record<string, unknown>;
  parameters: Record<string, unknown>;
  userHistory?: unknown[];
  tenantId?: string;
  moduleId?: string;
}

export interface AIServiceResponse {
  suggestions?: unknown[];
  recommendations?: unknown[];
  data?: unknown;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AIDecisionContext {
  decision_id: string;
  tenant_id: string;
  module_id: string;
  context: Record<string, unknown>;
  conditions: unknown[];
  actions: unknown[];
  steps?: unknown[];
  alternative_options?: unknown[];
}

export interface AILearningPattern {
  pattern_id: string;
  context_key: string;
  pattern_data: Record<string, unknown>;
  frequency: number;
  confidence: number;
  outcomes: unknown[];
}

// Array Type Definitions
export type UnknownArray = unknown[];
export type DataArray = Record<string, unknown>[];
export type ConfigArray = Record<string, unknown>[];
export type StringArray = string[];
export type NumberArray = number[];

// Service Response Types
export interface ServiceResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Function Type Definitions
export type SyncFunction<T = unknown> = (...args: unknown[]) => T;
export type ErrorHandler = (error: unknown) => void;

// Form and Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FormSubmissionData {
  [key: string]: unknown;
}

// Module and Workflow Types
export interface ModuleManifest {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  config: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  conditions?: unknown[];
  actions?: unknown[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: WorkflowStep[];
  results?: unknown[];
  error?: string;
}

// Analytics and Metrics Types (extended from existing MetricData)

export interface AnalyticsInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  data: unknown[];
  confidence: number;
  recommendations?: string[];
}

// Tenant and User Types
export interface TenantData {
  id: string;
  name: string;
  domain: string;
  settings: Record<string, unknown>;
  subscription?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  metadata?: Record<string, unknown>;
} 