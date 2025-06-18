
import React, { Suspense, ErrorBoundary } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { moduleLoader } from '@/services/moduleLoader';
import { LoadedModule } from '@/types/modules';

interface ModuleRendererProps {
  moduleId: string;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
  showError?: boolean;
}

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
  moduleId: string;
  showError?: boolean;
}

const ModuleErrorBoundary: React.FC<ModuleErrorBoundaryProps> = ({ 
  children, 
  moduleId, 
  showError = true 
}) => {
  return (
    <ErrorBoundary
      fallback={
        showError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to render module: {moduleId}
            </AlertDescription>
          </Alert>
        ) : null
      }
    >
      {children}
    </ErrorBoundary>
  );
};

const ModuleLoadingFallback: React.FC<{ moduleId: string }> = ({ moduleId }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading {moduleId}...
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-32 bg-gray-100 rounded animate-pulse" />
    </CardContent>
  </Card>
);

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ 
  moduleId, 
  props = {}, 
  fallback,
  showError = true 
}) => {
  const [loadedModule, setLoadedModule] = React.useState<LoadedModule | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if module is already loaded
        const existingModule = moduleLoader.getModule(moduleId);
        if (existingModule && existingModule.status === 'loaded') {
          setLoadedModule(existingModule);
          setLoading(false);
          return;
        }

        // Load the module
        const context = {
          tenantId: 'default', // This would come from tenant context
          userId: 'system',
          permissions: ['read', 'write'],
          config: props
        };

        const module = await moduleLoader.loadModule(moduleId, context);
        setLoadedModule(module);
      } catch (err) {
        console.error(`Failed to load module ${moduleId}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId, props]);

  if (loading) {
    return fallback || <ModuleLoadingFallback moduleId={moduleId} />;
  }

  if (error) {
    if (!showError) return null;
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading module {moduleId}: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!loadedModule || !loadedModule.instance) {
    if (!showError) return null;
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Module {moduleId} not found or failed to load
        </AlertDescription>
      </Alert>
    );
  }

  // Render the module component
  try {
    const ModuleComponent = loadedModule.instance.Component;
    if (!ModuleComponent) {
      throw new Error('Module component not found');
    }

    return (
      <ModuleErrorBoundary moduleId={moduleId} showError={showError}>
        <Suspense fallback={fallback || <ModuleLoadingFallback moduleId={moduleId} />}>
          <ModuleComponent {...props} />
        </Suspense>
      </ModuleErrorBoundary>
    );
  } catch (renderError) {
    console.error(`Failed to render module ${moduleId}:`, renderError);
    if (!showError) return null;
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to render module {moduleId}
        </AlertDescription>
      </Alert>
    );
  }
};

export default ModuleRenderer;
