
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '../FormFields';
import { TenantFormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmployeeSectionProps {
  form: UseFormReturn<TenantFormValues>;
  employeeOptions: { value: string; label: string }[];
  onSelectOption: (name: string, value: string) => void;
  onAddNewClick: (name: string) => void;
}

const EmployeeSection: React.FC<EmployeeSectionProps> = ({
  form,
  employeeOptions,
  onSelectOption,
  onAddNewClick
}) => {
  return (
    <>
      <FormInput
        form={form}
        name="noOfEmployee"
        label="No Of Employee"
        required
      />
      
      <div className="space-y-1">
        <FormSelect
          form={form}
          name="segmentAsPerNumberOfEmployees"
          label="Segment As Per Number Of Employees"
          options={employeeOptions}
          required
          onChange={(value) => onSelectOption('segmentAsPerNumberOfEmployees', value)}
        />
        {form.watch('segmentAsPerNumberOfEmployees') === '__add_new__' && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={() => onAddNewClick('segmentAsPerNumberOfEmployees')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Employee Range
          </Button>
        )}
      </div>
    </>
  );
};

export default EmployeeSection;
