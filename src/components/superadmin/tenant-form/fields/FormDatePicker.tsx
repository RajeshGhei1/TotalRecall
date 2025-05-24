
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormDatePickerProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  form,
  name,
  label,
  placeholder = "Select a date",
  required,
  disabled = false,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const getDisplayValue = () => {
          if (!field.value) return placeholder;
          
          const date = field.value instanceof Date ? field.value : new Date(field.value);
          
          if (isValid(date)) {
            return format(date, "PPP");
          }
          
          return placeholder;
        };

        const handleDateSelect = (date: Date | undefined) => {
          field.onChange(date);
        };

        const currentDate = field.value instanceof Date ? field.value : 
                           (field.value ? new Date(field.value) : undefined);
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                      disabled && "bg-gray-50 opacity-70 cursor-not-allowed"
                    )}
                    disabled={disabled}
                  >
                    {getDisplayValue()}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={isValid(currentDate) ? currentDate : undefined}
                  onSelect={handleDateSelect}
                  disabled={disabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormDatePicker;
