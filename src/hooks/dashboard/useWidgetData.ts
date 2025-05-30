
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WidgetDataSource {
  id: string;
  name: string;
  source_type: 'supabase_table' | 'custom_query' | 'api_endpoint' | 'calculated';
  query_config: Record<string, any>;
  refresh_interval: number;
  cache_duration: number;
}

export const useWidgetData = (dataSource: WidgetDataSource, widgetConfig?: Record<string, any>) => {
  return useQuery({
    queryKey: ['widget-data', dataSource.id, widgetConfig],
    queryFn: async () => {
      switch (dataSource.source_type) {
        case 'supabase_table':
          return fetchTableData(dataSource.query_config);
        case 'custom_query':
          return fetchCustomQuery(dataSource.query_config);
        case 'calculated':
          return fetchCalculatedData(dataSource.query_config);
        default:
          throw new Error(`Unsupported data source type: ${dataSource.source_type}`);
      }
    },
    staleTime: (dataSource.cache_duration || 300) * 1000,
    refetchInterval: (dataSource.refresh_interval || 300) * 1000,
  });
};

const fetchTableData = async (config: Record<string, any>) => {
  const { table, operation, filters = [], columns = '*' } = config;
  
  let query = supabase.from(table).select(columns);
  
  // Apply filters
  filters.forEach((filter: any) => {
    if (filter.column && filter.operator && filter.value !== undefined) {
      query = query.filter(filter.column, filter.operator, filter.value);
    }
  });

  if (operation === 'count') {
    const { count, error } = await query.select('*', { count: 'exact', head: true });
    if (error) throw error;
    return { count };
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const fetchCustomQuery = async (config: Record<string, any>) => {
  const { query } = config;
  // For now, we'll simulate custom query execution
  // In a real implementation, you'd need a backend function to execute raw SQL
  console.log('Custom query execution not implemented yet:', query);
  return [];
};

const fetchCalculatedData = async (config: Record<string, any>) => {
  const { calculation_type } = config;
  
  switch (calculation_type) {
    case 'revenue_metric':
      // Placeholder for revenue calculations
      return { value: 0, currency: 'USD' };
    default:
      return { value: 0 };
  }
};

export const useWidgetDataSources = () => {
  return useQuery({
    queryKey: ['widget-data-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('widget_data_sources')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as WidgetDataSource[];
    },
  });
};
