
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { personFormSchema, PersonFormValues } from './schema';

interface UsePersonFormProps {
  personType: 'talent' | 'contact';
  onSuccess: () => void;
}

export const usePersonForm = ({ personType, onSuccess }: UsePersonFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      company_id: undefined,
      role: '',
    },
  });

  const createPerson = useMutation({
    mutationFn: async (values: PersonFormValues) => {
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
