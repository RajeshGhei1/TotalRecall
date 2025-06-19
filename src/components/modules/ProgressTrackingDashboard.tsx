
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  TestTube, 
  CheckCircle, 
  FileText, 
  Star,
  TrendingUp,
  AlertCircle,
  Target,
  Plus
} from 'lucide-react';
import { useAllModulesProgress, useUpdateModuleProgress, getProgressStatus, getNextMilestoneRequirements } from '@/hooks/useModuleProgress';
import { getDisplayName } from '@/utils/moduleNameMapping';
import ProgressUpdateDialog from './ProgressUpdateDialog';
import ModuleProgressCard from './ModuleProgressCard';

const ProgressTrackingDashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  const { data: modulesProgress = [], isLoading } = useAllModulesProgress();
  const updateProgress = useUpdateModuleProgress();

  const getOverallStats = () => {
    if (modulesProgress.length === 0) return { avg: 0, production: 0, beta: 0, alpha: 0, planning: 0 };
    
    const avgProgress = modulesProgress.reduce((sum, m) => sum + m.overall_progress, 0) / modulesProgress.length;
    
    const statusCounts = modulesProgress.reduce((acc, module) => {
      const { stage } = getProgressStatus(module.overall_progress);
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      avg: avgProgress,
      production: statusCounts.production || 0,
      beta: statusCounts.beta || 0,  
      alpha: statusCounts.alpha || 0,
      planning: statusCounts.planning || 0
    };
  };

  const stats = getOverallStats();

  const handleQuickUpdate = async (moduleId: string, metricType: 'code' | 'test' | 'feature' | 'documentation', increment: number) => {
    try {
      await updateProgress.mutateAsync({
        module_id: moduleId,
        metric_type: metricType,
        increment_value: increment,
        metadata: { source: 'quick_update', timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Development Progress Tracking</h3>
          <p className="text-muted-foreground">
            Real-time metrics based on actual development progress
          </p>
        </div>
        <Button onClick={() => setUpdateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Update Progress
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avg.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.production}</p>
                <p className="text-sm text-muted-foreground">Production</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.beta}</p>
                <p className="text-sm text-muted-foreground">Beta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.alpha}</p>
                <p className="text-sm text-muted-foreground">Alpha</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{stats.planning}</p>
                <p className="text-sm text-muted-foreground">Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {modulesProgress.map((module) => (
              <ModuleProgressCard
                key={module.module_id}
                module={module}
                onQuickUpdate={handleQuickUpdate}
                onDetailedUpdate={(moduleId) => {
                  setSelectedModule(moduleId);
                  setUpdateDialogOpen(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {modulesProgress.map((module) => (
            <Card key={module.module_id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{getDisplayName(module.module_id)}</CardTitle>
                  <Badge variant="outline">{getProgressStatus(module.overall_progress).status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Code</span>
                    </div>
                    <Progress value={module.code_completion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {module.metrics_data.files_implemented}/{module.metrics_data.total_files_planned} files
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Tests</span>
                    </div>
                    <Progress value={module.test_coverage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {module.metrics_data.tests_passing}/{module.metrics_data.total_tests_planned} passing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Features</span>
                    </div>
                    <Progress value={module.feature_completion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {module.metrics_data.features_completed}/{module.metrics_data.features_planned} complete
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Docs</span>
                    </div>
                    <Progress value={module.documentation_completion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {module.metrics_data.docs_sections_completed}/{module.metrics_data.docs_sections_planned} sections
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {modulesProgress.map((module) => {
            const requirements = getNextMilestoneRequirements(module.overall_progress, module.metrics_data);
            const { status } = getProgressStatus(module.overall_progress);
            
            return (
              <Card key={module.module_id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{getDisplayName(module.module_id)}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={module.overall_progress} className="w-24 h-2" />
                      <span className="text-sm font-medium">{module.overall_progress.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Current Status: <Badge variant="outline">{status}</Badge></h4>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Next Milestone Requirements:</h4>
                      <ul className="space-y-1">
                        {requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Progress Update Dialog */}
      <ProgressUpdateDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        selectedModule={selectedModule}
        onUpdate={async (update) => {
          await updateProgress.mutateAsync(update);
          setUpdateDialogOpen(false);
          setSelectedModule(null);
        }}
      />
    </div>
  );
};

export default ProgressTrackingDashboard;
