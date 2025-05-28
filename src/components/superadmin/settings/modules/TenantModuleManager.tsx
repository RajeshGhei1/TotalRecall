
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus,
  Settings,
  Calendar,
  Clock
} from 'lucide-react';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import { useTenants } from '@/hooks/useTenants';
import AssignModuleDialog from './AssignModuleDialog';
import TenantModuleList from './TenantModuleList';

const TenantModuleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const { data: assignments, isLoading: assignmentsLoading } = useTenantModules();
  const { data: modules } = useSystemModules();
  const { data: tenants } = useTenants();

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

  if (assignmentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tenant Module Assignments
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
              Tenant Module Assignments
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage module access for all tenants
            </p>
          </div>
          <Button onClick={() => setAssignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Module
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
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

          {/* Assignment List */}
          <TenantModuleList assignments={filteredAssignments} />
        </CardContent>
      </Card>

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
