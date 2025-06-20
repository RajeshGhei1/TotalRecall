
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Blocks, 
  Play, 
  Settings, 
  TestTube,
  ArrowLeft,
  Eye,
  Code,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModuleLoader } from '@/hooks/useModuleLoader';
import ModuleRenderer from './ModuleRenderer';
import { ModuleContext } from '@/types/modules';

const DevelopmentModulesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadedModules, isLoading, refreshModules } = useModuleLoader();
  const [previewingModule, setPreviewingModule] = useState<string | null>(null);

  // Development modules - these would come from your database or development registry
  const developmentModules = [
    {
      id: 'business_contacts_data_access',
      name: 'Business Contacts & Data Access',
      description: 'Comprehensive contact management and data access functionality',
      category: 'business',
      version: '1.0.0',
      status: 'development',
      author: 'System',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'linkedin_enrichment',
      name: 'LinkedIn Profile Enrichment',
      description: 'Enhance contact profiles with LinkedIn data',
      category: 'integration',
      version: '1.2.0',
      status: 'development',
      author: 'System',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'talent_analytics',
      name: 'Talent Analytics Dashboard',
      description: 'Advanced analytics for talent management',
      category: 'analytics',
      version: '2.1.0',
      status: 'development',
      author: 'System',
      lastUpdated: '2024-01-13'
    }
  ];

  const handlePreview = (moduleId: string, moduleName: string) => {
    console.log(`Previewing module: ${moduleId} (${moduleName})`);
    setPreviewingModule(moduleId);
  };

  const handleTest = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-testing', {
      state: { moduleId, moduleName }
    });
  };

  const handleEdit = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-development', {
      state: { action: 'edit', moduleId, moduleName }
    });
  };

  const handleBackToList = () => {
    setPreviewingModule(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'business': 'bg-blue-50 border-blue-200 text-blue-700',
      'integration': 'bg-green-50 border-green-200 text-green-700',
      'analytics': 'bg-purple-50 border-purple-200 text-purple-700',
      'communication': 'bg-orange-50 border-orange-200 text-orange-700',
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  // Test context for module preview
  const createTestContext = (moduleId: string): ModuleContext => ({
    moduleId,
    tenantId: 'dev-tenant',
    userId: 'dev-user',
    permissions: ['read', 'write', 'admin'],
    config: {
      environment: 'development',
      debugMode: true
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading development modules...</p>
        </div>
      </div>
    );
  }

  // Show module preview if one is selected
  if (previewingModule) {
    const module = developmentModules.find(m => m.id === previewingModule);
    if (!module) {
      setPreviewingModule(null);
      return null;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Module Preview: {module.name}</h2>
            <p className="text-gray-600">Live preview of the module component</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Module Component Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModuleRenderer
                moduleId={previewingModule}
                context={createTestContext(previewingModule)}
                props={{}}
                showStatus={true}
                showError={true}
                containerClassName="border rounded-lg p-6 bg-gray-50"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Module ID:</span>
                  <p className="text-gray-600">{module.id}</p>
                </div>
                <div>
                  <span className="font-medium">Version:</span>
                  <p className="text-gray-600">{module.version}</p>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <p className="text-gray-600 capitalize">{module.category}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant="secondary">{module.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Development Modules</h2>
          <p className="text-gray-600 mt-1">
            Modules currently under development and testing
          </p>
        </div>
        <Button onClick={refreshModules}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {developmentModules.map((module) => (
          <Card key={module.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Blocks className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">{module.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">v{module.version}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getCategoryColor(module.category)}
                >
                  {module.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {module.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>By {module.author}</span>
                <span>Updated {module.lastUpdated}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePreview(module.id, module.name)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleTest(module.id, module.name)}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(module.id, module.name)}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {developmentModules.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Blocks className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No development modules</h3>
          <p className="text-gray-600">
            Development modules will appear here once they are registered in the system.
          </p>
        </div>
      )}
    </div>
  );
};

export default DevelopmentModulesDashboard;
