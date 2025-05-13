
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from '../FormFields';
import { TenantFormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CompanyTypeDropdownProps {
  form: UseFormReturn<TenantFormValues>;
  name: 'companySector' | 'companyType' | 'entityType';
  label: string;
  options: { value: string; label: string }[];
  onSelectAddNew: (name: string) => void;
  buttonLabel: string;
}

const CompanyTypeDropdown: React.FC<CompanyTypeDropdownProps> = ({
  form,
  name,
  label,
  options,
  onSelectAddNew,
  buttonLabel
}) => {
  const handleChange = (value: string) => {
    console.log(`Company type dropdown ${name} changed to:`, value);
    if (value === '__add_new__') {
      console.log(`Triggering add new for ${name}`);
      onSelectAddNew(name);
    }
  };

  return (
    <div className="space-y-1">
      <FormSelect 
        form={form}
        name={name}
        label={label}
        options={options}
        required
        onChange={handleChange}
      />
      {form.watch(name) === '__add_new__' && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-1"
          onClick={() => onSelectAddNew(name)}
        >
          <Plus className="h-4 w-4 mr-1" /> {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default CompanyTypeDropdown;
