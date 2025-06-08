
import { useState, useEffect } from 'react';

export interface SystemModule {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  version?: string;
  dependencies?: string[];
  default_limits?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useSystemModules = (activeOnly: boolean = true) => {
  const [data, setData] = useState<SystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Mock loading modules with proper category and default_limits
    setTimeout(() => {
      setData([
        {
          id: '1',
          name: 'Forms Management',
          description: 'Form management and processing',
          category: 'core',
          is_active: true,
          version: '1.0.0',
          dependencies: [],
          default_limits: { max_forms: 100, max_responses: 1000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Workflow Automation',
          description: 'Workflow automation and management',
          category: 'core',
          is_active: true,
          version: '1.0.0',
          dependencies: [],
          default_limits: { max_workflows: 50, max_executions: 500 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Analytics Dashboard',
          description: 'Advanced analytics and reporting',
          category: 'analytics',
          is_active: true,
          version: '1.0.0',
          dependencies: [],
          default_limits: { max_reports: 25, max_data_points: 10000 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Email Integration',
          description: 'Email communication and automation',
          category: 'communication',
          is_active: true,
          version: '1.0.0',
          dependencies: [],
          default_limits: { max_emails: 1000, max_templates: 20 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, [activeOnly]);

  const createModule = {
    mutateAsync: async (moduleData: Partial<SystemModule>) => {
      setIsSaving(true);
      // Mock create operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newModule: SystemModule = {
        id: Math.random().toString(36).substr(2, 9),
        name: moduleData.name || '',
        description: moduleData.description || '',
        category: moduleData.category || 'core',
        is_active: moduleData.is_active ?? true,
        version: moduleData.version || '1.0.0',
        dependencies: moduleData.dependencies || [],
        default_limits: moduleData.default_limits || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setData(prev => [...prev, newModule]);
      setIsSaving(false);
      return newModule;
    },
    isPending: isSaving
  };

  const updateModule = {
    mutateAsync: async ({ id, updates }: { id: string; updates: Partial<SystemModule> }) => {
      setIsSaving(true);
      // Mock update operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(prev => prev.map(module => 
        module.id === id 
          ? { 
              ...module, 
              ...updates, 
              // Ensure required fields are maintained
              name: updates.name || module.name,
              category: updates.category || module.category,
              updated_at: new Date().toISOString() 
            }
          : module
      ));
      setIsSaving(false);
    },
    isPending: isSaving
  };

  const deleteModule = {
    mutateAsync: async (id: string) => {
      setIsSaving(true);
      // Mock delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(prev => prev.filter(module => module.id !== id));
      setIsSaving(false);
    },
    isPending: isSaving
  };

  return {
    data,
    isLoading,
    createModule,
    updateModule,
    deleteModule
  };
};

export const useSystemModuleById = (moduleId: string) => {
  const [data, setData] = useState<SystemModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (moduleId) {
      // Mock loading single module
      setTimeout(() => {
        setData({
          id: moduleId,
          name: 'Sample Module',
          description: 'Sample module description',
          category: 'core',
          is_active: true,
          version: '1.0.0',
          dependencies: [],
          default_limits: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setIsLoading(false);
      }, 500);
    }
  }, [moduleId]);

  return { data, isLoading };
};
