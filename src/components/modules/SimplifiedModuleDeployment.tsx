
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Package,
  TestTube,
  FileText,
  Settings,
  Play,
  Code
} from 'lucide-react';
import ModulePackageUploader from './ModulePackageUploader';
import ModuleTestRunner from './ModuleTestRunner';
import ManifestWizard from './ManifestWizard';
import LiveDevelopmentSandbox from './LiveDevelopmentSandbox';

const SimplifiedModuleDeployment: React.FC = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [testRunnerOpen, setTestRunnerOpen] = useState(false);
  const [manifestWizardOpen, setManifestWizardOpen] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  const handleExportModule = () => {
    // Simulate module export
    const moduleData = {
      manifest: {
        id: 'exported-module',
        name: 'Exported Module',
        version: '1.0.0'
      },
      files: []
    };
    
    const dataStr = JSON.stringify(moduleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'module-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRefreshCache = () => {
    // Simulate cache refresh
    console.log('Refreshing module cache...');
    setTimeout(() => {
      console.log('Module cache refreshed successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Module Development Tools
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete toolkit for module development, testing, and deployment
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Module Creation & Management</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setManifestWizardOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Create Module Manifest
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setUploaderOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Module Package
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleExportModule}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Module
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleRefreshCache}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Module Cache
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Development & Testing</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setSandboxOpen(true)}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Open Development Sandbox
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setTestRunnerOpen(true)}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Module Tests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Module Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Hot Reload Test
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Environment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Module System</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Hot Reload</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Development
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Test Runner</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Module Package</DialogTitle>
          </DialogHeader>
          <ModulePackageUploader 
            onUploadComplete={() => setUploaderOpen(false)}
            onClose={() => setUploaderOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={testRunnerOpen} onOpenChange={setTestRunnerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Module Test Runner</DialogTitle>
          </DialogHeader>
          <ModuleTestRunner 
            moduleId="current-module"
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

export default SimplifiedModuleDeployment;
