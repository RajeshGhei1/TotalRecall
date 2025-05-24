
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
        // Ensure we have a valid Date object for display
        const getDisplayDate = () => {
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
        
        const displayDate = getDisplayDate();
        
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
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !displayDate && "text-muted-foreground",
                      disabled && "bg-gray-50 opacity-70 cursor-not-allowed"
                    )}
                    disabled={disabled}
                  >
                    {displayDate ? (
                      format(displayDate, "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1050]" align="start">
                <Calendar
                  mode="single"
                  selected={displayDate}
                  onSelect={(date) => field.onChange(date)}
                  disabled={disabled}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
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
