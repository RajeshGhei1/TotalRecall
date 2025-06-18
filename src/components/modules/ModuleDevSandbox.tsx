
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  FileText, 
  Play, 
  Settings,
  Rocket,
  Plus,
  CheckCircle,
  Package
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NewModuleWizard from './NewModuleWizard';
import EnhancedLiveCodeEditor from './EnhancedLiveCodeEditor';
import ModuleDeploymentPipeline from './ModuleDeploymentPipeline';
import DevelopmentModulesDashboard from './DevelopmentModulesDashboard';

interface ModuleData {
  name: string;
  description: string;
  category: string;
  version: string;
  templateId: string;
  features: string[];
  dependencies: string[];
  configuration: Record<string, any>;
}

const ModuleDevSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('development');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModuleData | null>(null);
  const [deployedModules, setDeployedModules] = useState<string[]>([]);

  const handleCreateModule = () => {
    setIsCreatingModule(true);
    setActiveTab('create');
  };

  const handleModuleCreated = (moduleData: ModuleData) => {
    setCurrentModule(moduleData);
    setIsCreatingModule(false);
    setActiveTab('code');
    
    toast({
      title: 'Module Created',
      description: `${moduleData.name} is ready for development.`,
    });
  };

  const handleCancelCreation = () => {
    setIsCreatingModule(false);
    setActiveTab('development');
  };

  const handleDeploymentComplete = (moduleId: string) => {
    setDeployedModules(prev => [...prev, moduleId]);
    toast({
      title: 'Module Deployed',
      description: 'Your module has been successfully deployed to the system.',
    });
  };

  const resetSandbox = () => {
    setCurrentModule(null);
    setIsCreatingModule(false);
    setActiveTab('development');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Development Environment</h2>
          <p className="text-gray-600 mt-1">
            Manage development modules and create new ones for the Total Recall system
          </p>
        </div>
        <div className="flex gap-2">
          {currentModule && (
            <Button variant="outline" onClick={resetSandbox}>
              Reset Sandbox
            </Button>
          )}
          <Button onClick={handleCreateModule} disabled={isCreatingModule}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Module
          </Button>
        </div>
      </div>

      {/* Current Module Status */}
      {currentModule && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentModule.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    v{currentModule.version} • {currentModule.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">In Development</Badge>
                {deployedModules.length > 0 && (
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Deployed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="development">
            <Package className="h-4 w-4 mr-2" />
            Development Modules
          </TabsTrigger>
          <TabsTrigger value="create" disabled={!isCreatingModule && !!currentModule}>
            Create Module
          </TabsTrigger>
          <TabsTrigger value="code" disabled={!currentModule}>
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="deploy" disabled={!currentModule}>
            Deploy
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="development" className="space-y-6">
          <DevelopmentModulesDashboard />
        </TabsContent>

        <TabsContent value="create">
          {isCreatingModule && (
            <NewModuleWizard
              onComplete={handleModuleCreated}
              onCancel={handleCancelCreation}
            />
          )}
        </TabsContent>

        <TabsContent value="code">
          {currentModule && (
            <EnhancedLiveCodeEditor />
          )}
        </TabsContent>

        <TabsContent value="deploy">
          {currentModule && (
            <ModuleDeploymentPipeline
              moduleData={currentModule}
              onDeploymentComplete={handleDeploymentComplete}
            />
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Development Environment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Development Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Auto-save module changes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Enable hot reload</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Debug mode</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Deployment Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Require approval before production</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Auto-promote after successful deployment</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDevSandbox;
