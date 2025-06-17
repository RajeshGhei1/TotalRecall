
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Blocks, 
  Play, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useModuleLoader } from '@/hooks/useModuleLoader';
import ModuleRenderer from './ModuleRenderer';
import { ModuleContext } from '@/types/modules';

const ModuleTestPage: React.FC = () => {
  const { loadedModules, isLoading, refreshModules } = useModuleLoader();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [moduleProps, setModuleProps] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('test');

  // Create a test context
  const testContext: ModuleContext = {
    moduleId: selectedModule,
    tenantId: 'test-tenant',
    userId: 'test-user',
    permissions: ['read', 'write', 'admin'],
    config: {}
  };

  useEffect(() => {
    if (loadedModules.length > 0 && !selectedModule) {
      setSelectedModule(loadedModules[0].manifest.id);
    }
  }, [loadedModules, selectedModule]);

  const selectedModuleData = loadedModules.find(m => m.manifest.id === selectedModule);

  const handlePropChange = (propName: string, value: any) => {
    setModuleProps(prev => ({
      ...prev,
      [propName]: value
    }));
  };

  const renderModuleList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Modules</h3>
        <Button onClick={refreshModules} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {loadedModules.map((module) => (
          <Card key={module.manifest.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{module.manifest.name}</h4>
                    <Badge variant="outline">{module.manifest.category}</Badge>
                    <Badge variant={module.status === 'loaded' ? 'default' : 'destructive'}>
                      {module.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {module.manifest.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>v{module.manifest.version}</span>
                    <span>Author: {module.manifest.author}</span>
                    {module.manifest.dependencies.length > 0 && (
                      <span>Dependencies: {module.manifest.dependencies.length}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedModule(module.manifest.id)}
                  >
                    Test
                  </Button>
                  {module.status === 'loaded' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPropControls = () => {
    if (!selectedModuleData?.instance?.Component?.moduleMetadata?.props) {
      return (
        <div className="text-center py-8">
          <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No configurable props available</p>
        </div>
      );
    }

    const props = selectedModuleData.instance.Component.moduleMetadata.props;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Module Configuration</h3>
        
        <div className="grid gap-4">
          {Object.entries(props).map(([propName, propConfig]: [string, any]) => (
            <div key={propName} className="space-y-2">
              <label className="text-sm font-medium">
                {propName}
                {propConfig.type && (
                  <span className="text-muted-foreground ml-1">({propConfig.type})</span>
                )}
              </label>
              
              {propConfig.options ? (
                <Select
                  value={moduleProps[propName] || propConfig.default}
                  onValueChange={(value) => handlePropChange(propName, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propConfig.options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : propConfig.type === 'boolean' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={moduleProps[propName] ?? propConfig.default}
                    onChange={(e) => handlePropChange(propName, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-muted-foreground">
                    Default: {String(propConfig.default)}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  value={moduleProps[propName] || propConfig.default || ''}
                  onChange={(e) => handlePropChange(propName, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={`Default: ${propConfig.default}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderModuleTest = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger>
              <SelectValue placeholder="Select a module to test" />
            </SelectTrigger>
            <SelectContent>
              {loadedModules.map((module) => (
                <SelectItem key={module.manifest.id} value={module.manifest.id}>
                  {module.manifest.name} ({module.manifest.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setModuleProps({})}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Props
        </Button>
      </div>

      {selectedModule && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPropControls()}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Module Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModuleRenderer
                  moduleId={selectedModule}
                  context={testContext}
                  props={moduleProps}
                  showStatus={true}
                  containerClassName="border rounded-lg p-4"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Testing Lab</h1>
          <p className="text-muted-foreground">
            Test and configure modules in a safe environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {loadedModules.length} modules loaded
          </Badge>
          <Button onClick={refreshModules}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Test Module
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Blocks className="h-4 w-4" />
            Module Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="mt-6">
          {renderModuleTest()}
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          {renderModuleList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleTestPage;
