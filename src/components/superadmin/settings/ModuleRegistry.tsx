
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Blocks, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import CreateModuleDialog from './modules/CreateModuleDialog';
import EditModuleDialog from './modules/EditModuleDialog';
import DeleteModuleDialog from './modules/DeleteModuleDialog';
import ModuleCard from './modules/ModuleCard';

const ModuleRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const { data: modules, isLoading } = useSystemModules();

  const categories = [
    { value: 'all', label: 'All Modules' },
    { value: 'core', label: 'Core' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' }
  ];

  const filteredModules = modules?.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setEditDialogOpen(true);
  };

  const handleDeleteModule = (module: any) => {
    setSelectedModule(module);
    setDeleteDialogOpen(true);
  };

  const getModuleStats = () => {
    if (!modules) return { total: 0, active: 0, inactive: 0 };
    
    return {
      total: modules.length,
      active: modules.filter(m => m.is_active).length,
      inactive: modules.filter(m => !m.is_active).length
    };
  };

  const stats = getModuleStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Module Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Module Registry
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage system modules and their configurations
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
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
          <div className="flex gap-4 mb-6">
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
                onClick={() => setCreateDialogOpen(true)}
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
                  onEdit={handleEditModule}
                  onDelete={handleDeleteModule}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateModuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedModule && (
        <>
          <EditModuleDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            module={selectedModule}
          />
          <DeleteModuleDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            module={selectedModule}
          />
        </>
      )}
    </div>
  );
};

export default ModuleRegistry;
