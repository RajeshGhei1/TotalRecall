
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';

interface UseCompanyLinkFormProps {
  personId?: string;
  personType?: 'talent' | 'contact';
  onSubmit: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const useCompanyLinkForm = ({
  personId,
  personType,
  onSubmit,
  onClose,
  isOpen
}: UseCompanyLinkFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [potentialManagers, setPotentialManagers] = useState<Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>>([]);

  // Initialize form data based on current props
  const [formData, setFormData] = useState<LinkCompanyRelationshipData>(() => ({
    person_id: personId || '',
    company_id: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: true,
    relationship_type: (personType === 'talent' ? 'employment' : 'business_contact') as 'employment' | 'business_contact'
  }));

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when dialog opens/closes or personId/personType changes
  useEffect(() => {
    if (isOpen && personId) {
      console.log('Resetting form with personId:', personId, 'personType:', personType);
      const newFormData: LinkCompanyRelationshipData = {
        person_id: personId,
        company_id: '',
        role: '',
        start_date: '',
        end_date: '',
        is_current: true,
        relationship_type: (personType === 'talent' ? 'employment' : 'business_contact') as 'employment' | 'business_contact'
      };
      console.log('Setting new form data:', newFormData);
      setFormData(newFormData);
      setStartDate(undefined);
      setEndDate(undefined);
      setPotentialManagers([]);
    }
  }, [isOpen, personId, personType]);

  // Fetch potential managers when company changes
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!formData.person_id || !formData.company_id) {
        setPotentialManagers([]);
        return;
      }
      
      try {
        console.log('Fetching potential managers for company:', formData.company_id);
        
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            role,
            person:people(id, full_name, email, type)
          `)
          .eq('company_id', formData.company_id)
          .eq('is_current', true)
          .neq('person_id', formData.person_id);
          
        if (error) {
          console.error('Error fetching potential managers:', error);
          throw error;
        }
        
        console.log('Raw potential managers data:', data);
        
        // Transform the data to include role information from the relationship
        const validManagers = data?.map(item => ({
          person: item.person ? {
            ...item.person,
            role: item.role
          } : null
        })).filter(item => item && item.person) || [];
        
        console.log('Processed potential managers:', validManagers);
        setPotentialManagers(validManagers);
      } catch (error) {
        console.error('Error fetching potential managers:', error);
        toast({
          title: "Error",
          description: "Failed to load potential managers",
          variant: "destructive"
        });
        setPotentialManagers([]);
      }
    };
    
    fetchPotentialManagers();
  }, [formData.company_id, formData.person_id, toast]);

  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!formData.person_id || !formData.company_id || !formData.role || !startDate) {
        throw new Error("Missing required fields.");
      }
      
      console.log('Creating relationship with data:', formData);
      
      // If this is a current role, make sure no other current roles exist for this person
      if (formData.is_current) {
        const { error: updateError } = await supabase
          .from('company_relationships')
          .update({ 
            is_current: false,
            end_date: new Date().toISOString().split('T')[0]
          })
          .eq('person_id', formData.person_id)
          .eq('is_current', true);
          
        if (updateError) {
          console.error('Error updating existing relationships:', updateError);
          throw updateError;
        }
      }
      
      const dataToSubmit = {
        ...formData,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        reports_to: formData.reports_to || null
      };
      
      console.log('Submitting relationship data:', dataToSubmit);
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        console.error('Error creating relationship:', error);
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company relationship created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['company-relationships'] });
      onSubmit();
      onClose();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create company relationship.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    createRelationshipMutation.mutate();
  };

  const handleCompanyChange = (value: string) => {
    console.log('handleCompanyChange called with value:', value);
    setFormData(prev => {
      const newData = { 
        ...prev, 
        company_id: value, 
        reports_to: '' // Reset manager when company changes
      };
      console.log('Updated form data after company change:', newData);
      return newData;
    });
  };

  const handleRoleChange = (value: string) => {
    console.log('Role changed to:', value);
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    console.log('Start date changed to:', date);
    setStartDate(date);
    setFormData(prev => ({ 
      ...prev, 
      start_date: date ? date.toISOString().split('T')[0] : '' 
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    console.log('End date changed to:', date);
    setEndDate(date);
    setFormData(prev => ({ 
      ...prev, 
      end_date: date ? date.toISOString().split('T')[0] : '',
      is_current: !date
    }));
  };

  const handleManagerChange = (value: string) => {
    console.log('Manager changed to:', value);
    setFormData(prev => ({ ...prev, reports_to: value }));
  };

  return {
    formData,
    startDate,
    endDate,
    potentialManagers,
    isSubmitting: createRelationshipMutation.isPending,
    handleSubmit,
    handleCompanyChange,
    handleRoleChange,
    handleStartDateChange,
    handleEndDateChange,
    handleManagerChange
  };
};
