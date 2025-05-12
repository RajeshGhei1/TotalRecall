
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { FieldFormValues } from '../CustomFieldForm';
import { availableForms } from '../CustomFieldForm';

interface FormApplicabilitySelectorProps {
  form: UseFormReturn<FieldFormValues>;
}

const FormApplicabilitySelector: React.FC<FormApplicabilitySelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="applicable_forms"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Apply to Forms</FormLabel>
            <FormDescription>
              Select which forms this field should appear in (leave empty to show in all forms)
            </FormDescription>
          </div>
          <div className="space-y-2">
            {availableForms.map((formOption) => (
              <FormField
                key={formOption.id}
                control={form.control}
                name="applicable_forms"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={formOption.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(formOption.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, formOption.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== formOption.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {formOption.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormApplicabilitySelector;
