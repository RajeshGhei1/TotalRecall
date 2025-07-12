
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, TrendingUp } from 'lucide-react';
import { useSmartFormAssistance } from '@/hooks/ai/useSmartFormAssistance';
import { SmartSuggestionsPanel } from './SmartSuggestionsPanel';
import { FormSuggestion } from '@/services/ai/smartForms/formSuggestionEngine';
import { FormValues } from '@/types/common';

interface CognitiveFormWrapperProps {
  children: React.ReactNode;
  form: UseFormReturn<FormValues>;
  formType: string;
  userId: string;
  className?: string;
  autoSuggest?: boolean;
  showSuggestionsPanel?: boolean;
}

export const CognitiveFormWrapper: React.FC<CognitiveFormWrapperProps> = ({
  children,
  form,
  formType,
  userId,
  className = '',
  autoSuggest = true,
  showSuggestionsPanel = true
}) => {
  const [userHistory] = useState<FormValues[]>([]);
  const [lastSuggestionTime, setLastSuggestionTime] = useState(0);

  const {
    suggestions,
    isLoadingSuggestions,
    generateSuggestions,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    hasSuggestions
  } = useSmartFormAssistance(formType, userId);

  const currentValues = form.watch();

  // Auto-generate suggestions when form values change
  useEffect(() => {
    if (!autoSuggest) return;

    const now = Date.now();
    const timeSinceLastSuggestion = now - lastSuggestionTime;

    // Debounce suggestions - only generate every 2 seconds
    if (timeSinceLastSuggestion < 2000) return;

    // Only generate suggestions if we have some values but form isn't complete
    const hasValues = Object.values(currentValues).some(value => value);
    const isComplete = Object.keys(currentValues).length > 5 && 
                      Object.values(currentValues).every(value => value);

    if (hasValues && !isComplete) {
      generateSuggestions(currentValues, userHistory);
      setLastSuggestionTime(now);
    }
  }, [currentValues, autoSuggest, generateSuggestions, userHistory, lastSuggestionTime]);

  const handleApplySuggestion = async (suggestion: FormSuggestion) => {
    // Apply the suggestion to the form
    form.setValue(suggestion.fieldName, suggestion.suggestedValue, {
      shouldValidate: true,
      shouldDirty: true
    });

    // Record the acceptance
    await applySuggestion(suggestion);

    // Trigger form validation
    form.trigger(suggestion.fieldName);
  };

  const handleRefreshSuggestions = () => {
    generateSuggestions(currentValues, userHistory);
  };

  const handleClearSuggestions = () => {
    clearSuggestions();
  };

  return (
    <div className={`cognitive-form-wrapper ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form Content */}
        <div className="lg:col-span-3">
          <div className="relative">
            {/* Cognitive assistance indicator */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Cognitive Assistance Active</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">AI-powered form completion</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>

        {/* Smart Suggestions Panel */}
        {showSuggestionsPanel && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <SmartSuggestionsPanel
                suggestions={suggestions}
                isLoading={isLoadingSuggestions}
                onApplySuggestion={handleApplySuggestion}
                onDismissSuggestion={dismissSuggestion}
                onRefreshSuggestions={handleRefreshSuggestions}
              />

              {/* Cognitive Insights Card */}
              {hasSuggestions && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">AI Insights</span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div>• {suggestions.length} suggestions available</div>
                      <div>• Form completion estimated at {Math.round((Object.values(currentValues).filter(v => v).length / 10) * 100)}%</div>
                      <div>• AI confidence: {suggestions.length > 0 ? Math.round(suggestions[0].confidence * 100) : 0}%</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-xs"
                      onClick={handleClearSuggestions}
                    >
                      Clear All Suggestions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
