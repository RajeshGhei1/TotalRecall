
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DropdownOption } from './types';

export function useDropdownOptionsByCategoryId(categoryId?: string) {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const queryClient = useQueryClient();

  // Fetch options by category ID
  const { 
    data: options = [], 
    isLoading,
    refetch: refetchOptions 
  } = useQuery({
    queryKey: ['dropdown-options-by-id', categoryId],
    queryFn: async () => {
      if (!categoryId) {
        console.log("No category ID provided for fetching options");
        return [];
      }
      
      console.log(`Fetching options by category ID: ${categoryId}`);
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

  // Add a new option
  const addOption = useMutation({
    mutationFn: async ({ 
      value, 
      label,
      isDefault = false,
      sortOrder
    }: { 
      value: string; 
      label: string;
      isDefault?: boolean;
      sortOrder?: number;
    }) => {
      if (!categoryId) {
        throw new Error('No category ID provided');
      }

      setIsAddingOption(true);
      
      // If no sort order is provided, place at the end
      const finalSortOrder = sortOrder !== undefined 
        ? sortOrder 
        : options.length > 0 
          ? Math.max(...options.map(o => o.sort_order || 0)) + 1 
          : 0;
      
      console.log(`Adding new option to category ${categoryId}: ${value} (${label}) with sort order ${finalSortOrder}`);
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
      queryClient.invalidateQueries({ queryKey: ['dropdown-options-by-id', categoryId] });
      
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
      if (!categoryId) {
        throw new Error('No category ID provided');
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
      queryClient.invalidateQueries({ queryKey: ['dropdown-options-by-id', categoryId] });
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
