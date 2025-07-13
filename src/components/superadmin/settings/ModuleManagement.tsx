
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight,
  ArrowLeft,
  Settings,
  BookOpen,
  Play,
  Pause,
  MoreHorizontal,
  Filter,
  Search,
  X,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useSystemModules, SystemModule } from '@/hooks/useSystemModules';
import CreateModuleDialog from './modules/CreateModuleDialog';
import EditModuleDialog from './modules/EditModuleDialog';
import DeleteModuleDialog from './modules/DeleteModuleDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const ModuleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SystemModule | null>(null);
  const [activeTab, setActiveTab] = useState<string>('planning');

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [hasDependenciesFilter, setHasDependenciesFilter] = useState<boolean>(false);

  // Fetch ALL modules for unified management
  const { data: allModules, isLoading, updateModule } = useSystemModules(false);

  // Smart navigation function (similar to useModuleNavigation)
  const handleViewModule = (module: SystemModule) => {
    const moduleSlug = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Smart navigation logic
    if (module.maturity_status === 'production' && module.is_active) {
      // Navigate to live production module
      if (module.name === 'ats_core' || moduleSlug === 'ats-core' || module.name === 'ATS Core') {
        navigate('/superadmin/ats-core');
      } else if (module.name === 'companies') {
        navigate('/superadmin/companies');
      } else if (module.name === 'people') {
        navigate('/superadmin/people');
      } else if (module.name === 'ai_analytics' || moduleSlug === 'ai-analytics') {
        navigate('/superadmin/ai-analytics');
      } else {
        // Navigate to dynamic module page
        navigate(`/superadmin/${moduleSlug}`);
      }
    } else {
      // Navigate to development environment for non-production modules
      navigate(`/superadmin/module-development?module=${module.id}&focus=${moduleSlug}`);
    }
  };

  // Get unique categories and types for filter options
  const availableCategories = useMemo(() => {
    if (!allModules) return [];
    const categories = [...new Set(allModules.map(m => m.category))].filter(Boolean).sort();
    return categories;
  }, [allModules]);

  const availableTypes = useMemo(() => {
    if (!allModules) return [];
    const types = [...new Set(allModules.map(m => m.type))].filter(Boolean).sort();
    return types;
  }, [allModules]);

  // Apply filters to modules
  const filteredModules = useMemo(() => {
    if (!allModules) return [];
    
    return allModules.filter(module => {
      // Category filter
      if (categoryFilter !== 'all' && module.category !== categoryFilter) {
        return false;
      }
      
      // Type filter
      if (typeFilter !== 'all' && module.type !== typeFilter) {
        return false;
      }
      
      // Dependencies filter
      if (hasDependenciesFilter && (!module.dependencies || module.dependencies.length === 0)) {
        return false;
      }
      
      // Search filter
      if (searchFilter && !module.name.toLowerCase().includes(searchFilter.toLowerCase()) && 
          !module.description?.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [allModules, categoryFilter, typeFilter, searchFilter, hasDependenciesFilter]);

  const handleEditModule = (module: SystemModule) => {
    setSelectedModule(module);
    setEditDialogOpen(true);
  };

  const handleDeleteModule = (module: SystemModule) => {
    setSelectedModule(module);
    setDeleteDialogOpen(true);
  };

  // Get module status information
  const getModuleStatus = (module: SystemModule) => {
    if (!module.is_active) {
      return { status: 'inactive', color: 'bg-red-500', label: 'Inactive', description: 'Module is disabled' };
    }
    
    switch(module.maturity_status) {
      case 'production': return { status: 'production', color: 'bg-green-500', label: 'Live', description: 'Ready to use' };
      case 'beta': return { status: 'beta', color: 'bg-yellow-500', label: 'Testing', description: 'In beta testing' };
      case 'alpha': return { status: 'alpha', color: 'bg-orange-500', label: 'Development', description: 'In active development' };
      case 'planning': return { status: 'planning', color: 'bg-blue-500', label: 'Planning', description: 'In planning stage' };
      default: return { status: 'unknown', color: 'bg-gray-500', label: 'Unknown', description: 'Status unknown' };
    }
  };

  // Get modules by stage (now using filtered modules)
  const getModulesByStage = (stage: string): SystemModule[] => {
    if (stage === 'inactive') {
      return filteredModules.filter(module => !module.is_active);
    }
    return filteredModules.filter(module => 
      module.is_active && (module.maturity_status === stage || (stage === 'planning' && !module.maturity_status))
    );
  };

  // Calculate stage counts
  const planningModules = getModulesByStage('planning');
  const alphaModules = getModulesByStage('alpha');
  const betaModules = getModulesByStage('beta');
  const productionModules = getModulesByStage('production');
  const inactiveModules = getModulesByStage('inactive');

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter('all');
    setTypeFilter('all');
    setSearchFilter('');
    setHasDependenciesFilter(false);
  };

  // Check if any filters are active
  const hasActiveFilters = categoryFilter !== 'all' || typeFilter !== 'all' || searchFilter !== '' || hasDependenciesFilter;

  const promoteModule = async (module: SystemModule, newStage: string) => {
    try {
      const updatedModule = {
        ...module,
        maturity_status: newStage as any,
        updated_at: new Date().toISOString()
      };
      
      if (updateModule) {
        await updateModule.mutateAsync({ id: module.id, updates: updatedModule });
      }
    } catch (error) {
      console.error('Error promoting module:', error);
    }
  };

  const toggleModuleActive = async (module: SystemModule) => {
    try {
      const updatedModule = { ...module, is_active: !module.is_active };
      if (updateModule) {
        await updateModule.mutateAsync({ id: module.id, updates: updatedModule });
      }
    } catch (error) {
      console.error('Error toggling module active state:', error);
    }
  };

  const getNextStage = (currentStage: string): string | null => {
    const stages = ['planning', 'alpha', 'beta', 'production'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };

  const getPreviousStage = (currentStage: string): string | null => {
    const stages = ['planning', 'alpha', 'beta', 'production'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex > 0 ? stages[currentIndex - 1] : null;
  };

  const ModuleCard = ({ module }: { module: SystemModule }) => {
    const statusInfo = getModuleStatus(module);
    const nextStage = getNextStage(module.maturity_status || 'planning');
    const prevStage = getPreviousStage(module.maturity_status || 'planning');

    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
              <h3 className="font-semibold text-lg">{module.name}</h3>
              <Badge variant="outline" className="text-xs">
                {module.type?.replace('_', ' ') || 'business'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-50">
                {module.category?.replace('_', ' ') || 'general'}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3">{module.description}</p>
            
            {/* Debug: Always show dependencies section with debug info */}
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500">
                Dependencies ({module.dependencies?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {module.dependencies && module.dependencies.length > 0 ? (
                  module.dependencies.map((dep, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{dep}</Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs text-gray-400">
                    {module.type === 'super_admin' ? 'Super Admin (no dependencies)' : 
                     module.type === 'foundation' ? 'Foundation (no dependencies)' : 
                     'No dependencies'}
                  </Badge>
                )}
              </div>
            </div>

            {module.ai_capabilities && module.ai_capabilities.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">AI Capabilities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.ai_capabilities.slice(0, 3).map((capability, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                      {capability}
                    </Badge>
                  ))}
                  {module.ai_capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{module.ai_capabilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-4">
            {prevStage && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => promoteModule(module, prevStage)}
                title={`Demote to ${prevStage}`}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            {nextStage && (
              <Button 
                size="sm" 
                onClick={() => promoteModule(module, nextStage)}
                title={`Promote to ${nextStage}`}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => toggleModuleActive(module)}
              title={module.is_active ? 'Deactivate' : 'Activate'}
            >
              {module.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewModule(module)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Module
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditModule(module)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Module
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteModule(module)}
                  className="text-red-600"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Delete Module
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading modules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
          <p className="text-gray-600">Unified module development lifecycle and configuration</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Module
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Search Filter */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-48 h-8"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type?.replace('_', ' ') || 'Unknown'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 h-8">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category?.replace('_', ' ') || 'Unknown'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dependencies Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Has Dependencies:</span>
            <Select value={hasDependenciesFilter ? 'true' : 'false'} onValueChange={(value) => setHasDependenciesFilter(value === 'true')}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeFilter}
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Category: {categoryFilter}
                </Badge>
              )}
              {searchFilter && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchFilter}"
                </Badge>
              )}
              {hasDependenciesFilter && (
                <Badge variant="secondary" className="text-xs">
                  Dependencies: Yes
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Stage Overview Stats - Now Clickable Navigation */}
      <div className="grid grid-cols-5 gap-4">
        <Card 
          className={`p-4 bg-blue-50 border-blue-200 cursor-pointer transition-all hover:shadow-md ${
            activeTab === 'planning' ? 'ring-2 ring-blue-500 shadow-md' : ''
          }`}
          onClick={() => setActiveTab('planning')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{planningModules.length}</div>
            <div className="text-sm text-blue-700">Planning</div>
          </div>
        </Card>
        <Card 
          className={`p-4 bg-orange-50 border-orange-200 cursor-pointer transition-all hover:shadow-md ${
            activeTab === 'alpha' ? 'ring-2 ring-orange-500 shadow-md' : ''
          }`}
          onClick={() => setActiveTab('alpha')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-900">{alphaModules.length}</div>
            <div className="text-sm text-orange-700">Alpha</div>
          </div>
        </Card>
        <Card 
          className={`p-4 bg-yellow-50 border-yellow-200 cursor-pointer transition-all hover:shadow-md ${
            activeTab === 'beta' ? 'ring-2 ring-yellow-500 shadow-md' : ''
          }`}
          onClick={() => setActiveTab('beta')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-900">{betaModules.length}</div>
            <div className="text-sm text-yellow-700">Beta</div>
          </div>
        </Card>
        <Card 
          className={`p-4 bg-green-50 border-green-200 cursor-pointer transition-all hover:shadow-md ${
            activeTab === 'production' ? 'ring-2 ring-green-500 shadow-md' : ''
          }`}
          onClick={() => setActiveTab('production')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{productionModules.length}</div>
            <div className="text-sm text-green-700">Production</div>
          </div>
        </Card>
        <Card 
          className={`p-4 bg-red-50 border-red-200 cursor-pointer transition-all hover:shadow-md ${
            activeTab === 'inactive' ? 'ring-2 ring-red-500 shadow-md' : ''
          }`}
          onClick={() => setActiveTab('inactive')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-900">{inactiveModules.length}</div>
            <div className="text-sm text-red-700">Inactive</div>
          </div>
        </Card>
      </div>

      {/* Module Content - No Redundant Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsContent value="planning" className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            📋 <strong>Planning Stage:</strong> Modules in initial planning phase. Ready to move to Alpha development.
          </div>
          {planningModules.map(module => <ModuleCard key={module.id} module={module} />)}
          {planningModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters ? 'No modules match the current filters' : 'No modules in planning stage'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alpha" className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-orange-50 rounded-lg border border-orange-200">
            🔧 <strong>Alpha Stage:</strong> Modules in active development. Testing core functionality.
          </div>
          {alphaModules.map(module => <ModuleCard key={module.id} module={module} />)}
          {alphaModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters ? 'No modules match the current filters' : 'No modules in alpha stage'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="beta" className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            🧪 <strong>Beta Stage:</strong> Modules in testing phase. Ready for user feedback.
          </div>
          {betaModules.map(module => <ModuleCard key={module.id} module={module} />)}
          {betaModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters ? 'No modules match the current filters' : 'No modules in beta stage'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-green-50 rounded-lg border border-green-200">
            🚀 <strong>Production Stage:</strong> Live modules ready for customers.
          </div>
          {productionModules.map(module => <ModuleCard key={module.id} module={module} />)}
          {productionModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters ? 'No modules match the current filters' : 'No modules in production stage'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="text-sm text-gray-600 p-4 bg-red-50 rounded-lg border border-red-200">
            💤 <strong>Inactive Stage:</strong> Disabled modules not currently in use.
          </div>
          {inactiveModules.map(module => <ModuleCard key={module.id} module={module} />)}
          {inactiveModules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters ? 'No modules match the current filters' : 'No inactive modules'}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateModuleDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      <EditModuleDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        module={selectedModule as any}
      />
      <DeleteModuleDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        module={selectedModule as any}
      />
    </div>
  );
};

export default ModuleManagement;
