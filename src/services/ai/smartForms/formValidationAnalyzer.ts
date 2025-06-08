
import { FormField } from '@/types/form-builder';

export interface ValidationIssue {
  fieldId: string;
  issue: string;
  severity: 'error' | 'warning';
  suggestion: string;
}

export class FormValidationAnalyzer {
  static identifyValidationIssues(fields: FormField[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    fields.forEach(field => {
      // Check for missing labels
      if (!field.name || field.name.trim().length === 0) {
        issues.push({
          fieldId: field.id,
          issue: 'Missing field label',
          severity: 'error',
          suggestion: 'Add a descriptive label for this field'
        });
      }

      // Check for email fields without proper validation
      if (field.field_type === 'email' && !field.validation_rules) {
        issues.push({
          fieldId: field.id,
          issue: 'Email field lacks validation',
          severity: 'warning',
          suggestion: 'Add email format validation to ensure data quality'
        });
      }

      // Check for required fields without indication
      if (field.required && !field.name?.includes('*')) {
        issues.push({
          fieldId: field.id,
          issue: 'Required field not clearly marked',
          severity: 'warning',
          suggestion: 'Consider adding an asterisk (*) to indicate required fields'
        });
      }

      // Check for very long field names
      if (field.name && field.name.length > 50) {
        issues.push({
          fieldId: field.id,
          issue: 'Field label too long',
          severity: 'warning',
          suggestion: 'Shorten the field label for better user experience'
        });
      }
    });

    return issues;
  }
}
