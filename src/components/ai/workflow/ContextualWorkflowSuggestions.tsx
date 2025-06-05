
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { workflowOptimizerService, automationEngineService } from '@/services/ai/workflow';
import { Lightbulb, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowSuggestion {
  id: string;
  type: 'optimization' | 'automation' | 'template' | 'health_check';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
}

interface ContextualWorkflowSuggestionsProps {
  context: {
    module?: string;
    formType?: string;
    userId?: string;
    tenantId?: string;
  };
  onSuggestionApplied?: (suggestionId: string) => void;
}

const ContextualWorkflowSuggestions: React.FC<ContextualWorkflowSuggestionsProps> = ({
  context,
  onSuggestionApplied
}) => {
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    generateSuggestions();
  }, [context]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const contextualSuggestions = await generateContextualSuggestions(context);
      setSuggestions(contextualSuggestions);
    } catch (error) {
      console.error('Error generating workflow suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualSuggestions = async (ctx: typeof context): Promise<WorkflowSuggestion[]> => {
    const suggestions: WorkflowSuggestion[] = [];

    // Form-specific suggestions
    if (ctx.formType === 'talent_form') {
      suggestions.push({
        id: 'talent_onboarding_automation',
        type: 'automation',
        title: 'Automate Talent Onboarding',
        description: 'Create an automated workflow for new talent submissions including background checks, document collection, and welcome emails.',
        impact: 'high',
        confidence: 0.9,
        actionable: true
      });
    }

    if (ctx.formType === 'company_creation') {
      suggestions.push({
        id: 'company_verification_workflow',
        type: 'template',
        title: 'Company Verification Workflow',
        description: 'Set up automated company verification including business registration checks and compliance validation.',
        impact: 'high',
        confidence: 0.85,
        actionable: true
      });
    }

    // Module-specific suggestions
    if (ctx.module === 'forms') {
      suggestions.push({
        id: 'form_analytics_integration',
        type: 'optimization',
        title: 'Integrate Form Analytics',
        description: 'Connect form submission data to workflow triggers for better automation accuracy.',
        impact: 'medium',
        confidence: 0.8,
        actionable: true
      });
    }

    if (ctx.module === 'ats') {
      suggestions.push({
        id: 'candidate_scoring_automation',
        type: 'automation',
        title: 'Automated Candidate Scoring',
        description: 'Set up AI-powered candidate evaluation workflows based on job requirements and past hiring success.',
        impact: 'high',
        confidence: 0.88,
        actionable: true
      });
    }

    // General optimization suggestions
    suggestions.push({
      id: 'workflow_health_monitoring',
      type: 'health_check',
      title: 'Enable Workflow Health Monitoring',
      description: 'Set up automated monitoring for workflow performance and bottleneck detection.',
      impact: 'medium',
      confidence: 0.75,
      actionable: true
    });

    return suggestions;
  };

  const applySuggestion = async (suggestion: WorkflowSuggestion) => {
    try {
      // Simulate applying the suggestion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
      onSuggestionApplied?.(suggestion.id);
      
      toast({
        title: 'Suggestion Applied',
        description: `Successfully applied: ${suggestion.title}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply suggestion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'automation': return Zap;
      case 'template': return Lightbulb;
      case 'health_check': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Workflow Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Workflow Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No new suggestions available. Your workflows are optimized!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Workflow Suggestions
        </CardTitle>
        <CardDescription>
          Contextual recommendations to improve your workflow automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => {
          const IconComponent = getSuggestionIcon(suggestion.type);
          const isApplied = appliedSuggestions.has(suggestion.id);
          
          return (
            <Alert key={suggestion.id} className={isApplied ? 'bg-green-50 border-green-200' : ''}>
              <IconComponent className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact} impact
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
                <AlertDescription className="mb-3">
                  {suggestion.description}
                </AlertDescription>
                {suggestion.actionable && !isApplied && (
                  <Button 
                    onClick={() => applySuggestion(suggestion)}
                    size="sm"
                    className="w-full"
                  >
                    Apply Suggestion
                  </Button>
                )}
                {isApplied && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Applied</span>
                  </div>
                )}
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ContextualWorkflowSuggestions;
