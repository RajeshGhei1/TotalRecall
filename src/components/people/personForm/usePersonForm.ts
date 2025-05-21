
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { personFormSchema, PersonFormValues } from './schema';
import { useCustomFieldValues } from '@/hooks/customFields';

interface UsePersonFormProps {
  personType: 'talent' | 'contact';
  onSuccess: () => void;
}

export const usePersonForm = ({ personType, onSuccess }: UsePersonFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { saveCustomFieldValues } = useCustomFieldValues();

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      company_id: undefined,
      role: '',
      type: personType,
    },
  });

  const createPerson = useMutation({
    mutationFn: async (values: PersonFormValues) => {
      // Extract custom field values from form data
      const standardFields = ['full_name', 'email', 'phone', 'location', 'company_id', 'role', 'type'];
      const customFieldValues: Record<string, any> = {};
      
      // Extract any fields starting with 'custom_' as custom field values
      Object.keys(values).forEach(key => {
        if (key.startsWith('custom_')) {
          customFieldValues[key.replace('custom_', '')] = values[key as keyof PersonFormValues];
        }
      });
      
      // First create the person
      const { data: personData, error: personError } = await supabase
        .from('people')
        .insert([
          { 
            full_name: values.full_name,
            email: values.email,
            phone: values.phone || null,
            location: values.location || null,
            type: personType
          }
        ])
        .select();
      
      if (personError) throw personError;

      // Get the correct form context based on person type
      const formContext = personType === 'talent' ? 'talent_form' : 'contact_form';

      // If we have a person created and custom field values
      if (personData && personData[0] && Object.keys(customFieldValues).length > 0) {
        // Save custom field values for this person
        await saveCustomFieldValues(
          formContext,
          personData[0].id, 
          customFieldValues
        );
      }

      // If company_id and role are provided and this is a contact, create a company relationship
      if (personType === 'contact' && values.company_id && values.role && personData && personData[0]) {
        const { error: relationshipError } = await supabase
          .from('company_relationships')
          .insert([
            {
              person_id: personData[0].id,
              company_id: values.company_id,
              role: values.role,
              relationship_type: 'business_contact',
              start_date: new Date().toISOString().split('T')[0],
              is_current: true
            }
          ]);
        
        if (relationshipError) throw relationshipError;
      }
      
      return personData;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['people', personType] });
      onSuccess();
      toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} created successfully`);
    },
    onError: (err: any) => {
      console.error('Error creating person:', err);
      setError(err.message);
      toast.error(`Failed to create ${personType}. Please try again.`);
    }
  });

  const handleCreatePerson = async (values: PersonFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createPerson.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    error,
    handleCreatePerson
  };
};
