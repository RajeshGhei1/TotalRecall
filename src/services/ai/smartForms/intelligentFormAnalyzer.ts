
import { FormDefinition, FormField } from '@/types/form-builder';
import { formSuggestionEngine, FormSuggestion } from './formSuggestionEngine';
import { FormTypeDetector } from './formTypeDetector';
import { FormCompletenessCalculator } from './formCompletenessCalculator';
import { FormUsabilityScorer } from './formUsabilityScorer';
import { FormValidationAnalyzer, ValidationIssue } from './formValidationAnalyzer';
import { FormFieldOrderAnalyzer, FieldOrderSuggestion } from './formFieldOrderAnalyzer';

export interface FormAnalysis {
  completeness: number;
  usabilityScore: number;
  suggestions: FormSuggestion[];
  missingFields: string[];
  fieldOrderSuggestions: FieldOrderSuggestion[];
  validationIssues: ValidationIssue[];
}

export type { ValidationIssue, FieldOrderSuggestion };

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
    const formType = this.getFormType(form);
    const completeness = FormCompletenessCalculator.calculateCompleteness(form, fields, formType);
    const usabilityScore = FormUsabilityScorer.calculateUsabilityScore(form, fields);
    const suggestions = await this.generateFieldSuggestions(form, fields, context, formType);
    const missingFields = FormCompletenessCalculator.identifyMissingFields(form, fields, formType);
    const fieldOrderSuggestions = FormFieldOrderAnalyzer.analyzeFieldOrder(fields);
    const validationIssues = FormValidationAnalyzer.identifyValidationIssues(fields);

    return {
      completeness,
      usabilityScore,
      suggestions,
      missingFields,
      fieldOrderSuggestions,
      validationIssues
    };
  }

  private getFormType(form: FormDefinition): string {
    const name = form.name?.toLowerCase() || '';
    const description = form.description?.toLowerCase() || '';
    
    if (name.includes('job') || name.includes('application') || description.includes('job')) {
      return 'job_application';
    } else if (name.includes('contact') || description.includes('contact')) {
      return 'contact_form';
    } else if (name.includes('survey') || description.includes('survey')) {
      return 'survey';
    } else if (name.includes('registration') || description.includes('registration')) {
      return 'registration';
    }
    
    return 'general';
  }

  private async generateFieldSuggestions(
    form: FormDefinition,
    fields: FormField[],
    context?: Record<string, any>,
    formType?: string
  ): Promise<FormSuggestion[]> {
    const formContext = {
      formType: formType || this.getFormType(form),
      currentValues: fields.reduce((acc, field) => {
        acc[field.field_key || field.name] = field.name;
        return acc;
      }, {} as Record<string, any>),
      userHistory: [],
      userId: context?.userId || '',
      tenantId: context?.tenantId
    };

    return formSuggestionEngine.generateSuggestions(formContext);
  }
}

export const intelligentFormAnalyzer = IntelligentFormAnalyzer.getInstance();
