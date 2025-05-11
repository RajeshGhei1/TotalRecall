
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormDatePicker, FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BasicInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          form={form}
          name="name"
          label="Account Name"
          required
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Parent</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="[Choose One]" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background">
              <SelectItem value="none">None</SelectItem>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
        
        <FormSelect 
          form={form}
          name="companyStatus"
          label="Company Status"
          options={formOptions.companyStatusOptions}
          required
        />
        
        <FormInput 
          form={form}
          name="noOfDirectives"
          label="No Of Directives/Partner"
          required
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
