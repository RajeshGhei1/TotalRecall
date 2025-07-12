
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { WorkflowStep } from '@/types/form-builder';

interface AIWorkflowOptimizerProps {
  workflowId: string;
  workflowSteps: WorkflowStep[];
  onOptimizationApplied: (optimizedSteps: WorkflowStep[]) => void;
}

const AIWorkflowOptimizer: React.FC<AIWorkflowOptimizerProps> = ({
  workflowId,
  workflowSteps,
  onOptimizationApplied
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<unknown[]>([]);

  const analyzeWorkflow = async () => {
    setIsAnalyzing(true);
    
    // Mock AI analysis - replace with actual AI service
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: '1',
          type: 'optimization',
          title: 'Combine Sequential Email Steps',
          description: 'Two consecutive email notifications can be combined into a single step',
          impact: 'high',
          effort: 'low',
          estimatedSavings: '25% faster execution'
        },
        {
          id: '2',
          type: 'efficiency',
          title: 'Add Conditional Logic',
          description: 'Use conditions to skip unnecessary steps based on form data',
          impact: 'medium',
          effort: 'medium',
          estimatedSavings: '30% fewer API calls'
        },
        {
          id: '3',
          type: 'reliability',
          title: 'Add Error Handling',
          description: 'Include retry logic for webhook calls',
          impact: 'high',
          effort: 'low',
          estimatedSavings: '90% fewer failures'
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const applySuggestion = (suggestionId: string) => {
    // Mock optimization application
    const optimizedSteps = [...workflowSteps];
    onOptimizationApplied(optimizedSteps);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'efficiency': return Zap;
      case 'reliability': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Workflow Optimizer
          </CardTitle>
          <CardDescription>
            Get intelligent suggestions to improve workflow performance and reliability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {workflowSteps.length} steps in current workflow
            </div>
            <Button 
              onClick={analyzeWorkflow}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Workflow'}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-sm text-muted-foreground">
                AI is analyzing your workflow for optimization opportunities...
              </span>
            </div>
          )}

          {suggestions.length > 0 && !isAnalyzing && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Optimization Suggestions</h3>
              {suggestions.map((suggestion) => {
                const IconComponent = getImpactIcon(suggestion.type);
                return (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getImpactColor(suggestion.impact)}`}
                            >
                              {suggestion.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Effort: {suggestion.effort}</span>
                            <span>Savings: {suggestion.estimatedSavings}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => applySuggestion(suggestion.id)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {suggestions.length === 0 && !isAnalyzing && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Analyze Workflow" to get AI-powered optimization suggestions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIWorkflowOptimizer;
