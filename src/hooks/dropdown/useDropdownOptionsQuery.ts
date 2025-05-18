
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DropdownOption } from './types';

export function useDropdownOptionsQuery(categoryName?: string, categoryId?: string) {
  console.log("useDropdownOptionsQuery initialized with:", { categoryName, categoryId });

  // Query by category name
  const queryByName = useQuery({
    queryKey: ['dropdown-options-by-name', categoryName],
    queryFn: async () => {
      if (!categoryName) {
        console.log("No category name provided for fetching options");
        return [];
      }
      
      console.log(`Fetching options for category name: ${categoryName}`);
      const { data: categoryData } = await supabase
        .from('dropdown_option_categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (!categoryData) {
        console.log(`No category found with name: ${categoryName}`);
        return [];
      }

      console.log(`Found category ID: ${categoryData.id} for name: ${categoryName}`);
      const { data, error } = await supabase
        .from('dropdown_options')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error(`Error fetching options for ${categoryName}:`, error);
        throw error;
      }
      
      console.log(`Options fetched for ${categoryName}:`, data);
      return data as DropdownOption[];
    },
    enabled: !!categoryName,
  });

  // Query by category ID
  const queryById = useQuery({
    queryKey: ['dropdown-options-by-id', categoryId],
    queryFn: async () => {
      if (!categoryId) {
        console.log("No category ID provided for fetching options");
        return [];
      }
      
      console.log(`Fetching options for category ID: ${categoryId}`);
      const { data, error } = await supabase
        .from('dropdown_options')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error(`Error fetching options for category ID ${categoryId}:`, error);
        throw error;
      }
      
      console.log(`Options fetched for category ID ${categoryId}:`, data);
      return data as DropdownOption[];
    },
    enabled: !!categoryId,
  });

  // Return appropriate query result based on provided parameters
  if (categoryName) {
    return {
      options: queryByName.data || [],
      isLoading: queryByName.isLoading,
      refetchOptions: queryByName.refetch
    };
  }
  
  if (categoryId) {
    return {
      options: queryById.data || [],
      isLoading: queryById.isLoading,
      refetchOptions: queryById.refetch
    };
  }
  
  // Default return if neither categoryName nor categoryId is provided
  return {
    options: [],
    isLoading: false,
    refetchOptions: () => Promise.resolve()
  };
}
