
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from './FormFields';
import { TenantFormValues, formOptions } from './schema';

interface LocationSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const LocationSection: React.FC<LocationSectionProps> = ({ form }) => {
  const { regionOptions, countryOptions, localRegionOptions, locationOptions } = formOptions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormSelect 
        form={form}
        name="globalRegion"
        label="Global Region"
        options={regionOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="country"
        label="Country"
        options={countryOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="region"
        label="Region"
        options={localRegionOptions}
        required
      />
      
      <FormSelect 
        form={form}
        name="hoLocation"
        label="HO Location"
        options={locationOptions}
        required
      />
    </div>
  );
};

export default LocationSection;
