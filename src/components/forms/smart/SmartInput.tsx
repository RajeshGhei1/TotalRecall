
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Lightbulb, Loader2 } from 'lucide-react';
import { useSmartFormAssistance } from '@/hooks/ai/useSmartFormAssistance';
import { AutocompleteOption } from '@/services/ai/smartForms/smartAutocompleteService';

interface SmartInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fieldType?: string;
  formType: string;
  userId: string;
  context?: FormContext;
  required?: boolean;
  className?: string;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  fieldType = 'text',
  formType,
  userId,
  context,
  required,
  className
}) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const {
    autocompleteOptions,
    isLoadingAutocomplete,
    getAutocomplete,
    clearAutocomplete,
    hasAutocomplete
  } = useSmartFormAssistance(formType, userId);

  const options = autocompleteOptions[fieldType] || [];
  const isLoading = isLoadingAutocomplete[fieldType] || false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Trigger autocomplete for relevant field types
    if (['company_name', 'person_name', 'email', 'role', 'industry', 'location'].includes(fieldType)) {
      if (newValue.length >= 2) {
        getAutocomplete(fieldType, newValue, context);
        setShowAutocomplete(true);
      } else {
        setShowAutocomplete(false);
        clearAutocomplete(fieldType);
      }
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    onChange(option.value);
    setShowAutocomplete(false);
    clearAutocomplete(fieldType);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setInputFocused(true);
    if (hasAutocomplete(fieldType) && value.length >= 2) {
      setShowAutocomplete(true);
    }
  };

  const handleBlur = () => {
    setInputFocused(false);
    // Delay hiding autocomplete to allow for option selection
    setTimeout(() => {
      setShowAutocomplete(false);
    }, 200);
  };

  return (
    <div className={className}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pr-8"
        />
        
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}

        {showAutocomplete && options.length > 0 && (
          <Card
            ref={autocompleteRef}
            className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border shadow-lg"
          >
            <CardContent className="p-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center justify-between"
                  onClick={() => handleOptionSelect(option)}
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500">{option.description}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {option.source}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
