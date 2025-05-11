
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DropdownCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface DropdownOption {
  id: string;
  category_id: string;
  value: string;
  label: string;
  is_default: boolean | null;
  sort_order: number | null;
}

export function useDropdownOptions(categoryName?: string) {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['dropdown-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dropdown_option_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching dropdown categories:', error);
        throw error;
      }
      return data as DropdownCategory[];
    },
  });

  // Fetch options by category name
  const { data: options = [], isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdown-options', categoryName],
    queryFn: async () => {
      if (!categoryName) return [];

      const { data: categoryData } = await supabase
        .from('dropdown_option_categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (!categoryData) return [];

      const { data, error } = await supabase
        .from('dropdown_options')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('sort_order');

      if (error) {
        console.error(`Error fetching options for ${categoryName}:`, error);
        throw error;
      }
      return data as DropdownOption[];
    },
    enabled: !!categoryName,
  });

  // Fetch options by category ID
  const getOptionsByCategoryId = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('dropdown_options')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order');

    if (error) {
      console.error(`Error fetching options for category ID ${categoryId}:`, error);
      throw error;
    }
    return data as DropdownOption[];
  };

  // Add a new option
  const addOption = useMutation({
    mutationFn: async ({ 
      categoryId, 
      value, 
      label,
      isDefault = false,
    }: { 
      categoryId: string; 
      value: string; 
      label: string;
      isDefault?: boolean;
    }) => {
      setIsAddingOption(true);
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
      return data[0] as DropdownOption;
    },
    onSuccess: (_, variables) => {
      // Invalidate the options query to refetch the options
      const category = categories.find(c => c.id === variables.categoryId);
      if (category) {
        queryClient.invalidateQueries({ queryKey: ['dropdown-options', category.name] });
      }
      toast({
        title: 'Option added',
        description: `"${variables.label || variables.value}" has been added successfully.`,
      });
      setIsAddingOption(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to add option',
        description: error.message,
        variant: 'destructive',
      });
      setIsAddingOption(false);
    },
  });

  // Get category ID by name
  const getCategoryIdByName = async (name: string): Promise<string | null> => {
    const category = categories.find(c => c.name === name);
    
    if (category) return category.id;
    
    // If not found in cache, fetch from database
    const { data, error } = await supabase
      .from('dropdown_option_categories')
      .select('id')
      .eq('name', name)
      .single();
    
    if (error || !data) {
      console.error(`Category not found: ${name}`, error);
      return null;
    }
    
    return data.id;
  };

  return {
    categories,
    options,
    isLoading: categoriesLoading || optionsLoading,
    isAddingOption,
    addOption,
    getOptionsByCategoryId,
    getCategoryIdByName
  };
}
