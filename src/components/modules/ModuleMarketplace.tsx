
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Star, 
  Download, 
  Shield, 
  Package,
  Filter,
  SortDesc,
  ExternalLink,
  Installation,
  Info
} from 'lucide-react';
import { moduleRegistryService, ModuleRegistryEntry } from '@/services/moduleRegistryService';
import { useStableTenantContext } from '@/hooks/useStableTenantContext';

const ModuleMarketplace: React.FC = () => {
  const { data: tenantData } = useStableTenantContext();
  const [modules, setModules] = useState<ModuleRegistryEntry[]>([]);
  const [filteredModules, setFilteredModules] = useState<ModuleRegistryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedModule, setSelectedModule] = useState<ModuleRegistryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Categories', icon: Package },
    { id: 'core', label: 'Core', icon: Shield },
    { id: 'business', label: 'Business', icon: Package },
    { id: 'recruitment', label: 'Recruitment', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: Package },
    { id: 'ai', label: 'AI & ML', icon: Package },
    { id: 'integration', label: 'Integrations', icon: Package },
    { id: 'communication', label: 'Communication', icon: Package },
    { id: 'custom', label: 'Custom', icon: Package }
  ];

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    filterAndSortModules();
  }, [modules, searchQuery, selectedCategory, sortBy]);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      const moduleData = await moduleRegistryService.getPublishedModules();
      setModules(moduleData);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortModules = () => {
    let filtered = modules;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => module.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort modules
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.download_count - a.download_count);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating_average - a.rating_average);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredModules(filtered);
  };

  const handleInstallModule = async (module: ModuleRegistryEntry) => {
    if (!tenantData?.tenant_id) return;

    try {
      const success = await moduleRegistryService.installModule(
        module.module_id,
        module.version,
        tenantData.tenant_id
      );

      if (success) {
        console.log(`Module ${module.name} installed successfully`);
        // Refresh modules to update download count
        loadModules();
      }
    } catch (error) {
      console.error('Error installing module:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderModuleCard = (module: ModuleRegistryEntry) => (
    <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{module.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {module.author}</p>
            <Badge variant="outline" className="mt-2">
              {module.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(module.rating_average)}
            <span className="text-sm text-muted-foreground ml-1">
              ({module.rating_count})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {module.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Download className="h-3 w-3" />
            <span>{module.download_count.toLocaleString()} downloads</span>
          </div>
          <div>v{module.version}</div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setSelectedModule(module)}
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleInstallModule(module)}
          >
            <Installation className="h-4 w-4 mr-2" />
            Install
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and install modules to extend your platform capabilities
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredModules.length} modules found
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(renderModuleCard)}
      </div>

      {/* Module Details Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {selectedModule?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground">by {selectedModule.author}</p>
                  <p className="text-sm text-muted-foreground">Version {selectedModule.version}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedModule.category}</Badge>
                    <Badge variant="outline">{selectedModule.license}</Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {renderStars(selectedModule.rating_average)}
                    <span className="text-sm ml-1">({selectedModule.rating_count})</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedModule.download_count.toLocaleString()} downloads
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Dependencies</h3>
                  <div className="space-y-1">
                    {selectedModule.dependencies?.length > 0 ? (
                      selectedModule.dependencies.map((dep, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {dep}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No dependencies</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Required Permissions</h3>
                  <div className="space-y-1">
                    {selectedModule.required_permissions?.length > 0 ? (
                      selectedModule.required_permissions.map((perm, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {perm}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No special permissions</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => selectedModule && handleInstallModule(selectedModule)}
                >
                  <Installation className="h-4 w-4 mr-2" />
                  Install Module
                </Button>
                
                {selectedModule.homepage && (
                  <Button variant="outline" asChild>
                    <a href={selectedModule.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Homepage
                    </a>
                  </Button>
                )}
                
                {selectedModule.repository && (
                  <Button variant="outline" asChild>
                    <a href={selectedModule.repository} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Repository
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleMarketplace;
