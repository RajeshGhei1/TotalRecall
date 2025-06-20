
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
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
    console.error(`Module ${this.props.moduleId} error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (!this.props.showError) return null;
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to render module: {this.props.moduleId}
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

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ 
  moduleId, 
  context,
  props = {}, 
  fallback,
  showError = true,
  showStatus = false,
  containerClassName
}) => {
  const [moduleComponent, setModuleComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadModuleComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Attempting to load module: ${moduleId}`);

        // First try to get from registry
        let component = moduleCodeRegistry.getComponent(moduleId);
        
        if (!component) {
          console.log(`Module ${moduleId} not in registry, attempting dynamic load...`);
          // Try to load dynamically
          component = await moduleCodeRegistry.loadModuleComponent(moduleId);
        }

        if (component) {
          console.log(`Successfully loaded module component: ${moduleId}`);
          setModuleComponent(component);
        } else {
          // Create a development status component
          console.warn(`Module ${moduleId} not found, creating status component`);
          const StatusComponent: React.FC<any> = (props) => (
            <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Development Module: {moduleId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-orange-100 p-3 rounded border border-orange-200">
                    <p className="text-sm text-orange-800 font-medium mb-2">
                      📋 Module Status: Implementation Required
                    </p>
                    <p className="text-xs text-orange-700">
                      This module exists in the database but doesn't have a React component implementation yet.
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border">
                    <p className="text-xs text-gray-500 mb-2">Module Configuration:</p>
                    <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                      {JSON.stringify({ moduleId, ...props }, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      🔧 Next Steps:
                    </p>
                    <ul className="text-xs text-blue-600 mt-1 space-y-1">
                      <li>• Create component file at: /src/modules/{moduleId}/index.tsx</li>
                      <li>• Implement the module functionality</li>
                      <li>• Test using the Module Testing Lab</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    ✅ Module loading system is operational
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          
          setModuleComponent(() => StatusComponent);
        }
      } catch (err) {
        console.error(`Failed to load module ${moduleId}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadModuleComponent();
  }, [moduleId]);

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

  if (!moduleComponent) {
    if (!showError) return null;
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Module {moduleId} component could not be loaded
        </AlertDescription>
      </Alert>
    );
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
