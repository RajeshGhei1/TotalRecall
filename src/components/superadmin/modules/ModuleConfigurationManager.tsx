
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, BarChart, Brain, Zap, Package, BookOpen, CheckCircle } from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { isFunctionalModule, getFunctionalModuleColors } from '@/utils/moduleUtils';

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
  const { data: allModules, isLoading } = useSystemModules(false);
  const functionalColors = getFunctionalModuleColors();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  // Separate core modules from subscription modules based on category
  const coreModules = allModules?.filter(module => 
    module.category === 'core' || 
    ['tenant_management', 'user_management', 'subscription_management', 'security_audit', 'global_settings'].includes(module.name)
  ) || [];
  
  const subscriptionModules = allModules?.filter(module => 
    module.category !== 'core' && 
    !['tenant_management', 'user_management', 'subscription_management', 'security_audit', 'global_settings'].includes(module.name)
  ) || [];

  const renderModule = (module: unknown, isAssignable: boolean = false) => {
    const IconComponent = categoryIcons[module.category as keyof typeof categoryIcons] || Package;
    const isCore = coreModules.includes(module);
    const isFunction = isFunctionalModule(module.name);
    
    // Use green colors for functional modules, otherwise use category colors
    const cardBackground = isFunction 
      ? functionalColors.background 
      : categoryColors[module.category as keyof typeof categoryColors] || 'bg-gray-100';
    
    const borderColor = isFunction ? functionalColors.leftBorder : 'border-l-blue-500';
    
    return (
      <Card key={module.id} className={`${cardBackground} border-l-4 ${borderColor}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{module.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {/* Functional Module Badge */}
              {isFunction && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Functional
                </Badge>
              )}
              
              <Badge variant={isCore ? 'default' : 'secondary'}>
                {isCore ? 'Core' : 'Module'}
              </Badge>
              {module.monthly_price && (
                <Badge variant="outline">
                  ${module.monthly_price}/mo
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
            
            {module.dependencies && module.dependencies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Dependencies</p>
                <div className="flex flex-wrap gap-1">
                  {module.dependencies.map((dep: string) => (
                    <Badge key={dep} variant="secondary" className="text-xs">
                      {allModules?.find(m => m.name === dep)?.name || dep}
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
