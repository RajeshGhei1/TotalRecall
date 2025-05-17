
import React from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { format } from 'date-fns';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => (
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
                  >
                    {formField.value ? (
                      format(new Date(formField.value), "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                <Calendar
                  mode="single"
                  selected={formField.value ? new Date(formField.value) : undefined}
                  onSelect={formField.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateFieldInput;
