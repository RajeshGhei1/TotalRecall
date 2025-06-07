
import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { formSuggestionEngine, FormSuggestion, FormContext } from '@/services/ai/smartForms/formSuggestionEngine';
import { smartAutocompleteService, AutocompleteOption, AutocompleteRequest } from '@/services/ai/smartForms/smartAutocompleteService';
import { intelligentFormAnalyzer, FormAnalysis } from '@/services/ai/smartForms/intelligentFormAnalyzer';
import { useTenantContext } from '@/contexts/TenantContext';

export interface SmartFormState {
  suggestions: FormSuggestion[];
  autocompleteOptions: Record<string, AutocompleteOption[]>;
  formAnalysis?: FormAnalysis;
  isLoadingSuggestions: boolean;
  isLoadingAutocomplete: Record<string, boolean>;
  isLoadingAnalysis: boolean;
}

export const useSmartFormAssistance = (formType: string, userId: string) => {
  const { selectedTenantId } = useTenantContext();
  const [formState, setFormState] = useState<SmartFormState>({
    suggestions: [],
    autocompleteOptions: {},
    isLoadingSuggestions: false,
    isLoadingAutocomplete: {},
    isLoadingAnalysis: false
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: async (context: FormContext) => {
      return formSuggestionEngine.generateSuggestions(context);
    },
    onSuccess: (suggestions) => {
      setFormState(prev => ({
        ...prev,
        suggestions,
        isLoadingSuggestions: false
      }));
    },
    onError: (error) => {
      console.error('Error generating suggestions:', error);
      setFormState(prev => ({
        ...prev,
        isLoadingSuggestions: false
      }));
    }
  });

  const getAutocompleteMutation = useMutation({
    mutationFn: async (request: AutocompleteRequest) => {
      return smartAutocompleteService.getAutocompleteSuggestions(request);
    },
    onSuccess: (options, variables) => {
      setFormState(prev => ({
        ...prev,
        autocompleteOptions: {
          ...prev.autocompleteOptions,
          [variables.fieldType]: options
        },
        isLoadingAutocomplete: {
          ...prev.isLoadingAutocomplete,
          [variables.fieldType]: false
        }
      }));
    },
    onError: (error, variables) => {
      console.error('Error getting autocomplete:', error);
      setFormState(prev => ({
        ...prev,
        isLoadingAutocomplete: {
          ...prev.isLoadingAutocomplete,
          [variables.fieldType]: false
        }
      }));
    }
  });

  const analyzeFormMutation = useMutation({
    mutationFn: async ({ form, fields, context }: { form: any, fields: any[], context?: Record<string, any> }) => {
      return intelligentFormAnalyzer.analyzeForm(form, fields, context);
    },
    onSuccess: (analysis) => {
      setFormState(prev => ({
        ...prev,
        formAnalysis: analysis,
        isLoadingAnalysis: false
      }));
    },
    onError: (error) => {
      console.error('Error analyzing form:', error);
      setFormState(prev => ({
        ...prev,
        isLoadingAnalysis: false
      }));
    }
  });

  const generateSuggestions = useCallback(async (
    currentValues: Record<string, any>,
    userHistory: Record<string, any>[] = []
  ) => {
    setFormState(prev => ({ ...prev, isLoadingSuggestions: true }));

    const context: FormContext = {
      formType,
      currentValues,
      userHistory,
      userId,
      tenantId: selectedTenantId || undefined
    };

    generateSuggestionsMutation.mutate(context);
  }, [formType, userId, selectedTenantId, generateSuggestionsMutation]);

  const getAutocomplete = useCallback(async (
    fieldType: string,
    query: string,
    context?: Record<string, any>
  ) => {
    if (query.length < 2) return; // Don't search for very short queries

    setFormState(prev => ({
      ...prev,
      isLoadingAutocomplete: {
        ...prev.isLoadingAutocomplete,
        [fieldType]: true
      }
    }));

    const request: AutocompleteRequest = {
      fieldType,
      query,
      context,
      userId,
      tenantId: selectedTenantId || undefined,
      limit: 10
    };

    getAutocompleteMutation.mutate(request);
  }, [userId, selectedTenantId, getAutocompleteMutation]);

  const analyzeForm = useCallback(async (
    form: any,
    fields: any[],
    context?: Record<string, any>
  ) => {
    setFormState(prev => ({ ...prev, isLoadingAnalysis: true }));
    
    analyzeFormMutation.mutate({ 
      form, 
      fields, 
      context: { ...context, userId, tenantId: selectedTenantId } 
    });
  }, [userId, selectedTenantId, analyzeFormMutation]);

  const applySuggestion = useCallback(async (suggestion: FormSuggestion) => {
    // Record that the user accepted this suggestion
    await formSuggestionEngine.recordSuggestionFeedback(
      `${suggestion.fieldName}_${Date.now()}`,
      true,
      {
        formType,
        currentValues: {},
        userHistory: [],
        userId,
        tenantId: selectedTenantId || undefined
      }
    );

    // Record the pattern for future suggestions
    formSuggestionEngine.recordUserPattern(userId, suggestion.fieldName, suggestion.suggestedValue);
  }, [formType, userId, selectedTenantId]);

  const dismissSuggestion = useCallback(async (suggestion: FormSuggestion) => {
    // Record that the user dismissed this suggestion
    await formSuggestionEngine.recordSuggestionFeedback(
      `${suggestion.fieldName}_${Date.now()}`,
      false,
      {
        formType,
        currentValues: {},
        userHistory: [],
        userId,
        tenantId: selectedTenantId || undefined
      }
    );

    // Remove from current suggestions
    setFormState(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s !== suggestion)
    }));
  }, [formType, userId, selectedTenantId]);

  const clearSuggestions = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      suggestions: []
    }));
  }, []);

  const clearAutocomplete = useCallback((fieldType: string) => {
    setFormState(prev => ({
      ...prev,
      autocompleteOptions: {
        ...prev.autocompleteOptions,
        [fieldType]: []
      }
    }));
  }, []);

  return {
    // State
    suggestions: formState.suggestions,
    autocompleteOptions: formState.autocompleteOptions,
    formAnalysis: formState.formAnalysis,
    isLoadingSuggestions: formState.isLoadingSuggestions,
    isLoadingAutocomplete: formState.isLoadingAutocomplete,
    isLoadingAnalysis: formState.isLoadingAnalysis,
    
    // Actions
    generateSuggestions,
    getAutocomplete,
    analyzeForm,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    clearAutocomplete,
    
    // Status
    hasSuggestions: formState.suggestions.length > 0,
    hasAutocomplete: (fieldType: string) => (formState.autocompleteOptions[fieldType] || []).length > 0,
    hasAnalysis: !!formState.formAnalysis
  };
};
