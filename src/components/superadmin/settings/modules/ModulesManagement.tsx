
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Blocks,
  AlertCircle,
  CheckCircle,
  Package,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { SystemModule } from '@/hooks/modules/useSystemModules';
import ModuleCard from './ModuleCard';

interface ModulesManagementProps {
  modules: SystemModule[];
  stats: { total: number; active: number; inactive: number };
  onCreateModule: () => void;
  onEditModule: (module: SystemModule) => void;
  onDeleteModule: (module: SystemModule) => void;
}

const ModulesManagement: React.FC<ModulesManagementProps> = ({
  modules,
  stats,
  onCreateModule,
  onEditModule,
  onDeleteModule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { value: 'all', label: 'All Modules', count: stats.total },
    { value: 'core', label: 'Core', count: modules?.filter(m => m.category === 'core').length || 0 },
    { value: 'analytics', label: 'Analytics', count: modules?.filter(m => m.category === 'analytics').length || 0 },
    { value: 'communication', label: 'Communication', count: modules?.filter(m => m.category === 'communication').length || 0 },
    { value: 'integrations', label: 'Integrations', count: modules?.filter(m => m.category === 'integrations').length || 0 },
    { value: 'recruitment', label: 'Recruitment', count: modules?.filter(m => m.category === 'recruitment').length || 0 },
    { value: 'talent', label: 'Talent Management', count: modules?.filter(m => m.category === 'talent').length || 0 },
    { value: 'configuration', label: 'Configuration', count: modules?.filter(m => m.category === 'configuration').length || 0 },
    { value: 'system-admin', label: 'System Admin', count: modules?.filter(m => m.category === 'system-admin').length || 0 },
    { value: 'tenant-admin', label: 'Tenant Admin', count: modules?.filter(m => m.category === 'tenant-admin').length || 0 }
  ];

  const filteredModules = modules?.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">System Module Library</h3>
          <p className="text-gray-600 mt-1">
            Manage and configure system modules for your platform
          </p>
        </div>
        <Button onClick={onCreateModule} size="lg" className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Module
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-blue-700 font-medium">Total Modules</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
              <p className="text-green-700 font-medium">Active Modules</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-900">{stats.inactive}</p>
              <p className="text-orange-700 font-medium">Inactive Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="h-8"
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 h-5 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Module Grid/List */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Blocks className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? "Try adjusting your search criteria or filters" 
              : "Get started by creating your first module"
            }
          </p>
          <Button onClick={onCreateModule} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Module
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={onEditModule}
              onDelete={onDeleteModule}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModulesManagement;
