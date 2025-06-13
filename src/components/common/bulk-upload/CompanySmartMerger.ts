
import { CompanyCSVRow } from './CompanyDuplicateDetector';
import { MergeOptions } from './types';

export class CompanySmartMerger {
  static mergeCompanies(
    existingRecord: any,
    newRecord: CompanyCSVRow,
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

    // All company fields that exist in the companies table
    const companyFieldMappings = {
      'name': 'name',
      'cin': 'cin',
      'email': 'email',
      'website': 'website',
      'domain': 'domain',
      'phone': 'phone',
      'description': 'description',
      'founded': 'founded',
      'location': 'location',
      'registeredofficeaddress': 'registeredofficeaddress',
      'country': 'country',
      'globalregion': 'globalregion',
      'region': 'region',
      'holocation': 'holocation',
      'industry1': 'industry1',
      'industry2': 'industry2',
      'industry3': 'industry3',
      'companysector': 'companysector',
      'companytype': 'companytype',
      'entitytype': 'entitytype',
      'size': 'size',
      'noofemployee': 'noofemployee',
      'segmentaspernumberofemployees': 'segmentaspernumberofemployees',
      'turnover': 'turnover',
      'segmentasperturnover': 'segmentasperturnover',
      'turnoveryear': 'turnoveryear',
      'yearofestablishment': 'yearofestablishment',
      'paidupcapital': 'paidupcapital',
      'segmentasperpaidupcapital': 'segmentasperpaidupcapital',
      'companystatus': 'companystatus',
      'registrationdate': 'registrationdate',
      'registeredemailaddress': 'registeredemailaddress',
      'noofdirectives': 'noofdirectives',
      'companyprofile': 'companyprofile',
      'areaofspecialize': 'areaofspecialize',
      'serviceline': 'serviceline',
      'verticles': 'verticles',
      'linkedin': 'linkedin',
      'twitter': 'twitter',
      'facebook': 'facebook',
      'parent_company_id': 'parent_company_id',
      'company_group_name': 'company_group_name',
      'hierarchy_level': 'hierarchy_level'
    };

    // Merge all fields that exist in the companies table
    Object.entries(companyFieldMappings).forEach(([csvField, dbField]) => {
      if (newRecord[csvField as keyof CompanyCSVRow] !== undefined) {
        merged[dbField] = mergeField(
          existingRecord[dbField],
          newRecord[csvField as keyof CompanyCSVRow],
          dbField
        );
      }
    });

    // Update timestamp
    merged.updated_at = new Date().toISOString();

    return merged;
  }

  static generateMergePreview(existingRecord: any, newRecord: CompanyCSVRow, options: MergeOptions) {
    const merged = this.mergeCompanies(existingRecord, newRecord, options);
    
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
