
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, RefreshCw, Save } from 'lucide-react';

const LiveDevelopmentSandbox: React.FC = () => {
  const [code, setCode] = useState(`import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyModule: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Custom Module</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hello from my custom module!</p>
      </CardContent>
    </Card>
  );
};

export default MyModule;`);

  const [activeTab, setActiveTab] = useState('editor');

  return (
    <div className="h-[70vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Live Development Sandbox</h3>
          <p className="text-sm text-muted-foreground">
            Write and test your module code in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full resize-none font-mono text-sm border-0 outline-none"
                placeholder="Write your module code here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-muted-foreground">Module preview will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="console" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Console Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-black text-green-400 p-4 rounded h-48 overflow-auto">
                <div>Module sandbox initialized...</div>
                <div>Ready for development</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveDevelopmentSandbox;
