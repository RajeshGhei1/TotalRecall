
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ModulePermissionsHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

const ModulePermissionsHeader: React.FC<ModulePermissionsHeaderProps> = ({
  onSave,
  isSaving
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Module Permissions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure which modules are available for this plan
        </p>
      </div>
      <Button 
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </CardHeader>
  );
};

export default ModulePermissionsHeader;
