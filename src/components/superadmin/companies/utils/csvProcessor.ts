
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
  companySector?: string;
  companyType?: string;
  entityType?: string;
  founded?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  [key: string]: any;
}

export interface CSVParseResult {
  validRows: CSVRow[];
  errors: Array<{ row: number; message: string; data?: any }>;
  duplicates: CSVRow[];
  summary: {
    totalRows: number;
    validRows: number;
    errors: number;
    duplicates: number;
  };
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
  'sector': 'companySector',
  'company sector': 'companySector',
  'type': 'companyType',
  'company type': 'companyType',
  'entity type': 'entityType',
  'legal entity': 'entityType',
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
  'status': 'companyStatus',
  'company status': 'companyStatus'
};

export function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

export function mapCSVRowToCompany(csvRow: any, headers: string[]): Partial<Company> | null {
  const company: Partial<Company> = {};
  let hasRequiredField = false;

  headers.forEach(header => {
    const normalizedHeader = normalizeHeader(header);
    const mappedField = fieldMappings[normalizedHeader];
    
    if (mappedField && mappedField !== 'ignore') {
      const value = csvRow[header];
      if (value && value.toString().trim()) {
        (company as any)[mappedField] = value.toString().trim();
        if (mappedField === 'name') {
          hasRequiredField = true;
        }
      }
    }
  });

  // Convert founded year to number if present
  if (company.founded) {
    const foundedYear = parseInt(company.founded.toString());
    if (!isNaN(foundedYear) && foundedYear > 1800 && foundedYear <= new Date().getFullYear()) {
      company.founded = foundedYear;
    } else {
      delete company.founded;
    }
  }

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

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        const validRows: CSVRow[] = [];
        const errors: Array<{ row: number; message: string; data?: any }> = [];
        const duplicates: CSVRow[] = [];
        const seenCompanies = new Set<string>();

        results.data.forEach((row: any, index: number) => {
          try {
            const headers = Object.keys(row);
            const company = mapCSVRowToCompany(row, headers);

            if (!company) {
              errors.push({
                row: index + 1,
                message: 'Missing required field: Company name',
                data: row
              });
              return;
            }

            const validationErrors = validateCompanyData(company);
            if (validationErrors.length > 0) {
              errors.push({
                row: index + 1,
                message: validationErrors.join(', '),
                data: row
              });
              return;
            }

            // Check for duplicates based on name
            const companyKey = company.name!.toLowerCase().trim();
            if (seenCompanies.has(companyKey)) {
              duplicates.push(company as CSVRow);
              return;
            }

            seenCompanies.add(companyKey);
            validRows.push(company as CSVRow);

          } catch (error) {
            errors.push({
              row: index + 1,
              message: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              data: row
            });
          }
        });

        resolve({
          validRows,
          errors,
          duplicates,
          summary: {
            totalRows: results.data.length,
            validRows: validRows.length,
            errors: errors.length,
            duplicates: duplicates.length
          }
        });
      },
      error: (error) => {
        resolve({
          validRows: [],
          errors: [{ row: 0, message: `CSV parsing error: ${error.message}` }],
          duplicates: [],
          summary: {
            totalRows: 0,
            validRows: 0,
            errors: 1,
            duplicates: 0
          }
        });
      }
    });
  });
}

export function detectDuplicatesWithExisting(
  csvRows: CSVRow[],
  existingCompanies: Company[]
): { duplicateRows: CSVRow[]; uniqueRows: CSVRow[] } {
  const existingNames = new Set(
    existingCompanies.map(company => company.name.toLowerCase().trim())
  );
  
  const existingEmails = new Set(
    existingCompanies
      .filter(company => company.email)
      .map(company => company.email!.toLowerCase().trim())
  );

  const duplicateRows: CSVRow[] = [];
  const uniqueRows: CSVRow[] = [];

  csvRows.forEach(row => {
    const isDuplicateName = existingNames.has(row.name.toLowerCase().trim());
    const isDuplicateEmail = row.email && existingEmails.has(row.email.toLowerCase().trim());

    if (isDuplicateName || isDuplicateEmail) {
      duplicateRows.push(row);
    } else {
      uniqueRows.push(row);
    }
  });

  return { duplicateRows, uniqueRows };
}

export function generateSampleCSV(): string {
  const headers = [
    'Company Name',
    'Email',
    'Website',
    'Phone',
    'Location',
    'Size',
    'Primary Industry',
    'Secondary Industry',
    'Company Sector',
    'Company Type',
    'Founded',
    'LinkedIn',
    'Description'
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
      'Private',
      'Corporation',
      '2015',
      'https://linkedin.com/company/tech-innovations',
      'Leading provider of innovative software solutions'
    ],
    [
      'Global Manufacturing Corp',
      'info@globalmanufacturing.com',
      'https://globalmanufacturing.com',
      '+1-555-0456',
      'Detroit, MI',
      'Large',
      'Manufacturing',
      'Automotive',
      'Public',
      'Corporation',
      '1987',
      'https://linkedin.com/company/global-manufacturing',
      'Automotive parts manufacturer serving global markets'
    ]
  ];

  return Papa.unparse([headers, ...sampleRows]);
}
