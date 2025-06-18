
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Blocks, 
  Settings,
  Zap,
  BookOpen
} from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import CreateModuleDialog from './modules/CreateModuleDialog';
import EditModuleDialog from './modules/EditModuleDialog';
import DeleteModuleDialog from './modules/DeleteModuleDialog';
import ModulesManagement from './modules/ModulesManagement';

const ModuleManagement: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  // Only fetch production modules for the System Module Library
  const { data: modules, isLoading } = useSystemModules(true, 'production');

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
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border">
          <Blocks className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-green-900">{stats.total}</p>
            <p className="text-sm text-green-700">Production Modules</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border">
          <Zap className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
            <p className="text-sm text-blue-700">Active Modules</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border">
          <Settings className="h-8 w-8 text-orange-600" />
          <div>
            <p className="text-2xl font-bold text-orange-900">{stats.inactive}</p>
            <p className="text-sm text-orange-700">Inactive Modules</p>
          </div>
        </div>
      </div>

      {/* Main Module Management - Simplified to single tab */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">System Module Library</h2>
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Documentation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Modules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure and manage production-ready modules that can be assigned to subscription plans
          </p>
        </CardHeader>
        <CardContent>
          <ModulesManagement
            modules={modules || []}
            stats={stats}
            onCreateModule={() => setCreateDialogOpen(true)}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            showOnlyProduction={true}
          />
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

export default ModuleManagement;
