
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from '../schema';
import { FormSelect } from '../FormFields';

interface IndustryDropdownSectionProps {
  form: UseFormReturn<TenantFormValues>;
  industryOptions: { value: string; label: string }[];
  industry1Options?: { value: string; label: string }[];
  industry2Options?: { value: string; label: string }[];
  industry3Options?: { value: string; label: string }[];
  companySectorOptions: { value: string; label: string }[];
  companyTypeOptions: { value: string; label: string }[];
  entityTypeOptions: { value: string; label: string }[];
  onSelectAddNew: (name: string) => void;
}

const IndustryDropdownSection: React.FC<IndustryDropdownSectionProps> = ({
  form,
  industryOptions,
  industry1Options,
  industry2Options,
  industry3Options,
  companySectorOptions,
  companyTypeOptions,
  entityTypeOptions,
  onSelectAddNew,
}) => {
  // Use specific industry options when available, fall back to general industry options
  const industry1 = industry1Options || industryOptions;
  const industry2 = industry2Options || industryOptions;
  const industry3 = industry3Options || industryOptions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry1"
          label="Industry 1"
          options={industry1}
          required
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry1');
            }
          }}
        />
        {form.watch('industry1') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new industry...
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry2"
          label="Industry 2"
          options={industry2}
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry2');
            }
          }}
        />
        {form.watch('industry2') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new industry...
          </div>
        )}
      </div>

      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry3"
          label="Industry 3"
          options={industry3}
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry3');
            }
          }}
        />
        {form.watch('industry3') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new industry...
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="companySector"
          label="Company Sector"
          options={companySectorOptions}
          required
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('companySector');
            }
          }}
        />
        {form.watch('companySector') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new company sector...
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="companyType"
          label="Company Type"
          options={companyTypeOptions}
          required
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('companyType');
            }
          }}
        />
        {form.watch('companyType') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new company type...
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="entityType"
          label="Entity Type"
          options={entityTypeOptions}
          required
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('entityType');
            }
          }}
        />
        {form.watch('entityType') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new entity type...
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryDropdownSection;
