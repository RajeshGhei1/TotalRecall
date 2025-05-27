
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
  const [formData, setFormData] = useState<LinkCompanyRelationshipData>({
    person_id: personId || '',
    company_id: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: true,
    relationship_type: personType === 'talent' ? 'employment' : 'business_contact'
  });
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [potentialManagers, setPotentialManagers] = useState<Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        person_id: personId || '',
        company_id: '',
        role: '',
        start_date: '',
        end_date: '',
        is_current: true,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact'
      });
      setStartDate(undefined);
      setEndDate(undefined);
      setPotentialManagers([]);
    }
  }, [isOpen, personId, personType]);

  // Fetch potential managers when company changes
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!personId || personType !== 'talent' || !formData.company_id) {
        setPotentialManagers([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            role,
            person:people(id, full_name, email, type)
          `)
          .eq('company_id', formData.company_id)
          .eq('is_current', true)
          .neq('person_id', personId);
          
        if (error) throw error;
        
        // Transform the data to include role information from the relationship
        const validManagers = data?.map(item => ({
          person: item.person ? {
            ...item.person,
            role: item.role
          } : null
        })).filter(item => item && item.person) || [];
        
        setPotentialManagers(validManagers);
      } catch (error) {
        console.error('Error fetching potential managers:', error);
        toast({
          title: "Error",
          description: "Failed to load potential managers",
          variant: "destructive"
        });
      }
    };
    
    fetchPotentialManagers();
  }, [formData.company_id, personId, personType, toast]);

  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!personId || !formData.company_id || !formData.role || !startDate) {
        throw new Error("Missing required fields.");
      }
      
      const dataToSubmit = {
        ...formData,
        person_id: personId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        reports_to: formData.reports_to || null
      };
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) throw new Error(error.message);
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
      toast({
        title: "Error",
        description: error.message || "Failed to create company relationship.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createRelationshipMutation.mutate();
  };

  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, company_id: value, reports_to: '' }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setFormData(prev => ({ 
      ...prev, 
      start_date: date ? date.toISOString().split('T')[0] : '' 
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setFormData(prev => ({ 
      ...prev, 
      end_date: date ? date.toISOString().split('T')[0] : '',
      is_current: !date
    }));
  };

  const handleManagerChange = (value: string) => {
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
