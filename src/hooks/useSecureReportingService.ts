
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SavedReport, Filter } from '@/services/reportingService';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';
import { useCacheInvalidation } from '@/hooks/security/useCacheInvalidation';

export const useSecureSavedReports = () => {
  const { user } = useAuth();
  const { selectedTenantId } = useTenantContext();
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('secure-saved-reports', [selectedTenantId]),
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('saved_reports')
        .select(`
          *,
          profiles:created_by (
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching saved reports:', error);
        throw error;
      }
      
      // Parse the JSONB columns to proper JavaScript types
      const parsedData = data?.map(item => ({
        ...item,
        columns: Array.isArray(item.columns) ? item.columns : JSON.parse(String(item.columns || '[]')),
        filters: Array.isArray(item.filters) ? item.filters : JSON.parse(String(item.filters || '[]')),
        aggregation: Array.isArray(item.aggregation) ? item.aggregation : JSON.parse(String(item.aggregation || '[]'))
      })) as SavedReport[];
      
      return parsedData || [];
    },
    enabled: !!user,
  });
};

export const useSecureSaveReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedTenantId } = useTenantContext();
  const { createSecureKey } = useSecureQueryKey();
  const { clearCachePattern } = useCacheInvalidation();

  return useMutation({
    mutationFn: async (report: Omit<SavedReport, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const reportData = {
        ...report,
        // Use proper tenant context and user ownership
        tenant_id: selectedTenantId,
        created_by: user.id,
        columns: JSON.stringify(report.columns),
        filters: JSON.stringify(report.filters),
        aggregation: JSON.stringify(report.aggregation)
      };

      const { data, error } = await supabase
        .from('saved_reports')
        .insert([reportData])
        .select(`
          *,
          profiles:created_by (
            id,
            email,
            full_name
          )
        `)
        .single();
        
      if (error) {
        console.error('Error saving report:', error);
        throw error;
      }
      
      return {
        ...data,
        columns: Array.isArray(data.columns) ? data.columns : JSON.parse(String(data.columns || '[]')),
        filters: Array.isArray(data.filters) ? data.filters : JSON.parse(String(data.filters || '[]')),
        aggregation: Array.isArray(data.aggregation) ? data.aggregation : JSON.parse(String(data.aggregation || '[]'))
      };
    },
    onSuccess: () => {
      // Invalidate all secure report caches
      queryClient.invalidateQueries({ 
        queryKey: createSecureKey('secure-saved-reports') 
      });
      clearCachePattern('secure-saved-reports');
      
      toast({
        title: 'Success',
        description: 'Report saved successfully',
      });
    },
    onError: (error) => {
      console.error('Error saving report:', error);
      toast({
        title: 'Error',
        description: 'Failed to save report',
        variant: 'destructive',
      });
    },
  });
};

export const useSecureDeleteReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { createSecureKey } = useSecureQueryKey();
  const { clearCachePattern } = useCacheInvalidation();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', reportId);
        
      if (error) {
        console.error('Error deleting report:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate all secure report caches
      queryClient.invalidateQueries({ 
        queryKey: createSecureKey('secure-saved-reports') 
      });
      clearCachePattern('secure-saved-reports');
      
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
    },
  });
};

export const useSecureRunDynamicReport = () => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useMutation({
    mutationFn: async (params: {
      entity: string;
      columns: string[];
      filters: Filter[];
      groupBy?: string;
    }) => {
      const { entity, columns, filters, groupBy } = params;
      
      if (!entity || columns.length === 0) {
        throw new Error('Entity and columns are required');
      }
      
      // Validate that the entity is a valid table in the database
      const validEntities = ['companies', 'people', 'talents', 'tenants', 'dropdown_options'];
      if (!validEntities.includes(entity)) {
        throw new Error(`Invalid entity: ${entity}. Must be one of: ${validEntities.join(', ')}`);
      }
      
      // Build the query with proper typing
      let query = supabase.from(entity as any).select(columns.join(','));
      
      // Apply filters
      filters.forEach(filter => {
        if (filter.field && filter.value) {
          switch (filter.operator) {
            case 'equals':
              query = query.eq(filter.field, filter.value);
              break;
            case 'contains':
              query = query.ilike(filter.field, `%${filter.value}%`);
              break;
            case 'greater_than':
              query = query.gt(filter.field, filter.value);
              break;
            case 'less_than':
              query = query.lt(filter.field, filter.value);
              break;
            default:
              break;
          }
        }
      });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error running report:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};
