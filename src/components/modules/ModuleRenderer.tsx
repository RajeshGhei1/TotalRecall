
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { moduleLoader } from '@/services/moduleLoader';
import { LoadedModule, ModuleContext } from '@/types/modules';

interface ModuleRendererProps {
  moduleId: string;
  context: ModuleContext;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
  showStatus?: boolean;
  containerClassName?: string;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  moduleId,
  context,
  props = {},
  fallback,
  showStatus = false,
  containerClassName = ''
}) => {
  const [module, setModule] = useState<LoadedModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModule();
  }, [moduleId, context]);

  const loadModule = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`ModuleRenderer: Loading module ${moduleId}`);
      
      const loadedModule = await moduleLoader.loadModule(moduleId, context);
      setModule(loadedModule);
      
      if (loadedModule.status === 'error') {
        setError(loadedModule.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load module';
      console.error(`ModuleRenderer: Error loading module ${moduleId}:`, errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModuleStatus = () => {
    if (!showStatus) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Module: {moduleId}</span>
          {module && (
            <Badge 
              variant={
                module.status === 'loaded' ? 'default' : 
                module.status === 'error' ? 'destructive' : 
                'secondary'
              }
            >
              {module.status}
            </Badge>
          )}
        </div>
        
        {module && module.status === 'loaded' && (
          <div className="text-xs text-gray-500">
            Version: {module.manifest.version} | 
            Category: {module.manifest.category} |
            Loaded: {module.loadedAt.toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${containerClassName}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading module: {moduleId}</p>
        </div>
      </div>
    );
  }

  if (error || !module || module.status === 'error') {
    const errorMsg = error || module?.error || 'Module failed to load';
    
    if (fallback) {
      return (
        <div className={containerClassName}>
          {renderModuleStatus()}
          {fallback}
        </div>
      );
    }

    return (
      <div className={containerClassName}>
        {renderModuleStatus()}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Module Error:</strong> {errorMsg}
            <br />
            <span className="text-xs">Module ID: {moduleId}</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (module.status !== 'loaded' || !module.instance) {
    return (
      <div className={containerClassName}>
        {renderModuleStatus()}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Module is not ready for rendering (Status: {module.status})
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  try {
    // Render the module component
    const ModuleComponent = module.instance.Component;
    
    if (!ModuleComponent) {
      throw new Error('Module component not found');
    }

    return (
      <div className={containerClassName}>
        {renderModuleStatus()}
        <div className="module-content">
          <ModuleComponent {...props} />
        </div>
      </div>
    );
  } catch (renderError) {
    console.error(`ModuleRenderer: Error rendering module ${moduleId}:`, renderError);
    
    return (
      <div className={containerClassName}>
        {renderModuleStatus()}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Render Error:</strong> {renderError instanceof Error ? renderError.message : 'Unknown render error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
};

export default ModuleRenderer;
