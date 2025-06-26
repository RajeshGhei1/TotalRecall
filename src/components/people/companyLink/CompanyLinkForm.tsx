import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { CompanySelector } from './CompanySelector';
import { BranchOfficeSelector } from './BranchOfficeSelector';
import { RoleAndReportsSelector } from './RoleAndReportsSelector';

const companyLinkSchema = z.object({
  company_id: z.string().min(1, 'Please select a company'),
  branch_office_id: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  reports_to: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
});

type CompanyLinkFormValues = z.infer<typeof companyLinkSchema>;

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: { id: string; name: string }[];
  personType: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

export const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personType,
  personId,
  isSubmitting
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const queryClient = useQueryClient();

  console.log('CompanyLinkForm received companies:', companies);

  const form = useForm<CompanyLinkFormValues>({
    resolver: zodResolver(companyLinkSchema),
    defaultValues: {
      company_id: '',
      branch_office_id: '',
      role: '',
      reports_to: '',
      start_date: new Date().toISOString().split('T')[0],
    }
  });

  // Fetch branch offices for selected company
  const { data: branchOffices = [], isLoading: isLoadingBranches } = useQuery({
    queryKey: ['branch-offices', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('company_branch_offices')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .eq('is_active', true)
        .order('is_headquarters', { ascending: false })
        .order('branch_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  // Fetch potential managers from the same company
  const { data: potentialManagers = [] } = useQuery({
    queryKey: ['potential-managers', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('company_relationships')
        .select(`
          person_id,
          role,
          people!inner (
            id,
            full_name,
            email
          )
        `)
        .eq('company_id', selectedCompanyId)
        .eq('is_current', true)
        .neq('person_id', personId || '');

      if (error) throw error;
      return data?.map(rel => ({
        id: rel.people.id,
        full_name: rel.people.full_name,
        email: rel.people.email,
        role: rel.role
      })) || [];
    },
    enabled: !!selectedCompanyId,
  });

  const createRelationshipMutation = useMutation({
    mutationFn: async (values: CompanyLinkFormValues) => {
      if (!personId) throw new Error('Person ID is required');

      // Check if person already has a current relationship with this company
      const { data: existingRelationship } = await supabase
        .from('company_relationships')
        .select('id')
        .eq('person_id', personId)
        .eq('company_id', values.company_id)
        .eq('is_current', true)
        .maybeSingle();

      if (existingRelationship) {
        throw new Error('This person already has an active relationship with this company');
      }

      const { data, error } = await supabase
        .from('company_relationships')
        .insert({
          person_id: personId,
          company_id: values.company_id,
          branch_office_id: values.branch_office_id || null,
          role: values.role,
          reports_to: values.reports_to || null,
          start_date: values.start_date,
          relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
          is_current: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['contacts-for-reporting'] });
      queryClient.invalidateQueries({ queryKey: ['reporting-indicator'] });
      toast.success('Company relationship created successfully');
      onSubmit();
      form.reset();
      setSelectedCompanyId('');
    },
    onError: (error: any) => {
      console.error('Error creating company relationship:', error);
      toast.error(`Failed to create relationship: ${error.message}`);
    }
  });

  const handleSubmit = (values: CompanyLinkFormValues) => {
    console.log('Form submission with values:', values);
    createRelationshipMutation.mutate(values);
  };

  const handleCompanyChange = (companyId: string) => {
    console.log('Company changed to:', companyId);
    setSelectedCompanyId(companyId);
    form.setValue('company_id', companyId);
    form.setValue('branch_office_id', '');
    form.setValue('reports_to', '');
  };

  const handleClose = () => {
    form.reset();
    setSelectedCompanyId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Link {personType === 'talent' ? 'Talent' : 'Contact'} to Company</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <CompanySelector
              form={form}
              companies={companies}
              onCompanyChange={handleCompanyChange}
              isLoading={companies.length === 0}
            />

            {selectedCompanyId && (
              <>
                <BranchOfficeSelector
                  form={form}
                  branchOffices={branchOffices}
                  isLoading={isLoadingBranches}
                />

                <RoleAndReportsSelector
                  form={form}
                  potentialManagers={potentialManagers}
                  personType={personType}
                />
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createRelationshipMutation.isPending || isSubmitting || companies.length === 0}
              >
                {createRelationshipMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Link to Company
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
