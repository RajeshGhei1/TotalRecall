
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadZone from './bulk-upload/FileUploadZone';
import TemplateGenerator from './bulk-upload/TemplateGenerator';
import ContactFieldsInfo from './bulk-upload/ContactFieldsInfo';
import DuplicateResultsDisplay from './bulk-upload/DuplicateResultsDisplay';
import DuplicateStrategySelector from './bulk-upload/DuplicateStrategySelector';
import { FileProcessor } from './bulk-upload/FileProcessor';
import { EnhancedContactProcessor } from './bulk-upload/EnhancedContactProcessor';
import { ProcessingResultsEnhanced, DuplicateStrategy, MergeOptions } from './bulk-upload/types';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'talent' | 'contact';
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

const defaultStrategy: DuplicateStrategy = {
  primaryAction: 'skip',
  emailMatches: 'merge',
  phoneMatches: 'skip',
  nameMatches: 'review',
  linkedinMatches: 'merge',
  confidenceThreshold: 0.8
};

const defaultMergeOptions: MergeOptions = {
  overwriteEmpty: true,
  mergeArrays: true,
  keepMostRecent: true,
  preserveExisting: false
};

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ 
  isOpen, 
  onClose,
  entityType
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<ProcessingResultsEnhanced | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>(defaultStrategy);
  const [mergeOptions, setMergeOptions] = useState<MergeOptions>(defaultMergeOptions);
  const [currentTab, setCurrentTab] = useState<'upload' | 'strategy' | 'results'>('upload');
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
      setCurrentTab('strategy');
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
      
      toast.info(`Processing ${contacts.length} contacts with duplicate detection...`);
      
      const results = await EnhancedContactProcessor.processContactsWithDuplicateHandling(
        contacts,
        duplicateStrategy,
        mergeOptions
      );
      
      setUploadResults(results);
      setCurrentTab('results');
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['people', entityType] });
      
      if (results.successful > 0 || results.duplicates_merged > 0) {
        const totalProcessed = results.successful + results.duplicates_merged;
        toast.success(`Successfully processed ${totalProcessed} ${entityType === 'talent' ? 'talents' : 'contacts'}${results.failed > 0 ? ` (${results.failed} failed)` : ''}`);
      }
      
      if (results.duplicates_found > 0) {
        toast.info(`Found ${results.duplicates_found} duplicates: ${results.duplicates_skipped} skipped, ${results.duplicates_merged} merged`);
      }
      
      if (results.failed > 0) {
        toast.error(`${results.failed} records failed to process. Check the results for details.`);
      }
      
    } catch (error: unknown) {
      console.error('Bulk upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Upload failed: ${errorMessage}`);
      setUploadResults({ 
        successful: 0, 
        failed: 0, 
        duplicates_found: 0,
        duplicates_skipped: 0,
        duplicates_merged: 0,
        errors: [errorMessage],
        duplicate_details: []
      });
      setCurrentTab('results');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    setUploadResults(null);
    setCurrentTab('upload');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enhanced Bulk Upload {entityType === 'talent' ? 'Talents' : 'Business Contacts'}</DialogTitle>
          <DialogDescription>
            Upload a CSV, XLS, or XLSX file with advanced duplicate detection and merging capabilities. Maximum file size: 500MB.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'upload' | 'strategy' | 'results')} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">1. Upload File</TabsTrigger>
            <TabsTrigger value="strategy" disabled={!file}>2. Duplicate Strategy</TabsTrigger>
            <TabsTrigger value="results" disabled={!uploadResults}>3. Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 py-4">
            <TemplateGenerator entityType={entityType} />
            
            {entityType === 'contact' && <ContactFieldsInfo />}
            
            <FileUploadZone
              file={file}
              onFileChange={handleFileChange}
              maxFileSize={MAX_FILE_SIZE}
              acceptedTypes={['.csv', '.xls', '.xlsx']}
            />
          </TabsContent>

          <TabsContent value="strategy" className="space-y-6 py-4">
            <DuplicateStrategySelector
              strategy={duplicateStrategy}
              mergeOptions={mergeOptions}
              onStrategyChange={setDuplicateStrategy}
              onMergeOptionsChange={setMergeOptions}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6 py-4">
            {uploadResults && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{uploadResults.successful}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{uploadResults.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{uploadResults.duplicates_merged}</div>
                    <div className="text-sm text-muted-foreground">Merged</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{uploadResults.duplicates_skipped}</div>
                    <div className="text-sm text-muted-foreground">Skipped</div>
                  </div>
                </div>

                <DuplicateResultsDisplay results={uploadResults} />

                {uploadResults.errors.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Processing Errors:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
            {uploadResults ? 'Close' : 'Cancel'}
          </Button>
          {currentTab === 'strategy' && (
            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process Upload
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
