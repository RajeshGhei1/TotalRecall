
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Code,
  Eye,
  RefreshCw
} from 'lucide-react';
import ModuleRenderer from './ModuleRenderer';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { moduleLoader } from '@/services/moduleLoader';
import { ModuleContext } from '@/types/modules';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';

const ModuleTestPage: React.FC = () => {
  const { data: tenantData } = useStableTenantContext();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [moduleProps, setModuleProps] = useState<Record<string, any>>({});
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ModuleContext>({
    moduleId: '',
    tenantId: tenantData?.tenant_id || 'test-tenant',
    userId: 'test-user',
    permissions: ['read', 'write', 'admin'],
    config: {}
  });

  useEffect(() => {
    loadAvailableModules();
    initializeModuleSystem();
  }, []);

  const initializeModuleSystem = async () => {
    try {
      setIsLoading(true);
      await moduleLoader.initialize();
      await loadAvailableModules();
    } catch (error) {
      console.error('Error initializing module system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableModules = async () => {
    try {
      const registered = moduleCodeRegistry.getAllRegisteredModules();
      setAvailableModules(registered);
      
      if (registered.length > 0 && !selectedModule) {
        setSelectedModule(registered[0].id);
      }
    } catch (error) {
      console.error('Error loading available modules:', error);
    }
  };

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    setContext(prev => ({ ...prev, moduleId }));
    
    // Reset props and load module metadata
    const moduleComponent = moduleCodeRegistry.getModuleComponent(moduleId);
    if (moduleComponent) {
      const metadata = (moduleComponent.component as any).moduleMetadata;
      if (metadata?.props) {
        const defaultProps: Record<string, any> = {};
        Object.entries(metadata.props).forEach(([key, config]: [string, any]) => {
          if (config.default !== undefined) {
            defaultProps[key] = config.default;
          }
        });
        setModuleProps(defaultProps);
      }
    }
  };

  const handlePropChange = (key: string, value: any) => {
    setModuleProps(prev => ({ ...prev, [key]: value }));
  };

  const handleResetProps = () => {
    const moduleComponent = moduleCodeRegistry.getModuleComponent(selectedModule);
    if (moduleComponent) {
      const metadata = (moduleComponent.component as any).moduleMetadata;
      if (metadata?.props) {
        const defaultProps: Record<string, any> = {};
        Object.entries(metadata.props).forEach(([key, config]: [string, any]) => {
          if (config.default !== undefined) {
            defaultProps[key] = config.default;
          }
        });
        setModuleProps(defaultProps);
      }
    }
  };

  const renderPropEditor = () => {
    if (!selectedModule) return null;

    const moduleComponent = moduleCodeRegistry.getModuleComponent(selectedModule);
    if (!moduleComponent) return null;

    const metadata = (moduleComponent.component as any).moduleMetadata;
    if (!metadata?.props) {
      return <p className="text-sm text-gray-500">No configurable props for this module</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(metadata.props).map(([key, config]: [string, any]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {key} 
              <span className="text-xs text-gray-500 ml-2">({config.type})</span>
            </Label>
            
            {config.options ? (
              <Select 
                value={moduleProps[key]} 
                onValueChange={(value) => handlePropChange(key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : config.type === 'boolean' ? (
              <Select 
                value={moduleProps[key]?.toString()} 
                onValueChange={(value) => handlePropChange(key, value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            ) : config.type === 'number' ? (
              <Input
                type="number"
                value={moduleProps[key] || ''}
                onChange={(e) => handlePropChange(key, Number(e.target.value))}
                placeholder={`Enter ${key}`}
              />
            ) : config.type?.includes('string') && key.toLowerCase().includes('message') ? (
              <Textarea
                value={moduleProps[key] || ''}
                onChange={(e) => handlePropChange(key, e.target.value)}
                placeholder={`Enter ${key}`}
                rows={3}
              />
            ) : (
              <Input
                value={moduleProps[key] || ''}
                onChange={(e) => handlePropChange(key, e.target.value)}
                placeholder={`Enter ${key}`}
              />
            )}
            
            {config.default !== undefined && (
              <p className="text-xs text-gray-500">Default: {JSON.stringify(config.default)}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Module Testing Environment</h1>
          <p className="text-sm text-gray-600">Test and configure dynamic modules</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={initializeModuleSystem}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Modules
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Configuration Panel */}
        <div className="w-1/3 border-r bg-gray-50">
          <Tabs defaultValue="config" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Config
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="flex-1 p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="module-select">Select Module</Label>
                  <Select value={selectedModule} onValueChange={handleModuleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a module to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name} ({module.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedModule && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Properties</h3>
                      <Button variant="outline" size="sm" onClick={handleResetProps}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                    
                    {renderPropEditor()}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="info" className="flex-1 p-4">
              {selectedModule && (
                <div className="space-y-4">
                  {(() => {
                    const moduleComponent = moduleCodeRegistry.getModuleComponent(selectedModule);
                    const metadata = moduleComponent && (moduleComponent.component as any).moduleMetadata;
                    
                    if (!metadata) {
                      return <p className="text-sm text-gray-500">No metadata available</p>;
                    }

                    return (
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">Module Information</h4>
                          <div className="text-sm space-y-1 mt-2">
                            <p><strong>ID:</strong> {metadata.id}</p>
                            <p><strong>Version:</strong> {metadata.version}</p>
                            <p><strong>Category:</strong> <Badge variant="outline">{metadata.category}</Badge></p>
                            <p><strong>Author:</strong> {metadata.author}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm text-gray-600 mt-1">{metadata.description}</p>
                        </div>

                        {metadata.requiredPermissions && metadata.requiredPermissions.length > 0 && (
                          <div>
                            <h4 className="font-medium">Required Permissions</h4>
                            <div className="flex gap-1 mt-1">
                              {metadata.requiredPermissions.map((perm: string) => (
                                <Badge key={perm} variant="secondary" className="text-xs">{perm}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium">Current Props</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(moduleProps, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Module Preview</span>
              {selectedModule && (
                <Badge variant="outline">{selectedModule}</Badge>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            {selectedModule ? (
              <div className="bg-white rounded-lg border p-6">
                <ModuleRenderer
                  moduleId={selectedModule}
                  context={context}
                  props={moduleProps}
                  showStatus={true}
                  fallback={
                    <div className="text-center p-8 text-gray-500">
                      <p>Module failed to load</p>
                      <p className="text-sm">Check console for details</p>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a module to preview</p>
                  <p className="text-sm">Choose from {availableModules.length} available modules</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleTestPage;
