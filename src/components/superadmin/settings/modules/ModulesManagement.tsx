
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
  Package
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

  const categories = [
    { value: 'all', label: 'All Modules' },
    { value: 'core', label: 'Core' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'configuration', label: 'Configuration' },
    { value: 'system-admin', label: 'System Admin' },
    { value: 'tenant-admin', label: 'Tenant Admin' }
  ];

  const filteredModules = modules?.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">System Modules</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage system modules
          </p>
        </div>
        <Button onClick={onCreateModule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Modules</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
          <AlertCircle className="h-8 w-8 text-orange-600" />
          <div>
            <p className="text-2xl font-bold">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
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
            </Button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Blocks className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No modules found matching your criteria</p>
          <Button 
            variant="outline" 
            onClick={onCreateModule}
            className="mt-4"
          >
            Create your first module
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
