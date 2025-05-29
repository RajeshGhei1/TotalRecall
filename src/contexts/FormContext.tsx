
import React, { createContext, useContext, useState, useCallback } from 'react';
import { FormDefinition, FormResponse } from '@/types/form-builder';
import { formIntegrationService } from '@/services/FormIntegrationService';
import { useTenantContext } from './TenantContext';
import { useToast } from '@/hooks/use-toast';

interface FormContextType {
  activeForm: FormDefinition | null;
  formData: Record<string, any>;
  isSubmitting: boolean;
  openForm: (form: FormDefinition, placementId?: string) => void;
  closeForm: () => void;
  updateFormData: (data: Record<string, any>) => void;
  submitForm: (placementId?: string) => Promise<void>;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [activeForm, setActiveForm] = useState<FormDefinition | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedTenantId } = useTenantContext();
  const { toast } = useToast();

  const openForm = useCallback((form: FormDefinition, placementId?: string) => {
    setActiveForm(form);
    setFormData({});
    console.log('Opening form:', form.name, 'Placement:', placementId);
  }, []);

  const closeForm = useCallback(() => {
    setActiveForm(null);
    setFormData({});
    console.log('Closing form');
  }, []);

  const updateFormData = useCallback((data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const submitForm = useCallback(async (placementId?: string) => {
    if (!activeForm) return;

    setIsSubmitting(true);
    try {
      const response = await formIntegrationService.submitFormResponse(
        activeForm.id,
        placementId || '',
        formData,
        selectedTenantId,
        undefined // TODO: Get current user ID
      );

      toast({
        title: 'Success',
        description: 'Form submitted successfully',
      });

      console.log('Form submitted successfully:', response);
      closeForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [activeForm, formData, selectedTenantId, toast, closeForm]);

  const resetForm = useCallback(() => {
    setFormData({});
  }, []);

  return (
    <FormContext.Provider
      value={{
        activeForm,
        formData,
        isSubmitting,
        openForm,
        closeForm,
        updateFormData,
        submitForm,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
