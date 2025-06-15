
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulePackager } from '@/services/modulePackager';
import { moduleRepository, ModuleRepositoryEntry } from '@/services/moduleRepository';
import { moduleVersionManager } from '@/services/moduleVersionManager';
import { toast } from 'sonner';

const ModuleDeploymentManager: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [packageVersion, setPackageVersion] = useState('1.0.0');
  const queryClient = useQueryClient();

  // Fetch repository modules
  const { data: repositoryModules, isLoading } = useQuery({
    queryKey: ['repositoryModules'],
    queryFn: () => moduleRepository.getRepositoryModules(),
  });

  // Package module mutation
  const packageModuleMutation = useMutation({
    mutationFn: async ({ moduleId, version }: { moduleId: string; version: string }) => {
      const modulePackage = await modulePackager.packageModule(moduleId, version);
      return moduleRepository.uploadModule(modulePackage, 'current-user');
    },
    onSuccess: () => {
      toast.success('Module packaged and uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['repositoryModules'] });
    },
    onError: (error) => {
      toast.error(`Packaging failed: ${error.message}`);
    },
  });

  // Approve module mutation
  const approveModuleMutation = useMutation({
    mutationFn: (entryId: string) => moduleRepository.approveModule(entryId, 'current-user'),
    onSuccess: () => {
      toast.success('Module approved successfully');
      queryClient.invalidateQueries({ queryKey: ['repositoryModules'] });
    },
    onError: (error) => {
      toast.error(`Approval failed: ${error.message}`);
    },
  });

  // Deploy module mutation
  const deployModuleMutation = useMutation({
    mutationFn: (entryId: string) => moduleRepository.deployModule(entryId, {
      rollbackOnFailure: true,
      notifyUsers: true
    }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Module deployed successfully');
      } else {
        toast.error('Module deployment failed');
      }
      queryClient.invalidateQueries({ queryKey: ['repositoryModules'] });
    },
    onError: (error) => {
      toast.error(`Deployment failed: ${error.message}`);
    },
  });

  // Hot-swap module mutation
  const hotSwapMutation = useMutation({
    mutationFn: ({ moduleId, version }: { moduleId: string; version: string }) => 
      moduleVersionManager.hotSwapModule(moduleId, version, 'current-tenant'),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Hot-swapped ${result.oldVersion} → ${result.newVersion}`);
      } else {
        toast.error(`Hot-swap failed: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`Hot-swap failed: ${error.message}`);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deployed': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderModuleActions = (entry: ModuleRepositoryEntry) => (
    <div className="flex gap-2">
      {entry.status === 'pending' && (
        <Button
          size="sm"
          onClick={() => approveModuleMutation.mutate(entry.id)}
          disabled={approveModuleMutation.isPending}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </Button>
      )}
      
      {entry.status === 'approved' && (
        <Button
          size="sm"
          onClick={() => deployModuleMutation.mutate(entry.id)}
          disabled={deployModuleMutation.isPending}
        >
          <Upload className="h-3 w-3 mr-1" />
          Deploy
        </Button>
      )}
      
      {entry.status === 'deployed' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => hotSwapMutation.mutate({ 
            moduleId: entry.moduleId, 
            version: entry.version 
          })}
          disabled={hotSwapMutation.isPending}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Hot-swap
        </Button>
      )}
    </div>
  );

  const renderValidationResult = (entry: ModuleRepositoryEntry) => {
    const { validationResult } = entry;
    
    if (!validationResult.isValid) {
      return (
        <div className="text-sm text-red-600">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {validationResult.errors.length} error(s)
        </div>
      );
    }

    if (validationResult.warnings.length > 0) {
      return (
        <div className="text-sm text-yellow-600">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {validationResult.warnings.length} warning(s)
        </div>
      );
    }

    return (
      <div className="text-sm text-green-600">
        <CheckCircle className="h-3 w-3 inline mr-1" />
        Valid
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Module Deployment Manager...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Module Deployment Manager
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Package, deploy, and manage module versions with independent deployment capabilities
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="repository">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="repository">Repository</TabsTrigger>
              <TabsTrigger value="packaging">Packaging</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            <TabsContent value="repository" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Module Repository</h3>
                
                {repositoryModules && repositoryModules.length > 0 ? (
                  <div className="space-y-3">
                    {repositoryModules.map(entry => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(entry.status)}
                            <div>
                              <h4 className="font-semibold">
                                {entry.moduleId} v{entry.version}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {(entry.size / 1024).toFixed(1)} KB • 
                                Uploaded {entry.uploadedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status}
                            </Badge>
                            {renderValidationResult(entry)}
                            {renderModuleActions(entry)}
                          </div>
                        </div>
                        
                        {entry.validationResult.warnings.length > 0 && (
                          <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                            <strong>Warnings:</strong>
                            <ul className="mt-1 space-y-1">
                              {entry.validationResult.warnings.map((warning, i) => (
                                <li key={i} className="text-yellow-700">• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No modules in repository</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="packaging" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Package Module</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Module ID</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={selectedModule || ''}
                      onChange={(e) => setSelectedModule(e.target.value)}
                    >
                      <option value="">Select module...</option>
                      <option value="companies">Companies</option>
                      <option value="people_contacts">People & Contacts</option>
                      <option value="bi_dashboard">BI Dashboard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Version</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={packageVersion}
                      onChange={(e) => setPackageVersion(e.target.value)}
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    if (selectedModule) {
                      packageModuleMutation.mutate({ 
                        moduleId: selectedModule, 
                        version: packageVersion 
                      });
                    }
                  }}
                  disabled={!selectedModule || packageModuleMutation.isPending}
                  className="w-full"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {packageModuleMutation.isPending ? 'Packaging...' : 'Package Module'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deployment Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Deployed Modules</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {repositoryModules?.filter(m => m.status === 'deployed').length || 0}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">Pending Approval</h4>
                    <p className="text-2xl font-bold text-yellow-900">
                      {repositoryModules?.filter(m => m.status === 'pending').length || 0}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Ready to Deploy</h4>
                    <p className="text-2xl font-bold text-green-900">
                      {repositoryModules?.filter(m => m.status === 'approved').length || 0}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export Deployment Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh All Modules
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDeploymentManager;
