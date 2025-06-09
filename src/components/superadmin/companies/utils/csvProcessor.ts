
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
];

export const parseCSV = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const rows = lines.map(line => {
          // Simple CSV parsing - handles basic cases
          const cells: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cells.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          cells.push(current.trim());
          return cells;
        });
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const validateCSVData = (
  rows: string[][],
  mappings: CSVFieldMapping[],
  existingCompanies: Company[]
): CSVProcessingResult => {
  const validRows: Partial<Company>[] = [];
  const errors: CSVValidationError[] = [];
  const duplicates: { row: number; existingCompany: Company; duplicateField: string }[] = [];
  
  const headers = rows[0]?.map(h => h.toLowerCase().trim()) || [];
  const dataRows = rows.slice(1);
  
  dataRows.forEach((row, index) => {
    const rowIndex = index + 2; // +2 because we skip header and arrays are 0-indexed
    const companyData: Partial<Company> = {};
    let hasRequiredFields = true;
    
    // Apply field mappings
    mappings.forEach(mapping => {
      if (mapping.companyField === 'ignore') return;
      
      const csvIndex = headers.findIndex(h => h === mapping.csvColumn.toLowerCase());
      if (csvIndex === -1 && mapping.isRequired) {
        errors.push({
          row: rowIndex,
          field: mapping.companyField,
          value: '',
          error: `Required field '${mapping.csvColumn}' not found in CSV`
        });
        hasRequiredFields = false;
        return;
      }
      
      if (csvIndex >= 0) {
        let value = row[csvIndex]?.trim() || '';
        
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
        
        if (value && mapping.transform) {
          try {
            value = mapping.transform(value);
          } catch (error) {
            errors.push({
              row: rowIndex,
              field: mapping.companyField,
              value,
              error: `Invalid value format for '${mapping.companyField}'`
            });
            return;
          }
        }
        
        if (value) {
          (companyData as any)[mapping.companyField] = value;
        }
      }
    });
    
    // Check for duplicates
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
    
    if (hasRequiredFields) {
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
      errorRows: errors.length,
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
    'founded'
  ];
  
  const sampleData = [
    'Acme Corporation,contact@acme.com,https://acme.com,Technology,51-200,New York,+1-555-0123,Leading technology solutions provider,2010',
    'Global Industries,info@global.com,https://global.com,Manufacturing,201-500,California,+1-555-0456,International manufacturing company,2005'
  ];
  
  return [headers.join(','), ...sampleData].join('\n');
};
