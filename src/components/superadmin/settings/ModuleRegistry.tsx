
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Blocks, 
  Users,
  Settings
} from 'lucide-react';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import CreateModuleDialog from './modules/CreateModuleDialog';
import EditModuleDialog from './modules/EditModuleDialog';
import DeleteModuleDialog from './modules/DeleteModuleDialog';
import ModulesManagement from './modules/ModulesManagement';
import TenantModuleManager from './modules/TenantModuleManager';

const ModuleRegistry: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const { data: modules, isLoading } = useSystemModules();

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
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Blocks className="h-5 w-5" />
              Module Registry
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage system modules and tenant assignments
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Module Management
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tenant Assignments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-6">
              <ModulesManagement
                modules={modules || []}
                stats={stats}
                onCreateModule={() => setCreateDialogOpen(true)}
                onEditModule={handleEditModule}
                onDeleteModule={handleDeleteModule}
              />
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              <TenantModuleManager />
            </TabsContent>
          </Tabs>
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
