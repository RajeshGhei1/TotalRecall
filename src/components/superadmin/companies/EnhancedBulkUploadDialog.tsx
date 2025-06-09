
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  Download, 
  File, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  MapPin,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Company } from '@/hooks/useCompanies';
import {
  parseCSV,
  validateCSVData,
  generateCSVTemplate,
  CSVFieldMapping,
  CSVProcessingResult,
  BulkImportProgress,
  defaultFieldMappings
} from './utils/csvProcessor';

interface EnhancedBulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingCompanies: Company[];
  onImport: (companies: Partial<Company>[], options: { skipDuplicates: boolean }) => Promise<void>;
}

const EnhancedBulkUploadDialog: React.FC<EnhancedBulkUploadDialogProps> = ({
  isOpen,
  onClose,
  existingCompanies,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [fieldMappings, setFieldMappings] = useState<CSVFieldMapping[]>(defaultFieldMappings);
  const [validationResult, setValidationResult] = useState<CSVProcessingResult | null>(null);
  const [progress, setProgress] = useState<BulkImportProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'validation' | 'import'>('upload');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setProgress({ stage: 'parsing', progress: 0, message: 'Parsing CSV file...' });

    try {
      const rows = await parseCSV(selectedFile);
      setCsvData(rows);
      setCurrentStep('mapping');
      setProgress({ stage: 'parsing', progress: 100, message: 'CSV parsed successfully' });
      toast.success(`CSV loaded: ${rows.length - 1} data rows found`);
    } catch (error) {
      toast.error('Failed to parse CSV file');
      console.error('CSV parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFieldMappingChange = (index: number, field: 'csvColumn' | 'companyField' | 'isRequired', value: any) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFieldMappings(newMappings);
  };

  const addFieldMapping = () => {
    setFieldMappings([...fieldMappings, { csvColumn: '', companyField: 'name', isRequired: false }]);
  };

  const removeFieldMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const validateData = useCallback(() => {
    if (!csvData) return;

    setIsProcessing(true);
    setProgress({ stage: 'validating', progress: 0, message: 'Validating data...' });

    setTimeout(() => {
      const result = validateCSVData(csvData, fieldMappings, existingCompanies);
      setValidationResult(result);
      setCurrentStep('validation');
      setProgress({ 
        stage: 'validating', 
        progress: 100, 
        message: `Validation complete: ${result.summary.validRows} valid rows` 
      });
      setIsProcessing(false);
    }, 500);
  }, [csvData, fieldMappings, existingCompanies]);

  const handleImport = async () => {
    if (!validationResult) return;

    setIsProcessing(true);
    setCurrentStep('import');
    
    try {
      setProgress({ 
        stage: 'importing', 
        progress: 0, 
        totalRows: validationResult.validRows.length,
        message: 'Starting import...' 
      });

      // Simulate progress for UI feedback
      for (let i = 0; i <= validationResult.validRows.length; i++) {
        setProgress({
          stage: 'importing',
          progress: (i / validationResult.validRows.length) * 100,
          currentRow: i,
          totalRows: validationResult.validRows.length,
          message: `Importing company ${i} of ${validationResult.validRows.length}...`
        });
        
        if (i < validationResult.validRows.length) {
          await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for UI
        }
      }

      await onImport(validationResult.validRows, { skipDuplicates });
      
      setProgress({ 
        stage: 'complete', 
        progress: 100, 
        message: `Successfully imported ${validationResult.validRows.length} companies` 
      });
      
      toast.success(`Successfully imported ${validationResult.validRows.length} companies`);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      toast.error('Import failed');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const resetDialog = () => {
    setFile(null);
    setCsvData(null);
    setValidationResult(null);
    setProgress(null);
    setCurrentStep('upload');
    setFieldMappings(defaultFieldMappings);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const csvHeaders = csvData?.[0] || [];
  const companyFields = [
    'name', 'email', 'website', 'domain', 'industry', 'size', 'location',
    'phone', 'description', 'founded', 'linkedin', 'twitter', 'facebook', 'ignore'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Companies</DialogTitle>
          <DialogDescription>
            Import multiple companies from a CSV file with field mapping and validation
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={currentStep !== 'upload' && !csvData}>
              1. Upload
            </TabsTrigger>
            <TabsTrigger value="mapping" disabled={!csvData}>
              2. Field Mapping
            </TabsTrigger>
            <TabsTrigger value="validation" disabled={!validationResult}>
              3. Validation
            </TabsTrigger>
            <TabsTrigger value="import" disabled={!validationResult}>
              4. Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>CSV File Upload</Label>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <File className="h-8 w-8 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  {csvData && (
                    <Badge variant="secondary">
                      {csvData.length - 1} rows detected
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p>Drag and drop your CSV file here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Only CSV files are supported
                  </p>
                </div>
              )}
              
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Label
                htmlFor="file-upload"
                className={`inline-flex items-center justify-center mt-4 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${
                  file ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {file ? 'Change File' : 'Select File'}
              </Label>
            </div>

            {progress && progress.stage === 'parsing' && (
              <div className="space-y-2">
                <Progress value={progress.progress} />
                <p className="text-sm text-muted-foreground">{progress.message}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Field Mapping</Label>
              <Button variant="outline" size="sm" onClick={addFieldMapping}>
                Add Mapping
              </Button>
            </div>

            <ScrollArea className="h-64 border rounded-md p-4">
              <div className="space-y-3">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <Select
                      value={mapping.csvColumn}
                      onValueChange={(value) => handleFieldMappingChange(index, 'csvColumn', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="CSV Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header.toLowerCase()}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <MapPin className="h-4 w-4 text-muted-foreground" />

                    <Select
                      value={mapping.companyField}
                      onValueChange={(value) => handleFieldMappingChange(index, 'companyField', value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {companyFields.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field === 'ignore' ? 'Ignore Column' : field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`required-${index}`}
                        checked={mapping.isRequired}
                        onCheckedChange={(checked) => 
                          handleFieldMappingChange(index, 'isRequired', checked === true)
                        }
                      />
                      <Label htmlFor={`required-${index}`} className="text-sm">
                        Required
                      </Label>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFieldMapping(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button onClick={validateData} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Validate Data'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            {validationResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Total Rows
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{validationResult.summary.totalRows}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Valid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">{validationResult.summary.validRows}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center text-red-600">
                        <XCircle className="mr-2 h-4 w-4" />
                        Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-red-600">{validationResult.summary.errorRows}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center text-yellow-600">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Duplicates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-yellow-600">{validationResult.summary.duplicateRows}</p>
                    </CardContent>
                  </Card>
                </div>

                {validationResult.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Validation Errors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {validationResult.errors.slice(0, 10).map((error, index) => (
                            <p key={index} className="text-sm">
                              Row {error.row}: {error.error} (Field: {error.field})
                            </p>
                          ))}
                          {validationResult.errors.length > 10 && (
                            <p className="text-sm text-muted-foreground">
                              ...and {validationResult.errors.length - 10} more errors
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {validationResult.duplicates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-yellow-600">Duplicate Detection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id="skip-duplicates"
                          checked={skipDuplicates}
                          onCheckedChange={(checked) => setSkipDuplicates(checked === true)}
                        />
                        <Label htmlFor="skip-duplicates">Skip duplicate companies during import</Label>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {validationResult.duplicates.slice(0, 5).map((duplicate, index) => (
                            <p key={index} className="text-sm">
                              Row {duplicate.row}: Matches existing company "{duplicate.existingCompany.name}" by {duplicate.duplicateField}
                            </p>
                          ))}
                          {validationResult.duplicates.length > 5 && (
                            <p className="text-sm text-muted-foreground">
                              ...and {validationResult.duplicates.length - 5} more duplicates
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            {progress && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Import Progress</h3>
                  <Progress value={progress.progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">{progress.message}</p>
                  {progress.currentRow && progress.totalRows && (
                    <p className="text-xs text-muted-foreground">
                      {progress.currentRow} / {progress.totalRows} companies processed
                    </p>
                  )}
                </div>

                {progress.stage === 'complete' && (
                  <div className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-semibold text-green-600">Import Completed Successfully!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            {progress?.stage === 'complete' ? 'Close' : 'Cancel'}
          </Button>
          
          {currentStep === 'validation' && validationResult && validationResult.summary.validRows > 0 && (
            <Button onClick={handleImport} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${validationResult.summary.validRows} Companies`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedBulkUploadDialog;
