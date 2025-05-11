
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormTextarea, FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          form={form}
          name="areaOfSpecialize"
          label="Area of Specialize"
        />
        
        <FormInput 
          form={form}
          name="serviceLine"
          label="Service Line"
        />
        
        <FormInput 
          form={form}
          name="verticles"
          label="Verticles"
        />
        
        <FormInput 
          form={form}
          name="webSite"
          label="WEB Site"
        />
      </div>
      
      <FormTextarea
        form={form}
        name="companyProfile"
        label="Company Profile"
        required
      />
      
      <FormSelect 
        form={form}
        name="endUserChannel"
        label="EndUser/Channel"
        options={formOptions.endUserOptions}
        required
      />
    </>
  );
};

export default AdditionalInfoSection;
