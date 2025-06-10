import { Company } from '@/hooks/useCompanies';
import Papa from 'papaparse';

export interface CSVRow {
  name: string;
  email?: string;
  website?: string;
  phone?: string;
  location?: string;
  size?: string;
  description?: string;
  industry1?: string;
  industry2?: string;
  industry3?: string;
  companysector?: string;
  companytype?: string;
  entitytype?: string;
  founded?: string; // Keep as string for CSV compatibility
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  [key: string]: any;
}

export interface CSVProcessingResult {
  validRows: Partial<Company>[];
  errors: Array<{ row: number; message: string; data?: any; field?: string; value?: string }>;
  duplicates: Array<{ row: number; existingCompany: Company; duplicateField: string }>;
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    duplicateRows: number;
  };
}

export interface CSVFieldMapping {
  csvColumn: string;
  companyField: keyof Company | 'ignore';
  isRequired: boolean;
}

export interface BulkImportProgress {
  stage: 'parsing' | 'validating' | 'importing' | 'complete';
  progress: number;
  message: string;
  currentRow?: number;
  totalRows?: number;
}

// Field mapping for CSV headers to company properties
export const fieldMappings: Record<string, keyof Company | 'ignore'> = {
  'company name': 'name',
  'name': 'name',
  'company': 'name',
  'email': 'email',
  'business email': 'email',
  'company email': 'email',
  'website': 'website',
  'domain': 'website',
  'url': 'website',
  'phone': 'phone',
  'telephone': 'phone',
  'contact number': 'phone',
  'location': 'location',
  'address': 'location',
  'city': 'location',
  'size': 'size',
  'company size': 'size',
  'employees': 'size',
  'description': 'description',
  'about': 'description',
  'industry': 'industry1',
  'industry1': 'industry1',
  'primary industry': 'industry1',
  'industry2': 'industry2',
  'secondary industry': 'industry2',
  'industry3': 'industry3',
  'tertiary industry': 'industry3',
  'sector': 'companysector',
  'company sector': 'companysector',
  'type': 'companytype',
  'company type': 'companytype',
  'entity type': 'entitytype',
  'legal entity': 'entitytype',
  'founded': 'founded',
  'established': 'founded',
  'year founded': 'founded',
  'linkedin': 'linkedin',
  'linkedin url': 'linkedin',
  'twitter': 'twitter',
  'twitter url': 'twitter',
  'facebook': 'facebook',
  'facebook url': 'facebook',
  'cin': 'cin',
  'company identification': 'cin',
  'status': 'companystatus',
  'company status': 'companystatus'
};

export const defaultFieldMappings: CSVFieldMapping[] = [
  { csvColumn: 'name', companyField: 'name', isRequired: true },
  { csvColumn: 'email', companyField: 'email', isRequired: false },
  { csvColumn: 'website', companyField: 'website', isRequired: false },
  { csvColumn: 'phone', companyField: 'phone', isRequired: false },
  { csvColumn: 'location', companyField: 'location', isRequired: false },
  { csvColumn: 'size', companyField: 'size', isRequired: false },
  { csvColumn: 'description', companyField: 'description', isRequired: false },
  { csvColumn: 'industry1', companyField: 'industry1', isRequired: false },
  { csvColumn: 'industry2', companyField: 'industry2', isRequired: false },
  { csvColumn: 'industry3', companyField: 'industry3', isRequired: false },
];

export function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

export function mapCSVRowToCompany(csvRow: any, mappings: CSVFieldMapping[]): Partial<Company> | null {
  const company: Partial<Company> = {};
  let hasRequiredField = false;

  mappings.forEach(mapping => {
    if (mapping.companyField === 'ignore') return;
    
    const value = csvRow[mapping.csvColumn];
    if (value && value.toString().trim()) {
      const trimmedValue = value.toString().trim();
      
      // Handle founded year conversion
      if (mapping.companyField === 'founded') {
        const foundedYear = parseInt(trimmedValue);
        if (!isNaN(foundedYear) && foundedYear > 1800 && foundedYear <= new Date().getFullYear()) {
          (company as any)[mapping.companyField] = foundedYear;
        }
      } else {
        (company as any)[mapping.companyField] = trimmedValue;
      }
      
      if (mapping.companyField === 'name') {
        hasRequiredField = true;
      }
    }
  });

  return hasRequiredField ? company : null;
}

export function validateCompanyData(company: Partial<Company>): string[] {
  const errors: string[] = [];

  // Required field validation
  if (!company.name || company.name.trim().length === 0) {
    errors.push('Company name is required');
  }

  // Email validation
  if (company.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(company.email)) {
      errors.push('Invalid email format');
    }
  }

  // Website validation
  if (company.website) {
    try {
      new URL(company.website);
    } catch {
      // Try adding protocol if missing
      try {
        new URL(`https://${company.website}`);
        company.website = `https://${company.website}`;
      } catch {
        errors.push('Invalid website URL');
      }
    }
  }

  // Phone validation (basic)
  if (company.phone) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{7,}$/;
    if (!phoneRegex.test(company.phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }
  }

  return errors;
}

export function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as string[][]);
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

export function validateCSVData(
  csvData: string[][],
  mappings: CSVFieldMapping[],
  existingCompanies: Company[]
): CSVProcessingResult {
  const validRows: Partial<Company>[] = [];
  const errors: Array<{ row: number; message: string; data?: any; field?: string; value?: string }> = [];
  const duplicates: Array<{ row: number; existingCompany: Company; duplicateField: string }> = [];
  
  if (csvData.length === 0) {
    return {
      validRows: [],
      errors: [{ row: 0, message: 'No data found in CSV file' }],
      duplicates: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, duplicateRows: 0 }
    };
  }

  const headers = csvData[0];
  const dataRows = csvData.slice(1);
  const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase().trim()));
  const existingEmails = new Set(existingCompanies.filter(c => c.email).map(c => c.email!.toLowerCase().trim()));

  dataRows.forEach((row, index) => {
    try {
      const csvRowObject: any = {};
      headers.forEach((header, i) => {
        csvRowObject[header] = row[i] || '';
      });

      const company = mapCSVRowToCompany(csvRowObject, mappings);
      if (!company) {
        errors.push({
          row: index + 2, // +2 because we skip header and arrays are 0-indexed
          message: 'Missing required field: Company name',
          data: csvRowObject
        });
        return;
      }

      const validationErrors = validateCompanyData(company);
      if (validationErrors.length > 0) {
        errors.push({
          row: index + 2,
          message: validationErrors.join(', '),
          data: csvRowObject
        });
        return;
      }

      // Check for duplicates
      const isDuplicateName = company.name && existingNames.has(company.name.toLowerCase().trim());
      const isDuplicateEmail = company.email && existingEmails.has(company.email.toLowerCase().trim());

      if (isDuplicateName || isDuplicateEmail) {
        const existingCompany = existingCompanies.find(c => 
          (company.name && c.name.toLowerCase().trim() === company.name.toLowerCase().trim()) ||
          (company.email && c.email?.toLowerCase().trim() === company.email.toLowerCase().trim())
        );
        
        if (existingCompany) {
          duplicates.push({
            row: index + 2,
            existingCompany,
            duplicateField: isDuplicateName ? 'name' : 'email'
          });
          return;
        }
      }

      validRows.push(company);
    } catch (error) {
      errors.push({
        row: index + 2,
        message: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: row
      });
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
}

export function generateCSVTemplate(): string {
  const headers = [
    'name',
    'email',
    'website',
    'phone',
    'location',
    'size',
    'industry1',
    'industry2',
    'industry3',
    'description',
    'founded',
    'linkedin',
    'twitter',
    'facebook'
  ];

  const sampleRows = [
    [
      'Tech Innovations Ltd',
      'contact@techinnovations.com',
      'https://techinnovations.com',
      '+1-555-0123',
      'San Francisco, CA',
      'Medium',
      'Technology',
      'Software Development',
      'Enterprise Software',
      'Leading provider of innovative software solutions',
      '2015',
      'https://linkedin.com/company/tech-innovations',
      'https://twitter.com/techinnovations',
      'https://facebook.com/techinnovations'
    ]
  ];

  return Papa.unparse([headers, ...sampleRows]);
}

export function categorizeErrors(errors: Array<{ row: number; message: string; field?: string; value?: string }>) {
  const categories = {
    validation: errors.filter(e => e.message.includes('Invalid')),
    missing: errors.filter(e => e.message.includes('required')),
    processing: errors.filter(e => e.message.includes('Processing error'))
  };
  
  return categories;
}

export function createProgressTracker(totalRows: number) {
  return {
    updateProgress: (currentRow: number) => ({
      progress: (currentRow / totalRows) * 100,
      message: `Processing row ${currentRow} of ${totalRows}...`
    })
  };
}

export function detectDuplicatesWithExisting(
  csvRows: Partial<Company>[],
  existingCompanies: Company[]
): { duplicateRows: Partial<Company>[]; uniqueRows: Partial<Company>[] } {
  const existingNames = new Set(
    existingCompanies.map(company => company.name.toLowerCase().trim())
  );
  
  const existingEmails = new Set(
    existingCompanies
      .filter(company => company.email)
      .map(company => company.email!.toLowerCase().trim())
  );

  const duplicateRows: Partial<Company>[] = [];
  const uniqueRows: Partial<Company>[] = [];

  csvRows.forEach(row => {
    const isDuplicateName = row.name && existingNames.has(row.name.toLowerCase().trim());
    const isDuplicateEmail = row.email && existingEmails.has(row.email.toLowerCase().trim());

    if (isDuplicateName || isDuplicateEmail) {
      duplicateRows.push(row);
    } else {
      uniqueRows.push(row);
    }
  });

  return { duplicateRows, uniqueRows };
}
