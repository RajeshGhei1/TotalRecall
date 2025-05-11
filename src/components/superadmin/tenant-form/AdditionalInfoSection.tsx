
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormTextarea, FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  const { endUserOptions, specializationOptions, serviceLineOptions } = formOptions;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect 
          form={form}
          name="areaOfSpecialize"
          label="Area of Specialization"
          options={specializationOptions}
        />
        
        <FormSelect 
          form={form}
          name="serviceLine"
          label="Service Line"
          options={serviceLineOptions}
        />
        
        <FormInput 
          form={form}
          name="verticles"
          label="Verticles"
        />
        
        <FormInput 
          form={form}
          name="webSite"
          label="Website"
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
        options={endUserOptions}
        required
      />
    </>
  );
};

export default AdditionalInfoSection;
