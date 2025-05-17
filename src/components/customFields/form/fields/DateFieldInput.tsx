
import React, { useState } from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { format, isValid, parse } from 'date-fns';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const DateFieldInput: React.FC<DateFieldInputProps> = ({ field, form, fieldName }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Helper function to safely format dates
  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, 'dd/MM/yyyy') : '';
  };

  // Helper function to safely parse date strings
  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    
    try {
      const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) return parsed;
      
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
      name={fieldName}
      render={({ field: formField }) => {
        // Ensure date value is properly handled
        const dateValue = formField.value ? parseDate(formField.value) : undefined;
        const formattedDate = formatDate(dateValue);
        
        return (
          <FormItem>
            <FormLabel>
              {field.name}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  placeholder="DD/MM/YYYY"
                  value={formattedDate}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!inputValue) {
                      formField.onChange(undefined);
                      return;
                    }
                    
                    // Don't attempt to parse until we have enough characters
                    if (inputValue.length >= 8) {
                      const parsedDate = parseDate(inputValue);
                      if (parsedDate) {
                        formField.onChange(parsedDate);
                      } else {
                        // Keep the text input value even if it's not a valid date yet
                        formField.onChange(inputValue);
                      }
                    } else {
                      // Keep the text input value
                      formField.onChange(inputValue);
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
                      formField.onChange(date);
                      setShowCalendar(false);
                    }}
                    initialFocus
                    className="pointer-events-auto" // Ensure the calendar is interactive
                  />
                </PopoverContent>
              </Popover>
            </div>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DateFieldInput;
