
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
import { UseFormReturn } from 'react-hook-form';
import { CustomFormData } from '@/types/common';

interface DateFieldInputProps {
  field: CustomField;
  form: UseFormReturn<CustomFormData>;
  fieldName: string;
}

const DateFieldInput: React.FC<DateFieldInputProps> = ({ field, form, fieldName }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => {
        const parseCurrentValue = (): Date | undefined => {
          if (!formField.value) return undefined;
          
          if (formField.value instanceof Date && isValid(formField.value)) {
            return formField.value;
          }
          
          if (typeof formField.value === 'string') {
            const date = new Date(formField.value);
            if (isValid(date)) return date;
            
            const parsedDate = parse(formField.value, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) return parsedDate;
          }
          
          return undefined;
        };
        
        const currentDate = parseCurrentValue();
        const displayValue = currentDate ? format(currentDate, 'dd/MM/yyyy') : '';
        
        const handleInputChange = (value: string) => {
          if (!value) {
            formField.onChange(undefined);
            return;
          }
          
          if (value.length === 10) {
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) {
              formField.onChange(parsedDate);
              return;
            }
          }
          
          formField.onChange(value);
        };
        
        const handleCalendarSelect = (date: Date | undefined) => {
          formField.onChange(date);
          setIsCalendarOpen(false);
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
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    type="button"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
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
