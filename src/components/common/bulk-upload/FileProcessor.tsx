
import * as XLSX from 'xlsx';

export interface ContactCSVRow {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  personal_email?: string;
  role?: string;
  company_name?: string;
  reports_to_name?: string;
  direct_reports?: string;
  linkedin_url?: string;
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
  static parseCSV(csvText: string): ContactCSVRow[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows: ContactCSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: Partial<ContactCSVRow> = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          (row as Record<string, string>)[header] = values[index];
        }
      });
      
      rows.push(row as ContactCSVRow);
    }
    
    return rows;
  }

  static async parseExcel(file: File): Promise<ContactCSVRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
          
          if (jsonData.length < 2) {
            throw new Error('File must have at least a header row and one data row');
          }
          
          const headers = jsonData[0].map((h: unknown) => String(h).toLowerCase().trim());
          const rows: ContactCSVRow[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const rowData = jsonData[i];
            const row: Partial<ContactCSVRow> = {};
            
            headers.forEach((header, index) => {
              if (rowData[index] !== undefined && rowData[index] !== null && rowData[index] !== '') {
                (row as Record<string, string>)[header] = String(rowData[index]).trim();
              }
            });
            
            if (row.full_name || row.email) {
              rows.push(row as ContactCSVRow);
            }
          }
          
          resolve(rows);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static async parseFile(file: File): Promise<ContactCSVRow[]> {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      return this.parseCSV(await file.text());
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return this.parseExcel(file);
    } else {
      throw new Error('Unsupported file format');
    }
  }
}
