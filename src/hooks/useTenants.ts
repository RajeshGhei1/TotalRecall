
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TenantFormValues } from '@/components/superadmin/tenant-form';
import { parseFormDate } from '@/utils/dateUtils';
import { useCustomFields } from '@/hooks/useCustomFields';

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  created_at: string;
  registration_date?: string | null;
}

export const useTenants = () => {
  const queryClient = useQueryClient();
  const { saveCustomFieldValues } = useCustomFields();

  // Extract custom field values from form data
  const extractCustomFieldValues = (formData: TenantFormValues) => {
    const customFields: Record<string, any> = {};
    
    // Loop through all form values and extract those that start with "custom_"
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith('custom_')) {
        const fieldKey = key.replace('custom_', '');
        customFields[fieldKey] = value;
      }
    });
    
    return customFields;
  };

  // Fetch tenants from the database
  const {
    data: tenants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tenant[];
    },
  });

  // Mutation for creating a new tenant
  const createTenant = useMutation({
    mutationFn: async (tenantData: TenantFormValues) => {
      // Parse the registration date for database storage
      const formattedDate = parseFormDate(tenantData.registrationDate);
      
      if (tenantData.registrationDate && !formattedDate) {
        throw new Error("Invalid registration date format");
      }
      
      // Extract the basic tenant data that the database expects
      const basicTenantData = {
        name: tenantData.name,
        domain: tenantData.domain || tenantData.webSite, // Use website as domain if domain not provided
        description: tenantData.companyProfile, // Use company profile as description
        registration_date: formattedDate, // Add registration date
      };

      const { data, error } = await supabase
        .from('tenants')
        .insert([basicTenantData])
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(tenantData);
      
      if (Object.keys(customFieldValues).length > 0) {
        await saveCustomFieldValues('tenant', data.id, customFieldValues);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: 'Tenant created',
        description: 'The tenant has been created successfully',
      });
    },
    onError: (error: any) => {
      console.error("Error creating tenant:", error);
      toast({
        title: 'Error',
        description: `Failed to create tenant: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    tenants,
    isLoading,
    error,
    createTenant,
  };
};
