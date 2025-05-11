
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CustomField {
  id: string;
  tenant_id: string;
  name: string;
  field_key: string;
  field_type: string;
  required: boolean;
  options?: Record<string, any>;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface CustomFieldValue {
  id: string;
  field_id: string;
  entity_id: string;
  entity_type: string;
  value: any;
}

export function useCustomFields(tenantId?: string) {
  const queryClient = useQueryClient();

  // Default to "global" if no tenantId is provided
  const effectiveTenantId = tenantId || "global";
  
  console.log(`Fetching custom fields for tenant: ${effectiveTenantId}`);

  // Fetch custom fields for a tenant
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['customFields', effectiveTenantId],
    queryFn: async () => {
      console.log(`Starting custom fields query for tenant: ${effectiveTenantId}`);
      
      // For global fields, we look for tenant_id is null or 'global'
      let query = supabase
        .from('custom_fields')
        .select('*');
        
      if (effectiveTenantId === 'global') {
        // For global tenant fields, get fields where tenant_id is null or 'global'
        query = query.or('tenant_id.is.null,tenant_id.eq.global');
      } else {
        // For specific tenant, get tenant-specific fields and global fields
        query = query.or(`tenant_id.is.null,tenant_id.eq.${effectiveTenantId},tenant_id.eq.global`);
      }
      
      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error fetching custom fields:', error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} custom fields for tenant: ${effectiveTenantId}`, data);
      return data as CustomField[];
    },
    enabled: !!effectiveTenantId,
  });

  // Fetch custom field values for an entity
  const getCustomFieldValues = async (entityType: string, entityId: string) => {
    if (!entityId || !entityType) return [];

    console.log(`Getting custom field values for ${entityType}:${entityId}`);

    const { data, error } = await supabase
      .from('custom_field_values')
      .select(`
        id, 
        value,
        field_id,
        custom_fields(id, name, field_key, field_type, required, options)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) {
      console.error('Error fetching custom field values:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} custom field values for ${entityType}:${entityId}`, data);
    return data;
  };

  // Save custom field values
  const saveCustomFieldValues = async (
    entityType: string,
    entityId: string,
    values: Record<string, any>
  ) => {
    if (!entityId || !entityType) return;

    console.log(`Saving custom field values for ${entityType}:${entityId}`, values);

    // Get all custom fields
    const { data: fields, error: fieldsError } = await supabase
      .from('custom_fields')
      .select('id, field_key')
      .or(`tenant_id.is.null,tenant_id.eq.global${tenantId ? `,tenant_id.eq.${tenantId}` : ''}`);

    if (fieldsError) {
      console.error("Error fetching custom fields:", fieldsError);
      throw fieldsError;
    }
    
    // Get existing field values
    const { data: existingValues, error: existingError } = await supabase
      .from('custom_field_values')
      .select('id, field_id')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (existingError) {
      console.error("Error fetching existing values:", existingError);
      throw existingError;
    }

    // Create a map of field_key to field_id
    const fieldKeyToId = fields.reduce((acc, field) => {
      acc[field.field_key] = field.id;
      return acc;
    }, {} as Record<string, string>);

    // Create a map of field_id to existing value id
    const fieldIdToValueId = existingValues.reduce((acc, val) => {
      acc[val.field_id] = val.id;
      return acc;
    }, {} as Record<string, string>);

    // Prepare upserts (update or insert)
    const upserts = [];

    // Go through all values
    for (const [fieldKey, value] of Object.entries(values)) {
      const fieldId = fieldKeyToId[fieldKey];
      if (!fieldId) {
        console.warn(`Field key ${fieldKey} not found in database`);
        continue;  // Skip if field doesn't exist
      }

      const existingId = fieldIdToValueId[fieldId];
      
      console.log(`Processing field ${fieldKey} with value ${value}, existingId: ${existingId}`);

      upserts.push({
        id: existingId || undefined,
        field_id: fieldId,
        entity_type: entityType,
        entity_id: entityId,
        value: value
      });
    }

    if (upserts.length > 0) {
      console.log("Upserting custom field values:", upserts);
      const { error: upsertError, data } = await supabase
        .from('custom_field_values')
        .upsert(upserts)
        .select();

      if (upsertError) {
        console.error("Error upserting values:", upsertError);
        throw upsertError;
      }
      
      console.log("Upserted values:", data);
    } else {
      console.log("No custom field values to upsert");
    }
    
    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['customFieldValues', entityType, entityId] });
  };

  return {
    customFields,
    isLoading,
    getCustomFieldValues,
    saveCustomFieldValues
  };
}
