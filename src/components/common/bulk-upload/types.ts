// Database record interface for existing records
export interface DatabaseRecord {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  personal_email?: string;
  linkedin_url?: string;
  current_title?: string;
  notes?: string;
  resume_url?: string;
  portfolio_url?: string;
  experience_years?: number;
  desired_salary?: number;
  availability_date?: string;
  skills?: string; // JSON string or array
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; // For additional fields
}

// Import record interface for new records from CSV
export interface ImportRecord {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  personal_email?: string;
  linkedin_url?: string;
  current_title?: string;
  current_company?: string;
  notes?: string;
  resume_url?: string;
  portfolio_url?: string;
  experience_years?: string;
  desired_salary?: string;
  availability_date?: string;
  skills?: string;
  [key: string]: unknown; // For additional fields
}

export interface DuplicateMatch {
  type: 'email' | 'phone' | 'name_company' | 'linkedin';
  confidence: number;
  field: string;
  value: string;
}

export interface DuplicateInfo {
  row: number;
  newRecord: ImportRecord;
  existingRecord: DatabaseRecord;
  matches: DuplicateMatch[];
  suggestedAction: DuplicateAction;
}

export type DuplicateAction = 'skip' | 'update' | 'merge' | 'create_anyway' | 'review';

export interface DuplicateStrategy {
  primaryAction: DuplicateAction;
  emailMatches: DuplicateAction;
  phoneMatches: DuplicateAction;
  nameMatches: DuplicateAction;
  linkedinMatches: DuplicateAction;
  confidenceThreshold: number;
}

export interface MergeOptions {
  overwriteEmpty: boolean;
  mergeArrays: boolean;
  keepMostRecent: boolean;
  preserveExisting: boolean;
}

export interface ProcessingResultsEnhanced {
  successful: number;
  failed: number;
  duplicates_found: number;
  duplicates_skipped: number;
  duplicates_merged: number;
  errors: string[];
  duplicate_details: DuplicateInfo[];
}
