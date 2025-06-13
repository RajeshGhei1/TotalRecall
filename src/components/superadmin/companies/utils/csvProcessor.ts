import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Company } from '@/hooks/useCompanies';
import { CompanyCSVRow } from '@/components/common/bulk-upload/CompanyDuplicateDetector';

export interface BranchOfficeData {
  branch_name: string;
  branch_type: 'headquarters' | 'branch' | 'regional_office' | 'factory' | 'warehouse' | 'other';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
  is_headquarters: boolean;
  is_active: boolean;
}

export { BranchOfficeData };

export interface CSVFieldMapping {
  csvColumn: string;
  companyField: keyof Company;
  isRequired: boolean;
}

export interface CSVProcessingResult {
  validRows: Partial<Company>[];
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    duplicateRows: number;
    totalBranchOffices: number;
  };
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value?: any;
  }>;
  duplicates: Array<{
    row: number;
    existingCompany: Company;
    duplicateField: string;
  }>;
  branchOfficesData?: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }>;
}

export interface BulkImportProgress {
  stage: 'parsing' | 'validating' | 'importing' | 'complete';
  progress: number;
  currentRow?: number;
  totalRows?: number;
  message: string;
}

export const defaultFieldMappings: CSVFieldMapping[] = [
  { csvColumn: 'name', companyField: 'name', isRequired: true },
  { csvColumn: 'cin', companyField: 'cin', isRequired: false },
  { csvColumn: 'email', companyField: 'email', isRequired: false },
  { csvColumn: 'website', companyField: 'website', isRequired: false },
  { csvColumn: 'phone', companyField: 'phone', isRequired: false },
  { csvColumn: 'location', companyField: 'location', isRequired: false },
  { csvColumn: 'industry', companyField: 'industry', isRequired: false },
  { csvColumn: 'size', companyField: 'size', isRequired: false },
  { csvColumn: 'description', companyField: 'description', isRequired: false },
];

export const parseCSV = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          const rows = results.data as string[][];
          resolve(rows);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || 
               fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
               fileType === 'application/vnd.ms-excel') {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Use the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
          }) as string[][];
          
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Excel parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read Excel file'));
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file format. Please upload a CSV or Excel file.'));
    }
  });
};

export const validateCSVData = (
  csvData: string[][],
  fieldMappings: CSVFieldMapping[],
  existingCompanies: Company[]
): CSVProcessingResult => {
  const errors: CSVProcessingResult['errors'] = [];
  const duplicates: CSVProcessingResult['duplicates'] = [];
  const validRows: Partial<Company>[] = [];
  const branchOfficesData: Array<{ companyIndex: number; branchOffices: BranchOfficeData[] }> = [];
  let totalBranchOffices = 0;

  if (!csvData || csvData.length < 2) {
    return {
      validRows: [],
      summary: { totalRows: 0, validRows: 0, errorRows: 0, duplicateRows: 0, totalBranchOffices: 0 },
      errors: [{ row: 1, field: 'file', message: 'No data rows found in the file.' }],
      duplicates: []
    };
  }

  const headers = csvData[0].map(header => header.trim());
  const requiredFields = fieldMappings.filter(mapping => mapping.isRequired).map(mapping => mapping.companyField);

  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i];
    const company: Partial<Company> = {};
    let hasErrors = false;

    // Process each column based on field mappings
    fieldMappings.forEach(mapping => {
      const columnIndex = headers.indexOf(mapping.csvColumn);
      if (columnIndex !== -1) {
        const value = row[columnIndex]?.trim();
        if (value !== undefined) {
          company[mapping.companyField] = value;
        }
      }
    });

    // Validate required fields
    requiredFields.forEach(field => {
      if (!company[field]) {
        errors.push({
          row: i + 1,
          field: field as string,
          message: `Required field "${field}" is missing.`,
        });
        hasErrors = true;
      }
    });

    // Detect duplicates based on company name
    if (company.name) {
      const existingCompany = existingCompanies.find(
        c => c.name.toLowerCase() === company.name?.toLowerCase()
      );

      if (existingCompany) {
        duplicates.push({
          row: i + 1,
          existingCompany: existingCompany,
          duplicateField: 'name',
        });
      }
    }

    // Extract branch office data
    const branchOffices: BranchOfficeData[] = [];
    for (let j = 1; j <= 5; j++) {
      const branchNameHeader = headers.find(h => h.toLowerCase() === `branch_office_${j}_name`);
      if (branchNameHeader) {
        const columnIndex = headers.indexOf(branchNameHeader);
        const branchName = row[columnIndex]?.trim();

        if (branchName) {
          const branchOffice: BranchOfficeData = {
            branch_name: branchName,
            branch_type: (row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_type`))] || 'branch') as BranchOfficeData['branch_type'],
            address: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_address`))]?.trim(),
            city: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_city`))]?.trim(),
            state: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_state`))]?.trim(),
            country: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_country`))]?.trim(),
            postal_code: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_postal_code`))]?.trim(),
            phone: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_phone`))]?.trim(),
            email: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_email`))]?.trim(),
            gst_number: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_gst_number`))]?.trim(),
            is_headquarters: row[headers.indexOf(headers.find(h => h.toLowerCase() === `branch_office_${j}_is_headquarters`))]?.trim().toLowerCase() === 'true',
            is_active: true
          };
          branchOffices.push(branchOffice);
          totalBranchOffices++;
        }
      }
    }

    if (branchOffices.length > 0) {
      branchOfficesData.push({ companyIndex: i - 1, branchOffices: branchOffices });
    }

    if (!hasErrors) {
      validRows.push(company);
    }
  }

  const summary = {
    totalRows: csvData.length - 1,
    validRows: validRows.length,
    errorRows: errors.length,
    duplicateRows: duplicates.length,
    totalBranchOffices: totalBranchOffices
  };

  return {
    validRows,
    summary,
    errors,
    duplicates,
    branchOfficesData
  };
};

export const categorizeErrors = (errors: CSVProcessingResult['errors']): { [field: string]: number } => {
  return errors.reduce((acc, error) => {
    acc[error.field] = (acc[error.field] || 0) + 1;
    return acc;
  }, {});
};

export const createProgressTracker = (totalRows: number) => {
  let completedRows = 0;

  return {
    next: () => {
      completedRows++;
      return Math.round((completedRows / totalRows) * 100);
    },
    getCompleted: () => completedRows,
    getTotal: () => totalRows,
  };
};

export const generateCSVTemplate = (): string => {
  const headers = [
    // Basic Information (Required)
    'name',
    'cin',
    
    // Contact Information
    'email',
    'website',
    'domain',
    'phone',
    'registeredemailaddress',
    
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
    'founded',
    'yearofestablishment',
    'paidupcapital',
    'segmentasperpaidupcapital',
    
    // Legal & Registration
    'companystatus',
    'registrationdate',
    'noofdirectives',
    
    // Business Profile
    'description',
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
    
    // GST Numbers for Duplicate Detection & Branch Offices
    'gst_number',
    'branch_office_1_gst',
    'branch_office_2_gst', 
    'branch_office_3_gst',
    'branch_office_4_gst',
    
    // Branch Office Details (optional)
    'branch_office_1_name',
    'branch_office_1_type',
    'branch_office_1_address',
    'branch_office_1_city',
    'branch_office_1_state',
    'branch_office_1_country',
    'branch_office_1_postal_code',
    'branch_office_1_phone',
    'branch_office_1_email',
    'branch_office_1_is_headquarters',
    
    'branch_office_2_name',
    'branch_office_2_type',
    'branch_office_2_address',
    'branch_office_2_city',
    'branch_office_2_state',
    'branch_office_2_country',
    'branch_office_2_postal_code',
    'branch_office_2_phone',
    'branch_office_2_email',
    'branch_office_2_is_headquarters',
    
    'branch_office_3_name',
    'branch_office_3_type',
    'branch_office_3_address',
    'branch_office_3_city',
    'branch_office_3_state',
    'branch_office_3_country',
    'branch_office_3_postal_code',
    'branch_office_3_phone',
    'branch_office_3_email',
    'branch_office_3_is_headquarters',
    
    'branch_office_4_name',
    'branch_office_4_type',
    'branch_office_4_address',
    'branch_office_4_city',
    'branch_office_4_state',
    'branch_office_4_country',
    'branch_office_4_postal_code',
    'branch_office_4_phone',
    'branch_office_4_email',
    'branch_office_4_is_headquarters',
    
    'branch_office_5_name',
    'branch_office_5_type',
    'branch_office_5_address',
    'branch_office_5_city',
    'branch_office_5_state',
    'branch_office_5_country',
    'branch_office_5_postal_code',
    'branch_office_5_phone',
    'branch_office_5_email',
    'branch_office_5_gst_number',
    'branch_office_5_is_headquarters'
  ];

  const sampleData = [
    'Acme Corporation Ltd',
    'L74999MH2010PLC123456',
    'contact@acmecorp.com',
    'https://www.acmecorp.com',
    'acmecorp.com',
    '+91-22-12345678',
    'registered@acmecorp.com',
    'Mumbai, Maharashtra, India',
    '123 Business Park, Andheri East, Mumbai - 400069',
    'India',
    'Asia Pacific',
    'Maharashtra',
    'Mumbai',
    'Information Technology',
    'Software Services',
    'Cloud Computing',
    'Technology',
    'Private Limited Company',
    'Company',
    'Large',
    '500-1000',
    'Large Enterprise',
    '100 Crores',
    'Large',
    '2023',
    '2010',
    '2015',
    '50 Crores',
    'Medium',
    'Active',
    '2010-03-15',
    '5',
    'Leading provider of enterprise software solutions',
    'Enterprise software development and consulting services',
    'Cloud Computing, AI/ML, Data Analytics',
    'Software Development, Consulting, Support',
    'Banking, Healthcare, Retail',
    'https://linkedin.com/company/acmecorp',
    'https://twitter.com/acmecorp',
    'https://facebook.com/acmecorp',
    '',
    'Acme Group',
    '1',
    '27AAAAA0000A1Z5',
    '27BBBBB1111B2Z6',
    '29CCCCC2222C3Z7',
    '33DDDDD3333D4Z8',
    '36EEEEE4444E5Z9',
    'Mumbai Head Office',
    'headquarters',
    '123 Business Park, Andheri East',
    'Mumbai',
    'Maharashtra',
    'India',
    '400069',
    '+91-22-12345678',
    'mumbai@acmecorp.com',
    'true',
    'Delhi Branch',
    'branch',
    '456 Corporate Plaza, Connaught Place',
    'New Delhi',
    'Delhi',
    'India',
    '110001',
    '+91-11-98765432',
    'delhi@acmecorp.com',
    'false',
    'Bangalore Development Center',
    'development_center',
    '789 Tech Hub, Electronic City',
    'Bangalore',
    'Karnataka',
    'India',
    '560100',
    '+91-80-55443322',
    'bangalore@acmecorp.com',
    'false',
    'Chennai Support Center',
    'support_center',
    '321 IT Corridor, OMR',
    'Chennai',
    'Tamil Nadu',
    'India',
    '600096',
    '+91-44-66778899',
    'chennai@acmecorp.com',
    'false',
    'Pune Training Center',
    'training_center',
    '654 Knowledge Park, Hinjewadi',
    'Pune',
    'Maharashtra',
    'India',
    '411057',
    '+91-20-33445566',
    'pune@acmecorp.com',
    '36EEEEE4444E5Z9',
    'false'
  ];

  return [headers.join(','), sampleData.join(',')].join('\n');
};
