
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
          
          let date: Date;
          if (field.value instanceof Date) {
            date = field.value;
          } else if (typeof field.value === 'string') {
            date = new Date(field.value);
          } else {
            return placeholder;
          }
          
          if (isValid(date)) {
            return format(date, "PPP");
          }
          
          return placeholder;
        };

        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (selectedDate) {
            field.onChange(selectedDate);
          } else {
            field.onChange(undefined);
          }
        };

        const getCurrentDate = (): Date | undefined => {
          if (!field.value) return undefined;
          
          if (field.value instanceof Date) {
            return isValid(field.value) ? field.value : undefined;
          }
          
          if (typeof field.value === 'string') {
            const date = new Date(field.value);
            return isValid(date) ? date : undefined;
          }
          
          return undefined;
        };
        
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
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal justify-start",
                      !field.value && "text-muted-foreground",
                      disabled && "bg-gray-50 opacity-70 cursor-not-allowed"
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {getDisplayValue()}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[10001] bg-white border shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={getCurrentDate()}
                  onSelect={handleDateSelect}
                  disabled={disabled}
                  initialFocus
                  className="p-3 pointer-events-auto"
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
