import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, X, Plus, Sparkles } from 'lucide-react';
import { FormDefinition } from '@/types/form-builder';
import { useSmartFormAssistance } from '@/hooks/ai/useSmartFormAssistance';
import { useAuth } from '@/contexts/AuthContext';

interface SmartSuggestionsPanelProps {
  form: FormDefinition;
  onAddField: (suggestion: Record<string, unknown>) => void;
  onClose: () => void;
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({
  form,
  onAddField,
  onClose
}) => {
  const { user } = useAuth();
  const [formContext, setFormContext] = useState<FormContext>({});

  // Derive form type from name, description, or default to 'general'
  const getFormType = (form: FormDefinition): string => {
    const name = form.name?.toLowerCase() || '';
    const description = form.description?.toLowerCase() || '';
    
    if (name.includes('job') || name.includes('application') || description.includes('job')) {
      return 'job_application';
    } else if (name.includes('contact') || description.includes('contact')) {
      return 'contact_form';
    } else if (name.includes('survey') || description.includes('survey')) {
      return 'survey';
    } else if (name.includes('registration') || description.includes('registration')) {
      return 'registration';
    }
    
    return 'general';
  };

  const formType = getFormType(form);

  const {
    suggestions,
    generateSuggestions,
    applySuggestion,
    dismissSuggestion,
    isLoadingSuggestions,
    hasSuggestions
  } = useSmartFormAssistance(formType, user?.id || '');

  useEffect(() => {
    // Generate initial suggestions based on form type and existing fields
    const context = {
      formType: formType,
      formName: form.name,
      description: form.description
    };
    
    setFormContext(context);
    generateSuggestions(context, []);
  }, [form, generateSuggestions, formType]);

  const handleApplySuggestion = async (suggestion: Record<string, unknown>) => {
    try {
      await applySuggestion(suggestion);
      
      // Convert suggestion to field format
      const fieldData = {
        name: suggestion.fieldName,
        label: suggestion.fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        fieldType: suggestion.suggestedValue.includes('@') ? 'email' : 'text',
        required: false,
        placeholder: `Enter ${suggestion.fieldName.replace(/_/g, ' ')}`
      };
      
      onAddField(fieldData);
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  };

  const handleDismissSuggestion = async (suggestion: Record<string, unknown>) => {
    try {
      await dismissSuggestion(suggestion);
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  };

  return (
    <Card className="w-80 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Smart Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoadingSuggestions && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isLoadingSuggestions && !hasSuggestions && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            No suggestions available for this form type.
          </div>
        )}
        
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  {suggestion.fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {suggestion.reasoning}
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="text-xs bg-blue-100 text-blue-800"
              >
                {Math.round(suggestion.confidence * 100)}%
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApplySuggestion(suggestion)}
                className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Field
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDismissSuggestion(suggestion)}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {hasSuggestions && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateSuggestions(formContext, [])}
            className="w-full text-xs"
            disabled={isLoadingSuggestions}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Generate More Suggestions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestionsPanel;
