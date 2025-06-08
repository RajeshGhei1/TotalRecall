
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';

export const DecisionFeedbackInterface: React.FC = () => {
  const { provideFeedback, recordOutcome } = useUnifiedAIOrchestration();
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = async () => {
    await provideFeedback({ feedback, type: 'manual' });
    await recordOutcome({ outcome: 'feedback_provided' });
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provide AI Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Provide feedback on AI decisions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button onClick={handleSubmitFeedback} disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
