
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from '../schema';
import { FormInput, FormSelect } from '../fields';

interface EstablishmentSectionProps {
  form: UseFormReturn<TenantFormValues>;
  segmentOptions: { value: string; label: string }[];
  onSelectOption: (field: string, value: string) => void;
  onAddNewClick: (type: string) => void;
}

const EstablishmentSection: React.FC<EstablishmentSectionProps> = ({
  form,
  segmentOptions,
  onSelectOption,
  onAddNewClick
}) => {
  return (
    <>
      <FormInput
        form={form}
        name="paidupCapital"
        label="Paid-up Capital"
        placeholder="Enter paid-up capital amount"
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerPaidUpCapital"
        label="Segment as per Paid-up Capital"
        options={[
          ...segmentOptions,
          { value: '__add_new__', label: '[+ Add New]' }
        ]}
        onChange={(value) => {
          if (value === '__add_new__') {
            onAddNewClick('segmentAsPerPaidUpCapital');
          } else {
            onSelectOption('segmentAsPerPaidUpCapital', value);
          }
        }}
      />
    </>
  );
};

export default EstablishmentSection;
