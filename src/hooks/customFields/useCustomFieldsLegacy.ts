
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomField } from './types';

interface UseCustomFieldsOptions {
  formContext?: string;
}

/**
 * Legacy hook for fetching and managing custom fields
 * @deprecated Use useCustomFieldsHook instead
 */
export function useCustomFields(
  tenantId?: string,
  options?: UseCustomFieldsOptions
) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const formContext = options?.formContext;

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase.from('custom_fields').select('*');
        
        if (tenantId) {
          if (tenantId === 'global') {
            query = query.is('tenant_id', null);
          } else {
            query = query.eq('tenant_id', tenantId);
          }
        }

        if (formContext) {
          // We need to check if the form context is in the applicable_forms array
          // or if the applicable_forms array is empty (which means it applies to all forms)
          query = query.or(`applicable_forms.cs.{${formContext}},applicable_forms.eq.[]`);
        }

        // Check if sort_order column exists
        const { data: columns, error: columnsError } = await supabase
          .from('custom_fields')
          .select('sort_order')
          .limit(1);

        // Only order by sort_order if the column exists
        if (columns && !columnsError) {
          query = query.order('sort_order', { ascending: true });
        }

        // Always add a secondary ordering by creation date
        query = query.order('created_at', { ascending: true });

        const { data, error } = await query;

        if (error) throw error;

        const typedFields = (data || []).map((field, index) => ({
          ...field,
          // Use index as the default sort_order if it doesn't exist in the database
          sort_order: typeof field.sort_order !== 'undefined' ? field.sort_order : index, 
          applicable_forms: field.applicable_forms as string[] | null
        })) as CustomField[];

        setCustomFields(typedFields);
      } catch (err) {
        console.error('Error fetching custom fields:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomFields();
  }, [tenantId, formContext]);

  // Function to get custom field values for a specific entity
  const getCustomFieldValues = async (entityType: string, entityId: string): Promise<any[]> => {
    try {
      if (!entityId) return [];

      const { data, error } = await supabase
        .from('custom_field_values')
        .select('*, custom_fields(*)')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching custom field values:', error);
      throw error;
    }
  };

  // Function to save custom field values
  const saveCustomFieldValues = async (
    entityType: string,
    entityId: string,
    values: Record<string, any>
  ): Promise<void> => {
    try {
      if (!entityId) return;

      // Get field IDs by field_key
      const fieldKeyToId: Record<string, string> = {};
      customFields.forEach(field => {
        fieldKeyToId[field.field_key] = field.id;
      });

      // Get existing values
      const { data: existingValues, error: fetchError } = await supabase
        .from('custom_field_values')
        .select('id, field_id')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);

      if (fetchError) throw fetchError;

      // Create a map of field_id to existing value id
      const fieldIdToValueId: Record<string, string> = {};
      existingValues?.forEach(val => {
        fieldIdToValueId[val.field_id] = val.id;
      });

      // Prepare upserts
      const upserts = [];
      for (const [fieldKey, value] of Object.entries(values)) {
        const fieldId = fieldKeyToId[fieldKey];
        if (!fieldId) continue;

        upserts.push({
          id: fieldIdToValueId[fieldId],
          field_id: fieldId,
          entity_type: entityType,
          entity_id: entityId,
          value
        });
      }

      if (upserts.length > 0) {
        const { error } = await supabase
          .from('custom_field_values')
          .upsert(upserts);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving custom field values:', error);
      throw error;
    }
  };

  // Adding updateFieldOrder to match the expected API
  const updateFieldOrder = async (
    fields: CustomField[],
    tenantId?: string,
    formContext?: string
  ): Promise<any> => {
    console.warn('Field order updates not implemented in legacy hook');
    return Promise.resolve(fields);
  };

  return {
    customFields,
    isLoading,
    error,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder
  };
}
