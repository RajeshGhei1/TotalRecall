
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FieldFormValues } from '../CustomFieldForm';

interface BasicFieldInfoProps {
  form: UseFormReturn<FieldFormValues>;
}

const BasicFieldInfo: React.FC<BasicFieldInfoProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Certification" />
            </FormControl>
            <FormDescription>
              Name shown to users in forms and reports
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="field_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field Key</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., certification" />
            </FormControl>
            <FormDescription>
              Unique identifier used in database and code (letters, numbers, underscores only)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Description of what this field is for"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicFieldInfo;
