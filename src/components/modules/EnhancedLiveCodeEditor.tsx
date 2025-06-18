
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Save, 
  RefreshCw, 
  FileText, 
  Folder,
  Plus,
  Download,
  Upload,
  Settings,
  Bug,
  Terminal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileStructure {
  [key: string]: {
    content: string;
    type: 'typescript' | 'javascript' | 'json' | 'css' | 'html';
  };
}

const EnhancedLiveCodeEditor: React.FC = () => {
  const [currentFile, setCurrentFile] = useState('index.tsx');
  const [files, setFiles] = useState<FileStructure>({
    'index.tsx': {
      content: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyModule: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Custom Module</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hello from my custom module!</p>
        <p>Edit this code to see changes in real-time.</p>
      </CardContent>
    </Card>
  );
};

export default MyModule;`,
      type: 'typescript'
    },
    'manifest.json': {
      content: `{
  "id": "my-custom-module",
  "name": "My Custom Module",
  "version": "1.0.0",
  "description": "A custom module created in the development sandbox",
  "category": "custom",
  "author": "Developer",
  "license": "MIT",
  "dependencies": [],
  "entryPoint": "index.tsx",
  "requiredPermissions": ["read", "write"],
  "subscriptionTiers": ["basic", "pro", "enterprise"],
  "loadOrder": 100,
  "autoLoad": true,
  "canUnload": true
}`,
      type: 'json'
    },
    'styles.css': {
      content: `.my-module {
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.my-module h1 {
  color: #1e293b;
  margin-bottom: 1rem;
}`,
      type: 'css'
    }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Module sandbox initialized...',
    'Ready for development'
  ]);

  const addConsoleOutput = (message: string) => {
    setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleRun = () => {
    setIsRunning(true);
    addConsoleOutput('Building module...');
    
    setTimeout(() => {
      addConsoleOutput('Module compiled successfully');
      addConsoleOutput('Module loaded in preview');
      setIsRunning(false);
      toast({
        title: 'Module Updated',
        description: 'Your module has been compiled and is running in the preview.',
      });
    }, 2000);
  };

  const handleSave = () => {
    addConsoleOutput('Saving module files...');
    toast({
      title: 'Files Saved',
      description: 'Your module files have been saved to the development workspace.',
    });
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name (e.g., component.tsx, utils.ts):');
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      let type: 'typescript' | 'javascript' | 'json' | 'css' | 'html' = 'typescript';
      
      switch (extension) {
        case 'js':
          type = 'javascript';
          break;
        case 'json':
          type = 'json';
          break;
        case 'css':
          type = 'css';
          break;
        case 'html':
          type = 'html';
          break;
        default:
          type = 'typescript';
      }

      setFiles(prev => ({
        ...prev,
        [fileName]: {
          content: `// New ${type} file\n`,
          type
        }
      }));
      setCurrentFile(fileName);
      addConsoleOutput(`Created new file: ${fileName}`);
    }
  };

  const exportModule = () => {
    const moduleData = {
      files,
      manifest: JSON.parse(files['manifest.json']?.content || '{}'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(moduleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'module-export.json';
    a.click();
    URL.revokeObjectURL(url);

    addConsoleOutput('Module exported successfully');
    toast({
      title: 'Module Exported',
      description: 'Your module has been exported as a JSON file.',
    });
  };

  return (
    <div className="h-[70vh] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Enhanced Live Code Editor</h3>
          <Badge variant="secondary">Development Mode</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={createNewFile}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={exportModule}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Building...' : 'Run'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 border-r bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="h-4 w-4" />
            <span className="font-medium">Files</span>
          </div>
          <div className="space-y-1">
            {Object.keys(files).map((fileName) => (
              <div
                key={fileName}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200 ${
                  currentFile === fileName ? 'bg-blue-100 text-blue-700' : ''
                }`}
                onClick={() => setCurrentFile(fileName)}
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm">{fileName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {currentFile}
                    <Badge variant="outline" className="text-xs">
                      {files[currentFile]?.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={files[currentFile]?.content || ''}
                    onChange={(e) => setFiles(prev => ({
                      ...prev,
                      [currentFile]: {
                        ...prev[currentFile],
                        content: e.target.value
                      }
                    }))}
                    className="w-full h-96 resize-none font-mono text-sm border-0 outline-none p-4 bg-gray-50 rounded"
                    placeholder="Write your module code here..."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gray-50 rounded border-2 border-dashed">
                    <div className="text-center text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Module Preview</p>
                      <p className="text-sm">Click "Run" to see your module in action</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="console" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Console Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-black text-green-400 p-4 rounded h-80 overflow-auto">
                    {consoleOutput.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 m-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Module Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Development Options</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Auto-save on changes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Hot reload preview</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Enable debug mode</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Build Settings</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">TypeScript compilation</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Minify output</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLiveCodeEditor;
