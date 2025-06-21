
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Settings, 
  Code, 
  AlertTriangle,
  CheckCircle,
  Play,
  Package,
  TrendingUp
} from 'lucide-react';
import { LoadedModule } from '@/types/modules';
import ModuleProgressIndicator from './ModuleProgressIndicator';
import ModulePromotionButton from './ModulePromotionButton';

interface ModuleCardProps {
  module: LoadedModule;
  viewMode: 'grid' | 'list';
  onPreview: (moduleId: string) => void;
  onEditCode: (moduleId: string, moduleName: string) => void;
  onOpenSettings: (module: LoadedModule) => void;
  onPromotionSuccess?: () => void;
  showPromotionControls?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  viewMode,
  onPreview,
  onEditCode,
  onOpenSettings,
  onPromotionSuccess,
  showPromotionControls = true
}) => {
  // Extract real development stage and progress from module data
  const developmentStage = module.developmentStage?.stage || 'planning';
  const progress = module.progressData?.overall_progress || 0;

  const getStatusIcon = () => {
    if (module.status === 'error') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (module.status === 'loaded') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getStatusBadge = () => {
    if (module.status === 'error') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Error
        </Badge>
      );
    }
    if (module.status === 'loaded') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        Loading...
      </Badge>
    );
  };

  const getCategoryIcon = () => {
    return <Package className="h-8 w-8 text-gray-400" />;
  };

  const handleRunTest = () => {
    const testUrl = `/superadmin/module-testing?moduleId=${module.manifest.id}`;
    window.open(testUrl, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 bg-white">
        <div className="flex items-center p-6">
          {/* Module Icon */}
          <div className="w-28 h-28 flex-shrink-0 mr-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl border-2 border-gray-100 group-hover:border-gray-200 transition-all duration-300 flex items-center justify-center shadow-sm">
            {getCategoryIcon()}
          </div>
          
          {/* Module Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {module.manifest.name}
                  </h3>
                  {getStatusBadge()}
                </div>
                
                {/* Progress and Stage Info */}
                <div className="mb-3">
                  <ModuleProgressIndicator 
                    stage={developmentStage}
                    progress={progress}
                    showDetails={true}
                    size="md"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    {module.manifest.category}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                    v{module.manifest.version || '1.0.0'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                  {module.manifest.description}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreview(module.manifest.id)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => onEditCode(module.manifest.id, module.manifest.name)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                <Code className="h-4 w-4" />
                Edit Code
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onOpenSettings(module)}
                className="flex items-center gap-2 hover:bg-gray-100 transition-all"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunTest}
                className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all"
              >
                <Play className="h-4 w-4" />
                Test
              </Button>
              
              {/* Promotion Button */}
              {showPromotionControls && (
                <ModulePromotionButton
                  moduleId={module.manifest.id}
                  currentStage={developmentStage}
                  progress={progress}
                  onPromotionSuccess={onPromotionSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 bg-white overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {module.manifest.name}
            </span>
            {getStatusIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
              {module.manifest.category}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Module Icon */}
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-lg border-2 border-gray-100 p-4 min-h-[120px] flex items-center justify-center">
          {getCategoryIcon()}
        </div>
        
        {/* Progress Indicator */}
        <ModuleProgressIndicator 
          stage={developmentStage}
          progress={progress}
          showDetails={true}
          size="sm"
        />
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed min-h-[2.5rem]">
          {module.manifest.description}
        </p>
        
        {/* Version and Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            v{module.manifest.version || '1.0.0'}
          </Badge>
          {getStatusBadge()}
        </div>
        
        {/* Promotion Button */}
        {showPromotionControls && (
          <div className="pt-2">
            <ModulePromotionButton
              moduleId={module.manifest.id}
              currentStage={developmentStage}
              progress={progress}
              onPromotionSuccess={onPromotionSuccess}
            />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(module.manifest.id)}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => onEditCode(module.manifest.id, module.manifest.name)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
          >
            <Code className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenSettings(module)}
            className="flex items-center gap-2 hover:bg-gray-100 transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTest}
            className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all"
          >
            <Play className="h-4 w-4" />
            Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
