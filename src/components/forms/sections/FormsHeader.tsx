
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';

interface FormsHeaderProps {
  selectedTenantId: string | null;
  selectedTenantName: string | null;
  onCreateNew: () => void;
}

const FormsHeader: React.FC<FormsHeaderProps> = ({
  selectedTenantId,
  selectedTenantName,
  onCreateNew
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forms Manager</h1>
        <p className="text-gray-600">Create and manage dynamic forms with deployment configuration</p>
        {selectedTenantId && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <Building2 className="inline h-4 w-4 mr-1" />
              Current tenant context: <strong>{selectedTenantName}</strong>
            </p>
          </div>
        )}
      </div>
      <Button onClick={onCreateNew} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Form
      </Button>
    </div>
  );
};

export default FormsHeader;
