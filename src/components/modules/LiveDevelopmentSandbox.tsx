
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
  Monitor
} from 'lucide-react';

const LiveDevelopmentSandbox: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [code, setCode] = useState(`// Example Module Code
import React from 'react';

const MyModule = () => {
  return (
    <div>
      <h1>Hello from My Module!</h1>
      <p>This is a live development sandbox.</p>
    </div>
  );
};

export default MyModule;`);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[INFO] Sandbox initialized',
    '[INFO] Module system ready',
    '[INFO] Hot reload enabled'
  ]);

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

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Starting module...',
      '[INFO] Module compiled successfully',
      '[INFO] Module is running'
    ]);

    setTimeout(() => {
      setConsoleOutput(prev => [
        ...prev,
        '[SUCCESS] Module loaded and ready'
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

  const handleHotReload = () => {
    setConsoleOutput(prev => [
      ...prev,
      '[INFO] Hot reloading module...',
      '[INFO] Module reloaded successfully'
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
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleHotReload}
            disabled={!isRunning}
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
              <div className="p-4 h-full">
                <pre className="text-sm bg-muted p-3 rounded h-full overflow-auto">
{`{
  "id": "my-module",
  "name": "My Module",
  "version": "1.0.0",
  "description": "A sample module",
  "category": "custom",
  "author": "Developer",
  "license": "MIT",
  "entryPoint": "index.ts",
  "dependencies": [],
  "requiredPermissions": ["read"],
  "subscriptionTiers": ["basic"],
  "loadOrder": 100,
  "autoLoad": false,
  "canUnload": true
}`}
                </pre>
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
              <div className="h-full border bg-white">
                {isRunning ? (
                  <div className="p-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                      <h1 className="text-2xl font-bold mb-2">Hello from My Module!</h1>
                      <p>This is a live development sandbox.</p>
                      <div className="mt-4 flex gap-2">
                        <Badge variant="secondary">Live</Badge>
                        <Badge variant="secondary">Hot Reload Enabled</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Component State</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">Ready</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Memory Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">2.3 MB</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Run" to see your module preview</p>
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
                      <CardTitle className="text-sm">Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <div>✓ React 18.3.1</div>
                      <div>✓ Core System</div>
                      <div>✓ UI Components</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Module Tree</h3>
                  <div className="text-xs font-mono space-y-1">
                    <div>📦 my-module</div>
                    <div className="ml-4">📄 index.ts</div>
                    <div className="ml-4">📄 components/</div>
                    <div className="ml-8">📄 MyComponent.tsx</div>
                    <div className="ml-4">📄 styles/</div>
                    <div className="ml-8">📄 main.css</div>
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
          <span>Line 1, Column 1</span>
          <span>TypeScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex gap-4">
          <span>Sandbox: Enabled</span>
          <span>Hot Reload: On</span>
          <span>{isRunning ? "Status: Running" : "Status: Stopped"}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveDevelopmentSandbox;
