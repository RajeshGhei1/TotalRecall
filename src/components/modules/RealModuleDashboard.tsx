
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Settings,
  Download,
  Upload,
  Trash2,
  Eye,
  Code,
  Database
} from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { useModuleTemplates } from '@/hooks/useModuleTemplates';
import { useModuleDeployments } from '@/hooks/useModuleDeployments';
import { enhancedModuleLoader } from '@/services/enhancedModuleLoader';
import { toast } from '@/hooks/use-toast';

interface RealModuleDashboardProps {
  tenantId?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('installed');

  const { data: modules = [], isLoading: modulesLoading } = useSystemModules();
  const { data: templates = [], isLoading: templatesLoading } = useModuleTemplates();
  const { data: deployments = [], isLoading: deploymentsLoading } = useModuleDeployments(tenantId);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'core', label: 'Core' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' }
  ];

  const handleModuleAction = async (moduleId: string, action: string) => {
    try {
      const context = {
        moduleId,
        tenantId: tenantId || 'system',
        userId: 'system',
        permissions: ['read', 'write'],
        config: {}
      };

      switch (action) {
        case 'load':
          await enhancedModuleLoader.loadModule(moduleId, context);
          toast({
            title: 'Module Loaded',
            description: `Successfully loaded ${moduleId}`,
          });
          break;
        case 'reload':
          await enhancedModuleLoader.reloadModule(moduleId, context);
          toast({
            title: 'Module Reloaded',
            description: `Successfully reloaded ${moduleId}`,
          });
          break;
        case 'unload':
          enhancedModuleLoader.unloadModule(moduleId);
          toast({
            title: 'Module Unloaded',
            description: `Successfully unloaded ${moduleId}`,
          });
          break;
      }
    } catch (error) {
      toast({
        title: 'Module Action Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  if (modulesLoading || templatesLoading || deploymentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Module Discovery & Management</h3>
          <p className="text-muted-foreground">
            Discover, install, and manage system modules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Module
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{modules.length}</p>
                <p className="text-sm text-muted-foreground">Installed Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-sm text-muted-foreground">Available Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{modules.filter(m => m.is_active).length}</p>
                <p className="text-sm text-muted-foreground">Active Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{deployments.length}</p>
                <p className="text-sm text-muted-foreground">Recent Deployments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules and templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed Modules</TabsTrigger>
          <TabsTrigger value="templates">Module Templates</TabsTrigger>
          <TabsTrigger value="deployments">Deployment History</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-4">
          <div className="grid gap-4">
            {filteredModules.map((module) => (
              <Card key={module.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{module.name}</h4>
                        <Badge variant={module.is_active ? "default" : "secondary"}>
                          {module.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{module.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {module.description || 'No description available'}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Version: {module.version}</span>
                        {module.dependencies && module.dependencies.length > 0 && (
                          <span>• Dependencies: {module.dependencies.length}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModuleAction(module.name, 'load')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModuleAction(module.name, 'reload')}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModuleAction(module.name, 'unload')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredModules.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Modules Found</h3>
                  <p className="text-muted-foreground">
                    No modules match your current search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                        {template.is_built_in && (
                          <Badge variant="secondary">Built-in</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description || 'No description available'}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {template.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Templates Found</h3>
                  <p className="text-muted-foreground">
                    No templates match your current search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <div className="grid gap-4">
            {deployments.slice(0, 10).map((deployment) => (
              <Card key={deployment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{deployment.module_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deployment.deployment_type} • Version {deployment.version}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          deployment.status === 'completed' ? 'default' :
                          deployment.status === 'failed' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {deployment.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(deployment.started_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {deployments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Deployments Yet</h3>
                  <p className="text-muted-foreground">
                    Module deployment history will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealModuleDashboard;
