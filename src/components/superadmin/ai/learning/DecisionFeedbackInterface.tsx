
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { ThumbsUp, ThumbsDown, Send, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DecisionFeedbackInterface: React.FC = () => {
  const { provideFeedback, recordOutcome } = useUnifiedAIOrchestration();
  const [feedbackForm, setFeedbackForm] = useState({
    decisionId: '',
    feedback: '' as 'positive' | 'negative',
    details: '',
    category: ''
  });

  const [outcomeForm, setOutcomeForm] = useState({
    decisionId: '',
    outcome: '' as 'success' | 'failure' | 'partial_success',
    description: ''
  });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackForm.decisionId || !feedbackForm.feedback) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await provideFeedback({
        decisionId: feedbackForm.decisionId,
        feedback: feedbackForm.feedback,
        details: {
          description: feedbackForm.details,
          category: feedbackForm.category,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: 'Feedback Recorded',
        description: 'Thank you for your feedback. It will help improve AI performance.',
      });

      setFeedbackForm({
        decisionId: '',
        feedback: '' as 'positive' | 'negative',
        details: '',
        category: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record feedback. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!outcomeForm.decisionId || !outcomeForm.outcome) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await recordOutcome({
        decisionId: outcomeForm.decisionId,
        outcome: outcomeForm.outcome,
        outcomeData: {
          description: outcomeForm.description,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: 'Outcome Recorded',
        description: 'Decision outcome has been logged for learning purposes.',
      });

      setOutcomeForm({
        decisionId: '',
        outcome: '' as 'success' | 'failure' | 'partial_success',
        description: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record outcome. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Decision Feedback</h2>
        <p className="text-gray-600">
          Help improve AI performance by providing feedback on decisions and outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Provide Feedback
            </CardTitle>
            <CardDescription>
              Rate and comment on AI decisions to improve future performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-decision-id">Decision ID</Label>
                <Input
                  id="feedback-decision-id"
                  value={feedbackForm.decisionId}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, decisionId: e.target.value }))}
                  placeholder="Enter decision ID..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Feedback Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={feedbackForm.feedback === 'positive' ? 'default' : 'outline'}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, feedback: 'positive' }))}
                    className="flex-1"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Positive
                  </Button>
                  <Button
                    type="button"
                    variant={feedbackForm.feedback === 'negative' ? 'destructive' : 'outline'}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, feedback: 'negative' }))}
                    className="flex-1"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Negative
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-category">Category</Label>
                <Select 
                  value={feedbackForm.category} 
                  onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="helpfulness">Helpfulness</SelectItem>
                    <SelectItem value="speed">Response Speed</SelectItem>
                    <SelectItem value="clarity">Clarity</SelectItem>
                    <SelectItem value="completeness">Completeness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-details">Details</Label>
                <Textarea
                  id="feedback-details"
                  value={feedbackForm.details}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Provide specific details about your feedback..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Outcome Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Record Outcome
            </CardTitle>
            <CardDescription>
              Log the actual outcome of AI decisions for learning purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOutcomeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outcome-decision-id">Decision ID</Label>
                <Input
                  id="outcome-decision-id"
                  value={outcomeForm.decisionId}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, decisionId: e.target.value }))}
                  placeholder="Enter decision ID..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome-type">Outcome</Label>
                <Select 
                  value={outcomeForm.outcome} 
                  onValueChange={(value: 'success' | 'failure' | 'partial_success') => 
                    setOutcomeForm(prev => ({ ...prev, outcome: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="partial_success">Partial Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome-description">Description</Label>
                <Textarea
                  id="outcome-description"
                  value={outcomeForm.description}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what actually happened..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Record Outcome
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
