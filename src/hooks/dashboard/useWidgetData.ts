
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WidgetDataSource {
  id: string;
  name: string;
  source_type: 'supabase_table' | 'custom_query' | 'api_endpoint' | 'calculated';
  query_config: Record<string, unknown>;
  refresh_interval: number;
  cache_duration: number;
}

export const useWidgetData = (dataSource: WidgetDataSource, widgetConfig?: Record<string, unknown>) => {
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

const fetchTableData = async (config: Record<string, unknown>) => {
  const { table, operation, filters = [], columns = '*' } = config;
  
  try {
    // Check if we need to include custom fields
    const needsCustomFields = typeof columns === 'string' && 
      (columns.includes('custom_fields.') || table === 'custom_field_values');
    
    let query = supabase.from(table as string);
    
    if (needsCustomFields && table !== 'custom_field_values' && table !== 'custom_fields') {
      // For main entity tables, we need to join with custom field values
      query = query.select(`
        *,
        custom_field_values (
          field_key,
          value,
          custom_field_id,
          custom_fields (
            name,
            field_type
          )
        )
      `);
    } else {
      query = query.select(columns as string);
    }
    
    // Apply filters
    (filters as Array<any>).forEach((filter: any) => {
      if (filter.column && filter.operator && filter.value !== undefined) {
        // Handle custom field filters
        if (filter.column.startsWith('custom_fields.')) {
          const fieldKey = filter.column.replace('custom_fields.', '');
          // For custom field filters, we need to filter on the joined table
          query = query.filter(`custom_field_values.field_key`, 'eq', fieldKey);
          query = query.filter(`custom_field_values.value`, filter.operator, filter.value);
        } else {
          query = query.filter(filter.column, filter.operator, filter.value);
        }
      }
    });

    if (operation === 'count') {
      const { count, error } = await supabase
        .from(table as string)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { count };
    }

    if (operation === 'aggregate') {
      // For aggregate operations, we might need custom handling
      const { data, error } = await query;
      if (error) throw error;
      
      // Process aggregation
      return processAggregateData(data, config);
    }

    const { data, error } = await query;
    if (error) throw error;

    // If we fetched custom fields, transform the data structure
    if (needsCustomFields && data) {
      return transformCustomFieldsData(data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

const transformCustomFieldsData = (data: any[]) => {
  return data.map(item => {
    if (item.custom_field_values) {
      // Transform custom field values into a more usable format
      const customFields: Record<string, any> = {};
      
      item.custom_field_values.forEach((cfv: any) => {
        customFields[cfv.field_key] = {
          value: cfv.value,
          field_name: cfv.custom_fields?.name,
          field_type: cfv.custom_fields?.field_type
        };
      });
      
      return {
        ...item,
        custom_fields: customFields,
        custom_field_values: undefined // Remove the raw array
      };
    }
    return item;
  });
};

const processAggregateData = (data: any[], config: Record<string, unknown>) => {
  // Basic aggregation processing
  if (!data || data.length === 0) return [];
  
  const { aggregation = 'count' } = config;
  
  switch (aggregation) {
    case 'count':
      return [{ value: data.length }];
    case 'sum':
      // Would need to specify which field to sum
      return data;
    case 'avg':
      // Would need to specify which field to average
      return data;
    default:
      return data;
  }
};

const fetchCustomQuery = async (config: Record<string, unknown>) => {
  const { query } = config;
  
  if (!query || typeof query !== 'string') {
    throw new Error('Custom query is required');
  }

  const { data, error } = await supabase.rpc('execute_custom_query', {
    query_text: query
  });

  if (error) throw error;
  return data;
};

const fetchCalculatedData = async (config: Record<string, unknown>) => {
  const { calculation } = config;
  
  // For now, return mock calculated data
  // In a real implementation, this would perform calculations
  switch (calculation) {
    case 'total_companies':
      const { count: companyCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
      return [{ label: 'Total Companies', value: companyCount || 0 }];
      
    case 'total_people':
      const { count: peopleCount } = await supabase
        .from('people')
        .select('*', { count: 'exact', head: true });
      return [{ label: 'Total People', value: peopleCount || 0 }];
      
    case 'custom_fields_usage':
      const { data: customFieldsData } = await supabase
        .from('custom_field_values')
        .select('field_key', { count: 'exact' });
      
      // Group by field_key and count usage
      const usage: Record<string, number> = {};
      customFieldsData?.forEach(item => {
        usage[item.field_key] = (usage[item.field_key] || 0) + 1;
      });
      
      return Object.entries(usage).map(([field, count]) => ({
        label: field,
        value: count
      }));
      
    default:
      return [{ label: 'No Data', value: 0 }];
  }
};

export const useWidgetDataSources = () => {
  return useQuery({
    queryKey: ['widget-data-sources'],
    queryFn: async () => {
      // For now, return static data sources that include custom fields
      const staticDataSources = [
        {
          id: 'companies-basic',
          name: 'Companies (Basic)',
          source_type: 'supabase_table' as const,
          query_config: {
            table: 'companies',
            operation: 'select',
            columns: '*',
            filters: []
          },
          refresh_interval: 300,
          cache_duration: 300,
        },
        {
          id: 'companies-with-custom-fields',
          name: 'Companies with Custom Fields',
          source_type: 'supabase_table' as const,
          query_config: {
            table: 'companies',
            operation: 'select',
            columns: '*',
            filters: []
          },
          refresh_interval: 300,
          cache_duration: 300,
        },
        {
          id: 'people-basic',
          name: 'People (Basic)',
          source_type: 'supabase_table' as const,
          query_config: {
            table: 'people',
            operation: 'select',
            columns: '*',
            filters: []
          },
          refresh_interval: 300,
          cache_duration: 300,
        },
        {
          id: 'people-with-custom-fields',
          name: 'People with Custom Fields',
          source_type: 'supabase_table' as const,
          query_config: {
            table: 'people',
            operation: 'select',
            columns: '*',
            filters: []
          },
          refresh_interval: 300,
          cache_duration: 300,
        },
        {
          id: 'custom-fields-analytics',
          name: 'Custom Fields Usage Analytics',
          source_type: 'calculated' as const,
          query_config: {
            calculation: 'custom_fields_usage'
          },
          refresh_interval: 600,
          cache_duration: 600,
        },
        {
          id: 'custom-field-values',
          name: 'Custom Field Values',
          source_type: 'supabase_table' as const,
          query_config: {
            table: 'custom_field_values',
            operation: 'select',
            columns: '*',
            filters: []
          },
          refresh_interval: 300,
          cache_duration: 300,
        }
      ];

      return staticDataSources;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
