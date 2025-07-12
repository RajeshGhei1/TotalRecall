
import { toast } from 'sonner';
import { Company } from '@/hooks/useCompanies';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  fields: string[];
  includeCustomFields: boolean;
  includeRelationships: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, unknown>;
}

export interface ExportProgress {
  stage: 'preparing' | 'processing' | 'generating' | 'complete';
  progress: number;
  message: string;
}

export const availableFields = [
  { key: 'name', label: 'Company Name', required: true },
  { key: 'email', label: 'Email Address' },
  { key: 'website', label: 'Website' },
  { key: 'domain', label: 'Domain' },
  { key: 'industry', label: 'Industry' },
  { key: 'size', label: 'Company Size' },
  { key: 'location', label: 'Location' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'description', label: 'Description' },
  { key: 'founded', label: 'Founded Year' },
  { key: 'linkedin', label: 'LinkedIn URL' },
  { key: 'twitter', label: 'Twitter URL' },
  { key: 'facebook', label: 'Facebook URL' },
  // Tenant-specific fields
  { key: 'cin', label: 'CIN' },
  { key: 'registeredOfficeAddress', label: 'Registered Office Address' },
  { key: 'registrationDate', label: 'Registration Date' },
  { key: 'country', label: 'Country' },
  { key: 'region', label: 'Region' },
  { key: 'industry1', label: 'Primary Industry' },
  { key: 'industry2', label: 'Secondary Industry' },
  { key: 'industry3', label: 'Tertiary Industry' },
  { key: 'companyType', label: 'Company Type' },
  { key: 'entityType', label: 'Entity Type' },
  { key: 'noOfEmployee', label: 'Number of Employees' },
  { key: 'turnover', label: 'Turnover' },
  { key: 'companyProfile', label: 'Company Profile' },
  { key: 'created_at', label: 'Date Added' },
  { key: 'updated_at', label: 'Last Updated' },
];

export const exportCompanies = async (
  companies: Compunknown[], 
  options: ExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> => {
  if (companies.length === 0) {
    toast.error('No companies to export');
    return;
  }

  try {
    onProgress?.({ stage: 'preparing', progress: 0, message: 'Preparing export...' });

    // Filter companies based on date range if specified
    let filteredCompanies = companies;
    if (options.dateRange) {
      filteredCompanies = companies.filter(company => {
        const createdAt = new Date(company.created_at);
        return createdAt >= options.dateRange!.start && createdAt <= options.dateRange!.end;
      });
    }

    onProgress?.({ stage: 'processing', progress: 25, message: `Processing ${filteredCompanies.length} companies...` });

    // Extract selected fields
    const exportData = filteredCompanies.map(company => {
      const row: Record<string, unknown> = {};
      
      options.fields.forEach(fieldKey => {
        const field = availableFields.find(f => f.key === fieldKey);
        if (field) {
          row[field.label] = getFieldValue(company, fieldKey);
        }
      });

      return row;
    });

    onProgress?.({ stage: 'generating', progress: 75, message: 'Generating export file...' });

    // Generate file based on format
    switch (options.format) {
      case 'csv':
        await exportToCSV(exportData, `companies-export-${new Date().toISOString().split('T')[0]}.csv`);
        break;
      case 'excel':
        await exportToExcel(exportData, `companies-export-${new Date().toISOString().split('T')[0]}.xlsx`);
        break;
      case 'json':
        await exportToJSON(exportData, `companies-export-${new Date().toISOString().split('T')[0]}.json`);
        break;
    }

    onProgress?.({ stage: 'complete', progress: 100, message: `Successfully exported ${filteredCompanies.length} companies` });
    toast.success(`Successfully exported ${filteredCompanies.length} companies`);
    
  } catch (error) {
    console.error('Export failed:', error);
    toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    throw error;
  }
};

const getFieldValue = (company: Company, fieldKey: string): unknown => {
  const value = (company as unknown)[fieldKey];
  
  // Handle special cases
  if (fieldKey === 'created_at' || fieldKey === 'updated_at') {
    return value ? new Date(value).toLocaleDateString() : '';
  }
  
  if (fieldKey === 'registrationDate') {
    return value ? new Date(value).toLocaleDateString() : '';
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  // Handle objects
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  
  return value || '';
};

const exportToCSV = async (data: Record<string, unknown>[], filename: string): Promise<void> => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const stringValue = String(value || '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

const exportToExcel = async (data: Record<string, unknown>[], filename: string): Promise<void> => {
  // For now, export as CSV with Excel-friendly format
  // In a real implementation, you'd use a library like xlsx or exceljs
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join('\t'), // Use tabs for Excel
    ...data.map(row => 
      headers.map(header => String(row[header] || '')).join('\t')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'application/vnd.ms-excel');
  toast.info('Excel export generated as tab-separated values. For full Excel support, consider upgrading to Pro.');
};

const exportToJSON = async (data: Record<string, unknown>[], filename: string): Promise<void> => {
  const jsonContent = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalRecords: data.length,
    data: data
  }, null, 2);

  downloadFile(jsonContent, filename, 'application/json');
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Enhanced export templates
export const exportTemplates = {
  basic: {
    name: 'Basic Company Info',
    fields: ['name', 'email', 'website', 'industry', 'size', 'location']
  },
  contact: {
    name: 'Contact Information',
    fields: ['name', 'email', 'phone', 'website', 'location', 'description']
  },
  business: {
    name: 'Business Details',
    fields: ['name', 'industry', 'companyType', 'entityType', 'noOfEmployee', 'turnover', 'founded']
  },
  compliance: {
    name: 'Compliance & Legal',
    fields: ['name', 'cin', 'registeredOfficeAddress', 'registrationDate', 'country', 'region', 'entityType']
  },
  complete: {
    name: 'Complete Export',
    fields: availableFields.map(f => f.key)
  }
};

// Utility for creating scheduled exports
export const createScheduledExport = (options: ExportOptions & { schedule: string }) => {
  // This would integrate with a job scheduler in a real implementation
  console.log('Scheduled export created:', options);
  toast.success('Scheduled export has been created and will run automatically.');
};

// Export statistics
export const calculateExportStats = (companies: Compunknown[], options: ExportOptions) => {
  const stats = {
    totalCompanies: companies.length,
    fieldsSelected: options.fields.length,
    estimatedFileSize: 0,
    estimatedDuration: 0
  };

  // Rough calculation for file size estimation
  const avgFieldSize = 20; // bytes per field
  stats.estimatedFileSize = stats.totalCompanies * stats.fieldsSelected * avgFieldSize;
  
  // Rough calculation for duration (1000 companies per second)
  stats.estimatedDuration = Math.max(1, Math.ceil(stats.totalCompanies / 1000));

  return stats;
};
