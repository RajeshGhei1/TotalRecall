
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
import { format, isValid, parse } from 'date-fns';
import { cn } from '@/lib/utils';

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
        const getCurrentDate = () => {
          if (!formField.value) return undefined;
          
          if (formField.value instanceof Date) {
            return isValid(formField.value) ? formField.value : undefined;
          }
          
          if (typeof formField.value === 'string') {
            // Try parsing as ISO date first
            const isoDate = new Date(formField.value);
            if (isValid(isoDate)) return isoDate;
            
            // Try parsing as DD/MM/YYYY format
            const parsedDate = parse(formField.value, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) return parsedDate;
          }
          
          return undefined;
        };
        
        const currentDate = getCurrentDate();
        const displayValue = currentDate ? format(currentDate, 'dd/MM/yyyy') : '';
        
        const handleInputChange = (inputValue: string) => {
          if (!inputValue) {
            formField.onChange(undefined);
            return;
          }
          
          // Allow partial input during typing
          if (inputValue.length < 10) {
            formField.onChange(inputValue);
            return;
          }
          
          // Try to parse complete date input
          try {
            const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) {
              formField.onChange(parsedDate);
            } else {
              formField.onChange(inputValue); // Keep raw input if invalid
            }
          } catch (error) {
            formField.onChange(inputValue); // Keep raw input on parse error
          }
        };
        
        const handleCalendarSelect = (date: Date | undefined) => {
          formField.onChange(date);
          setShowCalendar(false);
        };
        
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
                  value={displayValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="rounded-r-none"
                />
              </FormControl>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={() => setShowCalendar(true)}
                    type="button"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[1050]" align="end">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
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
