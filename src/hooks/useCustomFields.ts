
// This file is kept for backward compatibility
// It re-exports the useCustomFields hook from the new location
import { useCustomFieldsHook } from './customFields/useCustomFieldsHook';

// Re-export the new hook with the original name for backward compatibility
export const useCustomFields = useCustomFieldsHook;
