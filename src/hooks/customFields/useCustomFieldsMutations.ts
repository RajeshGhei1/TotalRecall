import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define types for custom field and option
export type CustomField = {
  id?: string;
  tenant_id: string;
  name: string;
  type: string;
  description?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  created_at?: string;
};

// Function to parse options from different formats
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
      if (optionsString && optionsString.length > 0) {
        optionsArray = optionsString
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

// Hook for creating a custom field
export const useCreateCustomField = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    async (newField: CustomField) => {
      const { data, error } = await supabase
        .from("custom_fields")
        .insert([newField])
        .select()
        .single();

      if (error) {
        console.error("Error creating custom field:", error);
        throw new Error(error.message);
      }
      return data;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: "Custom field created successfully.",
        });
        queryClient.invalidateQueries(["custom-fields", data.tenant_id]);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to create custom field: ${error.message}`,
          variant: "destructive",
        });
      },
    }
  );
};

// Hook for updating a custom field
export const useUpdateCustomField = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    async (updatedField: CustomField) => {
      const { data, error } = await supabase
        .from("custom_fields")
        .update(updatedField)
        .eq("id", updatedField.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating custom field:", error);
        throw new Error(error.message);
      }
      return data;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: "Custom field updated successfully.",
        });
        queryClient.invalidateQueries(["custom-fields", data.tenant_id]);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to update custom field: ${error.message}`,
          variant: "destructive",
        });
      },
    }
  );
};

// Hook for deleting a custom field
export const useDeleteCustomField = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    async (id: string) => {
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
    {
      onSuccess: (data: any, id: string) => {
        toast({
          title: "Success",
          description: "Custom field deleted successfully.",
        });
        queryClient.invalidateQueries(["custom-fields"]);
        router.refresh();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to delete custom field: ${error.message}`,
          variant: "destructive",
        });
      },
    }
  );
};
