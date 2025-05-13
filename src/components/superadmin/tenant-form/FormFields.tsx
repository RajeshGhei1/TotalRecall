
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface FormInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

interface FormTextareaProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

interface FormSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

interface FormDatePickerProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  form,
  name,
  label,
  placeholder,
  required,
  type = 'text',
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={type}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormTextarea: React.FC<FormTextareaProps> = ({
  form,
  name,
  label,
  placeholder,
  required,
  rows = 4,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormSelect: React.FC<FormSelectProps> = ({
  form,
  name,
  label,
  options,
  placeholder,
  required,
  onChange,
}) => {
  console.log(`Rendering FormSelect for ${name} with ${options.length} options`);
  
  const handleValueChange = (value: string) => {
    console.log(`Select ${name} value changed to:`, value);
    if (onChange) {
      console.log(`Running onChange handler for ${name}`);
      onChange(value);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              handleValueChange(value);
            }} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[10000]">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  form,
  name,
  label,
  placeholder,
  required,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className="w-full pl-3 text-left font-normal"
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span className="text-muted-foreground">
                      {placeholder || "Pick a date"}
                    </span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
