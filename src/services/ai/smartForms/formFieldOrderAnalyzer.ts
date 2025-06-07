
import { FormField } from '@/types/form-builder';
import { FormTypeDetector } from './formTypeDetector';

export interface FieldOrderSuggestion {
  fieldId: string;
  currentPosition: number;
  suggestedPosition: number;
  reasoning: string;
}

export class FormFieldOrderAnalyzer {
  static analyzeFieldOrder(fields: FormField[]): FieldOrderSuggestion[] {
    const suggestions: FieldOrderSuggestion[] = [];
    const idealOrder = FormTypeDetector.getIdealFieldOrder();

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
}
