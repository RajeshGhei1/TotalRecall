
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { format, isValid } from 'date-fns';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
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
  // Helper function to safely format dates
  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, 'PPP') : null;
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => {
        // Ensure date value is properly handled
        const dateValue = formField.value ? new Date(formField.value) : undefined;
        const isValidDate = dateValue ? isValid(dateValue) : false;
        
        return (
          <FormItem>
            <FormLabel>
              {field.name}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left font-normal"
                      type="button" // Prevent form submission when clicking
                    >
                      {isValidDate ? (
                        formatDate(dateValue) || "Select date"
                      ) : (
                        <span className="text-muted-foreground">Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                  <Calendar
                    mode="single"
                    selected={isValidDate ? dateValue : undefined}
                    onSelect={(date) => {
                      // Only send the date or undefined to ensure consistent handling
                      formField.onChange(date ? date : undefined);
                      console.log("Custom field date selected:", date);
                    }}
                    initialFocus
                    className="pointer-events-auto" // Ensure the calendar is interactive
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DateFieldInput;
