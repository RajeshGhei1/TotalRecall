
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
    },
  });

  const createPerson = useMutation({
    mutationFn: async (values: PersonFormValues) => {
      const { data, error } = await supabase
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
      
      if (error) throw error;
      return data;
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
