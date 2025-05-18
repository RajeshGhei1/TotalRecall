
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define types for custom field and option
export type CustomField = {
  id?: string;
  tenant_id: string;
  name: string;
  type: string;
  field_key?: string;
  field_type?: string;
  description?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  applicable_forms?: string[];
  created_at?: string;
};

// Fix the type issues in the parseOptions function
export const parseOptions = (values: any) => {
  let optionsArray: Array<{ label: string; value: string }> = [];

  if (values.options) {
    if (Array.isArray(values.options)) {
      // Handle array of objects with label/value
      optionsArray = values.options.map((option: any) => ({
        label: option.label || '',
        value: option.value || option.label || ''
      }));
    } else if (typeof values.options === 'string') {
      // Type assertion to help TypeScript understand the type
      const optionsString = values.options as string;
      
      // Only proceed if it's a non-empty string
      if (optionsString && optionsString.trim().length > 0) {
        optionsArray = optionsString
          .trim()
          .split(',')
          .map((option: string) => option.trim())
          .filter((option: string) => option)
          .map((option: string) => ({
            label: option,
            value: option.toLowerCase().replace(/\s+/g, '_')
          }));
      }
    }
  }

  return optionsArray;
};

// Prepare field for database insertion
const prepareFieldForDb = (field: CustomField) => {
  // Map the form field type to database field_type
  return {
    tenant_id: field.tenant_id,
    name: field.name,
    field_key: field.field_key || field.name.toLowerCase().replace(/\s+/g, '_'),
    field_type: field.field_type || field.type,
    description: field.description,
    required: field.required || false,
    options: field.options ? JSON.stringify(field.options) : null,
    applicable_forms: field.applicable_forms || [],
  };
};

// Hook for creating a custom field
export const useCreateCustomField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newField: CustomField) => {
      const dbField = prepareFieldForDb(newField);
      
      const { data, error } = await supabase
        .from("custom_fields")
        .insert(dbField)
        .select()
        .single();

      if (error) {
        console.error("Error creating custom field:", error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Custom field created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['customFields', data.tenant_id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create custom field: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Hook for updating a custom field
export const useUpdateCustomField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedField: CustomField) => {
      const dbField = prepareFieldForDb(updatedField);
      
      const { data, error } = await supabase
        .from("custom_fields")
        .update(dbField)
        .eq("id", updatedField.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating custom field:", error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Custom field updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['customFields', data.tenant_id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update custom field: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a custom field
export const useDeleteCustomField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("custom_fields")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error deleting custom field:", error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        description: "Custom field deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete custom field: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Export a combined hook for custom fields mutations
export const useCustomFieldsMutations = (tenantId: string) => {
  return {
    addFieldMutation: useCreateCustomField(),
    deleteFieldMutation: useDeleteCustomField()
  };
};
