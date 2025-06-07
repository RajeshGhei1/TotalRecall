
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { FormDefinition } from '@/types/form-builder';
import SmartSuggestionsPanel from './SmartSuggestionsPanel';

interface FieldSuggestionButtonProps {
  form: FormDefinition;
  onAddField: (fieldData: any) => void;
}

const FieldSuggestionButton: React.FC<FieldSuggestionButtonProps> = ({
  form,
  onAddField
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (showSuggestions) {
    return (
      <SmartSuggestionsPanel
        form={form}
        onAddField={onAddField}
        onClose={() => setShowSuggestions(false)}
      />
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowSuggestions(true)}
      className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
    >
      <Sparkles className="h-4 w-4 mr-2" />
      Get AI Suggestions
    </Button>
  );
};

export default FieldSuggestionButton;
