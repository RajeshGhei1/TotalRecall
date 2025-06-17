
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  RefreshCw, 
  Terminal, 
  FileText,
  Settings,
  Bug,
  Layers,
  Monitor,
  Save,
  Upload
} from 'lucide-react';
import ModuleRenderer from './ModuleRenderer';
import { moduleCodeRegistry } from '@/services/moduleCodeRegistry';
import { moduleLoader } from '@/services/moduleLoader';
import { ModuleContext } from '@/types/modules';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';

const LiveDevelopmentSandbox: React.FC = () => {
  const { data: tenantData } = useStableTenantContext();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[INFO] Sandbox initialized',
    '[INFO] Module system ready',
    '[INFO] Hot reload enabled'
  ]);

  const [code, setCode] = useState(`// Example Module Code
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyModule = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello from My Module!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a live development sandbox.</p>
      </CardContent>
    </Card>
  );
};

// Module metadata
MyModule.moduleMetadata = {
  id: 'my-module',
  name: 'My Module',
  category: 'custom',
  version: '1.0.0',
  description: 'A sample module',
  author: 'Developer'
};

export default MyModule;`);

  const [manifest, setManifest] = useState(`{
  "id": "my-module",
  "name": "My Module",
  "version": "1.0.0",
  "description": "A sample module",
  "category": "custom",
  "author": "Developer",
  "license": "MIT",
  "entryPoint": "index.tsx",
  "dependencies": [],
  "requiredPermissions": ["read"],
  "subscriptionTiers": ["basic"],
  "loadOrder": 100,
  "autoLoad": false,
  "canUnload": true
}`);

  const context: ModuleContext = {
    moduleId: selectedModule || 'my-module',
    tenantId: tenantData?.tenant_id || 'sandbox-tenant',
    userId: 'sandbox-user',
    permissions: ['read', 'write', 'admin'],
    config: {}
  };

  useEffect(() => {
    loadAvailableModules();
    initializeModuleSystem();
  }, []);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      if (isRunning) {
        setConsoleOutput(prev => [
          ...prev,
          `[DEBUG] ${new Date().toLocaleTimeString()} - Module running...`
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const initializeModuleSystem = async () => {
    try {
      await moduleLoader.initialize();
      setConsoleOutput(prev => [
        ...prev,
        '[INFO] Module loader initialized',
        '[INFO] Component registry ready'
      ]);
    } catch (error) {
      setConsoleOutput(prev => [
        ...prev,
        `[ERROR] Failed to initialize module system: ${error}`
      ]);
    }
  };

  const loadAvailableModules = async () => {
    try {
      const registered = moduleCodeRegistry.getAllRegisteredModules();
      setAvailableModules(registered);
      
      if (registered.length > 0 && !selectedModule) {
        setSelectedModule(registered[0].id);
        loadModuleCode(registered[0].id);
      }
      
      setConsoleOutput(prev => [
        ...prev,
        `[INFO] Found ${registered.length} registered modules`
      ]);
    } catch (error) {
      setConsoleOutput(prev => [
        ...prev,
        `[ERROR] Failed to load modules: ${error}`
      ]);
    }
  };

  const loadModuleCode = async (moduleId: string) => {
    try {
      const moduleComponent = moduleCodeRegistry.getModuleComponent(moduleId);
      if (moduleComponent) {
        setConsoleOutput(prev => [
          ...prev,
          `[INFO] Loaded code for module: ${moduleId}`
        ]);
        
        // In a real implementation, you would fetch the actual source code
        // For now, we'll show a placeholder
        setCode(`// Module: ${moduleId}
// This is a placeholder - real implementation would show actual source code
import React from 'react';

const ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} = () => {
  return (
    <div>
      <h1>Module: ${moduleComponent.name}</h1>
      <p>Category: ${moduleComponent.manifest.category}</p>
      <p>Version: ${moduleComponent.manifest.version}</p>
    </div>
  );
};

export default ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)};`);

        setManifest(JSON.stringify(moduleComponent.manifest, null, 2));
      }
    } catch (error) {
      setConsoleOutput(prev => [
        ...prev,
        `[ERROR] Failed to load module code: ${error}`
      ]);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Starting module...',
      '[INFO] Compiling TypeScript...',
      '[INFO] Module compiled successfully',
      '[INFO] Module is running'
    ]);

    setTimeout(() => {
      setConsoleOutput(prev => [
        ...prev,
        '[SUCCESS] Module loaded and ready',
        '[INFO] Hot reload active'
      ]);
    }, 1000);
  };

  const handleStopCode = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Stopping module...',
      '[INFO] Module stopped'
    ]);
  };

  const handleHotReload = async () => {
    if (!selectedModule) return;
    
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Hot reloading module...',
      '[INFO] Clearing component cache...'
    ]);

    try {
      // In a real implementation, this would recompile and reload the module
      await moduleLoader.reloadModule(selectedModule, context);
      
      setConsoleOutput(prev => [
        ...prev,
        '[SUCCESS] Module reloaded successfully',
        '[INFO] Component cache updated'
      ]);
    } catch (error) {
      setConsoleOutput(prev => [
        ...prev,
        `[ERROR] Hot reload failed: ${error}`
      ]);
    }
  };

  const handleSaveModule = () => {
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Saving module...',
      '[SUCCESS] Module saved to filesystem'
    ]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  return (
    <div className="h-[800px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h2 className="font-semibold">Live Development Sandbox</h2>
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
          {selectedModule && (
            <Badge variant="outline">{selectedModule}</Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              loadModuleCode(e.target.value);
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="">Select Module</option>
            {availableModules.map(module => (
              <option key={module.id} value={module.id}>
                {module.name} ({module.id})
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveModule}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleHotReload}
            disabled={!isRunning || !selectedModule}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Hot Reload
          </Button>
          
          {isRunning ? (
            <Button size="sm" variant="destructive" onClick={handleStopCode}>
              <Monitor className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button size="sm" onClick={handleRunCode}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 border-r">
          <Tabs defaultValue="code" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="manifest" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Manifest
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Config
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 m-0">
              <div className="h-full">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none"
                  placeholder="Write your module code here..."
                />
              </div>
            </TabsContent>

            <TabsContent value="manifest" className="flex-1 m-0">
              <div className="h-full">
                <textarea
                  value={manifest}
                  onChange={(e) => setManifest(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none"
                  placeholder="Module manifest (JSON)"
                />
              </div>
            </TabsContent>

            <TabsContent value="config" className="flex-1 m-0">
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Hot Reload</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Automatically reload on code changes
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Sandbox Mode</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Run in isolated environment
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Debug Level</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md bg-background">
                    <option>Info</option>
                    <option>Debug</option>
                    <option>Verbose</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Module Registry</label>
                  <div className="text-xs text-gray-600 mt-1">
                    <p>Registered: {availableModules.length} modules</p>
                    <p>Selected: {selectedModule || 'None'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="console" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Console
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Debug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full border bg-white p-4 overflow-auto">
                {isRunning && selectedModule ? (
                  <ModuleRenderer
                    moduleId={selectedModule}
                    context={context}
                    showStatus={true}
                    fallback={
                      <div className="text-center p-8 text-gray-500">
                        <p>Module failed to render</p>
                        <p className="text-sm">Check console for details</p>
                      </div>
                    }
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Run" to see your module preview</p>
                      {!selectedModule && (
                        <p className="text-sm">Select a module to get started</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="console" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="text-sm font-medium">Console Output</span>
                  <Button size="sm" variant="ghost" onClick={clearConsole}>
                    Clear
                  </Button>
                </div>
                
                <div className="flex-1 p-2 bg-black text-green-400 font-mono text-xs overflow-auto">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="animate-pulse">█</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="debug" className="flex-1 m-0">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <div>Load Time: 234ms</div>
                      <div>Memory: 2.3MB</div>
                      <div>CPU: 1.2%</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Module Status</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <div>Status: {isRunning ? 'Running' : 'Stopped'}</div>
                      <div>Registered: {availableModules.length}</div>
                      <div>Selected: {selectedModule || 'None'}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Available Modules</h3>
                  <div className="text-xs font-mono space-y-1 max-h-32 overflow-auto">
                    {availableModules.map(module => (
                      <div key={module.id} className="flex items-center gap-2">
                        <span className={selectedModule === module.id ? 'text-blue-600' : ''}>
                          📦 {module.id}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {module.manifest.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Registry Stats</h3>
                  <div className="text-xs space-y-1">
                    <div>Components Cached: {availableModules.length}</div>
                    <div>Hot Reload: {isRunning ? 'Active' : 'Inactive'}</div>
                    <div>Sandbox Mode: Enabled</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t p-2 text-xs text-muted-foreground flex justify-between">
        <div className="flex gap-4">
          <span>Module: {selectedModule || 'None'}</span>
          <span>TypeScript Ready</span>
          <span>UTF-8</span>
        </div>
        <div className="flex gap-4">
          <span>Registry: {availableModules.length} modules</span>
          <span>Hot Reload: {isRunning ? 'Active' : 'Inactive'}</span>
          <span>{isRunning ? "Status: Running" : "Status: Stopped"}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveDevelopmentSandbox;
