
import { supabase } from '@/integrations/supabase/client';

export interface Filter {
  field: string;
  operator: string;
  value: string;
}

export interface Aggregation {
  function: string;
  field: string;
}

export interface SavedReport {
  id: string;
  name: string;
  entity: string;
  columns: string[];
  filters: Filter[];
  group_by: string;
  aggregation: Aggregation[];
  visualization_type: string;
  created_at: string;
  updated_at: string;
}

export const fetchSavedReports = async (): Promise<SavedReport[]> => {
  const { data, error } = await supabase
    .from('saved_reports')
    .select('*')
    .order('created_at', { ascending: false });
    
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
};

export const saveReport = async (report: Omit<SavedReport, 'id' | 'created_at' | 'updated_at'>): Promise<SavedReport> => {
  // Convert arrays to JSON strings for Supabase
  const reportData = {
    ...report,
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
};

export const deleteReport = async (reportId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_reports')
    .delete()
    .eq('id', reportId);
    
  if (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

export const runDynamicReport = async (
  entity: string,
  columns: string[],
  filters: Filter[],
  groupBy?: string,
): Promise<unknown[]> => {
  if (!entity || columns.length === 0) {
    throw new Error('Entity and columns are required');
  }
  
  // Validate that the entity is a valid table in the database
  const validEntities = ['companies', 'people', 'talents', 'tenants', 'dropdown_options'];
  if (!validEntities.includes(entity)) {
    throw new Error(`Invalid entity: ${entity}. Must be one of: ${validEntities.join(', ')}`);
  }
  
  // Build the query - fixed to use a type assertion to handle the dynamic table name
  let query = supabase.from(entity as unknown).select(columns.join(','));
  
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
};
