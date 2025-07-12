
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSuggestionEngine } from '@/services/ai/smartForms/formSuggestionEngine';
import { ContextualWorkflowSuggestions } from '@/components/ai/workflow/ContextualWorkflowSuggestions';
import { Lightbulb, Zap, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartFormSuggestionsProps {
  formType: string;
  currentValues: FormValues;
  userId: string;
  tenantId?: string;
  onSuggestionApplied?: (suggestion: Record<string, unknown>) => void;
}

const SmartFormSuggestions: React.FC<SmartFormSuggestionsProps> = ({
  formType,
  currentValues,
  userId,
  tenantId,
  onSuggestionApplied
}) => {
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (Object.keys(currentValues).length > 0) {
      generateSuggestions();
    }
  }, [currentValues, formType]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const formSuggestions = await FormSuggestionEngine.generateSuggestions({
        formType,
        currentValues,
        userHistory: [],
        userId,
        tenantId
      });
      setSuggestions(formSuggestions);
    } catch (error) {
      console.error('Error generating form suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: Record<string, unknown>) => {
    onSuggestionApplied?.(suggestion);
    toast({
      title: 'Suggestion Applied',
      description: `Applied suggestion for ${suggestion.fieldName}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Form Field Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Smart Form Suggestions
            </CardTitle>
            <CardDescription>
              AI-powered field suggestions based on your input
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{suggestion.fieldName}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.reasoning}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Suggested: {suggestion.suggestedValue}
                    </p>
                  </div>
                  <Button 
                    onClick={() => applySuggestion(suggestion)}
                    size="sm"
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Workflow Suggestions */}
      <ContextualWorkflowSuggestions
        module="forms"
        formType={formType}
        userId={userId}
        tenantId={tenantId}
      />
    </div>
  );
};

export default SmartFormSuggestions;
