
import { useDropdownCategories } from './useDropdownCategories';
import { useDropdownOptionsMutations } from './useDropdownOptionsMutations';
import { useDropdownOptionsQuery } from './useDropdownOptionsQuery';
import { DropdownOption } from './types';

export function useDropdownOptionsByCategoryName(categoryName?: string) {
  console.log("useDropdownOptionsByCategoryName hook initialized with categoryName:", categoryName);

  // Get the categories hook
  const { getCategoryIdByName } = useDropdownCategories();
  
  // Get options data using our query hook
  const { 
    options = [], 
    isLoading, 
    refetchOptions 
  } = useDropdownOptionsQuery(categoryName);
  
  // Get mutations using our mutations hook
  const {
    isAddingOption,
    addOption,
    updateOptionOrder
  } = useDropdownOptionsMutations(categoryName, options);

  return {
    options,
    isLoading,
    isAddingOption,
    addOption,
    updateOptionOrder,
    refetchOptions,
    getCategoryIdByName
  };
}
