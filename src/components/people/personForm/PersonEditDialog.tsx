
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
import { CustomFieldsForm } from '@/components/customFields';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersonEmploymentHistory } from '@/hooks/company-relationships/usePersonEmploymentHistory';
import JobHistoryList from '../JobHistoryList';

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
  const { employmentHistory, isLoading: isLoadingHistory } = usePersonEmploymentHistory(person?.id);

  // Get current reporting relationship
  const { data: currentRelationship } = useQuery({
    queryKey: ['current-relationship', person?.id],
    queryFn: async () => {
      if (!person?.id) return null;
      
      const { data, error } = await supabase
        .from('company_relationships')
        .select('*')
        .eq('person_id', person.id)
        .eq('is_current', true)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!person?.id && person?.type === 'contact'
  });

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
      reports_to: '',
      personal_email: '',
    }
  });

  // Reset form values when person or relationship changes
  useEffect(() => {
    if (person) {
      form.reset({
        full_name: person.full_name,
        email: person.email,
        phone: person.phone || '',
        location: person.location || '',
        type: person.type,
        company_id: currentRelationship?.company_id || undefined,
        role: currentRelationship?.role || '',
        reports_to: currentRelationship?.reports_to || '',
        personal_email: '',
      });
    }
  }, [person, currentRelationship, form]);

  const updatePersonMutation = useMutation({
    mutationFn: async (values: PersonFormValues) => {
      if (!person?.id) throw new Error('Person ID is required');
      
      // Update person basic info
      const { data, error } = await supabase
        .from('people')
        .update({
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          location: values.location || null,
        })
        .eq('id', person.id)
        .select()
        .single();
        
      if (error) throw error;

      // Update or create company relationship for contacts
      if (person.type === 'contact') {
        if (currentRelationship) {
          // Update existing relationship
          const { error: updateError } = await supabase
            .from('company_relationships')
            .update({
              role: values.role || 'Contact',
              reports_to: values.reports_to || null,
            })
            .eq('id', currentRelationship.id);
            
          if (updateError) throw updateError;
        } else if (values.role || values.reports_to) {
          // Create new relationship if role or reports_to is specified
          const { error: createError } = await supabase
            .from('company_relationships')
            .insert([{
              person_id: person.id,
              company_id: values.company_id || null,
              role: values.role || 'Contact',
              reports_to: values.reports_to || null,
              relationship_type: 'business_contact',
              start_date: new Date().toISOString().split('T')[0],
              is_current: true,
            }]);
            
          if (createError) throw createError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['person', person?.id] });
      queryClient.invalidateQueries({ queryKey: ['current-relationship'] });
      queryClient.invalidateQueries({ queryKey: ['person-reporting-relationships'] });
      queryClient.invalidateQueries({ queryKey: ['potential-managers'] });
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {person?.type === 'talent' ? 'Talent' : 'Contact'}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
            {person?.type === 'contact' && (
              <TabsTrigger value="employment">Employment History</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <PersonFormFields 
                  form={form} 
                  personType={person?.type} 
                  personId={person?.id}
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
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            {person?.id && person?.type && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Custom Fields</h3>
                <CustomFieldsForm
                  entityType={person.type === 'talent' ? 'talent_form' : 'contact_form'}
                  entityId={person.id}
                  formContext={person.type === 'talent' ? 'talent_form' : 'contact_form'}
                  form={form}
                />
              </div>
            )}
          </TabsContent>
          
          {person?.type === 'contact' && (
            <TabsContent value="employment" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Employment History</h3>
                {isLoadingHistory ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : employmentHistory && employmentHistory.length > 0 ? (
                  <JobHistoryList history={employmentHistory} showAllHistory={true} />
                ) : (
                  <div className="rounded-md bg-muted p-4 text-center">
                    <p>No employment history found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PersonEditDialog;
