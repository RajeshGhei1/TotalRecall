
import { ModuleManifest } from '@/types/modules';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleTemplate {
  id: string;
  template_id: string;
  name: string;
  description: string;
  category: string;
  manifest_template: Partial<ModuleManifest>;
  files: Record<string, string>;
  dependencies: string[];
  tags: string[];
  is_built_in: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class ModuleTemplateService {
  private static instance: ModuleTemplateService;

  static getInstance(): ModuleTemplateService {
    if (!ModuleTemplateService.instance) {
      ModuleTemplateService.instance = new ModuleTemplateService();
    }
    return ModuleTemplateService.instance;
  }

  async getTemplates(): Promise<ModuleTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('module_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching templates from database:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseTemplate);
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return [];
    }
  }

  async getTemplate(templateId: string): Promise<ModuleTemplate | undefined> {
    try {
      const { data, error } = await supabase
        .from('module_templates')
        .select('*')
        .eq('template_id', templateId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching template:', error);
        return undefined;
      }

      return this.mapDatabaseTemplate(data);
    } catch (error) {
      console.error('Error in getTemplate:', error);
      return undefined;
    }
  }

  async getTemplatesByCategory(category: string): Promise<ModuleTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('module_templates')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching templates by category:', error);
        return [];
      }

      return (data || []).map(this.mapDatabaseTemplate);
    } catch (error) {
      console.error('Error in getTemplatesByCategory:', error);
      return [];
    }
  }

  async createModuleFromTemplate(
    templateId: string, 
    moduleConfig: {
      id: string;
      name: string;
      description?: string;
    }
  ): Promise<{ manifest: ModuleManifest; files: Record<string, string> } | null> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        return null;
      }

      // Create manifest from template
      const manifest: ModuleManifest = {
        id: moduleConfig.id,
        name: moduleConfig.name,
        version: '1.0.0',
        description: moduleConfig.description || template.description,
        category: template.category as any,
        author: 'Developer',
        license: 'MIT',
        dependencies: template.dependencies,
        entryPoint: 'index.tsx',
        requiredPermissions: template.manifest_template.requiredPermissions || ['read'],
        subscriptionTiers: template.manifest_template.subscriptionTiers || ['basic', 'pro', 'enterprise'],
        loadOrder: 100,
        autoLoad: false,
        canUnload: true,
        minCoreVersion: '1.0.0',
        ...template.manifest_template
      };

      // Process template files with replacements
      const processedFiles: Record<string, string> = {};
      Object.entries(template.files).forEach(([filename, content]) => {
        processedFiles[filename] = content
          .replace(/{{MODULE_ID}}/g, moduleConfig.id)
          .replace(/{{MODULE_NAME}}/g, moduleConfig.name)
          .replace(/{{MODULE_DESCRIPTION}}/g, moduleConfig.description || template.description);
      });

      return {
        manifest,
        files: processedFiles
      };
    } catch (error) {
      console.error('Error creating module from template:', error);
      return null;
    }
  }

  async registerTemplate(template: Omit<ModuleTemplate, 'id' | 'is_built_in' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('module_templates')
        .insert({
          template_id: template.template_id,
          name: template.name,
          description: template.description,
          category: template.category,
          tags: template.tags as any,
          manifest_template: template.manifest_template as any,
          files: template.files as any,
          dependencies: template.dependencies as any,
          is_built_in: false,
          is_active: true
        });

      if (error) {
        console.error('Error registering template:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in registerTemplate:', error);
      throw error;
    }
  }

  async unregisterTemplate(templateId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_templates')
        .update({ is_active: false })
        .eq('template_id', templateId);

      if (error) {
        console.error('Error unregistering template:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in unregisterTemplate:', error);
      return false;
    }
  }

  private mapDatabaseTemplate(data: any): ModuleTemplate {
    return {
      id: data.id,
      template_id: data.template_id,
      name: data.name,
      description: data.description || '',
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      manifest_template: data.manifest_template || {},
      files: data.files || {},
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      is_built_in: data.is_built_in || false,
      is_active: data.is_active || true,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}

export const moduleTemplateService = ModuleTemplateService.getInstance();
