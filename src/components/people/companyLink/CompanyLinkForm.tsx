
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';
import CompanySelector from './CompanySelector';
import RoleInput from './RoleInput';
import DateSelectors from './DateSelectors';
import ManagerSelector from './ManagerSelector';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: { id: string; name: string }[];
  personType?: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personType,
  personId,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<LinkCompanyRelationshipData>({
    person_id: personId || '',
    company_id: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: true,
    relationship_type: personType as 'employment' | 'business_contact' || 'employment'
  });
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [potentialManagers, setPotentialManagers] = useState<Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>>([]);
  
  const { toast } = useToast();
  
  // Fetch potential managers for talent type
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!personId || personType !== 'talent' || !formData.company_id) return;
      
      try {
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            person:people(id, full_name)
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
        end_date: formData.end_date === '' ? null : formData.end_date,
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
    setDate(date);
    setFormData({ ...formData, start_date: date?.toISOString().split('T')[0] || '' });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setFormData({ ...formData, end_date: date?.toISOString().split('T')[0] || '' });
  };

  const handleManagerChange = (value: string) => {
    setFormData({ ...formData, reports_to: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Person to Company</DialogTitle>
          <DialogDescription>
            Create a new company relationship for this person.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <CompanySelector 
            companyId={formData.company_id}
            companies={companies}
            onCompanyChange={handleCompanyChange}
          />
          
          <RoleInput 
            role={formData.role}
            onRoleChange={handleRoleChange}
          />
          
          <DateSelectors 
            startDate={date}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            formStartDate={formData.start_date}
          />
          
          {potentialManagers && potentialManagers.length > 0 && (
            <ManagerSelector 
              reportsTo={formData.reports_to}
              potentialManagers={potentialManagers}
              onManagerChange={handleManagerChange}
            />
          )}
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || createRelationshipMutation.isPending}>
              {isSubmitting || createRelationshipMutation.isPending ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
