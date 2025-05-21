
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomField } from "./types";

export interface UseCustomFieldsListParams {
  entityType?: string;
}

export const useCustomFieldsList = (params?: UseCustomFieldsListParams | string) => {
  // Handle both string and object parameters for backward compatibility
  const entityType = typeof params === 'string' 
    ? params 
    : params?.entityType;
  
  const { data: customFields, isLoading, error, refetch } = useQuery({
    queryKey: ['custom-fields', entityType],
    queryFn: async () => {
      let query = supabase
        .from('custom_fields')
        .select('*')
        .order('sort_order', { ascending: true });

      if (entityType) {
        // If entityType is provided, filter by it
        // Look for fields where the entityType is in the applicable_forms array
        query = query.contains('applicable_forms', [entityType]);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as CustomField[];
    },
  });

  return {
    customFields: customFields || [],
    isLoading,
    error,
    refetch,
  };
};
