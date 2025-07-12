
interface FormDefinition {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

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
}
