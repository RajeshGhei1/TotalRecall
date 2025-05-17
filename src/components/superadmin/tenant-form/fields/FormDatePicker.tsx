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
import { format, isValid, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

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
  
  // Helper function to safely format dates
  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return '';
    
    // Handle both Date objects and string dates
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, 'dd/MM/yyyy') : '';
  };

  // Helper function to safely parse date strings
  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    
    try {
      // Try to parse input in format dd/MM/yyyy
      const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) return parsed;
      
      // If that fails, try standard ISO parsing
      const dateObj = new Date(dateStr);
      return isValid(dateObj) ? dateObj : undefined;
    } catch (error) {
      console.error("Error parsing date:", error);
      return undefined;
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Ensure field.value is properly handled
        const dateValue = field.value ? parseDate(field.value) : undefined;
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
                    
                    // Don't attempt to parse until we have enough characters
                    if (inputValue.length >= 8) {
                      const parsedDate = parseDate(inputValue);
                      if (parsedDate) {
                        field.onChange(parsedDate);
                      } else {
                        // Keep the text input value even if it's not a valid date yet
                        field.onChange(inputValue);
                      }
                    } else {
                      // Keep the text input value even if it's not a valid date yet
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
                    selected={dateValue}
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
