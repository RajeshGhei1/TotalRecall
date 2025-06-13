
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

    // Merge basic fields - using correct field mappings for people table
    const fieldMappings = {
      'full_name': 'full_name',
      'email': 'email',
      'phone': 'phone',
      'location': 'location',
      'personal_email': 'personal_email', // This field may not exist in people table
      'linkedin_url': 'linkedin_url',
      'current_title': 'current_title',
      'current_company': 'current_title', // Map to existing field since current_company doesn't exist
      'notes': 'notes', // This field may not exist in people table
      'resume_url': 'resume_url', // This field may not exist in people table
      'portfolio_url': 'portfolio_url' // This field may not exist in people table
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

    // Handle numeric fields
    if (newRecord.experience_years) {
      const newExp = parseInt(newRecord.experience_years);
      if (!isNaN(newExp)) {
        merged.experience_years = mergeField(
          existingRecord.experience_years,
          newExp,
          'experience_years'
        );
      }
    }

    if (newRecord.desired_salary) {
      const newSalary = parseFloat(newRecord.desired_salary.replace(/[,$]/g, ''));
      if (!isNaN(newSalary)) {
        merged.desired_salary = mergeField(
          existingRecord.desired_salary,
          newSalary,
          'desired_salary'
        );
      }
    }

    // Handle date fields
    if (newRecord.availability_date) {
      const parsedDate = new Date(newRecord.availability_date);
      if (!isNaN(parsedDate.getTime())) {
        const newDateStr = parsedDate.toISOString().split('T')[0];
        
        if (options.keepMostRecent && existingRecord.availability_date) {
          const existingDate = new Date(existingRecord.availability_date);
          merged.availability_date = parsedDate > existingDate ? newDateStr : existingRecord.availability_date;
        } else {
          merged.availability_date = mergeField(
            existingRecord.availability_date,
            newDateStr,
            'availability_date'
          );
        }
      }
    }

    // Handle skills array merging
    if (options.mergeArrays && newRecord.skills) {
      const newSkills = newRecord.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      let existingSkills: string[] = [];
      if (existingRecord.skills) {
        try {
          existingSkills = typeof existingRecord.skills === 'string' 
            ? JSON.parse(existingRecord.skills)
            : existingRecord.skills;
        } catch (e) {
          existingSkills = [];
        }
      }

      // Merge and deduplicate skills
      const allSkills = [...existingSkills, ...newSkills];
      const uniqueSkills = Array.from(new Set(allSkills.map(s => s.toLowerCase())))
        .map(s => allSkills.find(skill => skill.toLowerCase() === s) || s);
      
      merged.skills = JSON.stringify(uniqueSkills);
    } else if (newRecord.skills) {
      const newSkills = newRecord.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      merged.skills = mergeField(
        existingRecord.skills,
        JSON.stringify(newSkills),
        'skills'
      );
    }

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
        
        if (field === 'skills' && options.mergeArrays) {
          action = 'merge';
        } else if (oldValue != null && oldValue !== '' && options.preserveExisting) {
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
