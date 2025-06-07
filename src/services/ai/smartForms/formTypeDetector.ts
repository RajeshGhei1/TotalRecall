
import { FormDefinition } from '@/types/form-builder';

export class FormTypeDetector {
  static detectFormType(form: FormDefinition): string {
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

  static getRequiredFieldsForFormType(formType: string): string[] {
    const fieldMapping: Record<string, string[]> = {
      'job_application': ['text', 'email', 'textarea', 'file'],
      'contact_form': ['text', 'email', 'textarea'],
      'survey': ['text', 'radio', 'dropdown'],
      'registration': ['text', 'email', 'phone', 'dropdown'],
      'general': ['text', 'email']
    };

    return fieldMapping[formType] || fieldMapping['general'];
  }

  static getIdealFieldOrder(): string[] {
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
