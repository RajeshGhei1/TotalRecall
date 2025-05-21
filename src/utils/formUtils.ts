
import { availableForms } from '@/components/customFields';

/**
 * Gets a readable form name from the form ID
 * @param formId The form identifier (e.g., 'talent_form')
 * @returns The readable form name (e.g., 'Talent Profile')
 */
export function getFormName(formId: string): string {
  const form = availableForms.find(f => f.id === formId);
  return form ? form.label : formId;
}

/**
 * Format a list of form IDs into a readable string
 * @param formIds Array of form identifiers
 * @returns Comma-separated string of form names
 */
export function formatFormsList(formIds: string[]): string {
  if (!formIds || formIds.length === 0) {
    return 'All forms';
  }
  
  return formIds.map(id => getFormName(id)).join(', ');
}
