
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';
import { FormTextarea } from '@/components/superadmin/tenant-form/fields';

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
        name="website"
        label="Website"
        placeholder="https://example.com"
      />
      
      <FormSelect
        form={form}
        name="industry"
        label="Industry"
        options={options.industryOptions}
        required
      />
      
      <FormSelect
        form={form}
        name="size"
        label="Company Size"
        options={options.sizeOptions}
      />
      
      <FormInput
        form={form}
        name="location"
        label="Headquarters Location"
        placeholder="City, Country"
      />
      
      <FormInput
        form={form}
        name="founded"
        label="Year Founded"
        type="number"
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
