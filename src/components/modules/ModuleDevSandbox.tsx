
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  RefreshCw, 
  Code, 
  Layers,
  Activity,
  Package,
  Zap,
  TrendingUp,
  Settings,
  Monitor,
  Database,
  TestTube,
  FileText,
  Wrench
} from 'lucide-react';
import SimplifiedModuleDeployment from './SimplifiedModuleDeployment';
import SimplifiedModuleScaling from './SimplifiedModuleScaling';
import RealModuleDashboard from './RealModuleDashboard';
import ModuleTestRunner from './ModuleTestRunner';
import ManifestWizard from './ManifestWizard';
import LiveDevelopmentSandbox from './LiveDevelopmentSandbox';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';
import { useModuleTemplates } from '@/hooks/useModuleTemplates';

const ModuleDevSandbox: React.FC = () => {
  // Use stable tenant context
  const { data: tenantData, isLoading: tenantLoading } = useStableTenantContext();
  const { data: templates = [], isLoading: templatesLoading } = useModuleTemplates();
  const [testRunnerOpen, setTestRunnerOpen] = useState(false);
  const [manifestWizardOpen, setManifestWizardOpen] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  // Add debugging to track component lifecycle
  useEffect(() => {
    console.log('ModuleDevSandbox mounted with stable tenant context');
    return () => {
      console.log('ModuleDevSandbox unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('ModuleDevSandbox - stable tenant context:', tenantData);
  }, [tenantData]);

  if (tenantLoading || templatesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Enhanced Module Development Environment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete development environment with template system, live coding, and comprehensive testing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              <span>System Modules Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-600" />
              <span>Stable Tenant Context</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span>Live Development Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4 text-orange-600" />
              <span>Test Framework Active</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>{templates.length} Templates Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Quick Development Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => setManifestWizardOpen(true)}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">Create Manifest</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => setSandboxOpen(true)}
            >
              <Code className="h-6 w-6" />
              <span className="text-sm">Live Coding</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => setTestRunnerOpen(true)}
            >
              <TestTube className="h-6 w-6" />
              <span className="text-sm">Run Tests</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
            >
              <Package className="h-6 w-6" />
              <span className="text-sm">Deploy Module</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Module Discovery
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Development Hub
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Package Management
          </TabsTrigger>
          <TabsTrigger value="scaling" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <RealModuleDashboard tenantId={tenantData?.tenant_id} />
        </TabsContent>

        <TabsContent value="development" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Development Hub
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Integrated development environment with templates, live coding, and testing
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Gallery */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Module Templates</h3>
                  <div className="space-y-3">
                    {templates.slice(0, 3).map((template) => (
                      <div key={template.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="flex gap-1 mt-2">
                              {template.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Templates ({templates.length})
                    </Button>
                  </div>
                </div>
                
                {/* Development Tools */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Development Tools</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setSandboxOpen(true)}
                    >
                      <Code className="h-6 w-6" />
                      <span className="text-sm">Live IDE</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setTestRunnerOpen(true)}
                    >
                      <TestTube className="h-6 w-6" />
                      <span className="text-sm">Test Suite</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex-col gap-2"
                    >
                      <Activity className="h-6 w-6" />
                      <span className="text-sm">Performance</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex-col gap-2"
                    >
                      <RefreshCw className="h-6 w-6" />
                      <span className="text-sm">Hot Reload</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Development Environment Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Tenant Context:</strong> {tenantData?.tenant_name || 'Loading...'}</p>
                    <p><strong>Tenant ID:</strong> {tenantData?.tenant_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Environment:</strong> {tenantData?.is_development ? 'Development' : 'Production'}</p>
                    <p><strong>Module System:</strong> Enhanced & Connected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="mt-6">
          <SimplifiedModuleDeployment />
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <SimplifiedModuleScaling />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={testRunnerOpen} onOpenChange={setTestRunnerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Module Test Runner</DialogTitle>
          </DialogHeader>
          <ModuleTestRunner 
            moduleId="development-module"
            onTestComplete={() => setTestRunnerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={manifestWizardOpen} onOpenChange={setManifestWizardOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Module Manifest</DialogTitle>
          </DialogHeader>
          <ManifestWizard 
            onComplete={() => setManifestWizardOpen(false)}
            onCancel={() => setManifestWizardOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={sandboxOpen} onOpenChange={setSandboxOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Live Development Sandbox</DialogTitle>
          </DialogHeader>
          <LiveDevelopmentSandbox />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleDevSandbox;
