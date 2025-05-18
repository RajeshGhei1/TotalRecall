
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DropdownOption } from './types';
import { useDropdownCategories } from './useDropdownCategories';

export function useDropdownOptionsMutations(categoryName?: string, options: DropdownOption[] = []) {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIdByName } = useDropdownCategories();
  
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
        category_id: option.category_id,
        value: option.value,
        label: option.label,
        is_default: option.is_default,
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
    isAddingOption,
    addOption,
    updateOptionOrder
  };
}
