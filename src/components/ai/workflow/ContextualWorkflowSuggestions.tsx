
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, CheckCircle } from 'lucide-react';

interface ContextualWorkflowSuggestionsProps {
  context: {
    module: string;
    formType?: string;
    userId: string;
    tenantId?: string;
  };
  onSuggestionApplied: (suggestionId: string) => void;
}

const ContextualWorkflowSuggestions: React.FC<ContextualWorkflowSuggestionsProps> = ({
  context,
  onSuggestionApplied
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (context.module === 'forms') {
      generateWorkflowSuggestions();
    }
  }, [context]);

  const generateWorkflowSuggestions = () => {
    setIsLoading(true);
    
    // Mock workflow suggestions
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: '1',
          title: 'Auto-notification Setup',
          description: 'Set up automatic email notifications when forms are submitted',
          type: 'notification',
          confidence: 0.9
        },
        {
          id: '2',
          title: 'Response Processing',
          description: 'Add automated processing rules for form responses',
          type: 'processing',
          confidence: 0.8
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Workflow Suggestions
        </CardTitle>
        <CardDescription>
          AI-recommended workflow automations for your forms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSuggestionApplied(suggestion.id)}
                  className="ml-2"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Apply
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ContextualWorkflowSuggestions;
