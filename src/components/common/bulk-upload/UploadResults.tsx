
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UploadResultsProps {
  results: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

const UploadResults: React.FC<UploadResultsProps> = ({ results }) => {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h4 className="font-medium flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Upload Results
      </h4>
      <div className="text-sm space-y-1">
        <p className="text-green-600">✓ Successfully imported: {results.successful}</p>
        <p className="text-red-600">✗ Failed to import: {results.failed}</p>
        {results.errors.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Errors:</p>
            <ul className="list-disc list-inside text-red-600 max-h-32 overflow-y-auto">
              {results.errors.map((error, index) => (
                <li key={index} className="text-xs">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResults;
