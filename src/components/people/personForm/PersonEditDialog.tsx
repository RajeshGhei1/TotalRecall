
import React from 'react';
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
import { Person } from '@/types/person';

interface PersonEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  person: Person | null;
}

const PersonEditDialog: React.FC<PersonEditDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  person
}) => {
  const queryClient = useQueryClient();

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      full_name: person?.full_name || '',
      email: person?.email || '',
      phone: person?.phone || '',
      location: person?.location || '',
      type: person?.type || 'talent',
      company_id: undefined,
      role: '',
    }
  });

  // Reset form values when person changes
  React.useEffect(() => {
    if (person) {
      form.reset({
        full_name: person.full_name,
        email: person.email,
        phone: person.phone || '',
        location: person.location || '',
        type: person.type,
        company_id: undefined,
        role: '',
      });
    }
  }, [person, form]);

  const updatePersonMutation = useMutation({
    mutationFn: async (values: PersonFormValues) => {
      if (!person?.id) throw new Error('Person ID is required');
      
      const { data, error } = await supabase
        .from('people')
        .update({
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          location: values.location || null,
          // Don't update type as it could break relationships
        })
        .eq('id', person.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['person', person?.id] });
      toast.success('Person updated successfully');
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error('Error updating person:', error);
      toast.error(`Failed to update: ${error.message}`);
    }
  });
  
  const onSubmit = (values: PersonFormValues) => {
    updatePersonMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {person?.type === 'talent' ? 'Talent' : 'Contact'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PersonFormFields form={form} personType={person?.type} />
            
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
                disabled={updatePersonMutation.isPending}
              >
                {updatePersonMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonEditDialog;
