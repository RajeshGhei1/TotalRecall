
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedSystemModule {
  name: string; // Primary key in system_modules table
  description?: string;
  category: string;
  is_active: boolean;
  version?: string;
  dependencies?: string[];
  default_limits?: Record<string, any>;
  pricing_tier?: string;
  monthly_price?: number;
  annual_price?: number;
  requires_modules?: string[];
  max_usage_limits?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Helper function to safely convert Json to Record<string, any>
const parseJsonField = (jsonValue: any): Record<string, any> => {
  if (!jsonValue) return {};
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue);
    } catch {
      return {};
    }
  }
  if (typeof jsonValue === 'object') return jsonValue;
  return {};
};

// Helper function to convert database row to EnhancedSystemModule
const mapDatabaseRowToModule = (row: any): EnhancedSystemModule => ({
  name: row.name,
  description: row.description,
  category: row.category,
  is_active: row.is_active,
  version: row.version,
  dependencies: row.dependencies || [],
  default_limits: parseJsonField(row.default_limits),
  pricing_tier: row.pricing_tier,
  monthly_price: row.monthly_price,
  annual_price: row.annual_price,
  requires_modules: row.requires_modules || [],
  max_usage_limits: parseJsonField(row.max_usage_limits),
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const useEnhancedSystemModules = (activeOnly: boolean = true) => {
  const [data, setData] = useState<EnhancedSystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('system_modules')
        .select('*')
        .order('name');

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data: modules, error } = await query;

      if (error) {
        console.error('Error fetching enhanced system modules:', error);
        setError(error.message);
        return;
      }

      const mappedModules = (modules || []).map(mapDatabaseRowToModule);
      setData(mappedModules);
      setError(null);
    } catch (err) {
      console.error('Error in fetchModules:', err);
      setError('Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [activeOnly]);

  const createModule = async (moduleData: Partial<EnhancedSystemModule>) => {
    try {
      const { data: newModule, error } = await supabase
        .from('system_modules')
        .insert({
          name: moduleData.name || '',
          description: moduleData.description,
          category: moduleData.category || 'business',
          is_active: moduleData.is_active ?? true,
          version: moduleData.version || '1.0.0',
          dependencies: moduleData.dependencies || [],
          default_limits: moduleData.default_limits || {},
          pricing_tier: moduleData.pricing_tier || 'basic',
          monthly_price: moduleData.monthly_price || 0,
          annual_price: moduleData.annual_price || 0,
          requires_modules: moduleData.requires_modules || [],
          max_usage_limits: moduleData.max_usage_limits || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh the module list
      await fetchModules();
      return mapDatabaseRowToModule(newModule);
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  };

  const updateModule = async (moduleName: string, updates: Partial<EnhancedSystemModule>) => {
    try {
      // Convert Record<string, any> fields back to the format expected by Supabase
      const updateData: any = { ...updates };
      if (updates.default_limits) {
        updateData.default_limits = updates.default_limits;
      }
      if (updates.max_usage_limits) {
        updateData.max_usage_limits = updates.max_usage_limits;
      }

      const { data: updatedModule, error } = await supabase
        .from('system_modules')
        .update(updateData)
        .eq('name', moduleName)
        .select()
        .single();

      if (error) throw error;

      // Refresh the module list
      await fetchModules();
      return mapDatabaseRowToModule(updatedModule);
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  };

  const deleteModule = async (moduleName: string) => {
    try {
      const { error } = await supabase
        .from('system_modules')
        .delete()
        .eq('name', moduleName);

      if (error) throw error;

      // Refresh the module list
      await fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchModules,
    createModule,
    updateModule,
    deleteModule
  };
};

export const useEnhancedSystemModuleByName = (moduleName: string) => {
  const [data, setData] = useState<EnhancedSystemModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleName) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const fetchModule = async () => {
      try {
        setIsLoading(true);
        const { data: module, error } = await supabase
          .from('system_modules')
          .select('*')
          .eq('name', moduleName)
          .single();

        if (error) {
          console.error('Error fetching system module:', error);
          setError(error.message);
          return;
        }

        setData(mapDatabaseRowToModule(module));
        setError(null);
      } catch (err) {
        console.error('Error in fetchModule:', err);
        setError('Failed to fetch module');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [moduleName]);

  return { data, isLoading, error };
};
