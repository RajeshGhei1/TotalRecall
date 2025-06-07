
import { FormDefinition, FormField } from '@/types/form-builder';
import { formSuggestionEngine, FormSuggestion } from './formSuggestionEngine';

export interface FormAnalysis {
  completeness: number;
  usabilityScore: number;
  suggestions: FormSuggestion[];
  missingFields: string[];
  fieldOrderSuggestions: FieldOrderSuggestion[];
  validationIssues: ValidationIssue[];
}

export interface FieldOrderSuggestion {
  fieldId: string;
  currentPosition: number;
  suggestedPosition: number;
  reasoning: string;
}

export interface ValidationIssue {
  type: 'missing_validation' | 'conflicting_rules' | 'accessibility' | 'ux';
  severity: 'low' | 'medium' | 'high';
  field?: string;
  message: string;
  suggestion: string;
}

export class IntelligentFormAnalyzer {
  private static instance: IntelligentFormAnalyzer;

  private constructor() {}

  static getInstance(): IntelligentFormAnalyzer {
    if (!IntelligentFormAnalyzer.instance) {
      IntelligentFormAnalyzer.instance = new IntelligentFormAnalyzer();
    }
    return IntelligentFormAnalyzer.instance;
  }

  async analyzeForm(
    form: FormDefinition,
    fields: FormField[],
    context?: Record<string, any>
  ): Promise<FormAnalysis> {
    const completeness = this.calculateCompleteness(form, fields);
    const usabilityScore = this.calculateUsabilityScore(form, fields);
    const suggestions = await this.generateFieldSuggestions(form, fields, context);
    const missingFields = this.identifyMissingFields(form, fields);
    const fieldOrderSuggestions = this.analyzeFieldOrder(fields);
    const validationIssues = this.identifyValidationIssues(fields);

    return {
      completeness,
      usabilityScore,
      suggestions,
      missingFields,
      fieldOrderSuggestions,
      validationIssues
    };
  }

  private calculateCompleteness(form: FormDefinition, fields: FormField[]): number {
    const requiredFieldTypes = this.getRequiredFieldsForFormType(form.form_type || 'general');
    const presentFieldTypes = fields.map(f => f.field_type);
    
    const completenessRatio = requiredFieldTypes.filter(type => 
      presentFieldTypes.includes(type)
    ).length / requiredFieldTypes.length;

    return Math.round(completenessRatio * 100);
  }

  private calculateUsabilityScore(form: FormDefinition, fields: FormField[]): number {
    let score = 100;

    // Deduct points for UX issues
    if (fields.length > 15) score -= 10; // Too many fields
    if (fields.length < 3) score -= 15; // Too few fields
    
    // Check for logical field order
    const hasLogicalOrder = this.hasLogicalFieldOrder(fields);
    if (!hasLogicalOrder) score -= 20;

    // Check for proper field labeling
    const hasGoodLabels = fields.every(f => f.label && f.label.length > 2);
    if (!hasGoodLabels) score -= 15;

    // Check for required field balance
    const requiredFieldsRatio = fields.filter(f => f.required).length / fields.length;
    if (requiredFieldsRatio > 0.7) score -= 10; // Too many required fields

    return Math.max(0, score);
  }

  private async generateFieldSuggestions(
    form: FormDefinition,
    fields: FormField[],
    context?: Record<string, any>
  ): Promise<FormSuggestion[]> {
    const formContext = {
      formType: form.form_type || 'general',
      currentValues: fields.reduce((acc, field) => {
        acc[field.field_key || field.name] = field.label;
        return acc;
      }, {} as Record<string, any>),
      userHistory: [],
      userId: context?.userId || '',
      tenantId: context?.tenantId
    };

    return formSuggestionEngine.generateSuggestions(formContext);
  }

  private identifyMissingFields(form: FormDefinition, fields: FormField[]): string[] {
    const requiredFields = this.getRequiredFieldsForFormType(form.form_type || 'general');
    const presentFields = fields.map(f => f.field_type);
    
    return requiredFields.filter(required => !presentFields.includes(required));
  }

  private analyzeFieldOrder(fields: FormField[]): FieldOrderSuggestion[] {
    const suggestions: FieldOrderSuggestion[] = [];
    const idealOrder = this.getIdealFieldOrder();

    fields.forEach((field, index) => {
      const idealIndex = idealOrder.indexOf(field.field_type);
      if (idealIndex !== -1 && idealIndex !== index) {
        suggestions.push({
          fieldId: field.id,
          currentPosition: index,
          suggestedPosition: idealIndex,
          reasoning: `${field.field_type} fields are typically placed earlier in forms for better user experience`
        });
      }
    });

    return suggestions;
  }

  private identifyValidationIssues(fields: FormField[]): ValidationIssue[] {
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
      if (!field.label || field.label.length < 2) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          field: field.name,
          message: 'Field missing proper label',
          suggestion: 'Add a descriptive label for screen reader accessibility'
        });
      }

      // Check for UX issues
      if (field.field_type === 'textarea' && !field.placeholder) {
        issues.push({
          type: 'ux',
          severity: 'low',
          field: field.name,
          message: 'Text area missing placeholder text',
          suggestion: 'Add placeholder text to guide users on what to enter'
        });
      }
    });

    return issues;
  }

  private getRequiredFieldsForFormType(formType: string): string[] {
    const fieldMapping: Record<string, string[]> = {
      'job_application': ['text', 'email', 'textarea', 'file'],
      'contact_form': ['text', 'email', 'textarea'],
      'survey': ['text', 'radio', 'dropdown'],
      'registration': ['text', 'email', 'phone', 'dropdown'],
      'general': ['text', 'email']
    };

    return fieldMapping[formType] || fieldMapping['general'];
  }

  private hasLogicalFieldOrder(fields: FormField[]): boolean {
    const idealOrder = this.getIdealFieldOrder();
    const fieldTypes = fields.map(f => f.field_type);
    
    // Check if personal info fields come before detailed fields
    const emailIndex = fieldTypes.indexOf('email');
    const textareaIndex = fieldTypes.indexOf('textarea');
    
    return emailIndex === -1 || textareaIndex === -1 || emailIndex < textareaIndex;
  }

  private getIdealFieldOrder(): string[] {
    return [
      'text',      // Name/Title first
      'email',     // Contact info
      'phone',     // Contact info
      'number',    // Numeric data
      'date',      // Dates
      'dropdown',  // Selections
      'radio',     // Selections
      'checkbox',  // Multiple selections
      'textarea',  // Detailed text last
      'file'       // File uploads last
    ];
  }
}

export const intelligentFormAnalyzer = IntelligentFormAnalyzer.getInstance();
