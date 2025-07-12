
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomFormData } from '@/types/common';

interface FormSelectProps {
  form: UseFormReturn<CustomFormData>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const CustomFormSelect: React.FC<FormSelectProps> = ({
  form,
  name,
  label,
  options,
  placeholder,
  required,
  onChange,
}) => {
  console.log(`Rendering CustomFormSelect for ${name} with ${options.length} options`);
  
  const handleValueChange = (value: string) => {
    console.log(`CustomFormSelect ${name} value changed to:`, value);
    if (onChange) {
      console.log(`Running onChange handler for ${name}`);
      onChange(value);
    }
  };

  // Filter out any options with empty string values and ensure all options have valid values
  const validOptions = options.filter(option => 
    option && 
    typeof option.value === 'string' && 
    option.value.trim() !== '' &&
    typeof option.label === 'string'
  ).map(option => ({
    value: option.value || `option-${Math.random().toString(36).substr(2, 9)}`,
    label: option.label || option.value || 'Unknown Option'
  }));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        console.log(`Field value for ${name}:`, field.value);
        return (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              handleValueChange(value);
            }} 
            defaultValue={String(field.value || '')}
            value={String(field.value || '')}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[10000] bg-white">
              {validOptions.length === 0 ? (
                <SelectItem value="no-options-available">No options available</SelectItem>
              ) : (
                validOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}}
    />
  );
};

export default CustomFormSelect;
