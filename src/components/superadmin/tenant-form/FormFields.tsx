
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TenantFormValues } from './schema';

interface FormInputProps {
  form: UseFormReturn<TenantFormValues>;
  name: keyof TenantFormValues;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const FormInput = ({ 
  form,
  name, 
  label, 
  placeholder,
  type = 'text',
  required = false
}: FormInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <FormControl>
          <Input 
            placeholder={placeholder || label} 
            type={type} 
            {...field} 
            value={typeof field.value === 'string' ? field.value : ''}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormSelectProps extends FormInputProps {
  options: { value: string; label: string }[] | string[];
}

export const FormSelect = ({ 
  form,
  name, 
  label, 
  options,
  required = false
}: FormSelectProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <Select onValueChange={field.onChange} value={typeof field.value === 'string' ? field.value : ''}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="[Choose One]" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => {
              const value = typeof option === 'string' ? option.toLowerCase() : option.value;
              const label = typeof option === 'string' ? option : option.label;
              
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const FormTextarea = ({ 
  form,
  name, 
  label, 
  placeholder,
  required = false
}: FormInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <FormControl>
          <Textarea 
            placeholder={placeholder || label}
            className="min-h-[100px]" 
            {...field}
            value={typeof field.value === 'string' ? field.value : ''}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const FormDatePicker = ({
  form,
  name,
  label,
  required = false
}: FormInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel className="flex items-center">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span>Select Date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={field.onChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);
