import React, { useState } from 'react';
import { CustomField } from '@/hooks/customFields/types';
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
import { formatDate, parseFormDate } from '@/utils/dateUtils';

interface DateFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const DateFieldInput: React.FC<DateFieldInputProps> = ({ field, form, fieldName }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => {
        // Parse the current value to a Date object if possible
        const dateValue = formField.value ? 
          (formField.value instanceof Date ? formField.value : new Date(formField.value)) : 
          undefined;
        
        // Format the date as a string for display in the input
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
                    
                    // Only try to parse when we have enough characters
                    if (inputValue.length >= 8) {
                      try {
                        // Attempt to create a date from the input string
                        const dateObj = new Date(inputValue);
                        if (isNaN(dateObj.getTime())) {
                          // Keep the raw input if it's not a valid date yet
                          formField.onChange(inputValue);
                        } else {
                          formField.onChange(dateObj);
                        }
                      } catch (error) {
                        // Keep the raw text input if parsing fails
                        formField.onChange(inputValue);
                      }
                    } else {
                      // Keep the raw text input during typing
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
                    selected={dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined}
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
