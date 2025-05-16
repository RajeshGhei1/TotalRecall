
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
        .order('sort_order');

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
      isDefault = false
    }: { 
      value: string; 
      label: string;
      isDefault?: boolean;
    }) => {
      if (!categoryId) {
        throw new Error('No category ID provided');
      }

      setIsAddingOption(true);
      
      console.log(`Adding new option to category ${categoryId}: ${value} (${label})`);
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

  return {
    options,
    isLoading,
    isAddingOption,
    addOption,
    refetchOptions
  };
}
