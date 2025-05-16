
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DropdownOption } from './types';
import { useDropdownCategories } from './useDropdownCategories';

export function useDropdownOptionsByCategoryName(categoryName?: string) {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIdByName } = useDropdownCategories();
  
  console.log("useDropdownOptionsByCategoryName hook initialized with categoryName:", categoryName);

  // Fetch options by category name
  const { 
    data: options = [], 
    isLoading,
    refetch: refetchOptions 
  } = useQuery({
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
        .order('sort_order');

      if (error) {
        console.error(`Error fetching options for ${categoryName}:`, error);
        throw error;
      }
      
      console.log(`Options fetched for ${categoryName}:`, data);
      return data as DropdownOption[];
    },
    enabled: !!categoryName,
  });

  // Add a new option
  const addOption = useMutation({
    mutationFn: async ({ 
      value, 
      label,
      isDefault = false,
      categoryName: optionCategoryName = categoryName
    }: { 
      value: string; 
      label: string;
      isDefault?: boolean;
      categoryName?: string;
    }) => {
      setIsAddingOption(true);
      
      const finalCategoryName = optionCategoryName || categoryName;
      
      if (!finalCategoryName) {
        throw new Error('No category name provided');
      }
      
      // Get category ID or create it if it doesn't exist
      const categoryId = await getCategoryIdByName(finalCategoryName, true);
      
      if (!categoryId) {
        throw new Error(`Failed to get or create category with name: ${finalCategoryName}`);
      }

      console.log(`Adding new option to category ${finalCategoryName} (${categoryId}): ${value} (${label})`);
      const { data, error } = await supabase
        .from('dropdown_options')
        .insert([{
          category_id: categoryId,
          value,
          label: label || value,
          is_default: isDefault,
        }])
        .select();

      if (error) {
        console.error('Error adding option:', error);
        throw error;
      }
      console.log('Successfully added option:', data[0]);
      return data[0] as DropdownOption;
    },
    onSuccess: (_, variables) => {
      const targetCategoryName = variables.categoryName || categoryName;
      
      // Invalidate the options query to refetch the options
      if (targetCategoryName) {
        console.log(`Invalidating query for category name: ${targetCategoryName}`);
        queryClient.invalidateQueries({ queryKey: ['dropdown-options-by-name', targetCategoryName] });
      }
      
      toast({
        title: 'Option added',
        description: `"${variables.label || variables.value}" has been added successfully.`,
      });
      setIsAddingOption(false);
    },
    onError: (error) => {
      console.error('Error in addOption mutation:', error);
      toast({
        title: 'Failed to add option',
        description: error.message,
        variant: 'destructive',
      });
      setIsAddingOption(false);
    },
  });

  return {
    options,
    isLoading,
    isAddingOption,
    addOption,
    refetchOptions
  };
}
