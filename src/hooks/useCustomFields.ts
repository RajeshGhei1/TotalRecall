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
  applicable_forms?: string[];
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

interface UseCustomFieldsOptions {
  formContext?: string;
}

export function useCustomFields(tenantId?: string, options?: UseCustomFieldsOptions) {
  const queryClient = useQueryClient();
  const { formContext } = options || {};

  // Default to "global" if no tenantId is provided
  const effectiveTenantId = tenantId || "global";
  
  console.log(`Fetching custom fields for tenant: ${effectiveTenantId}, formContext: ${formContext || 'all'}`);

  // Fetch custom fields for a tenant
  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['customFields', effectiveTenantId, formContext],
    queryFn: async () => {
      console.log(`Starting custom fields query for tenant: ${effectiveTenantId}`);
      
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('tenant_id', effectiveTenantId)
        .order('name');

      if (error) {
        // Special handling for global tenant
        if (effectiveTenantId === 'global' && error.code === '22P02') {
          console.log('Using alternative query for global tenant');
          
          // For global tenant, get fields where tenant_id is null or 'global'
          const { data: globalData, error: globalError } = await supabase
            .from('custom_fields')
            .select('*')
            .is('tenant_id', null)
            .order('name');
            
          if (globalError) {
            console.error('Error fetching global custom fields:', globalError);
            throw globalError;
          }
          
          console.log(`Retrieved ${globalData?.length || 0} global custom fields`);
          
          // Filter by form context if provided
          let filteredData = globalData as CustomField[];
          if (formContext) {
            filteredData = filteredData.filter(field => {
              // If applicable_forms is empty array or null, field applies to all forms
              if (!field.applicable_forms || field.applicable_forms.length === 0) {
                return true;
              }
              // Otherwise, check if this form is in the applicable_forms array
              return field.applicable_forms.includes(formContext);
            });
            console.log(`Filtered to ${filteredData.length} fields for form context: ${formContext}`);
          }
          
          return filteredData;
        }
        
        console.error('Error fetching custom fields:', error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} custom fields for tenant: ${effectiveTenantId}`);
      
      // Filter by form context if provided
      let filteredData = data as CustomField[];
      if (formContext) {
        filteredData = filteredData.filter(field => {
          // If applicable_forms is empty array or null, field applies to all forms
          if (!field.applicable_forms || field.applicable_forms.length === 0) {
            return true;
          }
          // Otherwise, check if this form is in the applicable_forms array
          return field.applicable_forms.includes(formContext);
        });
        console.log(`Filtered to ${filteredData.length} fields for form context: ${formContext}`);
      }
      
      return filteredData;
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
        custom_fields(id, name, field_key, field_type, required, options, applicable_forms)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);

    if (error) {
      console.error('Error fetching custom field values:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} custom field values for ${entityType}:${entityId}`, data);
    
    // If formContext is provided, filter the values to only include fields applicable to this form
    if (formContext) {
      const filteredData = data.filter(item => {
        const field = item.custom_fields;
        // If applicable_forms is empty array or null, field applies to all forms
        if (!field.applicable_forms || field.applicable_forms.length === 0) {
          return true;
        }
        // Otherwise, check if this form is in the applicable_forms array
        return field.applicable_forms.includes(formContext);
      });
      
      console.log(`Filtered to ${filteredData.length} field values for form context: ${formContext}`);
      return filteredData;
    }
    
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
      .select('id, field_key, applicable_forms')
      .or(`tenant_id.is.null,tenant_id.eq.${effectiveTenantId}`);

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

    // Create a map of field_key to field_id and check form context if provided
    const fieldKeyToId = fields.reduce((acc, field) => {
      // If formContext is provided, only include fields applicable to this form
      if (formContext) {
        if (!field.applicable_forms || field.applicable_forms.length === 0) {
          // Field applies to all forms
          acc[field.field_key] = field.id;
        } else if (field.applicable_forms.includes(formContext)) {
          // Field applies to this specific form
          acc[field.field_key] = field.id;
        }
      } else {
        // No form context filter, include all fields
        acc[field.field_key] = field.id;
      }
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
        console.warn(`Field key ${fieldKey} not found in database or not applicable to the form context`);
        continue;  // Skip if field doesn't exist or not applicable to this form
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
