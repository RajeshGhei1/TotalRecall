
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Trash } from 'lucide-react';

interface CustomField {
  id: string;
  tenant_id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  options?: Record<string, any>;
  description?: string;
}

interface CustomFieldsManagerProps {
  tenantId: string;
}

const fieldSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  field_key: z
    .string()
    .min(2, { message: 'Field key must be at least 2 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Field key can only contain letters, numbers and underscores' }),
  field_type: z.enum(['text', 'number', 'date', 'dropdown', 'boolean', 'textarea']),
  required: z.boolean().default(false),
  description: z.string().optional(),
  options: z.string().optional(),
});

const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({ tenantId }) => {
  const [isAddingField, setIsAddingField] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      field_key: '',
      field_type: 'text',
      required: false,
      description: '',
      options: '',
    },
  });

  // Fetch custom fields for this tenant
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['customFields', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');

      if (error) throw error;
      return data as CustomField[];
    },
  });

  // Add custom field mutation
  const addFieldMutation = useMutation({
    mutationFn: async (values: z.infer<typeof fieldSchema>) => {
      // Parse options if field type is dropdown
      let options = null;
      if (values.field_type === 'dropdown' && values.options) {
        try {
          // Convert comma-separated values to array of objects
          const optionsArray = values.options
            .split(',')
            .map(option => option.trim())
            .filter(option => option)
            .map(option => ({ label: option, value: option }));
          options = { options: optionsArray };
        } catch (err) {
          throw new Error('Invalid options format');
        }
      }

      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          tenant_id: tenantId,
          name: values.name,
          field_key: values.field_key,
          field_type: values.field_type,
          required: values.required,
          description: values.description,
          options: options,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Custom field created',
        description: 'The custom field has been created successfully',
      });
      form.reset();
      setIsAddingField(false);
      queryClient.invalidateQueries({ queryKey: ['customFields', tenantId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create custom field: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete custom field mutation
  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Custom field deleted',
        description: 'The custom field has been deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['customFields', tenantId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete custom field: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof fieldSchema>) => {
    addFieldMutation.mutate(values);
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this custom field? All data associated with it will be lost.')) {
      deleteFieldMutation.mutate(fieldId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Fields</h3>
        <Button
          onClick={() => setIsAddingField(true)}
          disabled={isAddingField}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Field
        </Button>
      </div>

      {isAddingField && (
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Field</CardTitle>
            <CardDescription>
              Define a new custom field for this tenant
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                  name="field_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="boolean">Yes/No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('field_type') === 'dropdown' && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Option 1, Option 2, Option 3" />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of options
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Required Field</FormLabel>
                        <FormDescription>
                          Make this field mandatory in forms
                        </FormDescription>
                      </div>
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingField(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addFieldMutation.isPending}
                >
                  {addFieldMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Custom Field
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : customFields.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No custom fields defined yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {customFields.map((field) => (
            <div
              key={field.id}
              className="flex justify-between items-center p-4 border rounded-md"
            >
              <div>
                <div className="font-medium">{field.name}</div>
                <div className="text-sm text-muted-foreground">
                  {field.field_key} ({field.field_type})
                  {field.required && <span className="ml-2 text-destructive">*Required</span>}
                </div>
                {field.description && (
                  <div className="text-sm mt-1">{field.description}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteField(field.id)}
                disabled={deleteFieldMutation.isPending}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFieldsManager;
