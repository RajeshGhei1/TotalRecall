
export class FormTypeDetector {
  static detectFormType(form: any): string {
    // Simple form type detection based on form name/title
    if (!form) return 'general';
    
    const name = form.name?.toLowerCase() || '';
    const description = form.description?.toLowerCase() || '';
    
    if (name.includes('job') || name.includes('application') || description.includes('job')) {
      return 'job_application';
    }
    
    if (name.includes('contact') || description.includes('contact')) {
      return 'contact_form';
    }
    
    if (name.includes('survey') || description.includes('survey')) {
      return 'survey';
    }
    
    if (name.includes('feedback') || description.includes('feedback')) {
      return 'feedback';
    }
    
    return 'general';
  }

  static getRequiredFieldsForFormType(formType: string): string[] {
    switch (formType) {
      case 'job_application':
        return ['text', 'email', 'phone', 'file_upload'];
      case 'contact_form':
        return ['text', 'email', 'textarea'];
      case 'survey':
        return ['text', 'radio', 'checkbox'];
      case 'feedback':
        return ['text', 'textarea', 'rating'];
      default:
        return ['text', 'email'];
    }
  }

  static getIdealFieldOrder(): string[] {
    return [
      'text',
      'email', 
      'phone',
      'select',
      'radio',
      'checkbox',
      'textarea',
      'file_upload',
      'date',
      'number'
    ];
  }
}
