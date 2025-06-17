
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  Play, 
  Save, 
  RefreshCw, 
  FolderOpen, 
  Code, 
  Eye, 
  Terminal,
  FileText,
  Settings,
  Bug
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  path: string;
}

const LiveDevelopmentSandbox: React.FC = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Mock file structure
  const [fileTree] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            {
              name: 'MyModule.tsx',
              type: 'file',
              path: 'src/components/MyModule.tsx',
              content: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyModule: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Custom Module</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a custom module created in the development sandbox.</p>
      </CardContent>
    </Card>
  );
};

export default MyModule;`
            }
          ]
        },
        {
          name: 'hooks',
          type: 'folder',
          path: 'src/hooks',
          children: [
            {
              name: 'useMyModule.ts',
              type: 'file',
              path: 'src/hooks/useMyModule.ts',
              content: `import { useState, useEffect } from 'react';

export const useMyModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData({ message: 'Hello from custom hook!' });
      setLoading(false);
    }, 1000);
  }, []);

  return { data, loading };
};`
            }
          ]
        },
        {
          name: 'index.ts',
          type: 'file',
          path: 'src/index.ts',
          content: `export { default as MyModule } from './components/MyModule';
export { useMyModule } from './hooks/useMyModule';`
        }
      ]
    },
    {
      name: 'manifest.json',
      type: 'file',
      path: 'manifest.json',
      content: `{
  "id": "my-custom-module",
  "name": "My Custom Module",
  "version": "1.0.0",
  "description": "A custom module built in the development sandbox",
  "category": "custom",
  "author": "Developer",
  "license": "MIT",
  "dependencies": [],
  "entryPoint": "src/index.ts",
  "requiredPermissions": [],
  "subscriptionTiers": ["professional"],
  "loadOrder": 100,
  "autoLoad": true,
  "canUnload": true,
  "minCoreVersion": "1.0.0"
}`
    },
    {
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      content: `{
  "name": "my-custom-module",
  "version": "1.0.0",
  "description": "A custom module built in the development sandbox",
  "main": "src/index.ts",
  "author": "Developer",
  "license": "MIT",
  "dependencies": {
    "react": "^18.0.0",
    "@types/react": "^18.0.0"
  }
}`
    }
  ]);

  useEffect(() => {
    // Load the first file by default
    const firstFile = findFirstFile(fileTree);
    if (firstFile) {
      handleFileSelect(firstFile);
    }
  }, []);

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') {
        return node;
      }
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
    setFileContent(file.content || '');
  };

  const handleSave = () => {
    if (selectedFile) {
      // Update file content
      selectedFile.content = fileContent;
      toast({
        title: "File saved",
        description: `${selectedFile.name} has been saved successfully.`
      });
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput([]);
    
    // Simulate module execution
    addConsoleOutput('🚀 Starting module execution...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addConsoleOutput('📦 Loading dependencies...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addConsoleOutput('⚡ Initializing module...');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    addConsoleOutput('✅ Module executed successfully!');
    addConsoleOutput('📊 Memory usage: 12.5MB');
    addConsoleOutput('⏱️ Execution time: 1.2s');
    
    setIsRunning(false);
    
    toast({
      title: "Module executed",
      description: "Your module has been executed successfully in the sandbox."
    });
  };

  const addConsoleOutput = (message: string) => {
    setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node, index) => (
      <div key={index} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`
            flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-muted
            ${selectedFile?.path === node.path ? 'bg-blue-100 text-blue-900' : ''}
          `}
          onClick={() => node.type === 'file' && handleFileSelect(node)}
        >
          {node.type === 'folder' ? (
            <FolderOpen className="h-4 w-4 text-blue-600" />
          ) : (
            <FileText className="h-4 w-4 text-gray-600" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <Card className="w-full h-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Live Development Sandbox
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handleRun} disabled={isRunning}>
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full border-r bg-muted/30">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm">File Explorer</h3>
              </div>
              <div className="p-2 overflow-y-auto">
                {renderFileTree(fileTree)}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Editor and Preview */}
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60}>
                <div className="h-full flex flex-col">
                  <div className="p-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {selectedFile ? selectedFile.name : 'No file selected'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-0">
                    <textarea
                      ref={editorRef}
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none"
                      style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                      placeholder={selectedFile ? "Edit your code here..." : "Select a file to start editing"}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Console and Preview */}
              <ResizablePanel defaultSize={40}>
                <Tabs defaultValue="console" className="h-full">
                  <div className="border-b">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="console" className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Console
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="debug" className="flex items-center gap-2">
                        <Bug className="h-4 w-4" />
                        Debug
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="console" className="h-full p-0 m-0">
                    <div className="h-full bg-black text-green-400 p-4 overflow-y-auto font-mono text-sm">
                      {consoleOutput.length === 0 ? (
                        <div className="text-gray-500">Console output will appear here...</div>
                      ) : (
                        consoleOutput.map((line, index) => (
                          <div key={index} className="mb-1">{line}</div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="h-full p-4 m-0">
                    <div className="h-full border rounded bg-white p-4">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Live preview will appear here</p>
                        <p className="text-sm mt-2">Run your module to see the preview</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="debug" className="h-full p-4 m-0">
                    <div className="h-full">
                      <div className="space-y-4">
                        <div className="text-sm">
                          <div className="font-semibold mb-2">Debug Information</div>
                          <div className="space-y-1 text-muted-foreground">
                            <div>Module: {selectedFile?.name || 'None'}</div>
                            <div>Status: Ready</div>
                            <div>Memory: 12.5MB</div>
                            <div>Load Time: 1.2s</div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="font-semibold mb-2">Breakpoints</div>
                          <div className="text-muted-foreground">No breakpoints set</div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="font-semibold mb-2">Watch Variables</div>
                          <div className="text-muted-foreground">No variables being watched</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default LiveDevelopmentSandbox;
