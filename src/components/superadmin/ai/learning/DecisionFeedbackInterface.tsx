
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { ThumbsUp, ThumbsDown, MessageSquare, Target, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [activeTab, setActiveTab] = useState<'feedback' | 'outcome'>('feedback');

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

  const getOutcomeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-3 w-3" />;
      case 'partial_success': return <AlertCircle className="h-3 w-3" />;
      case 'failure': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Recent Decisions - Enhanced Mobile Layout */}
      <Card>
        <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 md:px-6 md:pt-6">
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="truncate">Recent AI Decisions</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Provide feedback on recent AI decisions to improve learning
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
          <ScrollArea className="h-64 sm:h-72 md:h-80">
            <div className="space-y-3">
              {recentDecisions.map((decision) => (
                <div 
                  key={decision.decisionId}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedDecision?.decisionId === decision.decisionId 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedDecision(decision)}
                >
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <p className="text-sm font-medium break-words leading-relaxed">{decision.decisionText}</p>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(decision.confidence)}`} />
                        <span className="text-xs font-medium">
                          {(decision.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {decision.context.module}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(decision.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Enhanced Feedback Interface */}
      {selectedDecision && (
        <div className="space-y-4 md:space-y-6">
          {/* Selected Decision Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="px-3 sm:px-4 py-3 sm:py-4 md:px-6 md:py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected Decision:</h4>
                <p className="text-sm text-gray-700 break-words leading-relaxed">{selectedDecision.decisionText}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedDecision.context.module}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Confidence: {(selectedDecision.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Tab Selection */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={activeTab === 'feedback' ? 'default' : 'outline'}
              onClick={() => setActiveTab('feedback')}
              className="flex-1 sm:flex-none"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Provide Feedback
            </Button>
            <Button
              variant={activeTab === 'outcome' ? 'default' : 'outline'}
              onClick={() => setActiveTab('outcome')}
              className="flex-1 sm:flex-none"
            >
              <Target className="h-4 w-4 mr-2" />
              Record Outcome
            </Button>
          </div>

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <Card>
              <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 md:px-6 md:pt-6">
                <CardTitle className="flex items-center text-lg">
                  <ThumbsUp className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Rate Decision Quality</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Help improve AI learning by rating this decision
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6 space-y-4">
                <Textarea
                  placeholder="Provide detailed feedback about this decision (optional)..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] resize-none text-sm"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleProvideFeedback('positive')}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Good Decision'}
                  </Button>
                  <Button 
                    onClick={() => handleProvideFeedback('negative')}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Poor Decision'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Outcome Tab */}
          {activeTab === 'outcome' && (
            <Card>
              <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 md:px-6 md:pt-6">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Document Actual Result</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Record what actually happened after this decision was made
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outcome Type</label>
                  <Select
                    value={outcomeType}
                    onValueChange={(value: 'success' | 'failure' | 'partial_success') => setOutcomeType(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select outcome type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Complete Success
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
                          Failed Outcome
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Describe the actual outcome and any lessons learned..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] resize-none text-sm"
                />

                <Button 
                  onClick={handleRecordOutcome}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {getOutcomeIcon(outcomeType)}
                  <span className="ml-2">
                    {isSubmitting ? 'Recording...' : 'Record Outcome'}
                  </span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-gray-50">
            <CardContent className="px-3 sm:px-4 py-3 sm:py-4 md:px-6 md:py-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600">
                  Need to review another decision?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDecision(null);
                    setFeedbackText('');
                    setActiveTab('feedback');
                  }}
                  className="w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
