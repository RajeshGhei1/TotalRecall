
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
  Play
} from 'lucide-react';
import { LoadedModule } from '@/types/modules';
import ModuleRenderer from '../ModuleRenderer';

interface ModuleCardProps {
  module: LoadedModule;
  viewMode: 'grid' | 'list';
  onPreview: (moduleId: string) => void;
  onEditCode: (moduleId: string, moduleName: string) => void;
  onOpenSettings: (module: LoadedModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  viewMode,
  onPreview,
  onEditCode,
  onOpenSettings
}) => {
  const getStatusIcon = () => {
    if (module.status === 'error') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (module.status === 'loaded') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (module.status === 'error') {
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Error</span>
        </div>
      );
    }
    if (module.status === 'loaded') {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Active</span>
        </div>
      );
    }
    return null;
  };

  const handleRunTest = () => {
    // Navigate to module testing page with this module's ID
    const testUrl = `/superadmin/module-testing?moduleId=${module.manifest.id}`;
    window.open(testUrl, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
        <div className="flex items-center p-6">
          {/* Module Preview */}
          <div className="w-24 h-24 flex-shrink-0 mr-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <ModuleRenderer moduleId={module.manifest.id} showError={false} />
            </div>
          </div>
          
          {/* Module Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {module.manifest.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusText()}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {module.manifest.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{module.manifest.version || '1.0.0'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {module.manifest.description}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreview(module.manifest.id)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => onEditCode(module.manifest.id, module.manifest.name)}
                className="flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                Edit Code
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onOpenSettings(module)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunTest}
                className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Play className="h-4 w-4" />
                Test
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {module.manifest.name}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant="secondary">{module.manifest.category}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ModuleRenderer moduleId={module.manifest.id} showError={false} />
        </div>
        <p className="text-sm text-muted-foreground mb-4">{module.manifest.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(module.manifest.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => onEditCode(module.manifest.id, module.manifest.name)}
          >
            <Code className="h-4 w-4 mr-2" />
            Edit Code
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenSettings(module)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTest}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
