
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';

interface ModuleDependencySelectorProps {
  selectedDependencies: string[];
  onDependenciesChange: (dependencies: string[]) => void;
  currentModuleName?: string; // To prevent self-dependencies
}

const ModuleDependencySelector: React.FC<ModuleDependencySelectorProps> = ({
  selectedDependencies,
  onDependenciesChange,
  currentModuleName
}) => {
  // Fetch all modules (both active and inactive) since we might want to depend on inactive modules
  const { data: modules, isLoading, error } = useSystemModules(false);

  const handleDependencyToggle = (moduleName: string, checked: boolean) => {
    console.log('Toggling dependency:', moduleName, 'checked:', checked);
    
    if (checked) {
      const newDependencies = [...selectedDependencies, moduleName];
      console.log('New dependencies:', newDependencies);
      onDependenciesChange(newDependencies);
    } else {
      const newDependencies = selectedDependencies.filter(dep => dep !== moduleName);
      console.log('New dependencies after removal:', newDependencies);
      onDependenciesChange(newDependencies);
    }
  };

  // Filter out current module to prevent self-dependencies
  const availableModules = modules?.filter(module => 
    currentModuleName ? module.name !== currentModuleName : true
  ) || [];

  console.log('Available modules for dependencies:', availableModules.map(m => m.name));
  console.log('Current selected dependencies:', selectedDependencies);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Module Dependencies</Label>
        <div className="flex items-center justify-center p-4 border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading modules...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Module Dependencies</Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load modules. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!availableModules.length) {
    return (
      <div className="space-y-2">
        <Label>Module Dependencies</Label>
        <div className="p-4 border rounded-md text-center text-sm text-muted-foreground">
          No modules available for dependencies
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Module Dependencies</Label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
        {availableModules.map((module) => (
          <div key={module.name} className="flex items-center space-x-2">
            <Checkbox
              id={`dep-${module.name}`}
              checked={selectedDependencies.includes(module.name)}
              onCheckedChange={(checked) => 
                handleDependencyToggle(module.name, checked as boolean)
              }
            />
            <Label 
              htmlFor={`dep-${module.name}`}
              className="text-sm cursor-pointer flex-1"
              title={module.description || `${module.name} module`}
            >
              <div className="flex flex-col">
                <span>{getDisplayName(module.name)}</span>
                {module.category && (
                  <span className="text-xs text-muted-foreground">
                    {module.category}
                  </span>
                )}
              </div>
            </Label>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Select modules that this module depends on to function properly</p>
        {selectedDependencies.length > 0 && (
          <p className="text-blue-600">
            Selected: {selectedDependencies.map(dep => getDisplayName(dep)).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ModuleDependencySelector;
