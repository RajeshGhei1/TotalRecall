/**
 * STANDARDS-COMPLIANT FEATURE RENDERER
 * Implements all 7 design principles for atomic, dependency-free, composable features
 */

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader, AlertTriangle, Settings, Play, Pause, Info, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { DynamicFeatureLoader } from '@/services/features/dynamicFeatureLoader';
import { featureEventBus, FeatureEvents } from '@/services/features/featureEventBus';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { 
  StandardsCompliantFeature, 
  FeatureContext, 
  FeatureExecutionResult 
} from '@/types/standardsCompliantFeatures';

interface StandardsCompliantFeatureRendererProps {
  moduleName: string;
  entityType?: string;
  entityId?: string;
  context?: Partial<FeatureContext>;
  renderMode?: 'embedded' | 'standalone' | 'modal' | 'overlay';
  className?: string;
  // Standards-compliant props
  featureFilters?: {
    category?: string;
    tags?: string[];
    minVersion?: string;
  };
  onFeatureExecution?: (featureId: string, result: FeatureExecutionResult) => void;
  onFeatureError?: (featureId: string, error: Error) => void;
  debugMode?: boolean;
}

export const StandardsCompliantFeatureRenderer: React.FC<StandardsCompliantFeatureRendererProps> = ({
  moduleName,
  entityType,
  entityId,
  context = {},
  renderMode = 'embedded',
  className,
  featureFilters,
  onFeatureExecution,
  onFeatureError,
  debugMode = false
}) => {
  const [featureLoader] = useState(() => new DynamicFeatureLoader());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  // Enhanced context with all required information
  const enhancedContext: FeatureContext = {
    ...context,
    moduleName,
    entityType,
    entityId,
    executionMode: 'sync',
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId: context.sessionId || `session_${Date.now()}`
  };

  // Get features assigned to this module using standards-compliant API
  const { data: features = [], isLoading, error } = useQuery({
    queryKey: ['standardsCompliantFeatures', moduleName, featureFilters],
    queryFn: async () => {
      const allFeatures = await featureLoader.listFeatures({
        isActive: true,
        ...featureFilters
      });
      
      // Filter features assigned to this module
      // In the database migration, we updated features to include module assignments
      return allFeatures.filter(feature => 
        feature.ui_component_path && // Only features with UI components
        feature.feature_config.pluggable !== false // Only pluggable features
      );
    },
  });

  // Subscribe to feature events for reactive updates
  useEffect(() => {
    const subscriptions: string[] = [];

    if (debugMode) {
      // Subscribe to all feature events for debugging
      subscriptions.push(
        featureEventBus.subscribe('feature:*', (eventName, payload) => {
          console.log(`🔥 Feature Event: ${eventName}`, payload);
        })
      );
    }

    // Subscribe to feature execution results
    subscriptions.push(
      featureEventBus.subscribe(FeatureEvents.FEATURE_EXECUTED, (eventName, payload, context) => {
        if (onFeatureExecution && context?.moduleName === moduleName) {
          onFeatureExecution(context.entityId || 'unknown', payload as FeatureExecutionResult);
        }
      })
    );

    // Subscribe to feature errors
    subscriptions.push(
      featureEventBus.subscribe(FeatureEvents.FEATURE_ERROR, (eventName, payload, context) => {
        if (onFeatureError && context?.moduleName === moduleName) {
          onFeatureError(context.entityId || 'unknown', new Error(String(payload)));
        }
      })
    );

    return () => {
      subscriptions.forEach(id => featureEventBus.unsubscribe(id));
    };
  }, [moduleName, onFeatureExecution, onFeatureError, debugMode]);

  const toggleFeatureExpansion = useCallback((featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  }, []);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading features...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load features: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (features.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No features assigned to this module</p>
            <p className="text-sm">Configure features through Feature Management</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {debugMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-800">🔍 Debug Mode</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-blue-700">
              <p><strong>Module:</strong> {moduleName}</p>
              <p><strong>Features:</strong> {features.length}</p>
              <p><strong>Context:</strong> {JSON.stringify(enhancedContext, null, 2)}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {features.map((feature) => (
        <StandardsCompliantFeatureComponent
          key={feature.feature_id}
          feature={feature}
          context={enhancedContext}
          renderMode={renderMode}
          isExpanded={expandedFeatures.has(feature.feature_id)}
          onToggleExpansion={() => toggleFeatureExpansion(feature.feature_id)}
          debugMode={debugMode}
        />
      ))}
    </div>
  );
};

interface StandardsCompliantFeatureComponentProps {
  feature: StandardsCompliantFeature;
  context: FeatureContext;
  renderMode: 'embedded' | 'standalone' | 'modal' | 'overlay';
  isExpanded: boolean;
  onToggleExpansion: () => void;
  debugMode?: boolean;
}

const StandardsCompliantFeatureComponent: React.FC<StandardsCompliantFeatureComponentProps> = ({
  feature,
  context,
  renderMode,
  isExpanded,
  onToggleExpansion,
  debugMode = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<FeatureExecutionResult | null>(null);
  const [FeatureComponent, setFeatureComponent] = useState<React.ComponentType | null>(null);

  // Check feature access using existing hook
  const { data: accessResult, isLoading: accessLoading } = useFeatureAccess(
    context.moduleName, 
    feature.feature_id
  );

  // Load feature component when access is granted
  useEffect(() => {
    if (!accessResult?.hasAccess || !feature.ui_component_path) {
      return;
    }

    const loadComponent = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const Component = await DynamicFeatureLoader.loadFeatureComponent(feature.ui_component_path);
        setFeatureComponent(() => Component);
        
        // Emit feature loaded event
        await featureEventBus.emit(FeatureEvents.FEATURE_LOADED, {
          featureId: feature.feature_id,
          version: feature.version,
          componentPath: feature.ui_component_path
        }, context);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load feature';
        setLoadError(errorMessage);
        
        // Emit feature error event
        await featureEventBus.emit(FeatureEvents.FEATURE_ERROR, {
          featureId: feature.feature_id,
          error: errorMessage,
          stage: 'component_loading'
        }, context);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadComponent();
  }, [accessResult?.hasAccess, feature.feature_id, feature.ui_component_path, feature.version, context]);

  // Handle feature execution
  const executeFeature = useCallback(async (input: unknown) => {
    try {
      setExecutionResult(null);
      
      const featureLoader = new DynamicFeatureLoader();
      const result = await featureLoader.executeFeature(feature.feature_id, input, context);
      
      setExecutionResult(result);
      
      // Emit execution result event
      await featureEventBus.emit(FeatureEvents.FEATURE_EXECUTED, {
        featureId: feature.feature_id,
        result,
        input
      }, context);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Execution failed';
      setExecutionResult({
        success: false,
        errors: [{ code: 'EXECUTION_ERROR', message: errorMessage, recoverable: false }]
      });
      
      await featureEventBus.emit(FeatureEvents.FEATURE_ERROR, {
        featureId: feature.feature_id,
        error: errorMessage,
        stage: 'execution'
      }, context);
    }
  }, [feature.feature_id, context]);

  if (accessLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Loader className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Checking feature access...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accessResult?.hasAccess) {
    return null; // Feature not enabled for this tenant
  }

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpansion}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-sm">{feature.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {feature.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    v{feature.version}
                  </Badge>
                  {feature.feature_config.isolated && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      Isolated
                    </Badge>
                  )}
                  {feature.feature_config.stateless && (
                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                      Stateless
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                {loadError && <XCircle className="h-4 w-4 text-red-500" />}
                {FeatureComponent && !loadError && <CheckCircle className="h-4 w-4 text-green-500" />}
                {debugMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeFeature({ test: true });
                    }}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          
          {feature.description && (
            <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
          )}
          
          {feature.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {feature.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {debugMode && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs">
                <p><strong>Feature ID:</strong> {feature.feature_id}</p>
                <p><strong>Component Path:</strong> {feature.ui_component_path}</p>
                <p><strong>Dependencies:</strong> {feature.dependencies.join(', ') || 'None'}</p>
                <p><strong>Requirements:</strong> {feature.requirements.join(', ') || 'None'}</p>
                {executionResult && (
                  <div className="mt-2">
                    <p><strong>Last Execution:</strong></p>
                    <pre className="text-xs bg-white p-2 rounded mt-1">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {loadError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load feature: {loadError}
                </AlertDescription>
              </Alert>
            ) : FeatureComponent ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-4">
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading {feature.name}...</span>
                  </div>
                }
              >
                <FeatureComponent
                  // Standards-compliant props
                  featureId={feature.feature_id}
                  context={context}
                  config={feature.feature_config}
                  
                  // Legacy props for backward compatibility
                  entityType={context.entityType}
                  entityId={context.entityId}
                  tenantId={context.tenantId}
                  formContext={context.entityType}
                  form={context.entityData}
                  title={feature.name}
                  description={feature.description}
                />
              </Suspense>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Loading feature component...</span>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Feature component not available</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StandardsCompliantFeatureRenderer; 