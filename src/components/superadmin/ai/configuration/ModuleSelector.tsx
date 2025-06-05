
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Module {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
}

interface ModuleSelectorProps {
  modules?: Module[];
  selectedModule: string;
  onModuleSelect: (moduleId: string) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  modules,
  selectedModule,
  onModuleSelect
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Module</CardTitle>
        <CardDescription>Choose a module to configure AI settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {modules?.map((module) => (
          <div
            key={module.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedModule === module.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onModuleSelect(module.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{module.name}</h4>
                <p className="text-sm text-gray-600">{module.category}</p>
              </div>
              <Badge variant={module.is_active ? 'default' : 'secondary'}>
                {module.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
