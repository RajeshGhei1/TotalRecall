
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModuleRegistry, ModuleDefinition } from '@/services/moduleRegistry';
import { Building2, BarChart, Brain, Zap, Package, BookOpen } from 'lucide-react';

const categoryIcons = {
  core: Package,
  business: Building2,
  recruitment: Package,
  analytics: BarChart,
  ai: Brain,
  integration: Zap,
  communication: BookOpen
};

const categoryColors = {
  core: 'bg-slate-100',
  business: 'bg-blue-100',
  recruitment: 'bg-green-100',
  analytics: 'bg-purple-100',
  ai: 'bg-orange-100',
  integration: 'bg-yellow-100',
  communication: 'bg-pink-100'
};

interface ModuleConfigurationManagerProps {
  onAssignModule?: (moduleId: string) => void;
}

const ModuleConfigurationManager: React.FC<ModuleConfigurationManagerProps> = ({
  onAssignModule
}) => {
  const coreModules = ModuleRegistry.getCoreModules();
  const subscriptionModules = ModuleRegistry.getSubscriptionModules();

  const renderModule = (module: ModuleDefinition, isAssignable: boolean = false) => {
    const IconComponent = categoryIcons[module.category];
    
    return (
      <Card key={module.id} className={`${categoryColors[module.category]} border-l-4 border-l-blue-500`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{module.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={module.isCore ? 'default' : 'secondary'}>
                {module.isCore ? 'Core' : 'Module'}
              </Badge>
              {module.pricing && (
                <Badge variant="outline">
                  ${module.pricing.monthlyPrice}/mo
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
              <Badge variant="outline" className="capitalize">
                {module.category}
              </Badge>
            </div>
            
            {module.dependencies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Dependencies</p>
                <div className="flex flex-wrap gap-1">
                  {module.dependencies.map(dep => (
                    <Badge key={dep} variant="secondary" className="text-xs">
                      {ModuleRegistry.getModule(dep)?.name || dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {isAssignable && onAssignModule && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAssignModule(module.id)}
                className="w-full mt-3"
              >
                Assign to Subscription Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Core System Modules</h3>
        <p className="text-gray-600 mb-6">
          These modules are always available and handle core system functionality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreModules.map(module => renderModule(module, false))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Subscription Modules</h3>
        <p className="text-gray-600 mb-6">
          These modules can be assigned to subscription plans and control access to specific features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptionModules.map(module => renderModule(module, true))}
        </div>
      </div>
    </div>
  );
};

export default ModuleConfigurationManager;
