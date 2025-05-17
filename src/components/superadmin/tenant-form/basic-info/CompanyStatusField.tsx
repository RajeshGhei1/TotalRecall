
import React, { useState } from 'react';
import { FormSelect } from '../fields';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from '../schema';

interface CompanyStatusFieldProps {
  form: UseFormReturn<TenantFormValues>;
  options: { value: string, label: string }[];
  onSelectAddNew: () => void;
}

const CompanyStatusField: React.FC<CompanyStatusFieldProps> = ({ 
  form, 
  options, 
  onSelectAddNew 
}) => {
  // Handle selection of the "Add New" option
  const handleSelectCompanyStatus = (value: string) => {
    if (value === '__add_new__') {
      onSelectAddNew();
    }
  };

  return (
    <div className="space-y-1">
      <FormSelect 
        form={form}
        name="companyStatus"
        label="Company Status"
        options={options}
        required
        onChange={handleSelectCompanyStatus}
      />
      {form.watch('companyStatus') === '__add_new__' && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-1"
          onClick={onSelectAddNew}
        >
          <Plus className="h-4 w-4 mr-1" /> Add New Status
        </Button>
      )}
    </div>
  );
};

export default CompanyStatusField;
