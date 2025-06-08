
export class FormCompletenessCalculator {
  static calculateCompleteness(form: any, fields: any[], formType: string): number {
    if (!fields || fields.length === 0) return 0;
    
    const expectedFields = this.getExpectedFieldsForType(formType);
    const existingFieldTypes = fields.map(f => f.field_type || f.type).filter(Boolean);
    
    const matchedFields = expectedFields.filter(expected => 
      existingFieldTypes.includes(expected)
    );
    
    return Math.min(100, (matchedFields.length / expectedFields.length) * 100);
  }

  static identifyMissingFields(form: any, fields: any[], formType: string): string[] {
    const expectedFields = this.getExpectedFieldsForType(formType);
    const existingFieldTypes = fields.map(f => f.field_type || f.type).filter(Boolean);
    
    return expectedFields.filter(expected => !existingFieldTypes.includes(expected));
  }

  private static getExpectedFieldsForType(formType: string): string[] {
    switch (formType) {
      case 'job_application':
        return ['text', 'email', 'textarea', 'date'];
      case 'contact_form':
        return ['text', 'email', 'textarea'];
      case 'survey':
        return ['radio', 'checkbox', 'rating'];
      case 'registration':
        return ['text', 'email', 'password'];
      default:
        return ['text', 'email'];
    }
  }
}
