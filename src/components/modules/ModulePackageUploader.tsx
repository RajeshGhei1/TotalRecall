
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { moduleRepository, ModulePackage } from '@/services/moduleRepository';
import { useAuth } from '@/contexts/AuthContext';

interface ModulePackageUploaderProps {
  onUploadComplete?: (moduleId: string) => void;
  onClose?: () => void;
}

const ModulePackageUploader: React.FC<ModulePackageUploaderProps> = ({ 
  onUploadComplete,
  onClose 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/gzip', 'application/x-tar'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.zip') && !file.name.endsWith('.tar.gz')) {
      toast({
        title: "Invalid file type",
        description: "Please select a ZIP or TAR.GZ file",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    // Try to extract manifest (mock implementation for now)
    try {
      const mockManifest = {
        id: file.name.replace(/\.(zip|tar\.gz)$/, ''),
        name: file.name.replace(/\.(zip|tar\.gz)$/, '').replace(/[_-]/g, ' '),
        version: '1.0.0',
        description: 'Uploaded module package',
        category: 'custom',
        author: user?.email || 'Unknown',
        license: 'MIT',
        dependencies: [],
        entryPoint: 'index.js',
        requiredPermissions: [],
        subscriptionTiers: ['professional'],
        loadOrder: 100,
        autoLoad: true,
        canUnload: true,
        minCoreVersion: '1.0.0'
      };
      
      setManifest(mockManifest);
      
      // Validate manifest
      setIsValidating(true);
      const validation = await moduleRepository.validateManifest(mockManifest);
      setValidationResult(validation);
      setIsValidating(false);
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "Could not extract module manifest",
        variant: "destructive"
      });
      setIsValidating(false);
    }
  }, [user, toast]);

  const handleUpload = async () => {
    if (!selectedFile || !manifest || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Calculate file hash
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const packageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Create module package
      const modulePackage: ModulePackage = {
        id: manifest.id,
        packageHash,
        size: selectedFile.size,
        manifest,
        file: selectedFile
      };

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload module
      const result = await moduleRepository.uploadModule(modulePackage, user.id);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Module uploaded successfully",
        description: `Module ${result.moduleId} v${result.version} has been uploaded for review`
      });

      onUploadComplete?.(result.moduleId);
      
      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setManifest(null);
        setUploadProgress(0);
        setValidationResult(null);
      }, 2000);

    } catch (error) {
      console.error('Error uploading module:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload module",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Upload Module Package</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="module-file">Module Package File</Label>
          <Input
            id="module-file"
            type="file"
            accept=".zip,.tar.gz"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Upload a ZIP or TAR.GZ file containing your module
          </p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {/* Manifest Info */}
        {manifest && (
          <div className="space-y-3">
            <h4 className="font-medium">Module Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p>{manifest.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Version</Label>
                <p>{manifest.version}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <p className="capitalize">{manifest.category}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Author</Label>
                <p>{manifest.author}</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Results */}
        {isValidating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Validating module manifest...
          </div>
        )}

        {validationResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">
                Validation {validationResult.isValid ? 'Passed' : 'Failed'}
              </span>
            </div>

            {validationResult.errors.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs text-red-600">Errors</Label>
                {validationResult.errors.map((error: string, index: number) => (
                  <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs text-yellow-600">Warnings</Label>
                {validationResult.warnings.map((warning: string, index: number) => (
                  <p key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                    {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !validationResult?.isValid || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Module'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModulePackageUploader;
