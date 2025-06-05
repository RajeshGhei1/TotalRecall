
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Check, X, Loader2, Sparkles } from 'lucide-react';
import { FormSuggestion } from '@/services/ai/smartForms/formSuggestionEngine';

interface SmartSuggestionsPanelProps {
  suggestions: FormSuggestion[];
  isLoading: boolean;
  onApplySuggestion: (suggestion: FormSuggestion) => void;
  onDismissSuggestion: (suggestion: FormSuggestion) => void;
  onRefreshSuggestions?: () => void;
}

export const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({
  suggestions,
  isLoading,
  onApplySuggestion,
  onDismissSuggestion,
  onRefreshSuggestions
}) => {
  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai':
        return <Sparkles className="h-3 w-3" />;
      case 'pattern':
        return <Lightbulb className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      case 'pattern':
        return 'bg-blue-100 text-blue-800';
      case 'context':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <CardTitle className="text-sm">Smart Suggestions</CardTitle>
          </div>
          {onRefreshSuggestions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshSuggestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          )}
        </div>
        <CardDescription className="text-xs">
          AI-powered suggestions to help you complete the form faster
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Generating suggestions...</span>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 space-y-2 bg-gradient-to-r from-blue-50 to-purple-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getSourceColor(suggestion.source)}`}
                    >
                      {getSourceIcon(suggestion.source)}
                      <span className="ml-1 capitalize">{suggestion.source}</span>
                    </Badge>
                    <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {suggestion.fieldName}: <span className="text-blue-600">{suggestion.suggestedValue}</span>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {suggestion.reasoning}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 px-2 text-xs"
                  onClick={() => onApplySuggestion(suggestion)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => onDismissSuggestion(suggestion)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
