import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Settings, 
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Link,
  UserCheck,
  Brain,
  Shield,
  Database,
  Sparkles,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isFunctionalModule, getFunctionalModuleColors } from '@/utils/moduleUtils';
import { moduleNavigationService } from '@/services/moduleNavigationService';
import { normalizeModuleName } from '@/utils/moduleNameMapping';
import ModuleSettingsDialog from './ModuleSettingsDialog';
import { toast } from '@/hooks/use-toast';
import { SystemModule } from '@/hooks/useSystemModules';

interface ModuleCardProps {
  module: SystemModule;
  onEdit: (module: SystemModule) => void;
  onDelete: (module: SystemModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const isFunction = isFunctionalModule(module.name);
  const functionalColors = getFunctionalModuleColors();
  const normalizedModuleId = normalizeModuleName(module.name);
  const moduleRoute = moduleNavigationService.getModuleRoute(normalizedModuleId);

  const getCategoryColor = (category: string) => {
    // If it's a functional module, return green colors
    if (isFunction) {
      return `${functionalColors.background} ${functionalColors.border} ${functionalColors.text}`;
    }

    // Original category colors for non-functional modules
    const colors: Record<string, string> = {
      'core': 'bg-blue-50 border-blue-200 text-blue-700',
      'analytics': 'bg-green-50 border-green-200 text-green-700',
      'communication': 'bg-purple-50 border-purple-200 text-purple-700',
      'integrations': 'bg-orange-50 border-orange-200 text-orange-700',
      'recruitment': 'bg-red-50 border-red-200 text-red-700',
      'talent': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      'configuration': 'bg-gray-50 border-gray-200 text-gray-700',
      'system-admin': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'tenant-admin': 'bg-cyan-50 border-cyan-200 text-cyan-700'
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'core': <Database className="h-4 w-4" />,
      'analytics': <BarChart3 className="h-4 w-4" />,
      'communication': <MessageSquare className="h-4 w-4" />,
      'integrations': <Link className="h-4 w-4" />,
      'recruitment': <Users className="h-4 w-4" />,
      'talent': <UserCheck className="h-4 w-4" />,
      'configuration': <Settings className="h-4 w-4" />,
      'system-admin': <Shield className="h-4 w-4" />,
      'tenant-admin': <Brain className="h-4 w-4" />
    };
    return icons[category] || <Package className="h-4 w-4" />;
  };

  const getBorderColor = () => {
    if (isFunction) {
      return functionalColors.leftBorder;
    }
    return getCategoryColor(module.category).split(' ')[1]; // Extract border color from category color
  };

  const handleViewModule = () => {
    if (moduleRoute) {
      navigate(moduleRoute.path);
      toast({
        title: 'Navigating to Module',
        description: `Opening ${moduleRoute.name}`,
      });
    } else {
      toast({
        title: 'Module Not Available',
        description: 'This module implementation is not yet available.',
        variant: 'destructive',
      });
    }
  };

  const handleSettingsClick = () => {
    console.log('Settings button clicked for module:', module.name);
    setSettingsOpen(true);
  };

  const handleSettingsSave = (updatedSettings: Partial<SystemModule>) => {
    console.log('Saving module settings:', updatedSettings);
    toast({
      title: 'Settings Saved',
      description: 'Module settings have been updated successfully.',
    });
    setSettingsOpen(false);
  };

  const handleSettingsClose = () => {
    console.log('Settings dialog closed');
    setSettingsOpen(false);
  };

  return (
    <>
      <Card className={`group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        !module.is_active ? 'opacity-60 bg-gray-50' : 'bg-white'
      } border-l-4 ${getBorderColor()}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Module Name and Version */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(module.category)}`}>
                  {getCategoryIcon(module.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {module.name}
                  </h3>
                  {module.version && (
                    <p className="text-sm text-gray-500">Version {module.version}</p>
                  )}
                </div>
              </div>
              
              {/* Category and Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={`${getCategoryColor(module.category)} border font-medium`}
                >
                  <span className="capitalize">{module.category.replace('-', ' ')}</span>
                </Badge>
                
                {/* Functional Module Badge */}
                {isFunction && (
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Functional
                  </Badge>
                )}
                
                {/* Accessible Badge */}
                {moduleRoute && (
                  <Badge 
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Accessible
                  </Badge>
                )}
                
                <Badge 
                  variant={module.is_active ? 'default' : 'secondary'} 
                  className={`${module.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                  {module.is_active ? (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    'Inactive'
                  )}
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {moduleRoute && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewModule}
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                  title="View Module"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettingsClick}
                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                title="Module Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(module)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                title="Edit Module"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(module)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Delete Module"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Description */}
          {module.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {module.description}
            </p>
          )}

          {/* Module Route Info */}
          {moduleRoute && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Module Access</span>
              </div>
              <p className="text-xs text-blue-700">{moduleRoute.description}</p>
              <p className="text-xs text-blue-600 mt-1">Route: {moduleRoute.path}</p>
            </div>
          )}
          
          {/* Dependencies */}
          {module.dependencies && module.dependencies.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Dependencies
              </p>
              <div className="flex flex-wrap gap-1">
                {module.dependencies.slice(0, 3).map((dep, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    {dep}
                  </Badge>
                ))}
                {module.dependencies.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    +{module.dependencies.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Default Limits */}
          {module.default_limits && Object.keys(module.default_limits).length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                Default Limits
              </p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(module.default_limits).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {String(value)}
                    </span>
                  </div>
                ))}
                {Object.keys(module.default_limits).length > 2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{Object.keys(module.default_limits).length - 2} more limits
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Settings Dialog */}
      <ModuleSettingsDialog
        open={settingsOpen}
        onOpenChange={handleSettingsClose}
        module={module}
        onSave={handleSettingsSave}
      />
    </>
  );
};

export default ModuleCard;
