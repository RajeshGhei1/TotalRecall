
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';
import { FormTextarea } from '@/components/superadmin/tenant-form/fields';
import { FormDatePicker } from '@/components/superadmin/tenant-form/fields';

interface BasicInfoSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  options: {
    industryOptions: { value: string; label: string }[];
    sizeOptions: { value: string; label: string }[];
  };
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form, options }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="name"
        label="Company Name"
        required
      />
      
      <FormInput
        form={form}
        name="cin"
        label="CIN"
        required
      />
      
      <FormInput
        form={form}
        name="website"
        label="Website"
        placeholder="https://example.com"
      />
      
      <FormInput
        form={form}
        name="registeredOfficeAddress" 
        label="Registered Office Address"
        required
      />
      
      <FormSelect
        form={form}
        name="companyStatus"
        label="Company Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' }
        ]}
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
      
      <FormInput 
        form={form}
        name="noOfDirectives"
        label="No Of Directives/Partner"
        required
      />
      
      <div className="col-span-1 md:col-span-2">
        <FormTextarea
          form={form}
          name="description"
          label="Company Description"
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
