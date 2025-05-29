
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
import { Loader2, Building2, Globe } from 'lucide-react';

interface FormOption {
  id: string;
  label: string;
  description?: string;
  visibility_scope?: string;
  tenant_id?: string;
}

interface FormApplicabilitySelectorProps {
  form: UseFormReturn<FieldFormValues>;
  availableForms: FormOption[];
  isLoadingForms?: boolean;
}

const FormApplicabilitySelector: React.FC<FormApplicabilitySelectorProps> = ({ 
  form, 
  availableForms,
  isLoadingForms = false 
}) => {
  const getFormIcon = (formOption: FormOption) => {
    if (formOption.visibility_scope === 'tenant_specific') {
      return <Building2 className="h-3 w-3 text-blue-600" />;
    }
    if (formOption.visibility_scope === 'global') {
      return <Globe className="h-3 w-3 text-green-600" />;
    }
    return null;
  };

  const getFormDescription = (formOption: FormOption) => {
    if (formOption.description) {
      return formOption.description;
    }
    if (formOption.visibility_scope === 'tenant_specific') {
      return 'Tenant-specific form';
    }
    if (formOption.visibility_scope === 'global') {
      return 'Global form';
    }
    return 'Core application form';
  };

  return (
    <FormField
      control={form.control}
      name="forms"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Apply to Forms</FormLabel>
            <FormDescription>
              Select which forms this field should appear in (leave empty to show in all forms)
            </FormDescription>
          </div>
          
          {isLoadingForms ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading available forms...</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
              {availableForms.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  No forms available
                </div>
              ) : (
                availableForms.map((formOption) => (
                  <FormField
                    key={formOption.id}
                    control={form.control}
                    name="forms"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={formOption.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded hover:bg-gray-50"
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
                          <div className="flex-1">
                            <FormLabel className="font-normal flex items-center gap-2">
                              {getFormIcon(formOption)}
                              {formOption.label}
                            </FormLabel>
                            {getFormDescription(formOption) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {getFormDescription(formOption)}
                              </p>
                            )}
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))
              )}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormApplicabilitySelector;
