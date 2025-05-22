
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
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
    end_date: null,
    is_current: true,
    relationship_type: personType as 'employment' | 'business_contact' || 'employment'
  });
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [potentialManagers, setPotentialManagers] = useState<Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>>([]);
  
  const { toast } = useToast();

  // Reset form data when the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        person_id: personId || '',
        company_id: '',
        role: '',
        start_date: '',
        end_date: null,
        is_current: true,
        relationship_type: personType as 'employment' | 'business_contact' || 'employment'
      });
      setStartDate(new Date());
      setEndDate(undefined);
    }
  }, [isOpen, personId, personType]);
  
  // Fetch potential managers for talent type
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!personId || personType !== 'talent' || !formData.company_id) return;
      
      try {
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            person:people(id, full_name, email, type)
          `)
          .eq('company_id', formData.company_id)
          .eq('is_current', true)
          .neq('person_id', personId);
          
        if (error) throw error;
        
        // Filter out invalid entries
        const validManagers = data?.filter(item => item && item.person) || [];
        
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
      if (!personId) {
        throw new Error("Person ID is missing.");
      }
      
      if (!formData.company_id || !formData.role || !formData.start_date) {
        throw new Error("Missing required fields.");
      }
      
      const dataToSubmit = {
        ...formData,
        person_id: personId,
        end_date: formData.end_date,
        reports_to: formData.reports_to === '' ? null : formData.reports_to
      };
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company relationship created successfully.",
      });
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
    setFormData({ ...formData, company_id: value, reports_to: '' });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      setFormData({ ...formData, start_date: formattedDate });

      // If end date exists and is now before start date, reset it
      if (endDate && endDate < date) {
        setEndDate(undefined);
        setFormData(prev => ({ ...prev, end_date: null, is_current: true }));
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      setFormData({ ...formData, end_date: formattedDate, is_current: false });
    } else {
      setFormData({ ...formData, end_date: null, is_current: true });
    }
  };

  const handleManagerChange = (value: string) => {
    setFormData({ ...formData, reports_to: value });
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
