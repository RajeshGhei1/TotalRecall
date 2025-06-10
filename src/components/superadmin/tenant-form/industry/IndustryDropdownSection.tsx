
import React, { useEffect, useState } from 'react';
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
  getIndustry2OptionsForIndustry1?: (industry1Value: string) => { value: string; label: string }[];
  getIndustry3OptionsForIndustry2?: (industry2Value: string) => { value: string; label: string }[];
}

const IndustryDropdownSection: React.FC<IndustryDropdownSectionProps> = ({
  form,
  industry1Options = [],
  companySectorOptions,
  companyTypeOptions,
  entityTypeOptions,
  onSelectAddNew,
  getIndustry2OptionsForIndustry1,
  getIndustry3OptionsForIndustry2,
}) => {
  const [industry2Options, setIndustry2Options] = useState<{ value: string; label: string }[]>([]);
  const [industry3Options, setIndustry3Options] = useState<{ value: string; label: string }[]>([]);

  // Watch for changes in industry1 and industry2
  const industry1Value = form.watch('industry1');
  const industry2Value = form.watch('industry2');

  // Update industry2 options when industry1 changes
  useEffect(() => {
    if (industry1Value && industry1Value !== '__add_new__' && getIndustry2OptionsForIndustry1) {
      const newIndustry2Options = getIndustry2OptionsForIndustry1(industry1Value);
      setIndustry2Options(newIndustry2Options);
      
      // Clear industry2 and industry3 if the current values are not in the new options
      const currentIndustry2 = form.getValues('industry2');
      if (currentIndustry2 && !newIndustry2Options.find(opt => opt.value === currentIndustry2)) {
        form.setValue('industry2', '');
        form.setValue('industry3', '');
      }
    } else {
      setIndustry2Options([]);
      if (industry1Value !== '__add_new__') {
        form.setValue('industry2', '');
        form.setValue('industry3', '');
      }
    }
  }, [industry1Value, getIndustry2OptionsForIndustry1, form]);

  // Update industry3 options when industry2 changes
  useEffect(() => {
    if (industry2Value && industry2Value !== '__add_new__' && getIndustry3OptionsForIndustry2) {
      const newIndustry3Options = getIndustry3OptionsForIndustry2(industry2Value);
      setIndustry3Options(newIndustry3Options);
      
      // Clear industry3 if the current value is not in the new options
      const currentIndustry3 = form.getValues('industry3');
      if (currentIndustry3 && !newIndustry3Options.find(opt => opt.value === currentIndustry3)) {
        form.setValue('industry3', '');
      }
    } else {
      setIndustry3Options([]);
      if (industry2Value !== '__add_new__') {
        form.setValue('industry3', '');
      }
    }
  }, [industry2Value, getIndustry3OptionsForIndustry2, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry1"
          label="Industry 1 (Primary)"
          options={industry1Options}
          required
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry1');
            }
          }}
        />
        {form.watch('industry1') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new primary industry...
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry2"
          label="Industry 2 (Secondary)"
          options={industry2Options}
          required
          disabled={!industry1Value || industry1Value === '__add_new__'}
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry2');
            }
          }}
        />
        {form.watch('industry2') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new secondary industry...
          </div>
        )}
        {!industry1Value && (
          <div className="text-xs text-muted-foreground mt-1">
            Please select Industry 1 first
          </div>
        )}
      </div>

      <div className="space-y-1">
        <FormSelect 
          form={form}
          name="industry3"
          label="Industry 3 (Specific)"
          options={industry3Options}
          required
          disabled={!industry2Value || industry2Value === '__add_new__'}
          onChange={(value) => {
            if (value === '__add_new__') {
              onSelectAddNew('industry3');
            }
          }}
        />
        {form.watch('industry3') === '__add_new__' && (
          <div className="text-xs text-muted-foreground mt-1">
            Adding new specific industry...
          </div>
        )}
        {!industry2Value && (
          <div className="text-xs text-muted-foreground mt-1">
            Please select Industry 2 first
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
