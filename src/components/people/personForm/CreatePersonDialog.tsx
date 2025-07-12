
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PersonFormFields from './PersonFormFields';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personFormSchema, PersonFormValues } from './schema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CreatePersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  personType: 'talent' | 'contact';
}

const CreatePersonDialog: React.FC<CreatePersonDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  personType
}) => {
  const queryClient = useQueryClient();

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      type: personType,
      company_id: undefined,
      role: '',
      reports_to: '',
      personal_email: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        type: personType,
        company_id: undefined,
        role: '',
        reports_to: '',
        personal_email: '',
      });
    }
  }, [isOpen, personType, form]);

  const createPersonMutation = useMutation({
    mutationFn: async (values: PersonFormValues) => {
      // Create the person first
      const { data: person, error: personError } = await supabase
        .from('people')
        .insert([{
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          location: values.location || null,
          type: values.type,
        }])
        .select()
        .single();
        
      if (personError) throw personError;

      // If this is a contact with company/role info, create company relationship
      if (values.type === 'contact' && (values.company_id || values.role)) {
        const relationshipData: unknown = {
          person_id: person.id,
          relationship_type: 'business_contact',
          role: values.role || 'Contact',
          start_date: new Date().toISOString().split('T')[0],
          is_current: true,
        };

        // Add reports_to if specified
        if (values.reports_to) {
          relationshipData.reports_to = values.reports_to;
        }

        // Add company_id if specified
        if (values.company_id) {
          relationshipData.company_id = values.company_id;
        }

        const { error: relationshipError } = await supabase
          .from('company_relationships')
          .insert([relationshipData]);
          
        if (relationshipError) {
          console.error('Error creating company relationship:', relationshipError);
          // Don't throw error here - person was created successfully
        }
      }
      
      return person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['potential-managers'] });
      toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} created successfully`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: unknown) => {
      console.error('Error creating person:', error);
      toast.error(`Failed to create ${personType}: ${error.message}`);
    }
  });
  
  const onSubmit = (values: PersonFormValues) => {
    createPersonMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New {personType === 'talent' ? 'Talent' : 'Contact'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PersonFormFields 
              form={form} 
              personType={personType}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPersonMutation.isPending}
              >
                {createPersonMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create {personType === 'talent' ? 'Talent' : 'Contact'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonDialog;
