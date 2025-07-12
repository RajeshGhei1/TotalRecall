
export interface ValidationIssue {
  fieldName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface FormField {
  field_type?: string;
  type?: string;
  name?: string;
  field_key?: string;
  required?: boolean;
  validation_rules?: unknown;
  [key: string]: unknown;
}

export class FormValidationAnalyzer {
  static identifyValidationIssues(fields: FormField[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    fields.forEach(field => {
      const fieldName = field.name || field.field_key || 'Unknown';
      
      // Check for missing validation on email fields
      if ((field.field_type === 'email' || field.type === 'email') && !field.validation_rules) {
        issues.push({
          fieldName,
          issue: 'Email field lacks validation',
          severity: 'medium',
          suggestion: 'Add email format validation'
        });
      }
      
      // Check for missing required fields
      if (field.field_type === 'email' && !field.required) {
        issues.push({
          fieldName,
          issue: 'Email field should be required',
          severity: 'low',
          suggestion: 'Consider making email fields required'
        });
      }
    });
    
    return issues;
  }
}
