
import { FormDefinition, FormField } from '@/types/form-builder';
import { FormTypeDetector } from './formTypeDetector';

export class FormUsabilityScorer {
  static calculateUsabilityScore(form: FormDefinition, fields: FormField[]): number {
    let score = 100;

    // Deduct points for UX issues
    if (fields.length > 15) score -= 10; // Too many fields
    if (fields.length < 3) score -= 15; // Too few fields
    
    // Check for logical field order
    const hasLogicalOrder = this.hasLogicalFieldOrder(fields);
    if (!hasLogicalOrder) score -= 20;

    // Check for proper field labeling
    const hasGoodLabels = fields.every(f => f.name && f.name.length > 2);
    if (!hasGoodLabels) score -= 15;

    // Check for required field balance
    const requiredFieldsRatio = fields.filter(f => f.required).length / fields.length;
    if (requiredFieldsRatio > 0.7) score -= 10; // Too many required fields

    return Math.max(0, score);
  }

  private static hasLogicalFieldOrder(fields: FormField[]): boolean {
    const idealOrder = FormTypeDetector.getIdealFieldOrder();
    const fieldTypes = fields.map(f => f.field_type);
    
    // Check if personal info fields come before detailed fields
    const emailIndex = fieldTypes.indexOf('email');
    const textareaIndex = fieldTypes.indexOf('textarea');
    
    return emailIndex === -1 || textareaIndex === -1 || emailIndex < textareaIndex;
  }
}
