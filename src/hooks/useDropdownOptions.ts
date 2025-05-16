
import { supabase } from '@/integrations/supabase/client';
import { useDropdownOptions as useDropdownOptionsImpl } from './dropdown/useDropdownOptions';
import { 
  DropdownCategory, 
  DropdownOption 
} from './dropdown/types';

export { 
  DropdownCategory, 
  DropdownOption,
  useDropdownCategories,
  useDropdownOptionsByCategoryId,
  useDropdownOptionsByCategoryName
} from './dropdown/useDropdownOptions';

// Export the main hook for backward compatibility
export function useDropdownOptions(categoryName?: string) {
  return useDropdownOptionsImpl(categoryName);
}
