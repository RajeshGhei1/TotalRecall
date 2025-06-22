
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  includeCompanyInfo: boolean;
  includeLinkedInData: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    companies?: string[];
    locations?: string[];
    roles?: string[];
  };
}

interface PersonData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  type: string;
  created_at: string;
  updated_at: string;
  company_relationships?: Array<{
    role?: string;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
    companies?: {
      name?: string;
      industry?: string;
      size?: string;
      location?: string;
    };
  }>;
  linkedin_profile_enrichments?: Array<{
    linkedin_data: {
      publicProfileUrl?: string;
      headline?: string;
      summary?: string;
    };
  }>;
}

export const exportPeopleData = async (options: ExportOptions) => {
  try {
    // Build the query based on options
    let query = supabase
      .from('people')
      .select(`
        id,
        full_name,
        email,
        phone,
        location,
        type,
        created_at,
        updated_at
        ${options.includeCompanyInfo ? `,
          company_relationships!left (
            role,
            start_date,
            end_date,
            is_current,
            companies (
              name,
              industry,
              size,
              location
            )
          )
        ` : ''}
        ${options.includeLinkedInData ? `,
          linkedin_profile_enrichments!left (
            linkedin_data
          )
        ` : ''}
      `)
      .eq('type', 'contact');

    // Apply date range filter
    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start)
        .lte('created_at', options.dateRange.end);
    }

    const { data: rawData, error } = await query.order('full_name');
    
    if (error) throw error;
    if (!rawData) return null;

    // Transform data for export with proper type handling
    const exportData = rawData.map((person: PersonData) => {
      const baseData = {
        'Full Name': person.full_name || '',
        'Email': person.email || '',
        'Phone': person.phone || '',
        'Location': person.location || '',
        'Created Date': new Date(person.created_at).toLocaleDateString(),
        'Last Updated': new Date(person.updated_at).toLocaleDateString()
      };

      // Add company information if requested
      if (options.includeCompanyInfo && person.company_relationships) {
        const currentCompany = person.company_relationships.find(rel => rel.is_current);
        if (currentCompany && currentCompany.companies) {
          Object.assign(baseData, {
            'Current Company': currentCompany.companies.name || '',
            'Current Role': currentCompany.role || '',
            'Company Industry': currentCompany.companies.industry || '',
            'Company Size': currentCompany.companies.size || '',
            'Company Location': currentCompany.companies.location || ''
          });
        }
      }

      // Add LinkedIn data if requested
      if (options.includeLinkedInData && person.linkedin_profile_enrichments?.length) {
        const linkedInData = person.linkedin_profile_enrichments[0].linkedin_data;
        if (linkedInData) {
          Object.assign(baseData, {
            'LinkedIn URL': linkedInData.publicProfileUrl || '',
            'LinkedIn Headline': linkedInData.headline || '',
            'LinkedIn Summary': linkedInData.summary || ''
          });
        }
      }

      return baseData;
    });

    // Apply additional filters
    let filteredData = exportData;
    
    if (options.filters?.companies?.length) {
      filteredData = filteredData.filter(item => 
        options.filters!.companies!.includes(item['Current Company'] as string)
      );
    }

    if (options.filters?.locations?.length) {
      filteredData = filteredData.filter(item =>
        options.filters!.locations!.some(loc => 
          (item['Location'] as string).toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Generate export based on format
    switch (options.format) {
      case 'csv':
        return generateCSV(filteredData);
      case 'xlsx':
        return generateExcel(filteredData);
      case 'json':
        return generateJSON(filteredData);
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

const generateCSV = (data: any[]) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  return {
    content: csvContent,
    filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
    mimeType: 'text/csv'
  };
};

const generateExcel = (data: any[]) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Auto-size columns
  const columnWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 20)
  }));
  worksheet['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  
  const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  
  return {
    content: excelBuffer,
    filename: `contacts_export_${new Date().toISOString().split('T')[0]}.xlsx`,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
};

const generateJSON = (data: any[]) => {
  const jsonContent = JSON.stringify(data, null, 2);
  
  return {
    content: jsonContent,
    filename: `contacts_export_${new Date().toISOString().split('T')[0]}.json`,
    mimeType: 'application/json'
  };
};

// Utility function to trigger download
export const downloadExportedFile = (exportResult: { content: any; filename: string; mimeType: string }) => {
  const blob = new Blob([exportResult.content], { type: exportResult.mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = exportResult.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
