
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SavedReport, Filter } from '@/services/reportingService';

export const useSecureSavedReports = (tenantId?: string) => {
  return useQuery({
    queryKey: ['secure-saved-reports', tenantId],
    queryFn: async () => {
      let query = supabase
        .from('saved_reports')
        .select('*')
        .order('created_at', { ascending: false });

      // The RLS policies will automatically filter by tenant
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
  });
};

export const useSecureSaveReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (report: Omit<SavedReport, 'id' | 'created_at' | 'updated_at'>) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's tenant from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      const reportData = {
        ...report,
        created_by: user.id,
        tenant_id: profile?.tenant_id,
        columns: JSON.stringify(report.columns),
        filters: JSON.stringify(report.filters),
        aggregation: JSON.stringify(report.aggregation)
      };

      const { data, error } = await supabase
        .from('saved_reports')
        .insert([reportData])
        .select()
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
      queryClient.invalidateQueries({ queryKey: ['secure-saved-reports'] });
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
      queryClient.invalidateQueries({ queryKey: ['secure-saved-reports'] });
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
