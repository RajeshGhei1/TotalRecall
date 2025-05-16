
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormSelect } from '../FormFields';
import { TenantFormValues } from '../schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TurnoverSectionProps {
  form: UseFormReturn<TenantFormValues>;
  turnoverOptions: { value: string; label: string }[];
  yearOptions: { value: string; label: string }[];
  onSelectOption: (name: string, value: string) => void;
  onAddNewClick: (name: string) => void;
}

const TurnoverSection: React.FC<TurnoverSectionProps> = ({
  form,
  turnoverOptions,
  yearOptions,
  onSelectOption,
  onAddNewClick
}) => {
  return (
    <>
      <FormInput
        form={form}
        name="turnOver"
        label="Turn Over"
        required
      />
      
      <div className="space-y-1">
        <FormSelect
          form={form}
          name="segmentAsPerTurnover"
          label="Segment As Per Turnover"
          options={turnoverOptions}
          required
          onChange={(value) => onSelectOption('segmentAsPerTurnover', value)}
        />
        {form.watch('segmentAsPerTurnover') === '__add_new__' && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={() => onAddNewClick('segmentAsPerTurnover')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Turnover Range
          </Button>
        )}
      </div>
      
      <div className="space-y-1">
        <FormSelect
          form={form}
          name="turnoverYear"
          label="Turnover Year"
          options={yearOptions}
          required
          onChange={(value) => onSelectOption('turnoverYear', value)}
        />
        {form.watch('turnoverYear') === '__add_new__' && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={() => onAddNewClick('turnoverYear')}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Year
          </Button>
        )}
      </div>
    </>
  );
};

export default TurnoverSection;
