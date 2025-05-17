import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { formatDate, parseFormDate } from '@/utils/dateUtils';

interface FormDatePickerProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  required,
  minDate,
  maxDate,
  disabled = false,
  className,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Parse the current value to a Date object if possible
        const dateValue = field.value ? 
          (field.value instanceof Date ? field.value : new Date(field.value)) : 
          undefined;
        
        // Format the date as a string for display in the input
        const formattedDate = formatDate(dateValue);

        return (
          <FormItem className={`flex flex-col ${className}`}>
            <FormLabel>
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  placeholder={placeholder || "DD/MM/YYYY"}
                  value={formattedDate}
                  disabled={disabled}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!inputValue) {
                      field.onChange(undefined);
                      return;
                    }
                    
                    // Only try to parse when we have enough characters
                    if (inputValue.length >= 8) {
                      try {
                        // Attempt to create a date from the input string
                        const dateObj = new Date(inputValue);
                        if (isNaN(dateObj.getTime())) {
                          // Keep the raw input if it's not a valid date yet
                          field.onChange(inputValue);
                        } else {
                          field.onChange(dateObj);
                        }
                      } catch (error) {
                        // Keep the raw text input if parsing fails
                        field.onChange(inputValue);
                      }
                    } else {
                      // Keep the raw text input during typing
                      field.onChange(inputValue);
                    }
                  }}
                  className="rounded-r-none"
                />
              </FormControl>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={() => setShowCalendar(true)}
                    disabled={disabled}
                    type="button" // Prevent form submission
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[1000]" align="end">
                  <Calendar
                    mode="single"
                    selected={dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined}
                    onSelect={(date) => {
                      field.onChange(date);
                      setShowCalendar(false);
                    }}
                    disabled={(date) => {
                      if (disabled) return true;
                      if (minDate && date < minDate) return true;
                      if (maxDate && date > maxDate) return true;
                      return false;
                    }}
                    initialFocus
                    className="pointer-events-auto" // Ensure the calendar is interactive
                  />
                </PopoverContent>
              </Popover>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
