
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ContactCSVRow {
  // Basic Information
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  personal_email?: string;
  
  // Business Information
  role?: string;
  company_name?: string;
  reports_to_name?: string;
  direct_reports?: string;
  
  // Social Media
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  
  // Professional Details
  current_title?: string;
  current_company?: string;
  experience_years?: string;
  skills?: string;
  notes?: string;
  availability_date?: string;
  desired_salary?: string;
  resume_url?: string;
  portfolio_url?: string;
}

export class FileProcessor {
  static async parseFile(file: File): Promise<ContactCSVRow[]> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return this.parseCSV(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || 
               fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
               fileType === 'application/vnd.ms-excel') {
      return this.parseExcel(file);
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
    }
  }

  private static parseCSV(file: File): Promise<ContactCSVRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Normalize header names to match our interface
          return header.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          const contacts = results.data as ContactCSVRow[];
          const validContacts = contacts.filter(contact => 
            contact.full_name && contact.email
          );
          
          resolve(validContacts);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  }

  private static parseExcel(file: File): Promise<ContactCSVRow[]> {
    return new Promise((resolve, reject) => {
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
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must contain at least a header row and one data row');
          }
          
          // Normalize headers
          const headers = jsonData[0].map(header => 
            header.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')
          );
          
          // Convert rows to objects
          const contacts: ContactCSVRow[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const contact: any = {};
            
            headers.forEach((header, index) => {
              if (row[index] !== undefined && row[index] !== '') {
                contact[header] = String(row[index]).trim();
              }
            });
            
            // Only include rows with required fields
            if (contact.full_name && contact.email) {
              contacts.push(contact as ContactCSVRow);
            }
          }
          
          resolve(contacts);
        } catch (error) {
          reject(new Error(`Excel parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read Excel file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
}
