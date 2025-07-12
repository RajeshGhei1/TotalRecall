
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Package,
  Info
} from 'lucide-react';
import { moduleRepository } from '@/services/moduleRepository';

interface ModulePackageUploaderProps {
  onUploadComplete?: () => void;
  onClose?: () => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compatibilityIssues: string[];
}

const ModulePackageUploader: React.FC<ModulePackageUploaderProps> = ({
  onUploadComplete,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<unknown>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<unknown>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);
    setUploadResult(null);

    // Try to extract and validate manifest
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const manifestData = JSON.parse(text);
        setManifest(manifestData);
        
        // Validate manifest
        const validation = await moduleRepository.validateManifest(manifestData);
        setValidationResult(validation);
      } else {
        // For other file types, we'd need to extract the manifest from the package
        setManifest(null);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setValidationResult({
        isValid: false,
        errors: ['Failed to read or parse file'],
        warnings: [],
        compatibilityIssues: []
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !manifest) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Create module package
      const modulePackage = {
        id: manifest.id,
        packageHash: `hash-${Date.now()}`,
        size: selectedFile.size,
        manifest: manifest,
        file: selectedFile
      };

      // Upload to repository
      const result = await moduleRepository.uploadModule(modulePackage, 'current-user');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      
      // Call completion callback after a short delay
      setTimeout(() => {
        onUploadComplete?.();
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {validationResult.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Validation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validationResult.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-600 mb-2">Errors</h4>
              <div className="space-y-1">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationResult.warnings.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-yellow-600 mb-2">Warnings</h4>
              <div className="space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationResult.compatibilityIssues.length > 0 && (
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Compatibility Issues</h4>
              <div className="space-y-1">
                {validationResult.compatibilityIssues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-orange-600">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationResult.isValid && (
            <div className="text-green-600">
              <p className="text-sm">✓ Module package is valid and ready for upload</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderManifestPreview = () => {
    if (!manifest) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Module Manifest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Module ID</label>
              <p className="text-sm text-muted-foreground">{manifest.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">{manifest.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Version</label>
              <p className="text-sm text-muted-foreground">{manifest.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Badge variant="outline">{manifest.category}</Badge>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm text-muted-foreground">{manifest.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <p className="text-sm text-muted-foreground">{manifest.author}</p>
            </div>
            <div>
              <label className="text-sm font-medium">License</label>
              <p className="text-sm text-muted-foreground">{manifest.license}</p>
            </div>
          </div>

          {manifest.dependencies && manifest.dependencies.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium">Dependencies</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {manifest.dependencies.map((dep: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Module Package
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a module package (.zip, .tar.gz) or manifest (.json) file
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".zip,.tar.gz,.json"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {uploadResult && (
              <div className={`p-3 rounded-md ${uploadResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {uploadResult.error ? (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>Upload failed: {uploadResult.error}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Module uploaded successfully!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {renderManifestPreview()}
      {renderValidationResults()}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !validationResult?.isValid || isUploading}
        >
          <Package className="h-4 w-4 mr-2" />
          Upload Module
        </Button>
      </div>
    </div>
  );
};

export default ModulePackageUploader;
