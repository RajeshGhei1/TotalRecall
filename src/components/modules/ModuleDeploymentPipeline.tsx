import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  GitBranch,
  TestTube,
  Rocket,
  Shield,
  Users,
  Database,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSystemModules } from '@/hooks/useSystemModules';

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  details?: string;
}

interface ModuleData {
  name: string;
  description: string;
  category: string;
  version: string;
  templateId: string;
  features: string[];
  dependencies: string[];
  configuration: Record<string, unknown>;
}

interface ModuleDeploymentPipelineProps {
  moduleData?: ModuleData;
  onDeploymentComplete?: (moduleId: string) => void;
}

const ModuleDeploymentPipeline: React.FC<ModuleDeploymentPipelineProps> = ({ 
  moduleData,
  onDeploymentComplete 
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deployedModuleId, setDeployedModuleId] = useState<string | null>(null);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: 'validation', name: 'Code Validation', status: 'pending' },
    { id: 'build', name: 'Build Module', status: 'pending' },
    { id: 'test', name: 'Run Tests', status: 'pending' },
    { id: 'security', name: 'Security Scan', status: 'pending' },
    { id: 'package', name: 'Package Module', status: 'pending' },
    { id: 'deploy', name: 'Deploy to Sandbox', status: 'pending' },
    { id: 'register', name: 'Register in System Library', status: 'pending' }
  ]);

  const { createModule } = useSystemModules(false);

  const deploymentHistory = [
    {
      id: '1',
      version: '1.0.3',
      status: 'completed',
      deployedAt: '2024-01-15T10:30:00Z',
      deployedBy: 'John Doe',
      environment: 'production'
    },
    {
      id: '2',
      version: '1.0.2',
      status: 'completed',
      deployedAt: '2024-01-12T14:22:00Z',
      deployedBy: 'Jane Smith',
      environment: 'staging'
    },
    {
      id: '3',
      version: '1.0.1',
      status: 'failed',
      deployedAt: '2024-01-10T09:15:00Z',
      deployedBy: 'John Doe',
      environment: 'production'
    }
  ];

  const handleDeploy = async () => {
    if (!moduleData) {
      toast({
        title: 'No Module Data',
        description: 'Please create a module first before deploying.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);

    try {
      // Simulate deployment steps
      for (let i = 0; i < deploymentSteps.length; i++) {
        const step = deploymentSteps[i];
        
        // Update step to running
        setDeploymentSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: 'running' } : s
        ));

        // Simulate step duration
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Handle special steps
        if (step.id === 'register') {
          try {
            // Register module in system library
            const newModule = await createModule.mutateAsync({
              name: moduleData.name,
              description: moduleData.description,
              category: moduleData.category,
              version: moduleData.version,
              is_active: false, // Start as inactive until promoted
              dependencies: moduleData.dependencies,
              default_limits: {}
            });

            setDeployedModuleId(newModule.id);
            
            setDeploymentSteps(prev => prev.map(s => 
              s.id === step.id ? { 
                ...s, 
                status: 'completed',
                duration: Math.floor(1000 + Math.random() * 2000),
                details: `Module registered with ID: ${newModule.id}`
              } : s
            ));
          } catch (error) {
            setDeploymentSteps(prev => prev.map(s => 
              s.id === step.id ? { 
                ...s, 
                status: 'failed',
                duration: Math.floor(1000 + Math.random() * 2000),
                details: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
              } : s
            ));
            throw error;
          }
        } else {
          // Regular step completion
          const success = Math.random() > 0.05; // 95% success rate
          setDeploymentSteps(prev => prev.map(s => 
            s.id === step.id ? { 
              ...s, 
              status: success ? 'completed' : 'failed',
              duration: Math.floor(1000 + Math.random() * 2000),
              details: success ? 'Step completed successfully' : 'Step failed with errors'
            } : s
          ));

          if (!success) {
            throw new Error(`Deployment failed at step: ${step.name}`);
          }
        }

        setDeploymentProgress(((i + 1) / deploymentSteps.length) * 100);
      }

      setIsDeploying(false);
      toast({
        title: 'Deployment Successful',
        description: 'Your module has been deployed and registered in the system library.',
      });

      onDeploymentComplete?.(deployedModuleId || '');

    } catch (error) {
      setIsDeploying(false);
      toast({
        title: 'Deployment Failed',
        description: error instanceof Error ? error.message : 'Unknown deployment error',
        variant: 'destructive',
      });
    }
  };

  const handlePromoteToProduction = async () => {
    if (!deployedModuleId) {
      toast({
        title: 'No Module to Promote',
        description: 'Please deploy a module first before promoting to production.',
        variant: 'destructive',
      });
      return;
    }

    setIsPromoting(true);

    try {
      // Update module to active status
      await createModule.mutateAsync({
        name: moduleData!.name,
        is_active: true
      });

      toast({
        title: 'Module Promoted',
        description: 'Your module is now active and available for subscription assignment.',
      });
    } catch (error) {
      toast({
        title: 'Promotion Failed',
        description: 'Failed to promote module to production.',
        variant: 'destructive',
      });
    } finally {
      setIsPromoting(false);
    }
  };

  const resetDeployment = () => {
    setDeploymentSteps(prev => prev.map(step => ({ 
      ...step, 
      status: 'pending',
      duration: undefined,
      details: undefined
    })));
    setDeploymentProgress(0);
    setDeployedModuleId(null);
  };

  const getStatusIcon = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="deploy" className="w-full">
        <TabsList>
          <TabsTrigger value="deploy">Deploy Module</TabsTrigger>
          <TabsTrigger value="promote">Promote to Production</TabsTrigger>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Module Deployment Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Deployment Controls */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {moduleData ? `Deploy: ${moduleData.name}` : 'Ready to Deploy'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {moduleData 
                        ? `Deploy ${moduleData.name} v${moduleData.version} to the system`
                        : 'Create a module first to enable deployment'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetDeployment}
                      disabled={isDeploying}
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={handleDeploy}
                      disabled={isDeploying || !moduleData}
                    >
                      {isDeploying ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Deploy Module
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {isDeploying && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Deployment Progress</span>
                      <span className="text-sm text-muted-foreground">{Math.round(deploymentProgress)}%</span>
                    </div>
                    <Progress value={deploymentProgress} className="h-2" />
                  </div>
                )}

                {/* Deployment Steps */}
                <div className="space-y-3">
                  {deploymentSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div>{getStatusIcon(step.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{step.name}</span>
                          <Badge variant="outline" className={getStatusColor(step.status)}>
                            {step.status}
                          </Badge>
                          {step.id === 'register' && (
                            <Database className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        {step.details && (
                          <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                        )}
                      </div>
                      {step.duration && (
                        <span className="text-sm text-muted-foreground">
                          {(step.duration / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promote" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Promote to Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Production Promotion</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This will make your module available for subscription assignment and tenant access.
                  </p>
                </div>

                {deployedModuleId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Module deployed and ready for promotion</span>
                    </div>
                    <Button 
                      onClick={handlePromoteToProduction}
                      disabled={isPromoting}
                      className="w-full"
                    >
                      {isPromoting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Promoting...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Promote to Production
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No Module Ready for Promotion</p>
                    <p className="text-sm">Deploy a module first to enable promotion</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Deployment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deploymentHistory.map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">v{deployment.version}</Badge>
                      <div>
                        <p className="font-medium">Deployment to {deployment.environment}</p>
                        <p className="text-sm text-muted-foreground">
                          by {deployment.deployedBy} • {new Date(deployment.deployedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(deployment.status)}>
                      {deployment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-blue-500" />
                  Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Local development environment</p>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Staging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pre-production testing</p>
                  <Badge variant="outline">v1.0.2</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Live environment</p>
                  <Badge variant="default">v1.0.3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleDeploymentPipeline;
