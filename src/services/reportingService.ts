
import { supabase } from '@/integrations/supabase/client';

export interface SavedReport {
  id: string;
  name: string;
  entity: string;
  columns: string[];
  filters: {field: string, operator: string, value: string}[];
  group_by: string;
  aggregation: {function: string, field: string}[];
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
  
  return data || [];
};

export const saveReport = async (report: Omit<SavedReport, 'id' | 'created_at' | 'updated_at'>): Promise<SavedReport> => {
  const { data, error } = await supabase
    .from('saved_reports')
    .insert([report])
    .select()
    .single();
    
  if (error) {
    console.error('Error saving report:', error);
    throw error;
  }
  
  return data;
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
  filters: {field: string, operator: string, value: string}[],
  groupBy?: string,
): Promise<any[]> => {
  if (!entity || columns.length === 0) {
    throw new Error('Entity and columns are required');
  }
  
  // Build the query
  let query = supabase.from(entity).select(columns.join(','));
  
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
