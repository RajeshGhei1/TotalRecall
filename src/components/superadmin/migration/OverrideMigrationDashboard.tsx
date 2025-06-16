
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Mail,
  FileSpreadsheet,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  OverrideToSubscriptionMigrationService, 
  type MigrationReport,
  type MigrationRecommendation 
} from '@/services/migration/overrideToSubscriptionMigration';

const OverrideMigrationDashboard = () => {
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    loadMigrationReport();
  }, []);

  const loadMigrationReport = async () => {
    setIsLoading(true);
    try {
      const report = await OverrideToSubscriptionMigrationService.auditExistingOverrides();
      setMigrationReport(report);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load migration report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!migrationReport) return;

    const csvContent = OverrideToSubscriptionMigrationService.exportOverridesToCSV(migrationReport.exportedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `override-assignments-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Override assignments exported successfully"
    });
  };

  const handleCreateTemporarySubscriptions = async () => {
    if (!migrationReport) return;

    setIsLoading(true);
    try {
      await OverrideToSubscriptionMigrationService.createTemporarySubscriptionPlans(migrationReport.migrationRecommendations);
      setMigrationStatus('in-progress');
      toast({
        title: "Success",
        description: "Temporary subscriptions created for affected tenants"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create temporary subscriptions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: typeof migrationStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: typeof migrationStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <ArrowRight className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isLoading && !migrationReport) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading migration analysis...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle className="text-xl text-orange-900">Override Migration Dashboard</CardTitle>
                <p className="text-orange-700 mt-1">
                  Manage the transition from manual overrides to subscription-based access
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(migrationStatus)}>
              {getStatusIcon(migrationStatus)}
              <span className="ml-1 capitalize">{migrationStatus.replace('-', ' ')}</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      {migrationReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Overrides</p>
                  <p className="text-2xl font-bold">{migrationReport.totalOverrides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Affected Tenants</p>
                  <p className="text-2xl font-bold">{migrationReport.affectedTenants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Critical Overrides</p>
                  <p className="text-2xl font-bold">{migrationReport.criticalOverrides.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Recommendations</p>
                  <p className="text-2xl font-bold">{migrationReport.migrationRecommendations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migration Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Execute the migration process step by step
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              disabled={!migrationReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Override Data
            </Button>

            <Button 
              onClick={handleCreateTemporarySubscriptions}
              disabled={!migrationReport || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Create Temporary Subscriptions
            </Button>

            <Button 
              variant="outline"
              onClick={() => toast({ title: "Feature Coming Soon", description: "Bulk communication will be available shortly" })}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Tenant Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report */}
      {migrationReport && (
        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recommendations">Migration Recommendations</TabsTrigger>
            <TabsTrigger value="overrides">Current Overrides</TabsTrigger>
            <TabsTrigger value="communications">Communication Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Migration Recommendations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Suggested subscription plans based on current module usage
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {migrationReport.migrationRecommendations.map((recommendation) => (
                    <div key={recommendation.tenant_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{recommendation.tenant_name}</h4>
                          <p className="text-sm text-gray-600">{recommendation.tenant_id}</p>
                        </div>
                        <Badge variant="outline">
                          {recommendation.recommended_plan}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Current Modules: </span>
                          <span className="text-gray-600">
                            {recommendation.current_overrides.join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Justification: </span>
                          <span className="text-gray-600">{recommendation.justification}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overrides">
            <Card>
              <CardHeader>
                <CardTitle>Current Override Assignments</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed view of existing manual overrides
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {migrationReport.exportedData.map((override) => (
                    <div key={override.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{override.tenant_name || 'Unknown Tenant'}</p>
                        <p className="text-sm text-gray-600">{override.module_name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={override.is_enabled ? "default" : "secondary"}>
                          {override.is_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(override.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle>Communication Templates</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sample templates for tenant communication
                </p>
              </CardHeader>
              <CardContent>
                {migrationReport.migrationRecommendations.slice(0, 1).map((recommendation) => {
                  const templates = OverrideToSubscriptionMigrationService.generateCommunicationTemplates(recommendation);
                  return (
                    <div key={recommendation.tenant_id} className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Email Template</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2">Subject: {templates.emailSubject}</p>
                          <div className="text-sm whitespace-pre-line text-gray-700">
                            {templates.emailBody}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Dashboard Notice</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">{templates.dashboardNotice}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default OverrideMigrationDashboard;
