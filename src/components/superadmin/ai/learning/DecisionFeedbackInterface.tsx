
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { ThumbsUp, ThumbsDown, MessageSquare, Target, AlertCircle } from 'lucide-react';

interface DecisionFeedbackData {
  decisionId: string;
  decisionText: string;
  confidence: number;
  timestamp: string;
  context: any;
}

export const DecisionFeedbackInterface = () => {
  const { provideFeedback, recordOutcome } = useUnifiedAIOrchestration();
  const [selectedDecision, setSelectedDecision] = useState<DecisionFeedbackData | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [outcomeType, setOutcomeType] = useState<'success' | 'failure' | 'partial_success'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock recent decisions for demonstration
  const recentDecisions: DecisionFeedbackData[] = [
    {
      decisionId: 'dec_001',
      decisionText: 'Recommended hiring candidate based on skill match',
      confidence: 0.85,
      timestamp: '2024-01-15T10:30:00Z',
      context: { module: 'recruitment', action: 'candidate_evaluation' }
    },
    {
      decisionId: 'dec_002',
      decisionText: 'Suggested workflow optimization for form processing',
      confidence: 0.72,
      timestamp: '2024-01-15T09:15:00Z',
      context: { module: 'workflow', action: 'optimization' }
    },
    {
      decisionId: 'dec_003',
      decisionText: 'Recommended price adjustment for subscription plan',
      confidence: 0.91,
      timestamp: '2024-01-15T08:45:00Z',
      context: { module: 'pricing', action: 'plan_optimization' }
    }
  ];

  const handleProvideFeedback = async (feedback: 'positive' | 'negative') => {
    if (!selectedDecision) return;

    setIsSubmitting(true);
    try {
      await provideFeedback({
        decisionId: selectedDecision.decisionId,
        feedback,
        details: {
          user_feedback: feedbackText,
          manual_review: true,
          context: selectedDecision.context
        }
      });
      
      setFeedbackText('');
      setSelectedDecision(null);
    } catch (error) {
      console.error('Error providing feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordOutcome = async () => {
    if (!selectedDecision) return;

    setIsSubmitting(true);
    try {
      await recordOutcome({
        decisionId: selectedDecision.decisionId,
        outcome: outcomeType,
        outcomeData: {
          user_assessment: feedbackText,
          outcome_type: outcomeType,
          manual_evaluation: true
        }
      });
      
      setFeedbackText('');
      setSelectedDecision(null);
    } catch (error) {
      console.error('Error recording outcome:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Recent AI Decisions
          </CardTitle>
          <CardDescription>
            Provide feedback on recent AI decisions to improve learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDecisions.map((decision) => (
              <div 
                key={decision.decisionId}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDecision?.decisionId === decision.decisionId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDecision(decision)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{decision.decisionText}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {decision.context.module}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(decision.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(decision.confidence)}`} />
                    <span className="text-xs font-medium">
                      {(decision.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDecision && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2" />
                Provide Feedback
              </CardTitle>
              <CardDescription>
                Rate the quality of this AI decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Selected Decision:</p>
                <p className="text-sm text-gray-700 mt-1">{selectedDecision.decisionText}</p>
              </div>

              <Textarea
                placeholder="Provide detailed feedback about this decision..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleProvideFeedback('positive')}
                  disabled={isSubmitting}
                  className="flex-1"
                  variant="outline"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Positive
                </Button>
                <Button 
                  onClick={() => handleProvideFeedback('negative')}
                  disabled={isSubmitting}
                  className="flex-1"
                  variant="outline"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Negative
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Recording */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Record Outcome
              </CardTitle>
              <CardDescription>
                Document the actual result of this decision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={outcomeType}
                onValueChange={(value: 'success' | 'failure' | 'partial_success') => setOutcomeType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="partial_success">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                      Partial Success
                    </div>
                  </SelectItem>
                  <SelectItem value="failure">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      Failure
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Describe the actual outcome and any lessons learned..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={handleRecordOutcome}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Recording...' : 'Record Outcome'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
