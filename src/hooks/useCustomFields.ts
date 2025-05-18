
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomField } from './customFields/types';

interface CustomFieldsOptions {
  formContext?: string;
}

interface CustomFieldValue {
  id: string;
  entity_id: string;
  entity_type: string;
  field_id: string;
  value: any;
  custom_fields?: CustomField;
}

export function useCustomFields(tenantId?: string, options?: CustomFieldsOptions) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const formContext = options?.formContext;

  // Fetch custom fields
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        setIsLoading(true);
        
        // Define the query base
        let query = supabase
          .from('custom_fields')
          .select('*');
        
        // Add tenant filter if provided
        if (tenantId) {
          if (tenantId === 'global') {
            // For global, get fields where tenant_id is null
            query = query.is('tenant_id', null);
          } else {
            // For specific tenant
            query = query.eq('tenant_id', tenantId);
          }
        }
        
        // Add form context filter if provided
        if (formContext) {
          // We need to check if 'formContext' is in the applicable_forms array or if applicable_forms is empty
          query = query.or(`applicable_forms.cs.{${formContext}},applicable_forms.eq.[]`);
        }

        // Order by sort_order if available, then by creation date
        query = query.order('sort_order', { ascending: true, nullsLast: true })
                     .order('created_at', { ascending: true });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setCustomFields(data || []);
      } catch (err) {
        console.error('Error fetching custom fields:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomFields();
  }, [tenantId, formContext]);

  // Get values for an entity
  const getCustomFieldValues = async (entityType: string, entityId: string): Promise<CustomFieldValue[]> => {
    try {
      const { data, error } = await supabase
        .from('custom_field_values')
        .select(`
          *,
          custom_fields:field_id (*)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching custom field values:', err);
      throw err;
    }
  };

  // Save values for an entity
  const saveCustomFieldValues = async (entityType: string, entityId: string, values: Record<string, any>) => {
    try {
      if (!customFields || customFields.length === 0) return;
      
      // Prepare upsert array for all fields
      const upsertArray = customFields.map(field => {
        const value = values[field.field_key];
        
        return {
          entity_type: entityType,
          entity_id: entityId,
          field_id: field.id,
          value: value !== undefined ? value : null
        };
      });
      
      // Get existing values
      const { data: existingValues } = await supabase
        .from('custom_field_values')
        .select('id, field_id')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId);
      
      // Add IDs to upsert array if values already exist
      if (existingValues && existingValues.length > 0) {
        for (const item of upsertArray) {
          const existing = existingValues.find(ev => ev.field_id === item.field_id);
          if (existing) {
            item.id = existing.id;
          }
        }
      }
      
      // Perform upsert
      const { error } = await supabase
        .from('custom_field_values')
        .upsert(upsertArray);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error saving custom field values:', err);
      throw err;
    }
  };

  // Update field order
  const updateFieldOrder = async (
    fields: (CustomField & { sort_order?: number })[],
    tenantId?: string,
    formContext?: string
  ) => {
    if (!fields || fields.length === 0) return;
    
    try {
      // Prepare update array with updated sort order
      const updateArray = fields.map((field, index) => ({
        id: field.id,
        sort_order: index
      }));
      
      // Update fields in database
      const { error } = await supabase
        .from('custom_fields')
        .upsert(updateArray, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Update local state
      setCustomFields(fields);
      
      toast({
        title: 'Field order updated',
        description: 'The custom fields order has been saved successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating field order:', err);
      toast({
        title: 'Error',
        description: 'Failed to update field order. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    customFields,
    setCustomFields,
    isLoading,
    error,
    getCustomFieldValues,
    saveCustomFieldValues,
    updateFieldOrder
  };
}
