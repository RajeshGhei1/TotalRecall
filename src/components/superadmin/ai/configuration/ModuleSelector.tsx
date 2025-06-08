
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SystemModule } from '@/hooks/modules/useSystemModules';

interface ModuleSelectorProps {
  modules?: SystemModule[];
  selectedModule: string;
  onModuleSelect: (moduleId: string) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  modules = [],
  selectedModule,
  onModuleSelect
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Module</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {modules.map((module) => (
          <Button
            key={module.id}
            variant={selectedModule === module.id ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => onModuleSelect(module.id)}
          >
            <div className="flex items-center justify-between w-full">
              <span>{module.name}</span>
              <Badge variant={module.is_active ? 'default' : 'secondary'}>
                {module.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
