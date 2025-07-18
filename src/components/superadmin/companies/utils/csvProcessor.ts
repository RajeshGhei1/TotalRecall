import { Company } from '@/hooks/useCompanies';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface CSVRow {
  name: string;
  email?: string;
  website?: string;
  domain?: string;
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
  founded?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  cin?: string;
  registeredofficeaddress?: string;
  country?: string;
  globalregion?: string;
  region?: string;
  holocation?: string;
  noofemployee?: string;
  segmentaspernumberofemployees?: string;
  turnover?: string;
  segmentasperturnover?: string;
  turnoveryear?: string;
  yearofestablishment?: string;
  paidupcapital?: string;
  segmentasperpaidupcapital?: string;
  companyprofile?: string;
  areaofspecialize?: string;
  serviceline?: string;
  verticles?: string;
  registrationdate?: string;
  registeredemailaddress?: string;
  noofdirectives?: string;
  companystatus?: string;
  parent_company_id?: string;
  company_group_name?: string;
  hierarchy_level?: string;
  // Branch office fields (up to 5 branch offices)
  branch_office_1_name?: string;
  branch_office_1_type?: string;
  branch_office_1_address?: string;
  branch_office_1_city?: string;
  branch_office_1_state?: string;
  branch_office_1_country?: string;
  branch_office_1_postal_code?: string;
  branch_office_1_phone?: string;
  branch_office_1_email?: string;
  branch_office_1_gst_number?: string;
  branch_office_1_is_headquarters?: string;
  branch_office_1_is_active?: string;
  [key: string]: unknown;
}

export interface BranchOfficeData {
  branch_name: string;
  branch_type: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
  is_headquarters?: boolean;
  is_active?: boolean;
}

export interface CSVProcessingResult {
  validRows: Partial<Company>[];
  branchOfficesData: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }>;
  errors: Array<{ row: number; message: string; data?: Record<string, unknown>; field?: string; value?: string }>;
  duplicates: Array<{ row: number; existingCompany: Company; duplicateField: string }>;
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    duplicateRows: number;
    totalBranchOffices: number;
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

// Comprehensive field mapping for CSV headers to company properties
export const fieldMappings: Record<string, keyof Company | 'ignore'> = {
  // Basic Information
  'company name': 'name',
  'name': 'name',
  'company': 'name',
  'organization': 'name',
  'email': 'email',
  'contact email': 'email',
  'company email': 'email',
  'registered email': 'registeredemailaddress',
  'website': 'website',
  'web site': 'website',
  'domain': 'domain',
  'web domain': 'domain',
  'url': 'website',
  'web address': 'website',
  'phone': 'phone',
  'telephone': 'phone',
  'contact number': 'phone',
  'mobile': 'phone',
  'description': 'description',
  'about': 'description',
  'company description': 'description',
  'overview': 'description',
  
  // Location & Address
  'location': 'location',
  'address': 'location',
  'city': 'location',
  'headquarters': 'location',
  'hq': 'location',
  'registered office': 'registeredofficeaddress',
  'registered address': 'registeredofficeaddress',
  'office address': 'registeredofficeaddress',
  'country': 'country',
  'nation': 'country',
  'global region': 'globalregion',
  'region': 'region',
  'state': 'region',
  'ho location': 'holocation',
  'head office location': 'holocation',
  
  // Industry & Classification
  'industry': 'industry1',
  'industry1': 'industry1',
  'primary industry': 'industry1',
  'main industry': 'industry1',
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
  'entity': 'entitytype',
  
  // Business Details
  'size': 'size',
  'company size': 'size',
  'employees': 'noofemployee',
  'no of employees': 'noofemployee',
  'employee count': 'noofemployee',
  'staff count': 'noofemployee',
  'workforce': 'noofemployee',
  'employee segment': 'segmentaspernumberofemployees',
  'revenue': 'turnover',
  'turnover': 'turnover',
  'annual revenue': 'turnover',
  'sales': 'turnover',
  'income': 'turnover',
  'revenue segment': 'segmentasperturnover',
  'turnover segment': 'segmentasperturnover',
  'turnover year': 'turnoveryear',
  'revenue year': 'turnoveryear',
  'paid up capital': 'paidupcapital',
  'capital': 'paidupcapital',
  'share capital': 'paidupcapital',
  'capital segment': 'segmentasperpaidupcapital',
  
  // Dates & Establishment
  'founded': 'founded',
  'established': 'founded',
  'year founded': 'founded',
  'inception': 'founded',
  'year of establishment': 'yearofestablishment',
  'establishment year': 'yearofestablishment',
  'registration date': 'registrationdate',
  'incorporated': 'registrationdate',
  
  // Legal & Registration
  'cin': 'cin',
  'company identification': 'cin',
  'corporate identification': 'cin',
  'registration number': 'cin',
  'company number': 'cin',
  'status': 'companystatus',
  'company status': 'companystatus',
  'legal status': 'companystatus',
  'no of directors': 'noofdirectives',
  'directors count': 'noofdirectives',
  'board size': 'noofdirectives',
  
  // Business Profile
  'company profile': 'companyprofile',
  'profile': 'companyprofile',
  'area of specialization': 'areaofspecialize',
  'specialization': 'areaofspecialize',
  'expertise': 'areaofspecialize',
  'service line': 'serviceline',
  'services': 'serviceline',
  'offerings': 'serviceline',
  'verticals': 'verticles',
  'markets': 'verticles',
  
  // Social Media
  'linkedin': 'linkedin',
  'linkedin url': 'linkedin',
  'linkedin profile': 'linkedin',
  'twitter': 'twitter',
  'twitter url': 'twitter',
  'twitter handle': 'twitter',
  'facebook': 'facebook',
  'facebook url': 'facebook',
  'facebook page': 'facebook',
  
  // Hierarchy
  'parent company': 'parent_company_id',
  'parent': 'parent_company_id',
  'holding company': 'parent_company_id',
  'company group': 'company_group_name',
  'group name': 'company_group_name',
  'hierarchy level': 'hierarchy_level',
  'level': 'hierarchy_level'
};

export const defaultFieldMappings: CSVFieldMapping[] = [
  // Required fields
  { csvColumn: 'name', companyField: 'name', isRequired: true },
  { csvColumn: 'cin', companyField: 'cin', isRequired: true },
  
  // Basic Information (optional)
  { csvColumn: 'email', companyField: 'email', isRequired: false },
  { csvColumn: 'website', companyField: 'website', isRequired: false },
  { csvColumn: 'domain', companyField: 'domain', isRequired: false },
  { csvColumn: 'phone', companyField: 'phone', isRequired: false },
  { csvColumn: 'description', companyField: 'description', isRequired: false },
  { csvColumn: 'founded', companyField: 'founded', isRequired: false },
  
  // Location & Address
  { csvColumn: 'location', companyField: 'location', isRequired: false },
  { csvColumn: 'registeredofficeaddress', companyField: 'registeredofficeaddress', isRequired: false },
  { csvColumn: 'country', companyField: 'country', isRequired: false },
  { csvColumn: 'globalregion', companyField: 'globalregion', isRequired: false },
  { csvColumn: 'region', companyField: 'region', isRequired: false },
  { csvColumn: 'holocation', companyField: 'holocation', isRequired: false },
  
  // Industry & Classification
  { csvColumn: 'industry1', companyField: 'industry1', isRequired: false },
  { csvColumn: 'industry2', companyField: 'industry2', isRequired: false },
  { csvColumn: 'industry3', companyField: 'industry3', isRequired: false },
  { csvColumn: 'companysector', companyField: 'companysector', isRequired: false },
  { csvColumn: 'companytype', companyField: 'companytype', isRequired: false },
  { csvColumn: 'entitytype', companyField: 'entitytype', isRequired: false },
  
  // Business Details
  { csvColumn: 'size', companyField: 'size', isRequired: false },
  { csvColumn: 'noofemployee', companyField: 'noofemployee', isRequired: false },
  { csvColumn: 'segmentaspernumberofemployees', companyField: 'segmentaspernumberofemployees', isRequired: false },
  { csvColumn: 'turnover', companyField: 'turnover', isRequired: false },
  { csvColumn: 'segmentasperturnover', companyField: 'segmentasperturnover', isRequired: false },
  { csvColumn: 'turnoveryear', companyField: 'turnoveryear', isRequired: false },
  { csvColumn: 'yearofestablishment', companyField: 'yearofestablishment', isRequired: false },
  { csvColumn: 'paidupcapital', companyField: 'paidupcapital', isRequired: false },
  { csvColumn: 'segmentasperpaidupcapital', companyField: 'segmentasperpaidupcapital', isRequired: false },
  
  // Legal & Registration
  { csvColumn: 'companystatus', companyField: 'companystatus', isRequired: false },
  { csvColumn: 'registrationdate', companyField: 'registrationdate', isRequired: false },
  { csvColumn: 'registeredemailaddress', companyField: 'registeredemailaddress', isRequired: false },
  { csvColumn: 'noofdirectives', companyField: 'noofdirectives', isRequired: false },
  
  // Business Profile
  { csvColumn: 'companyprofile', companyField: 'companyprofile', isRequired: false },
  { csvColumn: 'areaofspecialize', companyField: 'areaofspecialize', isRequired: false },
  { csvColumn: 'serviceline', companyField: 'serviceline', isRequired: false },
  { csvColumn: 'verticles', companyField: 'verticles', isRequired: false },
  
  // Social Media
  { csvColumn: 'linkedin', companyField: 'linkedin', isRequired: false },
  { csvColumn: 'twitter', companyField: 'twitter', isRequired: false },
  { csvColumn: 'facebook', companyField: 'facebook', isRequired: false },
  
  // Hierarchy
  { csvColumn: 'parent_company_id', companyField: 'parent_company_id', isRequired: false },
  { csvColumn: 'company_group_name', companyField: 'company_group_name', isRequired: false },
  { csvColumn: 'hierarchy_level', companyField: 'hierarchy_level', isRequired: false }
];

export function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

export function extractBranchOfficesFromRow(csvRow: unknown): BranchOfficeData[] {
  const branchOffices: BranchOfficeData[] = [];
  
  // Support up to 5 branch offices per company
  for (let i = 1; i <= 5; i++) {
    const branchName = csvRow[`branch_office_${i}_name`] || csvRow[`branch_${i}_name`] || csvRow[`office_${i}_name`];
    const branchType = csvRow[`branch_office_${i}_type`] || csvRow[`branch_${i}_type`] || csvRow[`office_${i}_type`];
    
    if (branchName && branchType) {
      const branchOffice: BranchOfficeData = {
        branch_name: branchName.toString().trim(),
        branch_type: branchType.toString().trim(),
        address: csvRow[`branch_office_${i}_address`] || csvRow[`branch_${i}_address`] || csvRow[`office_${i}_address`] || '',
        city: csvRow[`branch_office_${i}_city`] || csvRow[`branch_${i}_city`] || csvRow[`office_${i}_city`] || '',
        state: csvRow[`branch_office_${i}_state`] || csvRow[`branch_${i}_state`] || csvRow[`office_${i}_state`] || '',
        country: csvRow[`branch_office_${i}_country`] || csvRow[`branch_${i}_country`] || csvRow[`office_${i}_country`] || '',
        postal_code: csvRow[`branch_office_${i}_postal_code`] || csvRow[`branch_${i}_postal_code`] || csvRow[`office_${i}_postal_code`] || '',
        phone: csvRow[`branch_office_${i}_phone`] || csvRow[`branch_${i}_phone`] || csvRow[`office_${i}_phone`] || '',
        email: csvRow[`branch_office_${i}_email`] || csvRow[`branch_${i}_email`] || csvRow[`office_${i}_email`] || '',
        gst_number: csvRow[`branch_office_${i}_gst_number`] || csvRow[`branch_${i}_gst_number`] || csvRow[`office_${i}_gst_number`] || '',
        is_headquarters: (csvRow[`branch_office_${i}_is_headquarters`] || csvRow[`branch_${i}_is_headquarters`] || csvRow[`office_${i}_is_headquarters`] || 'false').toString().toLowerCase() === 'true',
        is_active: (csvRow[`branch_office_${i}_is_active`] || csvRow[`branch_${i}_is_active`] || csvRow[`office_${i}_is_active`] || 'true').toString().toLowerCase() === 'true'
      };
      
      branchOffices.push(branchOffice);
    }
  }
  
  return branchOffices;
}

export function validateBranchOfficeData(branchOffice: BranchOfficeData): string[] {
  const errors: string[] = [];
  
  if (!branchOffice.branch_name || branchOffice.branch_name.trim().length === 0) {
    errors.push('Branch office name is required');
  }
  
  if (!branchOffice.branch_type || branchOffice.branch_type.trim().length === 0) {
    errors.push('Branch office type is required');
  }
  
  // Email validation for branch office
  if (branchOffice.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(branchOffice.email)) {
      errors.push('Invalid branch office email format');
    }
  }
  
  // Phone validation for branch office
  if (branchOffice.phone) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{7,}$/;
    if (!phoneRegex.test(branchOffice.phone.replace(/\s/g, ''))) {
      errors.push('Invalid branch office phone number format');
    }
  }
  
  return errors;
}

export function mapCSVRowToCompany(csvRow: unknown, mappings: CSVFieldMapping[]): Partial<Company> | null {
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
          (company as unknown)[mapping.companyField] = foundedYear;
        }
      } else if (mapping.companyField === 'hierarchy_level') {
        // Handle hierarchy level as integer
        const level = parseInt(trimmedValue);
        if (!isNaN(level) && level >= 0) {
          (company as unknown)[mapping.companyField] = level;
        }
      } else {
        (company as unknown)[mapping.companyField] = trimmedValue;
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

  // Required field validation - only name is truly required now (CIN optional but recommended)
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

  // Registered email validation
  if (company.registeredemailaddress) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(company.registeredemailaddress)) {
      errors.push('Invalid registered email format');
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

  // Social media URL validation
  ['linkedin', 'twitter', 'facebook'].forEach(field => {
    const url = (company as unknown)[field];
    if (url) {
      try {
        new URL(url);
      } catch {
        try {
          new URL(`https://${url}`);
          (company as unknown)[field] = `https://${url}`;
        } catch {
          errors.push(`Invalid ${field} URL`);
        }
      }
    }
  });

  return errors;
}

export function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    // Check file type - support both CSV and Excel files
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    const isCSV = fileType === 'text/csv' || fileName.endsWith('.csv');
    const isExcel = fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   fileType === 'application/vnd.ms-excel' || 
                   fileName.endsWith('.xlsx') || 
                   fileName.endsWith('.xls');

    if (!isCSV && !isExcel) {
      reject(new Error('Unsupported file format. Please upload a CSV or Excel file.'));
      return;
    }

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
          // Ensure all rows are arrays of strings
          const rows = (json as unknown[][]).map(row => row.map(cell => (cell == null ? '' : String(cell))));
          resolve(rows);
        } catch (err) {
          reject(new Error('Failed to parse Excel file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file.'));
      reader.readAsArrayBuffer(file);
      return;
    }

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as string[][]);
      },
      error: (error) => {
        reject(new Error(`File parsing error: ${error.message}`));
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
  const branchOfficesData: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }> = [];
  const errors: Array<{ row: number; message: string; data?: Record<string, unknown>; field?: string; value?: string }> = [];
  const duplicates: Array<{ row: number; existingCompany: Company; duplicateField: string }> = [];
  let totalBranchOffices = 0;
  
  if (csvData.length === 0) {
    return {
      validRows: [],
      branchOfficesData: [],
      errors: [{ row: 0, message: 'No data found in CSV file' }],
      duplicates: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 1, duplicateRows: 0, totalBranchOffices: 0 }
    };
  }

  const headers = csvData[0];
  const dataRows = csvData.slice(1);
  const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase().trim()));
  const existingEmails = new Set(existingCompanies.filter(c => c.email).map(c => c.email!.toLowerCase().trim()));

  dataRows.forEach((row, index) => {
    try {
      const csvRowObject: unknown = {};
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
      
      // Extract and validate branch offices
      const branchOffices = extractBranchOfficesFromRow(csvRowObject);
      const branchOfficeErrors: string[] = [];
      
      branchOffices.forEach((branchOffice, branchIndex) => {
        const branchErrors = validateBranchOfficeData(branchOffice);
        branchErrors.forEach(error => {
          branchOfficeErrors.push(`Branch office ${branchIndex + 1}: ${error}`);
        });
      });
      
      const allErrors = [...validationErrors, ...branchOfficeErrors];
      
      if (allErrors.length > 0) {
        errors.push({
          row: index + 2,
          message: allErrors.join(', '),
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

      // If we have branch offices, ensure at least one is marked as headquarters
      if (branchOffices.length > 0) {
        const hasHeadquarters = branchOffices.some(bo => bo.is_headquarters);
        if (!hasHeadquarters) {
          // Mark the first branch office as headquarters
          branchOffices[0].is_headquarters = true;
        }
      }

      validRows.push(company);
      if (branchOffices.length > 0) {
        branchOfficesData.push({
          companyIndex: validRows.length - 1,
          branchOffices
        });
        totalBranchOffices += branchOffices.length;
      }
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
    branchOfficesData,
    errors,
    duplicates,
    summary: {
      totalRows: dataRows.length,
      validRows: validRows.length,
      errorRows: errors.length,
      duplicateRows: duplicates.length,
      totalBranchOffices
    }
  };
}

export function generateCSVTemplate(): string {
  const headers = [
    // Basic Information
    'name',
    'cin',
    'email',
    'website',
    'domain',
    'phone',
    'description',
    'founded',
    
    // Location & Address
    'location',
    'registeredofficeaddress',
    'country',
    'globalregion',
    'region',
    'holocation',
    
    // Industry & Classification
    'industry1',
    'industry2',
    'industry3',
    'companysector',
    'companytype',
    'entitytype',
    
    // Business Details
    'size',
    'noofemployee',
    'segmentaspernumberofemployees',
    'turnover',
    'segmentasperturnover',
    'turnoveryear',
    'yearofestablishment',
    'paidupcapital',
    'segmentasperpaidupcapital',
    
    // Legal & Registration
    'companystatus',
    'registrationdate',
    'registeredemailaddress',
    'noofdirectives',
    
    // Business Profile
    'companyprofile',
    'areaofspecialize',
    'serviceline',
    'verticles',
    
    // Social Media
    'linkedin',
    'twitter',
    'facebook',
    
    // Hierarchy
    'parent_company_id',
    'company_group_name',
    'hierarchy_level',
    
    // Branch Offices (5 sets)
    ...Array.from({ length: 5 }, (_, i) => [
      `branch_office_${i + 1}_name`,
      `branch_office_${i + 1}_type`,
      `branch_office_${i + 1}_address`,
      `branch_office_${i + 1}_city`,
      `branch_office_${i + 1}_state`,
      `branch_office_${i + 1}_country`,
      `branch_office_${i + 1}_postal_code`,
      `branch_office_${i + 1}_phone`,
      `branch_office_${i + 1}_email`,
      `branch_office_${i + 1}_gst_number`,
      `branch_office_${i + 1}_is_headquarters`,
      `branch_office_${i + 1}_is_active`
    ]).flat()
  ];

  const sampleRows = [
    [
      // Basic Information
      'TechCorp Solutions Pvt Ltd',
      'U72900DL2015PTC123456',
      'contact@techcorp.com',
      'https://techcorp.com',
      'techcorp.com',
      '+91-11-12345678',
      'Leading provider of enterprise software solutions',
      '2015',
      
      // Location & Address
      'New Delhi, India',
      '123 Tech Tower, Sector 62, Noida, UP 201301',
      'India',
      'Asia Pacific',
      'North India',
      'Noida, UP',
      
      // Industry & Classification
      'Technology',
      'Software Development',
      'Enterprise Solutions',
      'IT Services',
      'Private Limited',
      'Company',
      
      // Business Details
      'Medium',
      '250',
      'Medium (100-500)',
      '50000000',
      'Medium (10-100 Cr)',
      '2023',
      '2015',
      '10000000',
      'Medium (1-10 Cr)',
      
      // Legal & Registration
      'Active',
      '2015-03-15',
      'legal@techcorp.com',
      '5',
      
      // Business Profile
      'Enterprise software development company specializing in digital transformation',
      'Cloud Computing, AI/ML, Enterprise Software',
      'Software Development, Consulting, Support',
      'Healthcare, Finance, Manufacturing',
      
      // Social Media
      'https://linkedin.com/company/techcorp',
      'https://twitter.com/techcorp',
      'https://facebook.com/techcorp',
      
      // Hierarchy
      '',
      'TechCorp Group',
      '0',
      
      // Branch Office 1 (Headquarters)
      'Head Office',
      'Headquarters',
      '123 Tech Tower, Sector 62',
      'Noida',
      'Uttar Pradesh',
      'India',
      '201301',
      '+91-11-12345678',
      'hq@techcorp.com',
      '09ABCDE1234F2Z5',
      'true',
      'true',
      
      // Branch Office 2
      'Mumbai Branch',
      'Branch Office',
      '456 Business Park, Andheri East',
      'Mumbai',
      'Maharashtra',
      'India',
      '400069',
      '+91-22-87654321',
      'mumbai@techcorp.com',
      '27ABCDE1234F2Z5',
      'false',
      'true',
      
      // Branch Office 3
      'Bangalore Development Center',
      'Development Center',
      '789 IT Park, Whitefield',
      'Bangalore',
      'Karnataka',
      'India',
      '560066',
      '+91-80-11223344',
      'bangalore@techcorp.com',
      '29ABCDE1234F2Z5',
      'false',
      'true',
      
      // Branch Office 4 (empty)
      '', '', '', '', '', '', '', '', '', '', '', '',
      
      // Branch Office 5 (empty)
      '', '', '', '', '', '', '', '', '', '', '', ''
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
