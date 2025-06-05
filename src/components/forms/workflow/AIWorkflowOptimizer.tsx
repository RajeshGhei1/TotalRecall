
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { workflowOptimizerService, bottleneckDetectorService, WorkflowOptimization, WorkflowBottleneck } from '@/services/ai/workflow';
import { Brain, TrendingUp, AlertTriangle, Zap, BarChart3, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIWorkflowOptimizerProps {
  workflowId: string;
  workflowSteps: any[];
  onOptimizationApplied: (optimizedSteps: any[]) => void;
}

export const AIWorkflowOptimizer: React.FC<AIWorkflowOptimizerProps> = ({
  workflowId,
  workflowSteps,
  onOptimizationApplied
}) => {
  const [optimizations, setOptimizations] = useState<WorkflowOptimization[]>([]);
  const [bottlenecks, setBottlenecks] = useState<WorkflowBottleneck[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedOptimizations, setSelectedOptimizations] = useState<Set<string>>(new Set());
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (workflowId) {
      analyzeWorkflow();
    }
  }, [workflowId]);

  const analyzeWorkflow = async () => {
    setIsAnalyzing(true);
    try {
      // Analyze workflow performance
      const metrics = await workflowOptimizerService.analyzeWorkflowPerformance(workflowId);
      setPerformanceMetrics(metrics);

      // Generate optimizations
      const optimizationSuggestions = await workflowOptimizerService.generateOptimizations(workflowId, metrics);
      setOptimizations(optimizationSuggestions);

      // Detect bottlenecks (mock execution data for demo)
      const mockExecutionData = generateMockExecutionData();
      const bottleneckAnalysis = await bottleneckDetectorService.detectBottlenecks(workflowId, mockExecutionData);
      setBottlenecks(bottleneckAnalysis.bottlenecks);

      toast({
        title: 'Analysis Complete',
        description: `Found ${optimizationSuggestions.length} optimization opportunities and ${bottleneckAnalysis.bottlenecks.length} bottlenecks`,
      });
    } catch (error) {
      console.error('Workflow analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze workflow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockExecutionData = () => {
    // Generate mock execution data for demo purposes
    return Array.from({ length: 20 }, (_, i) => ({
      id: `execution_${i}`,
      status: Math.random() > 0.1 ? 'completed' : 'abandoned',
      steps: workflowSteps.map((step, index) => ({
        id: step.id || `step_${index}`,
        executionTime: Math.random() * 120000 + 10000, // 10s to 2min
        status: Math.random() > 0.05 ? 'completed' : 'error',
        hasError: Math.random() < 0.05
      }))
    }));
  };

  const toggleOptimizationSelection = (optimizationId: string) => {
    const newSelection = new Set(selectedOptimizations);
    if (newSelection.has(optimizationId)) {
      newSelection.delete(optimizationId);
    } else {
      newSelection.add(optimizationId);
    }
    setSelectedOptimizations(newSelection);
  };

  const applyOptimizations = async () => {
    if (selectedOptimizations.size === 0) {
      toast({
        title: 'No Optimizations Selected',
        description: 'Please select at least one optimization to apply.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const selectedOptimizationObjects = optimizations.filter(opt => 
        selectedOptimizations.has(opt.id)
      );

      const optimizedSteps = await workflowOptimizerService.optimizeWorkflowSteps(
        workflowSteps,
        selectedOptimizationObjects
      );

      onOptimizationApplied(optimizedSteps);

      toast({
        title: 'Optimizations Applied',
        description: `Successfully applied ${selectedOptimizations.size} optimizations to the workflow.`,
      });

      setSelectedOptimizations(new Set());
    } catch (error) {
      console.error('Failed to apply optimizations:', error);
      toast({
        title: 'Optimization Failed',
        description: 'Unable to apply optimizations. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'time_reduction': return TrendingUp;
      case 'error_prevention': return AlertTriangle;
      case 'step_elimination': return Target;
      case 'parallel_execution': return Zap;
      default: return Brain;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getEfficiencyScore = () => {
    if (!performanceMetrics) return 0;
    
    const timeScore = Math.max(0, 100 - (performanceMetrics.averageExecutionTime / 300) * 100);
    const errorScore = Math.max(0, 100 - (performanceMetrics.errorRate * 1000));
    const satisfactionScore = performanceMetrics.userSatisfactionScore * 100;
    const completionScore = performanceMetrics.completionRate * 100;
    
    return Math.round((timeScore + errorScore + satisfactionScore + completionScore) / 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Workflow Optimizer</h3>
        </div>
        <Button
          onClick={analyzeWorkflow}
          disabled={isAnalyzing}
          variant="outline"
        >
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze Workflow'}
        </Button>
      </div>

      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(performanceMetrics.averageExecutionTime / 1000)}s
                </div>
                <div className="text-sm text-muted-foreground">Avg Execution Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(performanceMetrics.errorRate * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(performanceMetrics.userSatisfactionScore * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getEfficiencyScore()}%
                </div>
                <div className="text-sm text-muted-foreground">Efficiency Score</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Efficiency</span>
                <span className="text-sm text-muted-foreground">{getEfficiencyScore()}%</span>
              </div>
              <Progress value={getEfficiencyScore()} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="optimizations" className="w-full">
        <TabsList>
          <TabsTrigger value="optimizations">
            Optimizations ({optimizations.length})
          </TabsTrigger>
          <TabsTrigger value="bottlenecks">
            Bottlenecks ({bottlenecks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimizations" className="space-y-4">
          {optimizations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Optimizations Found</h3>
                <p className="text-muted-foreground">
                  {isAnalyzing ? 'Analyzing workflow...' : 'Your workflow is already well optimized!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Select optimizations to apply to your workflow
                </p>
                <Button
                  onClick={applyOptimizations}
                  disabled={selectedOptimizations.size === 0}
                >
                  Apply Selected ({selectedOptimizations.size})
                </Button>
              </div>
              
              <div className="space-y-3">
                {optimizations.map((optimization) => {
                  const Icon = getOptimizationIcon(optimization.optimizationType);
                  const isSelected = selectedOptimizations.has(optimization.id);
                  
                  return (
                    <Card 
                      key={optimization.id}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleOptimizationSelection(optimization.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="h-5 w-5 mt-0.5 text-blue-600" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{optimization.description}</h4>
                                <Badge variant="outline">
                                  {optimization.optimizationType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span>Impact: {Math.round(optimization.estimatedImpact * 100)}%</span>
                                <span>Confidence: {Math.round(optimization.confidence * 100)}%</span>
                                <Badge variant="outline" className="text-xs">
                                  {optimization.implementationComplexity}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                {optimization.suggestedChanges.map((change, index) => (
                                  <div key={index} className="text-xs text-muted-foreground">
                                    • {change.reasoning}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">
                                +{Math.round(optimization.estimatedImpact * 100)}%
                              </div>
                              <div className="text-xs text-muted-foreground">improvement</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-4">
          {bottlenecks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Bottlenecks Detected</h3>
                <p className="text-muted-foreground">
                  Your workflow is running smoothly without any significant bottlenecks.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bottlenecks.map((bottleneck) => (
                <Card key={bottleneck.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{bottleneck.stepName}</h4>
                          <Badge variant={getSeverityColor(bottleneck.severity)}>
                            {bottleneck.severity}
                          </Badge>
                          <Badge variant="outline">
                            {bottleneck.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {bottleneck.description}
                        </p>
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium text-gray-700">Suggested Solutions:</h5>
                          {bottleneck.suggestedSolutions.map((solution, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {solution}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {Math.round(bottleneck.impact * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">impact</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
