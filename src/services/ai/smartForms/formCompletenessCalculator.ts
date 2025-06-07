
import { FormDefinition, FormField } from '@/types/form-builder';
import { FormTypeDetector } from './formTypeDetector';

export class FormCompletenessCalculator {
  static calculateCompleteness(
    form: FormDefinition, 
    fields: FormField[], 
    formType: string
  ): number {
    const requiredFieldTypes = FormTypeDetector.getRequiredFieldsForFormType(formType);
    const presentFieldTypes = fields.map(f => f.field_type);
    
    const completenessRatio = requiredFieldTypes.filter(type => 
      presentFieldTypes.includes(type)
    ).length / requiredFieldTypes.length;

    return Math.round(completenessRatio * 100);
  }

  static identifyMissingFields(
    form: FormDefinition, 
    fields: FormField[], 
    formType: string
  ): string[] {
    const requiredFields = FormTypeDetector.getRequiredFieldsForFormType(formType);
    const presentFields = fields.map(f => f.field_type);
    
    return requiredFields.filter(required => !presentFields.includes(required));
  }
}
