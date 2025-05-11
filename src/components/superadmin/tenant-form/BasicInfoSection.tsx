
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormDatePicker, FormSelect } from './FormFields';
import { TenantFormValues } from './schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
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
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
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
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" }
          ]}
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
