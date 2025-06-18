
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
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NewModuleWizard from './NewModuleWizard';
import EnhancedLiveCodeEditor from './EnhancedLiveCodeEditor';
import ModuleDeploymentPipeline from './ModuleDeploymentPipeline';

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
  const [activeTab, setActiveTab] = useState('overview');
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
    setActiveTab('overview');
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
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Development Sandbox</h2>
          <p className="text-gray-600 mt-1">
            Create, develop, and deploy new modules for the Total Recall system
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
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

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Development Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      1
                    </div>
                    <span className="text-sm">Create module manifest and configuration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      2
                    </div>
                    <span className="text-sm">Develop and test module code</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      3
                    </div>
                    <span className="text-sm">Deploy to system module library</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      4
                    </div>
                    <span className="text-sm">Promote to production for tenant access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sandbox Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Live code editing with preview</li>
                  <li>• Module manifest generation</li>
                  <li>• Built-in testing environment</li>
                  <li>• Deployment pipeline integration</li>
                  <li>• Version control and history</li>
                  <li>• Template-based scaffolding</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {!currentModule && (
            <Card>
              <CardContent className="text-center py-12">
                <Code className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Module in Development</h3>
                <p className="text-muted-foreground mb-6">
                  Start by creating a new module to begin development
                </p>
                <Button onClick={handleCreateModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Module
                </Button>
              </CardContent>
            </Card>
          )}
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
              <CardTitle>Sandbox Settings</CardTitle>
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
