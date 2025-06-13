
export interface DuplicateMatch {
  type: 'email' | 'phone' | 'name_company' | 'linkedin';
  confidence: number;
  field: string;
  value: string;
}

export interface DuplicateInfo {
  row: number;
  newRecord: any;
  existingRecord: any;
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
