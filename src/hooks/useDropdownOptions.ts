
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
  
  console.log("useDropdownOptions hook initialized with categoryName:", categoryName);

  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['dropdown-categories'],
    queryFn: async () => {
      console.log("Fetching dropdown categories...");
      const { data, error } = await supabase
        .from('dropdown_option_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching dropdown categories:', error);
        throw error;
      }
      console.log("Dropdown categories fetched:", data);
      return data as DropdownCategory[];
    },
  });

  // Fetch options by category name
  const { data: options = [], isLoading: optionsLoading } = useQuery({
    queryKey: ['dropdown-options', categoryName],
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

  // Fetch options by category ID
  const getOptionsByCategoryId = async (categoryId: string) => {
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
      console.log(`Adding new option to category ${categoryId}: ${value} (${label})`);
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
      console.log('Successfully added option:', data[0]);
      return data[0] as DropdownOption;
    },
    onSuccess: (_, variables) => {
      // Invalidate the options query to refetch the options
      const category = categories.find(c => c.id === variables.categoryId);
      if (category) {
        console.log(`Invalidating query for category: ${category.name}`);
        queryClient.invalidateQueries({ queryKey: ['dropdown-options', category.name] });
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

  // Add a new category
  const addCategory = useMutation({
    mutationFn: async ({ 
      name, 
      description = null 
    }: { 
      name: string; 
      description?: string | null;
    }) => {
      console.log(`Adding new category: ${name}`);
      
      const { data, error } = await supabase
        .from('dropdown_option_categories')
        .insert([{
          name,
          description,
        }])
        .select();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }
      
      console.log('Successfully added category:', data[0]);
      return data[0] as DropdownCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-categories'] });
      toast({
        title: 'Category added',
        description: 'New dropdown category has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add category',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get category ID by name
  const getCategoryIdByName = async (name: string): Promise<string | null> => {
    console.log(`Looking up category ID for name: ${name}`);
    const category = categories.find(c => c.name === name);
    
    if (category) {
      console.log(`Found category ID in cache: ${category.id} for name: ${name}`);
      return category.id;
    }
    
    console.log(`Category not found in cache, fetching from database: ${name}`);
    // If not found in cache, fetch from database
    const { data, error } = await supabase
      .from('dropdown_option_categories')
      .select('id')
      .eq('name', name)
      .single();
    
    if (error || !data) {
      console.error(`Category not found in database: ${name}`, error);
      return null;
    }
    
    console.log(`Found category ID in database: ${data.id} for name: ${name}`);
    return data.id;
  };

  return {
    categories,
    options,
    isLoading: categoriesLoading || optionsLoading,
    isAddingOption,
    addOption,
    addCategory,
    getOptionsByCategoryId,
    getCategoryIdByName
  };
}
