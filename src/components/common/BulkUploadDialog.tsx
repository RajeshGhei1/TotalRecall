import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Download, File, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'talent' | 'contact';
}

interface ContactCSVRow {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  personal_email?: string;
  role?: string;
  company_name?: string;
  reports_to_name?: string;
  direct_reports?: string; // comma-separated names
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

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ 
  isOpen, 
  onClose,
  entityType
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const queryClient = useQueryClient();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 500MB limit. Please choose a smaller file.");
        return;
      }
      
      // Check file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      const validExtensions = ['.csv', '.xls', '.xlsx'];
      
      const isValidType = validTypes.includes(selectedFile.type) || 
                         validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
      
      if (!isValidType) {
        toast.error("Please select a CSV, XLS, or XLSX file.");
        return;
      }
      
      setFile(selectedFile);
      setUploadResults(null);
    }
  };
  
  const generateCSVTemplate = () => {
    if (entityType === 'contact') {
      const headers = [
        'full_name',
        'email', 
        'phone',
        'location',
        'personal_email',
        'role',
        'company_name',
        'reports_to_name',
        'direct_reports'
      ];
      
      const sampleData = [
        'John Doe',
        'john.doe@company.com',
        '+1-555-123-4567',
        'New York, NY',
        'john.personal@gmail.com',
        'Senior Manager',
        'Acme Corporation',
        'Jane Smith',
        'Alice Johnson, Bob Wilson'
      ];
      
      const csvContent = [
        headers.join(','),
        sampleData.join(',')
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'business_contacts_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };
  
  const handleDownloadTemplate = () => {
    generateCSVTemplate();
    toast.success(`${entityType === 'talent' ? 'Talent' : 'Business Contact'} CSV template has been downloaded to your device.`);
  };
  
  const parseCSV = (csvText: string): ContactCSVRow[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows: ContactCSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index];
        }
      });
      
      rows.push(row);
    }
    
    return rows;
  };
  
  const parseFile = async (file: File): Promise<ContactCSVRow[]> => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      return parseCSV(await file.text());
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return parseExcel(file);
    } else {
      throw new Error('Unsupported file format');
    }
  };
  
  const parseExcel = async (file: File): Promise<ContactCSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            throw new Error('File must have at least a header row and one data row');
          }
          
          const headers = jsonData[0].map((h: any) => String(h).toLowerCase().trim());
          const rows: ContactCSVRow[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const rowData = jsonData[i];
            const row: any = {};
            
            headers.forEach((header, index) => {
              if (rowData[index] !== undefined && rowData[index] !== null && rowData[index] !== '') {
                row[header] = String(rowData[index]).trim();
              }
            });
            
            if (row.full_name || row.email) { // Only add rows with at least name or email
              rows.push(row);
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
  };
  
  const processContacts = async (contacts: ContactCSVRow[]) => {
    const results = { successful: 0, failed: 0, errors: [] as string[] };
    
    for (const contact of contacts) {
      try {
        // Validate required fields
        if (!contact.full_name || !contact.email) {
          results.failed++;
          results.errors.push(`Row ${results.successful + results.failed + 1}: Missing required fields (full_name, email)`);
          continue;
        }
        
        // Parse experience years
        const experienceYears = contact.experience_years ? parseInt(contact.experience_years) : null;
        
        // Parse desired salary
        const desiredSalary = contact.desired_salary ? parseFloat(contact.desired_salary.replace(/[,$]/g, '')) : null;
        
        // Parse skills (comma-separated string to array)
        let skillsArray = [];
        if (contact.skills) {
          skillsArray = contact.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        }
        
        // Parse availability date
        let availabilityDate = null;
        if (contact.availability_date) {
          const parsedDate = new Date(contact.availability_date);
          if (!isNaN(parsedDate.getTime())) {
            availabilityDate = parsedDate.toISOString().split('T')[0];
          }
        }
        
        // Create person record with all fields
        const personData = {
          full_name: contact.full_name,
          email: contact.email,
          phone: contact.phone || null,
          location: contact.location || null,
          personal_email: contact.personal_email || null,
          linkedin_url: contact.linkedin_url || null,
          current_title: contact.current_title || null,
          current_company: contact.current_company || null,
          experience_years: experienceYears,
          skills: skillsArray.length > 0 ? JSON.stringify(skillsArray) : null,
          notes: contact.notes || null,
          availability_date: availabilityDate,
          desired_salary: desiredSalary,
          resume_url: contact.resume_url || null,
          portfolio_url: contact.portfolio_url || null,
          type: 'contact'
        };
        
        const { data: insertedPerson, error: personError } = await supabase
          .from('people')
          .insert([personData])
          .select()
          .single();
          
        if (personError) throw personError;
        
        // If company_name is provided, try to find or create company and link
        if (contact.company_name && contact.role && insertedPerson) {
          // First try to find existing company
          let { data: companyData, error: companyFindError } = await supabase
            .from('companies')
            .select('id, name')
            .ilike('name', contact.company_name)
            .limit(1);
            
          if (companyFindError) {
            console.warn('Error finding company:', companyFindError);
          }
          
          let companyId: string;
          
          if (companyData && companyData.length > 0) {
            companyId = companyData[0].id;
          } else {
            // Create new company
            const { data: newCompanyData, error: companyCreateError } = await supabase
              .from('companies')
              .insert([{
                name: contact.company_name,
                description: `Company created via bulk upload for ${contact.full_name}`
              }])
              .select('id')
              .single();
              
            if (companyCreateError) throw companyCreateError;
            companyId = newCompanyData.id;
          }
          
          // Create company relationship
          const { error: relationshipError } = await supabase
            .from('company_relationships')
            .insert([{
              person_id: insertedPerson.id,
              company_id: companyId,
              role: contact.role,
              relationship_type: 'business_contact',
              start_date: new Date().toISOString().split('T')[0],
              is_current: true
            }]);
            
          if (relationshipError) {
            console.warn('Error creating company relationship:', relationshipError);
            // Don't fail the entire import for relationship errors
          }
        }
        
        results.successful++;
        
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${contact.full_name || 'Unknown'}: ${error.message}`);
      }
    }
    
    return results;
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    setIsUploading(true);
    setUploadResults(null);
    
    try {
      const contacts = await parseFile(file);
      
      if (contacts.length === 0) {
        throw new Error('No valid data found in file');
      }
      
      const results = await processContacts(contacts);
      setUploadResults(results);
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['people', entityType] });
      
      if (results.successful > 0) {
        toast.success(`Successfully imported ${results.successful} ${entityType === 'talent' ? 'talents' : 'contacts'}${results.failed > 0 ? ` (${results.failed} failed)` : ''}`);
      }
      
      if (results.failed > 0) {
        toast.error(`${results.failed} records failed to import. Check the results for details.`);
      }
      
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
      setUploadResults({ successful: 0, failed: 0, errors: [error.message] });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    setUploadResults(null);
    onClose();
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload {entityType === 'talent' ? 'Talents' : 'Business Contacts'}</DialogTitle>
          <DialogDescription>
            Upload a CSV, XLS, or XLSX file with multiple {entityType === 'talent' ? 'talents' : 'business contacts'} to add them all at once. Maximum file size: 500MB.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Supports CSV, XLS, and XLSX files up to 500MB.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>
          
          {entityType === 'contact' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Business Contact Fields:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>
                  <strong>Required Fields:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• full_name</li>
                    <li>• email</li>
                  </ul>
                </div>
                <div>
                  <strong>Optional Fields:</strong>
                  <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                    <li>• phone</li>
                    <li>• location</li>
                    <li>• personal_email</li>
                    <li>• role</li>
                    <li>• company_name</li>
                    <li>• reports_to_name</li>
                    <li>• direct_reports</li>
                    <li>• linkedin_url</li>
                    <li>• current_title</li>
                    <li>• current_company</li>
                    <li>• experience_years</li>
                    <li>• skills (comma-separated)</li>
                    <li>• notes</li>
                    <li>• availability_date</li>
                    <li>• desired_salary</li>
                    <li>• resume_url</li>
                    <li>• portfolio_url</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <File className="h-8 w-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p>Drag and drop your CSV, XLS, or XLSX file here, or click to browse</p>
                <p className="text-sm text-gray-500">Maximum file size: 500MB</p>
              </div>
            )}
            <Input 
              id="file-upload" 
              type="file" 
              accept=".csv,.xls,.xlsx" 
              className="hidden"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload"
              className={`inline-flex items-center justify-center mt-4 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${file ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'} h-10 px-4 py-2 cursor-pointer`}
            >
              {file ? 'Change File' : 'Select File'}
            </label>
          </div>
          
          {uploadResults && (
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Upload Results
              </h4>
              <div className="text-sm space-y-1">
                <p className="text-green-600">✓ Successfully imported: {uploadResults.successful}</p>
                <p className="text-red-600">✗ Failed to import: {uploadResults.failed}</p>
                {uploadResults.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errors:</p>
                    <ul className="list-disc list-inside text-red-600 max-h-32 overflow-y-auto">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index} className="text-xs">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
            {uploadResults ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResults && (
            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
