
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Plus,
  Settings,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import { useTenants } from '@/hooks/useTenants';
import AssignModuleDialog from './AssignModuleDialog';
import TenantModuleList from './TenantModuleList';
import TenantAccessOverview from './TenantAccessOverview';

const TenantModuleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const { data: assignments, isLoading: assignmentsLoading } = useTenantModules();
  const { data: modules } = useSystemModules();
  const { tenants } = useTenants();

  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = 
      assignment.module?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenant = selectedTenant === 'all' || assignment.tenant_id === selectedTenant;
    return matchesSearch && matchesTenant;
  }) || [];

  const getAssignmentStats = () => {
    if (!assignments) return { total: 0, active: 0, expired: 0 };
    
    const now = new Date();
    return {
      total: assignments.length,
      active: assignments.filter(a => a.is_enabled && (!a.expires_at || new Date(a.expires_at) > now)).length,
      expired: assignments.filter(a => a.expires_at && new Date(a.expires_at) <= now).length
    };
  };

  const stats = getAssignmentStats();
  const selectedTenantData = tenants?.find(t => t.id === selectedTenant);

  if (assignmentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tenant Module Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tenant Module Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage module access through subscriptions and emergency overrides
            </p>
          </div>
          <Button onClick={() => setAssignDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Emergency Override
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Access Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Override Assignments
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            {/* Tenant Selector for Overview */}
            <div className="flex gap-4 mb-6">
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="all">Select a tenant for overview</option>
                {tenants?.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTenant !== 'all' && selectedTenantData && (
              <TenantAccessOverview 
                tenantId={selectedTenant} 
                tenantName={selectedTenantData.name}
              />
            )}

            {selectedTenant === 'all' && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Select a Tenant</h3>
                  <p className="text-muted-foreground">
                    Choose a tenant from the dropdown above to view their module access overview
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Settings className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Overrides</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.active}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.expired}</p>
                    <p className="text-sm text-muted-foreground">Expired</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by module or tenant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="all">All Tenants</option>
                  {tenants?.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warning about override system */}
              {filteredAssignments.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> These are emergency override assignments. 
                    The subscription-based access system takes priority. 
                    Consider migrating these to proper subscription plans.
                  </p>
                </div>
              )}

              {/* Assignment List */}
              <TenantModuleList assignments={filteredAssignments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Audit Log</h3>
              <p className="text-muted-foreground">
                Module access audit logging will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assignment Dialog */}
      <AssignModuleDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        modules={modules || []}
        tenants={tenants || []}
      />
    </div>
  );
};

export default TenantModuleManager;
