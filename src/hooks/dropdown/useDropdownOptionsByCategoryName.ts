
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

  // Add a new option
  const addOption = useMutation({
    mutationFn: async ({ 
      value, 
      label,
      isDefault = false,
      categoryName: optionCategoryName = categoryName,
      sortOrder
    }: { 
      value: string; 
      label: string;
      isDefault?: boolean;
      categoryName?: string;
      sortOrder?: number;
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
      
      // Calculate sort order if not provided
      const finalSortOrder = sortOrder !== undefined 
        ? sortOrder 
        : options.length > 0 
          ? Math.max(...options.map(o => o.sort_order || 0)) + 1 
          : 0;

      console.log(`Adding new option to category ${finalCategoryName} (${categoryId}): ${value} (${label}) with sort_order ${finalSortOrder}`);
      const { data, error } = await supabase
        .from('dropdown_options')
        .insert([{
          category_id: categoryId,
          value,
          label: label || value,
          is_default: isDefault,
          sort_order: finalSortOrder
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

  // Update option order
  const updateOptionOrder = useMutation({
    mutationFn: async (updatedOptions: DropdownOption[]) => {
      if (!categoryName) {
        throw new Error('No category name provided');
      }
      
      // Find the category ID from the options
      let categoryId = null;
      if (updatedOptions.length > 0 && updatedOptions[0].category_id) {
        categoryId = updatedOptions[0].category_id;
      } else {
        // Get category ID from the name
        categoryId = await getCategoryIdByName(categoryName);
      }
      
      if (!categoryId) {
        throw new Error(`Couldn't find category ID for name: ${categoryName}`);
      }
      
      // Create update payloads for each option with its new order
      const updates = updatedOptions.map((option, index) => ({
        id: option.id,
        sort_order: index
      }));
      
      // Update all options in one go
      const { error } = await supabase
        .from('dropdown_options')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) {
        console.error('Error updating option orders:', error);
        throw error;
      }
      
      return updatedOptions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-options-by-name', categoryName] });
      toast({
        title: 'Order updated',
        description: 'Options order has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update order',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    options,
    isLoading,
    isAddingOption,
    addOption,
    updateOptionOrder,
    refetchOptions
  };
}
