
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from './FormFields';
import { TenantFormValues } from './schema';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface IndustrySectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({ form }) => {
  // Get dropdown options from our hook
  const industryHook = useDropdownOptions('industries');
  const companySectorHook = useDropdownOptions('company_sectors');
  const companyTypeHook = useDropdownOptions('company_types');
  const entityTypeHook = useDropdownOptions('entity_types');
  
  // Map the options to the required format
  const industryOptions = industryHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : industryHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const companySectorOptions = companySectorHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : companySectorHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const companyTypeOptions = companyTypeHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : companyTypeHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const entityTypeOptions = entityTypeHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : entityTypeHook.options.map(o => ({ value: o.value, label: o.label }));
  
  // Fallback options in case API fails or has no data
  const fallbackIndustryOptions = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' }
  ];
  
  const fallbackSectorOptions = [
    { value: 'Private', label: 'Private Sector' },
    { value: 'Public', label: 'Public Sector' },
    { value: 'Government', label: 'Government' },
    { value: 'Non-profit', label: 'Non-profit' }
  ];
  
  const fallbackCompanyTypeOptions = [
    { value: 'LLC', label: 'Limited Liability Company' },
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' }
  ];
  
  const fallbackEntityTypeOptions = [
    { value: 'LLC', label: 'LLC' },
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' }
  ];
  
  // Use fetched options or fallbacks
  const industries = industryOptions.length > 1 ? industryOptions : fallbackIndustryOptions;
  const sectors = companySectorOptions.length > 1 ? companySectorOptions : fallbackSectorOptions;
  const companyTypes = companyTypeOptions.length > 1 ? companyTypeOptions : fallbackCompanyTypeOptions;
  const entityTypes = entityTypeOptions.length > 1 ? entityTypeOptions : fallbackEntityTypeOptions;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormSelect 
        form={form}
        name="industry1"
        label="Industry1"
        options={industries}
        required
      />
      
      <FormSelect 
        form={form}
        name="industry2"
        label="Industry2"
        options={industries}
        required
      />
      
      <FormSelect 
        form={form}
        name="industry3"
        label="Industry3"
        options={industries}
        required
      />
      
      <FormSelect 
        form={form}
        name="companySector"
        label="Company Sector"
        options={sectors}
        required
      />
      
      <FormSelect 
        form={form}
        name="companyType"
        label="Company Type"
        options={companyTypes}
        required
      />
      
      <FormSelect 
        form={form}
        name="entityType"
        label="Entity Type"
        options={entityTypes}
        required
      />
    </div>
  );
};

export default IndustrySection;
