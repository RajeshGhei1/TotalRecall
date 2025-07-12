
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleTemplate {
  id: string;
  template_id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  manifest_template: Record<string, any>;
  files: Record<string, string>;
  dependencies: string[];
  is_built_in: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useModuleTemplates = (activeOnly: boolean = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['module-templates', activeOnly],
    queryFn: async () => {
      let queryBuilder = supabase
        .from('module_templates')
        .select('*')
        .order('name');

      if (activeOnly) {
        queryBuilder = queryBuilder.eq('is_active', true);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching module templates:', error);
        throw error;
      }

      return (data || []).map((template: unknown) => ({
        ...template,
        tags: Array.isArray(template.tags) ? template.tags : [],
        dependencies: Array.isArray(template.dependencies) ? template.dependencies : [],
        manifest_template: template.manifest_template || {},
        files: template.files || {}
      })) as ModuleTemplate[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: Partial<ModuleTemplate>) => {
      const { data, error } = await supabase
        .from('module_templates')
        .insert({
          template_id: templateData.template_id,
          name: templateData.name,
          description: templateData.description,
          category: templateData.category || 'custom',
          tags: templateData.tags || [],
          manifest_template: templateData.manifest_template || {},
          files: templateData.files || {},
          dependencies: templateData.dependencies || [],
          is_built_in: false,
          is_active: true,
          created_by: templateData.created_by
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-templates'] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ModuleTemplate> }) => {
      const { data, error } = await supabase
        .from('module_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-templates'] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('module_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-templates'] });
    },
  });

  return {
    ...query,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};

export const useModuleTemplateById = (templateId: string) => {
  return useQuery({
    queryKey: ['module-template', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_templates')
        .select('*')
        .eq('template_id', templateId)
        .single();

      if (error) {
        console.error('Error fetching module template:', error);
        throw error;
      }

      return {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
        manifest_template: data.manifest_template || {},
        files: data.files || {}
      } as ModuleTemplate;
    },
    enabled: !!templateId,
  });
};
