import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Blocks, Settings, Users, BarChart3, MessageSquare, Zap } from 'lucide-react';
import { useSystemModules, SystemModule } from '@/hooks/useSystemModules';

interface ModuleSelectionStepProps {
  selectedModules: string[];
  moduleConfigs: Record<string, any>;
  onUpdate: (modules: string[], configs: Record<string, any>) => void;
}

const ModuleSelectionStep: React.FC<ModuleSelectionStepProps> = ({ 
  selectedModules, 
  moduleConfigs, 
  onUpdate 
}) => {
  const { data: modules, isLoading } = useSystemModules();
  
  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    let newSelected: string[];
    if (checked) {
      newSelected = [...selectedModules, moduleId];
    } else {
      newSelected = selectedModules.filter(id => id !== moduleId);
      // Remove config for unselected module
      const newConfigs = { ...moduleConfigs };
      delete newConfigs[moduleId];
      onUpdate(newSelected, newConfigs);
      return;
    }
    onUpdate(newSelected, moduleConfigs);
  };

  const handleConfigUpdate = (moduleId: string, config: any) => {
    const newConfigs = {
      ...moduleConfigs,
      [moduleId]: { ...moduleConfigs[moduleId], ...config }
    };
    onUpdate(selectedModules, newConfigs);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'core': Blocks,
      'analytics': BarChart3,
      'communication': MessageSquare,
      'integrations': Zap,
      'recruitment': Users,
      'talent': Users,
      'configuration': Settings,
      'system-admin': Settings,
      'tenant-admin': Settings
    };
    const Icon = icons[category] || Blocks;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'core': 'bg-blue-100 text-blue-800',
      'analytics': 'bg-green-100 text-green-800',
      'communication': 'bg-purple-100 text-purple-800',
      'integrations': 'bg-orange-100 text-orange-800',
      'recruitment': 'bg-indigo-100 text-indigo-800',
      'talent': 'bg-pink-100 text-pink-800',
      'configuration': 'bg-gray-100 text-gray-800',
      'system-admin': 'bg-red-100 text-red-800',
      'tenant-admin': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const groupedModules = modules?.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, SystemModule[]>) || {};

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Modules</h3>
        <p className="text-sm text-muted-foreground">
          Choose which modules to assign to this tenant and configure their settings
        </p>
      </div>

      {selectedModules.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Blocks className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(groupedModules).map(([category, categoryModules]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {getCategoryIcon(category)}
                <span className="capitalize">{category.replace('-', ' ')}</span>
                <Badge className={getCategoryColor(category)}>
                  {categoryModules.length} module{categoryModules.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryModules.map((module) => {
                const isSelected = selectedModules.includes(module.id);
                const config = moduleConfigs[module.id] || {};
                
                return (
                  <div key={module.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={module.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleModuleToggle(module.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label htmlFor={module.id} className="font-medium cursor-pointer">
                            {module.name}
                          </Label>
                          {module.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {module.description}
                            </p>
                          )}
                        </div>
                        
                        {isSelected && (
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                            <div>
                              <Label className="text-xs">Custom Limit</Label>
                              <Input
                                placeholder="e.g., 100"
                                value={config.customLimit || ''}
                                onChange={(e) => handleConfigUpdate(module.id, { customLimit: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Expires (days)</Label>
                              <Input
                                type="number"
                                placeholder="365"
                                value={config.expiryDays || ''}
                                onChange={(e) => handleConfigUpdate(module.id, { expiryDays: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedModules.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <Blocks className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-yellow-800 font-medium">No modules selected</p>
            <p className="text-sm text-yellow-700 mt-1">
              Please select at least one module to continue
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleSelectionStep;
