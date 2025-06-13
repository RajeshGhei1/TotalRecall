
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

    // Merge basic fields that exist in people table
    const fieldMappings = {
      'full_name': 'full_name',
      'email': 'email',
      'phone': 'phone',
      'location': 'location'
    };

    // Handle social media fields that exist in schema
    const socialMediaFields = {
      'linkedin_url': 'linkedin_url',
      'twitter_url': 'twitter_url', 
      'facebook_url': 'facebook_url',
      'instagram_url': 'instagram_url'
    };

    // Handle business fields that exist in schema
    const businessFields = {
      'personal_email': 'personal_email',
      'role': 'role'
    };

    // Merge all fields that exist in the people table
    const allFieldMappings = { ...fieldMappings, ...socialMediaFields, ...businessFields };

    Object.entries(allFieldMappings).forEach(([csvField, dbField]) => {
      if (newRecord[csvField as keyof ContactCSVRow] !== undefined) {
        merged[dbField] = mergeField(
          existingRecord[dbField],
          newRecord[csvField as keyof ContactCSVRow],
          dbField
        );
      }
    });

    // Note: Fields like company_name, reports_to_name, direct_reports, current_title, 
    // current_company, experience_years, skills, notes, availability_date, desired_salary,
    // resume_url, portfolio_url are not part of the people table schema and would require
    // additional processing or separate tables to handle properly.

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
