
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';
import { FormTextarea } from '@/components/superadmin/tenant-form/fields';
import { FormDatePicker } from '@/components/superadmin/tenant-form/fields';

interface BasicInfoSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  options?: {
    sizeOptions: { value: string; label: string }[];
  };
  readOnly?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form, options, readOnly = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="name"
        label="Company Name"
        required
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="cin"
        label="CIN"
        required
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="website"
        label="Website"
        placeholder="https://example.com"
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="yearOfEstablishment"
        label="Year of Establishment"
        placeholder="e.g., 2020"
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="registeredOfficeAddress" 
        label="Registered Office Address"
        required
        readOnly={readOnly}
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
        disabled={readOnly}
      />
      
      <FormDatePicker
        form={form}
        name="registrationDate"
        label="Registration Date"
        required
        disabled={readOnly}
      />
      
      <FormInput
        form={form}
        name="registeredEmailAddress"
        label="Registered Email Address"
        type="email"
        required
        readOnly={readOnly}
      />
      
      <FormInput 
        form={form}
        name="noOfDirectives"
        label="No Of Directives/Partner"
        required
        readOnly={readOnly}
      />

      {options?.sizeOptions && (
        <FormSelect
          form={form}
          name="size"
          label="Company Size"
          options={options.sizeOptions}
          disabled={readOnly}
        />
      )}
      
      <div className="col-span-1 md:col-span-2">
        <FormTextarea
          form={form}
          name="description"
          label="Company Description"
          rows={4}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
