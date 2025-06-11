
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiDecisionEngine, AIDecision } from '@/services/ai/core/aiDecisionEngine';
import { Brain, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

export const RealTimeDecisionMonitor: React.FC = () => {
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<AIDecision | null>(null);

  useEffect(() => {
    // Initial load
    const initialDecisions = aiDecisionEngine.getDecisionHistory();
    setDecisions(initialDecisions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedDecisions = aiDecisionEngine.getDecisionHistory();
      setDecisions(updatedDecisions);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDecisionIcon = (decision: AIDecision) => {
    if (decision.requires_human_review) return AlertTriangle;
    if (decision.confidence >= 0.8) return CheckCircle;
    return Brain;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Real-Time AI Decisions
          </CardTitle>
          <CardDescription>
            Monitor AI decision making in real-time across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {decisions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No AI decisions recorded yet</p>
                </div>
              ) : (
                decisions.map((decision) => {
                  const DecisionIcon = getDecisionIcon(decision);
                  return (
                    <div
                      key={decision.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDecision?.id === decision.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDecision(decision)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <DecisionIcon className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            Decision #{decision.id.split('_')[1]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getConfidenceColor(decision.confidence)}`}>
                            {(decision.confidence * 100).toFixed(1)}%
                          </span>
                          <Badge variant={decision.requires_human_review ? 'destructive' : 'default'} className="text-xs">
                            {decision.requires_human_review ? 'Review' : 'Auto'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {decision.recommended_action}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(decision.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Decision Details
          </CardTitle>
          <CardDescription>
            Detailed analysis of selected AI decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDecision ? (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Decision Summary</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(selectedDecision.decision, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Reasoning</h4>
                  <ul className="space-y-1">
                    {selectedDecision.reasoning.map((reason, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Alternative Options</h4>
                  <div className="space-y-2">
                    {selectedDecision.alternative_options.map((option, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <span className="font-medium">{option.option}</span>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">Risk: {option.risk}</Badge>
                          <Badge variant="outline" className="text-xs">Impact: {option.impact}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDecision.requires_human_review && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Approve Decision
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Request Revision
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a decision to view details</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
