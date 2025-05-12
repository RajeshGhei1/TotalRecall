import React, { useEffect } from 'react';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useQuery } from '@tanstack/react-query';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface CustomFieldsFormProps {
  tenantId: string;
  entityType: string;
  entityId?: string;
  formContext?: string; // Add formContext as an optional prop
  form: any;
}

const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  tenantId,
  entityType,
  entityId,
  formContext,
  form,
}) => {
  const { customFields, isLoading, getCustomFieldValues } = useCustomFields(tenantId, {
    formContext // Pass formContext to the hook
  });

  // Fetch existing values if entityId is provided
  const { data: fieldValues = [] } = useQuery({
    queryKey: ['customFieldValues', entityType, entityId, formContext],
    queryFn: async () => {
      if (!entityId) return [];
      return await getCustomFieldValues(entityType, entityId);
    },
    enabled: !!entityId,
  });

  // Use useEffect to set form values when fieldValues are loaded
  useEffect(() => {
    if (fieldValues && fieldValues.length > 0) {
      const values = {};
      fieldValues.forEach((item) => {
        const fieldKey = item.custom_fields?.field_key;
        if (fieldKey) {
          values[`custom_${fieldKey}`] = item.value;
        }
      });
      form.reset({ ...form.getValues(), ...values });
    }
  }, [fieldValues, form]);

  if (isLoading) {
    return <Card><CardContent className="py-4">Loading custom fields...</CardContent></Card>;
  }

  if (customFields.length === 0) {
    return <Card><CardContent className="py-4">No custom fields defined</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customFields.map((field) => {
          const fieldName = `custom_${field.field_key}`;
          
          switch (field.field_type) {
            case 'text':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...formField} placeholder={`Enter ${field.name.toLowerCase()}`} />
                      </FormControl>
                      {field.description && <FormDescription>{field.description}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            
            case 'textarea':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...formField} placeholder={`Enter ${field.name.toLowerCase()}`} />
                      </FormControl>
                      {field.description && <FormDescription>{field.description}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            
            case 'number':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...formField} 
                          onChange={(e) => formField.onChange(parseFloat(e.target.value) || '')}
                          placeholder={`Enter ${field.name.toLowerCase()}`} 
                        />
                      </FormControl>
                      {field.description && <FormDescription>{field.description}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            
            case 'date':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...formField} 
                          value={formField.value ? (
                            typeof formField.value === 'string' 
                              ? formField.value 
                              : format(new Date(formField.value), 'yyyy-MM-dd')
                          ) : ''}
                        />
                      </FormControl>
                      {field.description && <FormDescription>{field.description}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            
            case 'dropdown':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      <Select
                        onValueChange={formField.onChange}
                        value={formField.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {field.options?.options?.map((option: { value: string; label: string }) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.description && <FormDescription>{field.description}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            
            case 'boolean':
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {field.name}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                        {field.description && <FormDescription>{field.description}</FormDescription>}
                      </div>
                    </FormItem>
                  )}
                />
              );
            
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default CustomFieldsForm;
