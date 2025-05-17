
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormDatePicker } from './fields';
import { TenantFormValues } from './schema';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { toast } from '@/hooks/use-toast';
import ParentSelector from './basic-info/ParentSelector';
import CompanyStatusField from './basic-info/CompanyStatusField';
import DialogManager from './basic-info/DialogManager';

interface BasicInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const [addingCompanyStatus, setAddingCompanyStatus] = useState(false);
  const [newCompanyStatus, setNewCompanyStatus] = useState('');
  
  // Get parent tenants
  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants-for-parent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Get company status options from our hook
  const { 
    options: companyStatusOptionsRaw = [], 
    isLoading: statusLoading,
    isAddingOption: isAddingStatus,
    addOption,
  } = useDropdownOptions('company_statuses');

  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  const companyStatusOptions = statusLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...companyStatusOptionsRaw.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];

  // Handle adding a new company status
  const handleAddNewCompanyStatus = async () => {
    if (!newCompanyStatus.trim()) return;

    try {
      console.log("Adding new company status:", newCompanyStatus);
      const newOption = await addOption.mutateAsync({
        value: newCompanyStatus,
        label: newCompanyStatus,
        categoryName: 'company_statuses'
      });
      
      console.log("New company status added successfully:", newOption);
      
      // Set the form value to the newly added option
      form.setValue('companyStatus', newOption.value);
      setAddingCompanyStatus(false);
      
      toast({
        title: "Success",
        description: `Added new company status: ${newCompanyStatus}`,
      });
    } catch (error) {
      console.error('Failed to add new company status:', error);
      toast({
        title: "Error",
        description: `Failed to add company status: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          form={form}
          name="name"
          label="Account Name"
          required
        />
        
        <ParentSelector tenants={tenants} />
        
        <FormInput 
          form={form}
          name="cin"
          label="CIN"
          required
        />
        
        <FormInput 
          form={form}
          name="registeredOfficeAddress" 
          label="Registered Office Address"
          required
        />
        
        <FormDatePicker
          form={form}
          name="registrationDate"
          label="Registration Date"
          required
        />
        
        <FormInput 
          form={form}
          name="registeredEmailAddress"
          label="Registered Email Address"
          type="email"
          required
        />
        
        <CompanyStatusField 
          form={form}
          options={companyStatusOptions}
          onSelectAddNew={() => setAddingCompanyStatus(true)}
        />
        
        <FormInput 
          form={form}
          name="noOfDirectives"
          label="No Of Directives/Partner"
          required
        />
      </div>

      {/* Dialog for adding new company status */}
      <DialogManager
        isOpen={addingCompanyStatus}
        onClose={() => setAddingCompanyStatus(false)}
        onAdd={handleAddNewCompanyStatus}
        value={newCompanyStatus}
        onChange={setNewCompanyStatus}
        isAdding={isAddingStatus}
        dialogType="companyStatus"
      />
    </>
  );
};

export default BasicInfoSection;
