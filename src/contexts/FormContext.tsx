
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormDefinition, FormResponse } from '@/types/form-builder';

interface FormContextType {
  currentForm: FormDefinition | null;
  setCurrentForm: (form: FormDefinition | null) => void;
  responses: FormResponse[];
  addResponse: (response: FormResponse) => void;
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
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [currentForm, setCurrentForm] = useState<FormDefinition | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);

  const addResponse = (response: FormResponse) => {
    setResponses(prev => [...prev, response]);
  };

  return (
    <FormContext.Provider value={{
      currentForm,
      setCurrentForm,
      responses,
      addResponse
    }}>
      {children}
    </FormContext.Provider>
  );
};
