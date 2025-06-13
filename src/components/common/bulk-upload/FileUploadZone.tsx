
import React from 'react';
import { Upload, File } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxFileSize: number;
  acceptedTypes: string[];
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  file,
  onFileChange,
  maxFileSize,
  acceptedTypes
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
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
          <p className="text-sm text-gray-500">Maximum file size: {formatFileSize(maxFileSize)}</p>
        </div>
      )}
      <Input 
        id="file-upload" 
        type="file" 
        accept={acceptedTypes.join(',')} 
        className="hidden"
        onChange={onFileChange}
      />
      <label 
        htmlFor="file-upload"
        className={`inline-flex items-center justify-center mt-4 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${file ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'} h-10 px-4 py-2 cursor-pointer`}
      >
        {file ? 'Change File' : 'Select File'}
      </label>
    </div>
  );
};

export default FileUploadZone;
