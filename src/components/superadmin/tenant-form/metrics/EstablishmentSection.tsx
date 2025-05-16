
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '../FormFields';
import { TenantFormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EstablishmentSectionProps {
  form: UseFormReturn<TenantFormValues>;
  yearOptions: { value: string; label: string }[];
  segmentOptions: { value: string; label: string }[];
  onSelectOption: (name: string, value: string) => void;
  onAddNewClick: (name: string) => void;
}

const EstablishmentSection: React.FC<EstablishmentSectionProps> = ({
  form,
  yearOptions,
  segmentOptions,
  onSelectOption,
  onAddNewClick
}) => {
  return (
    <>
      <div className="space-y-1">
        <FormSelect
          form={form}
          name="yearOfEstablishment"
          label="Year Of Establishment"
          options={yearOptions}
          required
          onChange={(value) => onSelectOption('yearOfEstablishment', value)}
        />
        {form.watch('yearOfEstablishment') === '__add_new__' && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={() => onAddNewClick('yearOfEstablishment')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Year
          </Button>
        )}
      </div>
      
      <FormInput
        form={form}
        name="paidupCapital"
        label="Paidup Capital"
        required
      />
      
      <div className="space-y-1">
        <FormSelect
          form={form}
          name="segmentAsPerPaidUpCapital"
          label="Segment As Per Paid Up Capital"
          options={segmentOptions}
          required
          onChange={(value) => onSelectOption('segmentAsPerPaidUpCapital', value)}
        />
        {form.watch('segmentAsPerPaidUpCapital') === '__add_new__' && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={() => onAddNewClick('segmentAsPerPaidUpCapital')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Segment
          </Button>
        )}
      </div>
    </>
  );
};

export default EstablishmentSection;
