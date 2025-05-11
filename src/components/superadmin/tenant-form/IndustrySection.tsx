
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface IndustrySectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({ form }) => {
  const { industryOptions } = formOptions;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormSelect 
        form={form}
        name="industry1"
        label="Industry1"
        options={industryOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="industry2"
        label="Industry2"
        options={industryOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="industry3"
        label="Industry3"
        options={industryOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="companySector"
        label="Company Sector"
        options={["Private", "Public", "Government"]}
        required
      />
      
      <FormSelect 
        form={form}
        name="companyType"
        label="Company Type"
        options={formOptions.companyTypeOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="entityType"
        label="Entity Type"
        options={formOptions.entityTypeOptions}
        required
      />
    </div>
  );
};

export default IndustrySection;
