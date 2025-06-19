
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
  Code
} from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getFunctionalModuleCount, convertSystemModulesToModules } from '@/utils/moduleUtils';
import { getDisplayName } from '@/utils/moduleNameMapping';

const RealModuleDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch all system modules
  const { data: systemModules = [], isLoading } = useSystemModules(true);

  // Convert SystemModules to Module format for utility functions
  const modules = convertSystemModulesToModules(systemModules);

  // Calculate functional modules count
  const functionalCount = getFunctionalModuleCount(modules);

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
            Live view of all registered modules in the system
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex gap-2">
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
          {filteredModules.map((module) => (
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
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description || 'No description available'}
                    </p>

                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Version: {module.version || '1.0.0'}</span>
                      <span>Technical Name: {module.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealModuleDashboard;
