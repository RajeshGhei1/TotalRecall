
import { ContactCSVRow } from './FileProcessor';
import { MergeOptions } from './types';

export class SmartMerger {
  static mergeContacts(
    existingRecord: any,
    newRecord: ContactCSVRow,
    options: MergeOptions
  ): any {
    const merged = { ...existingRecord };

    // Helper function to merge individual fields
    const mergeField = (existingValue: any, newValue: any, fieldName: string) => {
      if (options.preserveExisting && existingValue != null && existingValue !== '') {
        return existingValue;
      }
      
      if (options.overwriteEmpty && (existingValue == null || existingValue === '')) {
        return newValue;
      }
      
      if (newValue != null && newValue !== '') {
        return newValue;
      }
      
      return existingValue;
    };

    // Merge basic fields - only use fields that exist in people table
    const fieldMappings = {
      'full_name': 'full_name',
      'email': 'email',
      'phone': 'phone',
      'location': 'location'
      // Note: Removed fields that don't exist in people table:
      // personal_email, linkedin_url, current_title, current_company, notes, resume_url, portfolio_url
    };

    Object.entries(fieldMappings).forEach(([csvField, dbField]) => {
      if (newRecord[csvField as keyof ContactCSVRow] !== undefined) {
        merged[dbField] = mergeField(
          existingRecord[dbField],
          newRecord[csvField as keyof ContactCSVRow],
          dbField
        );
      }
    });

    // Note: Removed numeric fields handling since they don't exist in people table
    // (experience_years, desired_salary, availability_date, skills)

    // Update timestamp
    merged.updated_at = new Date().toISOString();

    return merged;
  }

  static generateMergePreview(existingRecord: any, newRecord: ContactCSVRow, options: MergeOptions) {
    const merged = this.mergeContacts(existingRecord, newRecord, options);
    
    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
      action: 'keep' | 'update' | 'merge'
    }> = [];

    // Compare each field to show what would change
    Object.keys(merged).forEach(field => {
      if (field === 'updated_at') return; // Skip timestamp
      
      const oldValue = existingRecord[field];
      const newValue = merged[field];
      
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        let action: 'keep' | 'update' | 'merge' = 'update';
        
        if (oldValue != null && oldValue !== '' && options.preserveExisting) {
          action = 'keep';
        }
        
        changes.push({
          field,
          oldValue,
          newValue,
          action
        });
      }
    });

    return { merged, changes };
  }
}
