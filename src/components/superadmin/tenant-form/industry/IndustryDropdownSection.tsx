
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from '../schema';
import IndustryDropdown from '../dropdowns/IndustryDropdown';
import CompanyTypeDropdown from '../dropdowns/CompanyTypeDropdown';

interface IndustryDropdownSectionProps {
  form: UseFormReturn<TenantFormValues>;
  industryOptions: { value: string; label: string }[];
  companySectorOptions: { value: string; label: string }[];
  companyTypeOptions: { value: string; label: string }[];
  entityTypeOptions: { value: string; label: string }[];
  onSelectAddNew: (name: string) => void;
}

const IndustryDropdownSection = ({
  form,
  industryOptions,
  companySectorOptions,
  companyTypeOptions,
  entityTypeOptions,
  onSelectAddNew
}: IndustryDropdownSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <IndustryDropdown
        form={form}
        name="industry1"
        label="Industry 1"
        options={industryOptions}
        onSelectAddNew={onSelectAddNew}
      />
      
      <IndustryDropdown
        form={form}
        name="industry2"
        label="Industry 2"
        options={industryOptions}
        onSelectAddNew={onSelectAddNew}
      />
      
      <IndustryDropdown
        form={form}
        name="industry3"
        label="Industry 3"
        options={industryOptions}
        onSelectAddNew={onSelectAddNew}
      />
      
      <CompanyTypeDropdown
        form={form}
        name="companySector"
        label="Company Sector"
        options={companySectorOptions}
        onSelectAddNew={onSelectAddNew}
        buttonLabel="Add New Sector"
      />
      
      <CompanyTypeDropdown
        form={form}
        name="companyType"
        label="Company Type"
        options={companyTypeOptions}
        onSelectAddNew={onSelectAddNew}
        buttonLabel="Add New Company Type"
      />
      
      <CompanyTypeDropdown
        form={form}
        name="entityType"
        label="Entity Type"
        options={entityTypeOptions}
        onSelectAddNew={onSelectAddNew}
        buttonLabel="Add New Entity Type"
      />
    </div>
  );
};

export default IndustryDropdownSection;
