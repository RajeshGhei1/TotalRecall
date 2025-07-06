import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Lock, Users, Activity } from 'lucide-react';
import { useComplianceItems, useCreateComplianceItem, useUpdateComplianceItem, useDeleteComplianceItem, ComplianceItem } from '@/hooks/useComplianceItems';
import { ComplianceItemDialog } from './ComplianceItemDialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  affected_users?: number;
}

export const SecurityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComplianceItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ComplianceItem | null>(null);

  const { data: complianceItems, isLoading, isError } = useComplianceItems();
  const createItem = useCreateComplianceItem();
  const updateItem = useUpdateComplianceItem();
  const deleteItem = useDeleteComplianceItem();

  // Mock security alerts
  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'suspicious_activity',
      severity: 'high',
      title: 'Multiple Failed Login Attempts',
      description: 'User account experienced 15 failed login attempts in the last 10 minutes',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'active',
      affected_users: 1
    },
    {
      id: '2',
      type: 'data_access',
      severity: 'medium',
      title: 'Unusual Data Export Pattern',
      description: 'Large data export outside normal business hours',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'investigating',
      affected_users: 1
    },
    {
      id: '3',
      type: 'authorization',
      severity: 'low',
      title: 'Permission Escalation Request',
      description: 'User requested elevated permissions for sensitive module',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved'
    }
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };
  const handleEdit = (item: ComplianceItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };
  const handleDelete = (item: ComplianceItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };
  const handleDialogSubmit = async (data: Omit<ComplianceItem, 'id'>) => {
    if (editingItem) {
      await updateItem.mutateAsync({ ...editingItem, ...data });
    } else {
      await createItem.mutateAsync(data);
    }
    setDialogOpen(false);
  };
  const handleDeleteConfirm = async () => {
    if (deletingItem) {
      await deleteItem.mutateAsync(deletingItem.id);
      setDeleteDialogOpen(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return AlertTriangle;
      case 'investigating': return Clock;
      case 'resolved': return CheckCircle;
      default: return Shield;
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'non_compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const complianceScore = complianceItems && complianceItems.length > 0
    ? Math.round((complianceItems.filter(c => c.status === 'compliant').length / complianceItems.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityAlerts.filter(a => a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {securityAlerts.filter(a => a.status === 'investigating').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {complianceScore}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protected Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Alerts
              </CardTitle>
              <CardDescription>
                Real-time security alerts and incidents requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {securityAlerts.map((alert) => {
                    const StatusIcon = getStatusIcon(alert.status);
                    return (
                      <div key={alert.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-medium">{alert.title}</span>
                          </div>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                            {alert.status === 'active' && (
                              <Button size="sm">
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-end mb-2">
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Compliance Item
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Compliance Status
              </CardTitle>
              <CardDescription>
                Track compliance with security frameworks and regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <div>Loading...</div>}
              {isError && <div>Error loading compliance data.</div>}
              <div className="space-y-3">
                {complianceItems && complianceItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{item.framework}</span>
                          <p className="text-sm text-muted-foreground">{item.requirement}</p>
                        </div>
                        <Badge variant="outline" className={getComplianceColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Last audit: {item.last_audit}</span>
                        <span>Next review: {item.next_review}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item)} title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <ComplianceItemDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleDialogSubmit}
            initialData={editingItem}
            loading={createItem.isPending || updateItem.isPending}
          />
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Compliance Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this compliance item? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteItem.isPending}>
                  {deleteItem.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Access Control
              </CardTitle>
              <CardDescription>
                Manage user permissions and access rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Access control management interface</p>
                <p className="text-sm">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Monitoring
              </CardTitle>
              <CardDescription>
                Real-time security monitoring and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Security monitoring dashboard</p>
                <p className="text-sm">Real-time metrics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
