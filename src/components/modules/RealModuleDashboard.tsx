
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Grid3X3,
  List,
  Package,
  Activity,
  CheckCircle,
  XCircle,
  ExternalLink,
  Settings,
  Eye,
  Zap,
  Database,
  BarChart3,
  MessageSquare,
  Link,
  UserCheck,
  Brain,
  Shield,
  Sparkles
} from 'lucide-react';
import { useRealModuleDiscovery } from '@/hooks/useRealModuleDiscovery';
import ModuleStatusViewer from './ModuleStatusViewer';

interface RealModuleDashboardProps {
  tenantId?: string;
}

interface ModuleData {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  version: string;
  accessMethod: string;
  route?: string;
}

const RealModuleDashboard: React.FC<RealModuleDashboardProps> = ({ tenantId }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: moduleResults, isLoading } = useRealModuleDiscovery(tenantId);

  // Transform the results into the expected format
  const modules: ModuleData[] = useMemo(() => {
    if (!moduleResults) return [];
    
    return moduleResults.map((result, index) => ({
      id: `module-${index}`,
      name: result.moduleId,
      description: `${result.moduleId} module`,
      category: 'business', // Default category
      status: result.isEnabled ? 'active' : 'inactive',
      version: '1.0.0',
      accessMethod: 'subscription', // Simplified to subscription-only
      route: result.isEnabled ? `/modules/${result.moduleId}` : undefined
    }));
  }, [moduleResults]);

  const totalModules = modules.length;
  const activeModules = modules.filter(m => m.status === 'active').length;
  const availableModules = modules.filter(m => m.accessMethod === 'subscription').length;

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || module.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [modules, searchQuery, selectedCategory, selectedStatus]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(modules.map(m => m.category)));
    return uniqueCategories.sort();
  }, [modules]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'core': <Database className="h-4 w-4" />,
      'analytics': <BarChart3 className="h-4 w-4" />,
      'communication': <MessageSquare className="h-4 w-4" />,
      'integration': <Link className="h-4 w-4" />,
      'integrations': <Link className="h-4 w-4" />,
      'recruitment': <UserCheck className="h-4 w-4" />,
      'talent': <UserCheck className="h-4 w-4" />,
      'ai': <Brain className="h-4 w-4" />,
      'business': <Package className="h-4 w-4" />,
      'security': <Shield className="h-4 w-4" />
    };
    return icons[category] || <Package className="h-4 w-4" />;
  };

  const handleOpenModule = (module: ModuleData) => {
    if (module.route) {
      // Open module in new tab
      window.open(module.route, '_blank');
    } else {
      // Show a message or fallback action for modules without routes
      console.log(`Module ${module.name} doesn't have a configured route`);
    }
  };

  const renderModuleCard = (module: ModuleData) => (
    <Card key={module.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              module.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {getCategoryIcon(module.category)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {module.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">v{module.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs bg-blue-100 text-blue-800 border-blue-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              <span className="capitalize">Subscription</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="capitalize">{module.category}</span>
            </Badge>
            <Badge 
              variant={module.status === 'active' ? 'default' : 'secondary'}
              className={`text-xs ${
                module.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {module.status === 'active' && <Sparkles className="h-3 w-3 mr-1" />}
              <span className="capitalize">{module.status}</span>
            </Badge>
          </div>
          
          {module.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {module.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedModule(module)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Status
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenModule(module)}
            className="flex-1"
            disabled={!module.route}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {module.route ? 'Open' : 'No Route'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="px-3"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold">{totalModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Modules</p>
                <p className="text-2xl font-bold">{activeModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{availableModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      {filteredModules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredModules.map(renderModuleCard)}
        </div>
      )}

      {/* Module Status Modal */}
      {selectedModule && (
        <ModuleStatusViewer
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
        />
      )}
    </div>
  );
};

export default RealModuleDashboard;
