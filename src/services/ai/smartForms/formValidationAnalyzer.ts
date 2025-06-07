
import { FormField } from '@/types/form-builder';

export interface ValidationIssue {
  type: 'missing_validation' | 'conflicting_rules' | 'accessibility' | 'ux';
  severity: 'low' | 'medium' | 'high';
  field?: string;
  message: string;
  suggestion: string;
}

export class FormValidationAnalyzer {
  static identifyValidationIssues(fields: FormField[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    fields.forEach(field => {
      // Check for missing validation on email fields
      if (field.field_type === 'email' && !field.required) {
        issues.push({
          type: 'missing_validation',
          severity: 'medium',
          field: field.name,
          message: 'Email field should typically be required',
          suggestion: 'Consider making this email field required for better data quality'
        });
      }

      // Check for accessibility issues
      if (!field.name || field.name.length < 2) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          field: field.name,
          message: 'Field missing proper name',
          suggestion: 'Add a descriptive name for screen reader accessibility'
        });
      }

      // Check for UX issues
      if (field.field_type === 'textarea' && !field.description) {
        issues.push({
          type: 'ux',
          severity: 'low',
          field: field.name,
          message: 'Text area missing description',
          suggestion: 'Add description text to guide users on what to enter'
        });
      }
    });

    return issues;
  }
}
