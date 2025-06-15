
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

      setData(modules || []);
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
      return newModule;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  };

  const updateModule = async (moduleName: string, updates: Partial<EnhancedSystemModule>) => {
    try {
      const { data: updatedModule, error } = await supabase
        .from('system_modules')
        .update(updates)
        .eq('name', moduleName)
        .select()
        .single();

      if (error) throw error;

      // Refresh the module list
      await fetchModules();
      return updatedModule;
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

        setData(module);
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
