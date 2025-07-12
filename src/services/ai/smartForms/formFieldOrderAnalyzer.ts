
export interface FieldOrderSuggestion {
  fieldName: string;
  currentPosition: number;
  suggestedPosition: number;
  reason: string;
}

interface FormField {
  field_type?: string;
  type?: string;
  name?: string;
  field_key?: string;
  [key: string]: unknown;
}

export class FormFieldOrderAnalyzer {
  static analyzeFieldOrder(fields: FormField[]): FieldOrderSuggestion[] {
    const suggestions: FieldOrderSuggestion[] = [];
    
    // Check if email comes before name
    const emailIndex = fields.findIndex(f => f.field_type === 'email' || f.type === 'email');
    const nameIndex = fields.findIndex(f => 
      (f.field_type === 'text' || f.type === 'text') && 
      (f.name?.toLowerCase().includes('name') || f.field_key?.toLowerCase().includes('name'))
    );
    
    if (emailIndex !== -1 && nameIndex !== -1 && emailIndex < nameIndex) {
      suggestions.push({
        fieldName: fields[emailIndex].name || 'Email field',
        currentPosition: emailIndex,
        suggestedPosition: nameIndex + 1,
        reason: 'Email fields typically come after name fields'
      });
    }
    
    return suggestions;
  }
}
