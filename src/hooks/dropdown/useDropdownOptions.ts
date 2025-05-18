
import { supabase } from '@/integrations/supabase/client';
import { useDropdownCategories } from './useDropdownCategories';
import { useDropdownOptionsByCategoryName } from './useDropdownOptionsByCategoryName';
import { DropdownCategory, DropdownOption } from './types';
import { useDropdownOptionsByCategoryId } from './useDropdownOptionsByCategoryId';

export function useDropdownOptions(categoryName?: string) {
  console.log("useDropdownOptions hook initialized with categoryName:", categoryName);

  // Use our smaller hooks to get the data we need
  const {
    categories,
    isLoading: categoriesLoading,
    addCategory,
    getCategoryIdByName,
    refetchCategories
  } = useDropdownCategories();

  const {
    options,
    isLoading: optionsLoading,
    isAddingOption,
    addOption,
    updateOptionOrder,
    refetchOptions
  } = useDropdownOptionsByCategoryName(categoryName);

  // Helper function to get options by category ID
  const getOptionsByCategoryId = async (categoryId: string) => {
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
  };

  return {
    categories,
    options,
    isLoading: categoriesLoading || optionsLoading,
    isAddingOption,
    addOption,
    addCategory,
    getOptionsByCategoryId,
    getCategoryIdByName,
    updateOptionOrder,
    refetchOptions,
    refetchCategories
  };
}

// Re-export types and hooks for convenience
export type { DropdownCategory, DropdownOption } from './types';
export { useDropdownCategories } from './useDropdownCategories';
export { useDropdownOptionsByCategoryId } from './useDropdownOptionsByCategoryId';
export { useDropdownOptionsByCategoryName } from './useDropdownOptionsByCategoryName';
