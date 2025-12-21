
import React, { useState, useEffect } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import NewModuleWizard from './NewModuleWizard';
import EnhancedLiveCodeEditor from './EnhancedLiveCodeEditor';
import ModuleDeploymentPipeline from './ModuleDeploymentPipeline';
import DevelopmentModulesDashboard from './DevelopmentModulesDashboard';
import ModuleFeatureUpgradeHelper from '@/components/common/ModuleFeatureUpgradeHelper';

interface ModuleData {
  name: string;
  description: string;
  category: string;
  version: string;
  templateId: string;
  features: string[];
  ai_capabilities: string[];
  dependencies: string[];
  configuration: Record<string, unknown>;
}

const ModuleDevSandbox: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('development');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModuleData | null>(null);
  const [deployedModules, setDeployedModules] = useState<string[]>([]);

  // Handle navigation state from other pages
  useEffect(() => {
    const state = location.state as {
      action?: 'preview' | 'edit' | 'test';
      moduleId?: string;
      moduleName?: string;
    };

    if (state?.action && state?.moduleId && state?.moduleName) {
      console.log('Received navigation state:', state);
      
      // Create a temporary module data for the selected module
      const moduleData: ModuleData = {
        name: state.moduleName,
        description: `App: ${state.moduleName}`,
        category: 'development',
        version: '1.0.0',
        templateId: 'default',
        features: [],
        ai_capabilities: [],
        dependencies: [],
        configuration: {}
      };

      setCurrentModule(moduleData);
      
      // Switch to appropriate tab based on action
      if (state.action === 'preview') {
        setActiveTab('development'); // Show in development tab with preview
        toast({
          title: 'App Preview Mode',
          description: `Previewing ${state.moduleName}`,
        });
      } else if (state.action === 'edit') {
        setActiveTab('code');
        toast({
          title: 'App Edit Mode',
          description: `Editing ${state.moduleName}`,
        });
      }
    }
  }, [location.state]);

  const handleCreateModule = () => {
    setIsCreatingModule(true);
    setActiveTab('create');
  };

  const handleModuleCreated = (moduleData: Record<string, unknown>) => {
    const typedModuleData: ModuleData = {
      name: moduleData.name as string,
      description: moduleData.description as string,
      category: moduleData.category as string,
      version: moduleData.version as string,
      templateId: moduleData.templateId as string,
      features: (moduleData.features as string[]) || [],
      ai_capabilities: (moduleData.ai_capabilities as string[]) || [],
      dependencies: (moduleData.dependencies as string[]) || [],
      configuration: (moduleData.configuration as Record<string, unknown>) || {}
    };
    
    setCurrentModule(typedModuleData);
    setIsCreatingModule(false);
    setActiveTab('code');
    
    toast({
      title: 'App Created',
      description: `${typedModuleData.name} is ready for development.`,
    });
  };

  const handleCancelCreation = () => {
    setIsCreatingModule(false);
    setActiveTab('development');
  };

  const handleDeploymentComplete = (moduleId: string) => {
    setDeployedModules(prev => [...prev, moduleId]);
    toast({
      title: 'App Deployed',
      description: 'Your app has been successfully deployed to the system.',
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
          <h2 className="text-2xl font-bold text-gray-900">App Development Environment</h2>
          <p className="text-gray-600 mt-1">
            Manage development apps and create new ones for the Total Recall system
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
            Create New App
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
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="development">
            <Package className="h-4 w-4 mr-2" />
            Development Apps
          </TabsTrigger>
          <TabsTrigger value="upgrade">
            <Settings className="h-4 w-4 mr-2" />
            Upgrade Apps
          </TabsTrigger>
          <TabsTrigger value="create" disabled={!isCreatingModule && !!currentModule}>
            Create App
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

        <TabsContent value="upgrade" className="space-y-6">
          {/* Module Upgrade Helper */}
          <ModuleFeatureUpgradeHelper 
            moduleCount={currentModule ? 1 : 0}
            onViewModules={() => navigate('/superadmin/settings/modules')}
            onUpgradeModules={() => navigate('/superadmin/settings/modules')}
          />
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
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Code Editor - {currentModule.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedLiveCodeEditor />
                </CardContent>
              </Card>
            </div>
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
                      <span className="text-sm">Auto-save app changes</span>
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
