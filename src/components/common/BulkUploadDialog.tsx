
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
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import FileUploadZone from './bulk-upload/FileUploadZone';
import TemplateGenerator from './bulk-upload/TemplateGenerator';
import ContactFieldsInfo from './bulk-upload/ContactFieldsInfo';
import UploadResults from './bulk-upload/UploadResults';
import { FileProcessor } from './bulk-upload/FileProcessor';
import { ContactProcessor, ProcessingResults } from './bulk-upload/ContactProcessor';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'talent' | 'contact';
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ 
  isOpen, 
  onClose,
  entityType
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<ProcessingResults | null>(null);
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
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    setIsUploading(true);
    setUploadResults(null);
    
    try {
      const contacts = await FileProcessor.parseFile(file);
      
      if (contacts.length === 0) {
        throw new Error('No valid data found in file');
      }
      
      const results = await ContactProcessor.processContacts(contacts);
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
          <TemplateGenerator entityType={entityType} />
          
          {entityType === 'contact' && <ContactFieldsInfo />}
          
          <FileUploadZone
            file={file}
            onFileChange={handleFileChange}
            maxFileSize={MAX_FILE_SIZE}
            acceptedTypes={['.csv', '.xls', '.xlsx']}
          />
          
          {uploadResults && <UploadResults results={uploadResults} />}
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
