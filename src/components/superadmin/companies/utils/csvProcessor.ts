
import { Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';

export interface CSVFieldMapping {
  csvColumn: string;
  companyField: keyof Company | 'ignore';
  isRequired: boolean;
  transform?: (value: string) => any;
}

export interface CSVValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface CSVProcessingResult {
  validRows: Partial<Company>[];
  errors: CSVValidationError[];
  duplicates: { row: number; existingCompany: Company; duplicateField: string }[];
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    duplicateRows: number;
  };
}

export interface BulkImportProgress {
  stage: 'parsing' | 'validating' | 'checking-duplicates' | 'importing' | 'complete';
  progress: number;
  currentRow?: number;
  totalRows?: number;
  message: string;
}

export const defaultFieldMappings: CSVFieldMapping[] = [
  { csvColumn: 'name', companyField: 'name', isRequired: true },
  { csvColumn: 'company_name', companyField: 'name', isRequired: true },
  { csvColumn: 'email', companyField: 'email', isRequired: false },
  { csvColumn: 'website', companyField: 'website', isRequired: false },
  { csvColumn: 'domain', companyField: 'domain', isRequired: false },
  { csvColumn: 'industry', companyField: 'industry', isRequired: false },
  { csvColumn: 'size', companyField: 'size', isRequired: false },
  { csvColumn: 'location', companyField: 'location', isRequired: false },
  { csvColumn: 'phone', companyField: 'phone', isRequired: false },
  { csvColumn: 'description', companyField: 'description', isRequired: false },
  { csvColumn: 'founded', companyField: 'founded', isRequired: false, transform: (value) => value ? parseInt(value) : null },
  // Extended fields for tenant-specific data
  { csvColumn: 'cin', companyField: 'cin', isRequired: false },
  { csvColumn: 'registered_office_address', companyField: 'registeredOfficeAddress', isRequired: false },
  { csvColumn: 'country', companyField: 'country', isRequired: false },
  { csvColumn: 'region', companyField: 'region', isRequired: false },
  { csvColumn: 'industry1', companyField: 'industry1', isRequired: false },
  { csvColumn: 'company_type', companyField: 'companyType', isRequired: false },
  { csvColumn: 'entity_type', companyField: 'entityType', isRequired: false },
  { csvColumn: 'no_of_employees', companyField: 'noOfEmployee', isRequired: false },
  { csvColumn: 'turnover', companyField: 'turnover', isRequired: false },
  { csvColumn: 'company_profile', companyField: 'companyProfile', isRequired: false },
];

// Enhanced CSV parsing with better error handling
export const parseCSV = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      reject(new Error('File must be a CSV file'));
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      reject(new Error('File size too large. Maximum size is 50MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text.trim()) {
          reject(new Error('File is empty'));
          return;
        }

        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          reject(new Error('CSV must have at least a header row and one data row'));
          return;
        }

        const rows = lines.map((line, lineIndex) => {
          const cells: string[] = [];
          let current = '';
          let inQuotes = false;
          let quoteCount = 0;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              quoteCount++;
              if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              cells.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          // Add the last cell
          cells.push(current.trim());
          
          // Validate quote matching
          if (quoteCount % 2 !== 0) {
            throw new Error(`Unmatched quotes in line ${lineIndex + 1}`);
          }
          
          return cells;
        });

        // Validate header row
        const headers = rows[0];
        if (headers.length === 0 || headers.every(h => !h.trim())) {
          reject(new Error('CSV header row is empty or invalid'));
          return;
        }

        resolve(rows);
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'utf-8');
  });
};

// Enhanced validation with business rules
export const validateCSVData = (
  rows: string[][],
  mappings: CSVFieldMapping[],
  existingCompanies: Company[]
): CSVProcessingResult => {
  const validRows: Partial<Company>[] = [];
  const errors: CSVValidationError[] = [];
  const duplicates: { row: number; existingCompany: Company; duplicateField: string }[] = [];
  
  if (rows.length === 0) {
    return {
      validRows: [],
      errors: [{ row: 0, field: 'file', value: '', error: 'CSV file is empty' }],
      duplicates: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, duplicateRows: 0 }
    };
  }

  const headers = rows[0]?.map(h => h.toLowerCase().trim()) || [];
  const dataRows = rows.slice(1);
  
  if (headers.length === 0) {
    return {
      validRows: [],
      errors: [{ row: 1, field: 'headers', value: '', error: 'No headers found in CSV' }],
      duplicates: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, duplicateRows: 0 }
    };
  }

  // Track names within the CSV for internal duplicates
  const csvNames = new Map<string, number>();
  const csvEmails = new Map<string, number>();
  
  dataRows.forEach((row, index) => {
    const rowIndex = index + 2; // +2 because we skip header and arrays are 0-indexed
    const companyData: Partial<Company> = {};
    let hasRequiredFields = true;
    let hasAnyData = false;
    
    // Check if row has any data
    if (row.every(cell => !cell.trim())) {
      errors.push({
        row: rowIndex,
        field: 'row',
        value: '',
        error: 'Empty row - skipping'
      });
      return;
    }
    
    // Apply field mappings
    mappings.forEach(mapping => {
      if (mapping.companyField === 'ignore') return;
      
      const csvIndex = headers.findIndex(h => h === mapping.csvColumn.toLowerCase());
      if (csvIndex === -1) {
        if (mapping.isRequired) {
          errors.push({
            row: rowIndex,
            field: mapping.companyField,
            value: '',
            error: `Required column '${mapping.csvColumn}' not found in CSV headers`
          });
          hasRequiredFields = false;
        }
        return;
      }
      
      let value = row[csvIndex]?.trim() || '';
      
      // Check required fields
      if (mapping.isRequired && !value) {
        errors.push({
          row: rowIndex,
          field: mapping.companyField,
          value,
          error: `Required field '${mapping.companyField}' is empty`
        });
        hasRequiredFields = false;
        return;
      }
      
      if (value) {
        hasAnyData = true;
        
        // Apply transformations
        if (mapping.transform) {
          try {
            value = mapping.transform(value);
          } catch (error) {
            errors.push({
              row: rowIndex,
              field: mapping.companyField,
              value,
              error: `Invalid value format for '${mapping.companyField}': ${error instanceof Error ? error.message : 'transformation failed'}`
            });
            return;
          }
        }
        
        // Business rule validations
        if (mapping.companyField === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              row: rowIndex,
              field: mapping.companyField,
              value,
              error: 'Invalid email format'
            });
            return;
          }
        }
        
        if (mapping.companyField === 'website' && value) {
          try {
            new URL(value.startsWith('http') ? value : `https://${value}`);
          } catch {
            errors.push({
              row: rowIndex,
              field: mapping.companyField,
              value,
              error: 'Invalid website URL format'
            });
            return;
          }
        }
        
        if (mapping.companyField === 'founded' && value) {
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (isNaN(year) || year < 1800 || year > currentYear) {
            errors.push({
              row: rowIndex,
              field: mapping.companyField,
              value,
              error: `Invalid founding year. Must be between 1800 and ${currentYear}`
            });
            return;
          }
        }
        
        (companyData as any)[mapping.companyField] = value;
      }
    });
    
    if (!hasAnyData) {
      return; // Skip completely empty rows
    }
    
    // Check for duplicates within CSV
    if (companyData.name) {
      const nameKey = companyData.name.toLowerCase();
      if (csvNames.has(nameKey)) {
        errors.push({
          row: rowIndex,
          field: 'name',
          value: companyData.name,
          error: `Duplicate company name found in CSV at row ${csvNames.get(nameKey)}`
        });
      } else {
        csvNames.set(nameKey, rowIndex);
      }
    }
    
    if (companyData.email) {
      const emailKey = companyData.email.toLowerCase();
      if (csvEmails.has(emailKey)) {
        errors.push({
          row: rowIndex,
          field: 'email',
          value: companyData.email,
          error: `Duplicate email found in CSV at row ${csvEmails.get(emailKey)}`
        });
      } else {
        csvEmails.set(emailKey, rowIndex);
      }
    }
    
    // Check for duplicates against existing companies
    if (hasRequiredFields && companyData.name) {
      const duplicateByName = existingCompanies.find(
        c => c.name.toLowerCase() === companyData.name?.toLowerCase()
      );
      if (duplicateByName) {
        duplicates.push({
          row: rowIndex,
          existingCompany: duplicateByName,
          duplicateField: 'name'
        });
      }
      
      if (companyData.email) {
        const duplicateByEmail = existingCompanies.find(
          c => c.email?.toLowerCase() === companyData.email?.toLowerCase()
        );
        if (duplicateByEmail && duplicateByEmail.id !== duplicateByName?.id) {
          duplicates.push({
            row: rowIndex,
            existingCompany: duplicateByEmail,
            duplicateField: 'email'
          });
        }
      }
    }
    
    if (hasRequiredFields && hasAnyData) {
      validRows.push(companyData);
    }
  });
  
  return {
    validRows,
    errors,
    duplicates,
    summary: {
      totalRows: dataRows.length,
      validRows: validRows.length,
      errorRows: errors.filter(e => e.field !== 'row').length, // Exclude empty row errors
      duplicateRows: duplicates.length
    }
  };
};

export const generateCSVTemplate = (): string => {
  const headers = [
    'name',
    'email',
    'website',
    'industry',
    'size',
    'location',
    'phone',
    'description',
    'founded',
    'cin',
    'registered_office_address',
    'country',
    'region',
    'industry1',
    'company_type',
    'entity_type',
    'no_of_employees',
    'turnover',
    'company_profile'
  ];
  
  const sampleData = [
    'Acme Corporation,contact@acme.com,https://acme.com,Technology,51-200,New York,+1-555-0123,Leading technology solutions provider,2010,U12345ABC2010PLC123456,123 Tech Street New York NY 10001,United States,North America,Information Technology,Private Limited,Private,150,5000000,Technology consulting and software development',
    'Global Industries,info@global.com,https://global.com,Manufacturing,201-500,California,+1-555-0456,International manufacturing company,2005,U67890DEF2005PLC789012,456 Industrial Ave Los Angeles CA 90001,United States,North America,Manufacturing,Public Limited,Public,350,25000000,Industrial equipment and machinery manufacturing'
  ];
  
  return [headers.join(','), ...sampleData].join('\n');
};

// Enhanced error categorization
export const categorizeErrors = (errors: CSVValidationError[]) => {
  const categories = {
    required: errors.filter(e => e.error.includes('Required')),
    format: errors.filter(e => e.error.includes('Invalid') || e.error.includes('format')),
    duplicate: errors.filter(e => e.error.includes('Duplicate')),
    business: errors.filter(e => e.error.includes('year') || e.error.includes('rule')),
    other: errors.filter(e => !e.error.includes('Required') && !e.error.includes('Invalid') && !e.error.includes('Duplicate') && !e.error.includes('year'))
  };
  
  return categories;
};

// Export progress tracking utility
export const createProgressTracker = (totalItems: number) => {
  let completed = 0;
  
  return {
    increment: () => {
      completed++;
      return {
        completed,
        total: totalItems,
        percentage: Math.round((completed / totalItems) * 100)
      };
    },
    getProgress: () => ({
      completed,
      total: totalItems,
      percentage: Math.round((completed / totalItems) * 100)
    })
  };
};
