
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  MemoryStick, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { moduleResourceManager, ModuleResourceUsage, ModulePerformanceMetrics } from '@/services/moduleResourceManager';
import { moduleScalingAlgorithms, ScalingDecision } from '@/services/moduleScalingAlgorithms';
import { moduleHealthMonitor, ModuleHealthStatus } from '@/services/moduleHealthMonitor';
import { tenantModuleOptimizer, OptimizationResult } from '@/services/tenantModuleOptimizer';

const ModuleScalingDashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('tenant_management');
  const [scalingDecisions, setScalingDecisions] = useState<ScalingDecision[]>([]);
  const [healthStatuses, setHealthStatuses] = useState<ModuleHealthStatus[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(false);

  // Mock data for demonstration
  const modules = [
    'tenant_management',
    'user_management',
    'forms_management',
    'analytics',
    'workflow_automation'
  ];

  useEffect(() => {
    // Initialize mock data and start monitoring
    initializeMockData();
    
    // Start health monitoring
    moduleHealthMonitor.startMonitoring(10000); // 10 second intervals

    return () => {
      moduleHealthMonitor.stopMonitoring();
    };
  }, []);

  const initializeMockData = () => {
    // Generate mock scaling decisions
    const decisions = modules.map(moduleId => 
      moduleScalingAlgorithms.makeScalingDecision(moduleId)
    );
    setScalingDecisions(decisions);

    // Generate mock health statuses
    const healthPromises = modules.map(moduleId => 
      moduleHealthMonitor.checkModuleHealth(moduleId)
    );
    
    Promise.all(healthPromises).then(statuses => {
      setHealthStatuses(statuses);
    });

    // Generate mock optimization results
    const mockOptimizations: OptimizationResult[] = [
      {
        tenantId: 'tenant-1',
        optimizations: {
          modulesPreloaded: ['analytics'],
          modulesUnloaded: ['workflow_automation'],
          strategiesApplied: ['lazy_loading', 'predictive_preloading']
        },
        performanceGain: 0.15,
        resourceSavings: 0.12
      },
      {
        tenantId: 'tenant-2',
        optimizations: {
          modulesPreloaded: ['forms_management'],
          modulesUnloaded: [],
          strategiesApplied: ['usage_based_optimization']
        },
        performanceGain: 0.08,
        resourceSavings: 0.05
      }
    ];
    setOptimizationResults(mockOptimizations);
  };

  const handleManualScaling = async (moduleId: string, action: 'up' | 'down') => {
    console.log(`Manual scaling ${action} for module: ${moduleId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh data
    const decision = moduleScalingAlgorithms.makeScalingDecision(moduleId);
    setScalingDecisions(prev => 
      prev.map(d => d.moduleId === moduleId ? decision : d)
    );
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-700" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedModuleHealth = healthStatuses.find(h => h.moduleId === selectedModule);
  const selectedModuleDecision = scalingDecisions.find(d => d.moduleId === selectedModule);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Modules</p>
                <p className="text-2xl font-bold text-green-600">
                  {healthStatuses.filter(h => h.status === 'healthy').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto Scaling</p>
                <p className="text-sm font-semibold">
                  {autoScalingEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <Button
                size="sm"
                variant={autoScalingEnabled ? 'default' : 'outline'}
                onClick={() => setAutoScalingEnabled(!autoScalingEnabled)}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scaling Actions</p>
                <p className="text-2xl font-bold">
                  {scalingDecisions.filter(d => d.action !== 'maintain').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="scaling" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scaling">Scaling Decisions</TabsTrigger>
          <TabsTrigger value="health">Health Monitoring</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          <TabsTrigger value="optimization">Tenant Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Scaling Decisions</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-driven scaling recommendations based on usage patterns and performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {scalingDecisions.map((decision) => (
                  <div key={decision.moduleId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{decision.moduleId}</h3>
                        <Badge variant={
                          decision.action === 'scale_up' ? 'default' :
                          decision.action === 'scale_down' ? 'secondary' : 'outline'
                        }>
                          {decision.action.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{(decision.confidence * 100).toFixed(0)}% confidence</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{decision.reasoning}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Performance:</span>
                          <span className="ml-1 font-medium">
                            {decision.estimatedImpact.performanceImprovement > 0 ? '+' : ''}
                            {(decision.estimatedImpact.performanceImprovement * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="ml-1 font-medium">
                            {decision.estimatedImpact.costChange > 0 ? '+' : ''}
                            {(decision.estimatedImpact.costChange * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Utilization:</span>
                          <span className="ml-1 font-medium">
                            {decision.estimatedImpact.resourceUtilization > 0 ? '+' : ''}
                            {(decision.estimatedImpact.resourceUtilization * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManualScaling(decision.moduleId, 'up')}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManualScaling(decision.moduleId, 'down')}
                      >
                        <TrendingDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Module Health Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthStatuses.map((health) => (
                    <div
                      key={health.moduleId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedModule === health.moduleId ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedModule(health.moduleId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getHealthStatusIcon(health.status)}
                          <span className="font-medium">{health.moduleId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getHealthStatusColor(health.status)}>
                            {health.status}
                          </Badge>
                          <span className="text-sm font-medium">{health.score}/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Health Information */}
            {selectedModuleHealth && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getHealthStatusIcon(selectedModuleHealth.status)}
                    {selectedModuleHealth.moduleId} Health Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Health Score</span>
                      <span className="text-sm">{selectedModuleHealth.score}/100</span>
                    </div>
                    <Progress value={selectedModuleHealth.score} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Health Checks</h4>
                    {selectedModuleHealth.checks.map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            check.status === 'pass' ? 'bg-green-500' :
                            check.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm font-medium">{check.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{check.message}</span>
                      </div>
                    ))}
                  </div>

                  {selectedModuleHealth.recoveryActions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recovery Actions</h4>
                      {selectedModuleHealth.recoveryActions.map((action, index) => (
                        <div key={index} className="p-2 border rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{action.type.replace('_', ' ')}</span>
                            <Badge variant={
                              action.priority === 'critical' ? 'destructive' :
                              action.priority === 'high' ? 'default' : 'outline'
                            }>
                              {action.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time resource monitoring and allocation strategies
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modules.slice(0, 3).map((moduleId) => {
                  const allocation = moduleResourceManager.getResourceAllocationStrategy(moduleId);
                  return (
                    <div key={moduleId} className="space-y-4">
                      <h3 className="font-semibold">{moduleId}</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">CPU Usage</span>
                            <span className="text-sm">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Memory Usage</span>
                            <span className="text-sm">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Network I/O</span>
                            <span className="text-sm">28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs font-medium mb-1">Allocation Strategy</p>
                        <Badge variant="outline">{allocation.strategy}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{allocation.reasoning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Module Optimization</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize module loading and resource allocation per tenant
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationResults.map((result) => (
                  <div key={result.tenantId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{result.tenantId}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          +{(result.performanceGain * 100).toFixed(0)}% performance
                        </Badge>
                        <Badge variant="outline">
                          -{(result.resourceSavings * 100).toFixed(0)}% resources
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Preloaded Modules</p>
                        <div className="space-y-1">
                          {result.optimizations.modulesPreloaded.map(module => (
                            <Badge key={module} variant="outline" className="mr-1">{module}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Unloaded Modules</p>
                        <div className="space-y-1">
                          {result.optimizations.modulesUnloaded.map(module => (
                            <Badge key={module} variant="secondary" className="mr-1">{module}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-1">Applied Strategies</p>
                        <div className="space-y-1">
                          {result.optimizations.strategiesApplied.map(strategy => (
                            <Badge key={strategy} variant="outline" className="mr-1 mb-1">
                              {strategy.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleScalingDashboard;
