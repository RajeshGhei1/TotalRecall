
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';
import { parseFormDate } from '@/utils/dateUtils';
import { ReportingPerson } from '@/types/company-relationship-types';

interface UseCompanyLinkFormProps {
  personId?: string;
  personType?: 'talent' | 'contact';
  onSubmit: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const useCompanyLinkForm = ({
  personId,
  personType = 'talent',
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
    relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
  });
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [potentialManagers, setPotentialManagers] = useState<Array<{ person: ReportingPerson | null }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when opened
  useEffect(() => {
    if (isOpen && personId) {
      setFormData({
        person_id: personId,
        company_id: '',
        role: '',
        start_date: '',
        end_date: null,
        is_current: true,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
      });
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [isOpen, personId, personType]);
  
  // Fetch potential managers when company is selected
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!formData.company_id || !personId) return;
      
      try {
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            person:people(
              id,
              full_name,
              email,
              type,
              role:company_relationships(role)
            )
          `)
          .eq('company_id', formData.company_id)
          .eq('is_current', true)
          .neq('person_id', personId);
        
        if (error) {
          console.error('Error fetching potential managers:', error);
          return;
        }
        
        setPotentialManagers(data || []);
      } catch (error) {
        console.error('Error in fetchPotentialManagers:', error);
      }
    };
    
    fetchPotentialManagers();
  }, [formData.company_id, personId]);
  
  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, company_id: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    const formattedDate = date ? parseFormDate(date) : '';
    setFormData(prev => ({ 
      ...prev, 
      start_date: formattedDate || '' 
    }));
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const formattedDate = date ? parseFormDate(date) : null;
    setFormData(prev => ({ 
      ...prev, 
      end_date: formattedDate,
      is_current: !formattedDate
    }));
  };
  
  const handleManagerChange = (value: string) => {
    setFormData(prev => ({ ...prev, reports_to: value || undefined }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_id || !formData.role || !formData.start_date || !personId) {
      console.error('Missing required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If is_current is true, set other relationships for this company to not current
      if (formData.is_current) {
        await supabase
          .from('company_relationships')
          .update({ is_current: false })
          .eq('person_id', personId)
          .eq('company_id', formData.company_id);
      }
      
      // Insert the new relationship
      const { error } = await supabase
        .from('company_relationships')
        .insert({
          person_id: personId,
          company_id: formData.company_id,
          role: formData.role,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_current: formData.is_current,
          relationship_type: formData.relationship_type,
          reports_to: formData.reports_to
        });
      
      if (error) {
        console.error('Error creating company relationship:', error);
        return;
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    startDate,
    endDate,
    potentialManagers,
    isSubmitting,
    handleSubmit,
    handleCompanyChange,
    handleRoleChange,
    handleStartDateChange,
    handleEndDateChange,
    handleManagerChange
  };
};
