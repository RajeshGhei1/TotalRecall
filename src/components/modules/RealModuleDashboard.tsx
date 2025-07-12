
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Code,
  ExternalLink,
  Eye,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getFunctionalModuleCount, convertSystemModulesToModules } from '@/utils/moduleUtils';
import { getDisplayName, normalizeModuleName } from '@/utils/moduleNameMapping';
import { moduleNavigationService } from '@/services/moduleNavigationService';
import { toast } from '@/hooks/use-toast';

const RealModuleDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  // Fetch all system modules
  const { data: systemModules = [], isLoading } = useSystemModules(true);

  // Convert SystemModules to Module format for utility functions
  const modules = convertSystemModulesToModules(systemModules);

  // Calculate functional modules count
  const functionalCount = getFunctionalModuleCount(modules);
  const accessibleCount = systemModules.filter(module => 
    moduleNavigationService.isModuleAccessible(normalizeModuleName(module.name))
  ).length;

  const filteredModules = systemModules.filter(module => {
    const searchableText = `${module.name} ${module.description || ''}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Modules', count: systemModules.length },
    { value: 'core', label: 'Core', count: systemModules.filter(m => m.category === 'core').length },
    { value: 'analytics', label: 'Analytics', count: systemModules.filter(m => m.category === 'analytics').length },
    { value: 'communication', label: 'Communication', count: systemModules.filter(m => m.category === 'communication').length },
    { value: 'integrations', label: 'Integrations', count: systemModules.filter(m => m.category === 'integrations').length },
  ];

  const handleViewModule = (module: Record<string, unknown>) => {
    const normalizedId = normalizeModuleName(module.name);
    const route = moduleNavigationService.getModuleRoute(normalizedId);
    
    if (route) {
      navigate(route.path);
      toast({
        title: 'Opening Module',
        description: `Navigating to ${route.name}`,
      });
    } else {
      toast({
        title: 'Module Not Available',
        description: 'This module implementation is not yet available.',
        variant: 'destructive',
      });
    }
  };

  const handleViewInDevelopment = () => {
    navigate('/superadmin/module-development');
  };

  if (isLoading) {
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
          <h3 className="text-2xl font-bold">Real Module Dashboard</h3>
          <p className="text-muted-foreground">
            Live view of all registered modules in the system with access controls
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewInDevelopment}>
            <Code className="h-4 w-4 mr-2" />
            Development Console
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
                <p className="text-2xl font-bold">{systemModules.length}</p>
                <p className="text-sm text-muted-foreground">Total Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{functionalCount}</p>
                <p className="text-sm text-muted-foreground">Functional Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{accessibleCount}</p>
                <p className="text-sm text-muted-foreground">Accessible Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{systemModules.filter(m => m.is_active).length}</p>
                <p className="text-sm text-muted-foreground">Active Modules</p>
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
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 h-5 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      {filteredModules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Modules Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? "Try adjusting your search criteria or filters" 
                : "No modules are currently registered"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredModules.map((module) => {
            const normalizedId = normalizeModuleName(module.name);
            const moduleRoute = moduleNavigationService.getModuleRoute(normalizedId);
            const isAccessible = !!moduleRoute;
            
            return (
              <Card key={module.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{getDisplayName(module.name)}</h4>
                        <Badge variant="outline">{module.category}</Badge>
                        <Badge 
                          variant={module.is_active ? "default" : "secondary"}
                          className={module.is_active ? "bg-green-100 text-green-800" : ""}
                        >
                          {module.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {isAccessible && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Eye className="h-3 w-3 mr-1" />
                            Accessible
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description || 'No description available'}
                      </p>

                      {/* AI Contribution Section */}
                      {module.ai_level && module.ai_level !== 'none' && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={
                              module.ai_level === 'high' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              module.ai_level === 'medium' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              module.ai_level === 'low' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }>
                              {module.ai_level === 'high' ? 'High AI' :
                               module.ai_level === 'medium' ? 'Medium AI' :
                               module.ai_level === 'low' ? 'Low AI' : 'No AI'} Integration
                            </Badge>
                          </div>
                          {module.ai_description && (
                            <p className="text-xs text-gray-600 mb-2">
                              {module.ai_description}
                            </p>
                          )}
                          {module.ai_capabilities && module.ai_capabilities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {module.ai_capabilities.slice(0, 4).map((capability, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                  {capability}
                                </Badge>
                              ))}
                              {module.ai_capabilities.length > 4 && (
                                <Badge variant="secondary" className="text-xs px-2 py-1">
                                  +{module.ai_capabilities.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Module Route Info */}
                      {moduleRoute && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Available at: {moduleRoute.path}</span>
                          </div>
                          <p className="text-xs text-blue-700">{moduleRoute.description}</p>
                        </div>
                      )}

                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Version: {module.version || '1.0.0'}</span>
                        <span>Technical Name: {normalizedId}</span>
                        {module.dependencies && module.dependencies.length > 0 && (
                          <span>• Dependencies: {module.dependencies.length}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {isAccessible ? (
                        <Button 
                          size="sm"
                          onClick={() => handleViewModule(module)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Module
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                          title="Module implementation not available"
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Coming Soon
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RealModuleDashboard;
