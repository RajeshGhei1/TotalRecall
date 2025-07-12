
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Code, Database } from 'lucide-react';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { LoadedModule, ModuleContext } from '@/types/modules';

interface ModuleRendererProps {
  moduleId: string;
  context?: ModuleContext;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
  showError?: boolean;
  showStatus?: boolean;
  containerClassName?: string;
}

class ModuleErrorBoundary extends React.Component<
  { children: React.ReactNode; moduleId: string; showError?: boolean },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; moduleId: string; showError?: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`❌ Module ${this.props.moduleId} error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (!this.props.showError) return null;
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Module render error: {this.props.moduleId}
            <br />
            <span className="text-xs">{this.state.error?.message}</span>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

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

const ModuleNotFoundComponent: React.FC<{ moduleId: string; error?: string }> = ({ moduleId, error }) => (
  <Card className="border-2 border-red-200 bg-red-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-red-700">
        <AlertTriangle className="h-5 w-5" />
        Module Not Found: {moduleId}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="bg-red-100 p-3 rounded border border-red-200">
          <p className="text-sm text-red-800 font-medium mb-2">
            ❌ Module Loading Failed
          </p>
          <p className="text-xs text-red-700">
            The module "{moduleId}" exists in the database but its React component could not be loaded.
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-2 font-mono">
              Error: {error}
            </p>
          )}
        </div>
        
        <div className="bg-white p-3 rounded border">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Database className="h-3 w-3" />
            Expected Component Locations:
          </p>
          <ul className="text-xs text-gray-700 space-y-1 font-mono">
            <li>• /src/modules/{moduleId}/index.tsx</li>
            <li>• /src/modules/{moduleId}/Component.tsx</li>
            <li>• /src/modules/{moduleId}/{moduleId}.tsx</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
            <Code className="h-3 w-3" />
            To Fix This Issue:
          </p>
          <ul className="text-xs text-blue-600 mt-1 space-y-1">
            <li>1. Create the component file in one of the expected locations</li>
            <li>2. Export a default React component from the file</li>
            <li>3. Refresh the modules list to reload</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ 
  moduleId, 
  context,
  props = {}, 
  fallback,
  showError = true,
  showStatus = false,
  containerClassName
}) => {
  const [moduleComponent, setModuleComponent] = React.useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadModuleComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔍 ModuleRenderer: Loading module ${moduleId}`);

        // First try to get from registry
        let component = moduleCodeRegistry.getComponent(moduleId);
        
        if (!component) {
          console.log(`📦 Module ${moduleId} not in registry, attempting dynamic load...`);
          // Try to load dynamically
          component = await moduleCodeRegistry.loadModuleComponent(moduleId);
        }

        if (component) {
          console.log(`✅ ModuleRenderer: Successfully loaded ${moduleId}`);
          setModuleComponent(() => component);
        } else {
          console.warn(`❌ ModuleRenderer: Failed to load ${moduleId}`);
          setError('Component not found or failed to load');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`❌ ModuleRenderer: Error loading ${moduleId}:`, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadModuleComponent();
  }, [moduleId]);

  if (loading) {
    return fallback || <ModuleLoadingFallback moduleId={moduleId} />;
  }

  if (error || !moduleComponent) {
    if (!showError) return null;
    return <ModuleNotFoundComponent moduleId={moduleId} error={error || undefined} />;
  }

  // Render the module component
  try {
    const content = (
      <ModuleErrorBoundary moduleId={moduleId} showError={showError}>
        <Suspense fallback={fallback || <ModuleLoadingFallback moduleId={moduleId} />}>
          {React.createElement(moduleComponent, props)}
        </Suspense>
      </ModuleErrorBoundary>
    );

    if (containerClassName) {
      return <div className={containerClassName}>{content}</div>;
    }

    return content;
  } catch (renderError) {
    console.error(`❌ ModuleRenderer: Failed to render ${moduleId}:`, renderError);
    if (!showError) return null;
    return <ModuleNotFoundComponent moduleId={moduleId} error="Render error" />;
  }
};

export default ModuleRenderer;
