import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSystemModules } from '@/hooks/useSystemModules';

interface ModuleDependencySelectorProps {
  selectedDependencies: string[];
  onDependenciesChange: (dependencies: string[]) => void;
}

const ModuleDependencySelector: React.FC<ModuleDependencySelectorProps> = ({
  selectedDependencies,
  onDependenciesChange
}) => {
  const { data: modules } = useSystemModules();

  const handleDependencyToggle = (moduleName: string, checked: boolean) => {
    if (checked) {
      onDependenciesChange([...selectedDependencies, moduleName]);
    } else {
      onDependenciesChange(selectedDependencies.filter(dep => dep !== moduleName));
    }
  };

  const coreModules = [
    'people_management',
    'analytics_engine',
    'ai_orchestration',
    'communication_hub',
    'workflow_designer',
    'integration_framework'
  ];

  const availableModules = modules?.map(m => m.name) || [];
  const allModules = [...new Set([...coreModules, ...availableModules])];

  return (
    <div className="space-y-2">
      <Label>Module Dependencies</Label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
        {allModules.map((moduleName) => (
          <div key={moduleName} className="flex items-center space-x-2">
            <Checkbox
              id={`dep-${moduleName}`}
              checked={selectedDependencies.includes(moduleName)}
              onCheckedChange={(checked) => 
                handleDependencyToggle(moduleName, checked as boolean)
              }
            />
            <Label 
              htmlFor={`dep-${moduleName}`}
              className="text-sm cursor-pointer"
            >
              {moduleName.replace(/_/g, ' ')}
            </Label>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Select modules that this module depends on to function properly
      </p>
    </div>
  );
};

export default ModuleDependencySelector;
