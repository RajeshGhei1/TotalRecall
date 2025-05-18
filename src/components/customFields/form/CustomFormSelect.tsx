
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

interface FormSelectProps {
  form: UseFormReturn<any>;
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
            defaultValue={field.value}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[10000] bg-white">
              {options.length === 0 ? (
                <SelectItem value="no-options-available">No options available</SelectItem>
              ) : (
                options.map((option) => (
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
