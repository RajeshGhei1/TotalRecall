
import { supabase } from '@/integrations/supabase/client';

export interface ModuleRegistryEntry {
  id: string;
  module_id: string;
  name: string;
  version: string;
  description?: string;
  category: 'core' | 'business' | 'recruitment' | 'analytics' | 'ai' | 'integration' | 'communication' | 'custom';
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  
  // Dependencies and compatibility
  dependencies: string[];
  peer_dependencies?: string[];
  min_core_version: string;
  max_core_version?: string;
  
  // Module structure
  entry_point: string;
  manifest_data: any;
  
  // Access control
  required_permissions: string[];
  subscription_tiers: string[];
  
  // Module lifecycle
  status: 'draft' | 'pending' | 'approved' | 'published' | 'deprecated' | 'rejected';
  load_order: number;
  auto_load: boolean;
  can_unload: boolean;
  
  // Package info
  package_size?: number;
  package_hash?: string;
  package_url?: string;
  
  // Ratings and metrics
  download_count: number;
  rating_average: number;
  rating_count: number;
  
  // Metadata
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ModuleDependency {
  id: string;
  module_id: string;
  module_version: string;
  dependency_module_id: string;
  dependency_version_constraint: string;
  dependency_type: 'runtime' | 'development' | 'peer' | 'optional';
  created_at: string;
}

export interface ModuleRating {
  id: string;
  module_id: string;
  module_version: string;
  user_id: string;
  tenant_id?: string;
  rating: number;
  review_title?: string;
  review_content?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleInstallation {
  id: string;
  module_id: string;
  module_version: string;
  tenant_id: string;
  installed_by?: string;
  status: 'active' | 'inactive' | 'failed' | 'updating';
  configuration: Record<string, any>;
  installed_at: string;
  updated_at: string;
}

export class ModuleRegistryService {
  private static instance: ModuleRegistryService;

  static getInstance(): ModuleRegistryService {
    if (!ModuleRegistryService.instance) {
      ModuleRegistryService.instance = new ModuleRegistryService();
    }
    return ModuleRegistryService.instance;
  }

  async getPublishedModules(): Promise<ModuleRegistryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('module_registry')
        .select('*')
        .eq('status', 'published')
        .order('download_count', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching published modules:', error);
      return [];
    }
  }

  async getModulesByCategory(category: string): Promise<ModuleRegistryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('module_registry')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .order('rating_average', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching modules for category ${category}:`, error);
      return [];
    }
  }

  async searchModules(query: string): Promise<ModuleRegistryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('module_registry')
        .select('*')
        .eq('status', 'published')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('rating_average', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching modules:', error);
      return [];
    }
  }

  async getModuleDetails(moduleId: string, version?: string): Promise<ModuleRegistryEntry | null> {
    try {
      let query = supabase
        .from('module_registry')
        .select('*')
        .eq('module_id', moduleId);

      if (version) {
        query = query.eq('version', version);
      } else {
        query = query.eq('status', 'published').order('created_at', { ascending: false }).limit(1);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching module details for ${moduleId}:`, error);
      return null;
    }
  }

  async getModuleDependencies(moduleId: string, version: string): Promise<ModuleDependency[]> {
    try {
      const { data, error } = await supabase
        .from('module_dependencies')
        .select('*')
        .eq('module_id', moduleId)
        .eq('module_version', version);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching dependencies for ${moduleId}:`, error);
      return [];
    }
  }

  async getModuleRatings(moduleId: string, version: string): Promise<ModuleRating[]> {
    try {
      const { data, error } = await supabase
        .from('module_ratings')
        .select('*')
        .eq('module_id', moduleId)
        .eq('module_version', version)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ratings for ${moduleId}:`, error);
      return [];
    }
  }

  async submitModuleRating(
    moduleId: string, 
    version: string, 
    rating: number, 
    reviewTitle?: string, 
    reviewContent?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_ratings')
        .upsert({
          module_id: moduleId,
          module_version: version,
          rating,
          review_title: reviewTitle,
          review_content: reviewContent,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      // Update average rating
      await this.updateModuleRatingAverage(moduleId, version);
      
      return true;
    } catch (error) {
      console.error('Error submitting module rating:', error);
      return false;
    }
  }

  async installModule(moduleId: string, version: string, tenantId: string, configuration: Record<string, any> = {}): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_installations')
        .upsert({
          module_id: moduleId,
          module_version: version,
          tenant_id: tenantId,
          configuration,
          installed_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'active'
        });

      if (error) throw error;
      
      // Increment download count
      await this.incrementDownloadCount(moduleId, version);
      
      return true;
    } catch (error) {
      console.error('Error installing module:', error);
      return false;
    }
  }

  async getInstalledModules(tenantId: string): Promise<ModuleInstallation[]> {
    try {
      const { data, error } = await supabase
        .from('module_installations')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('installed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching installed modules:', error);
      return [];
    }
  }

  async uninstallModule(moduleId: string, tenantId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_installations')
        .delete()
        .eq('module_id', moduleId)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error uninstalling module:', error);
      return false;
    }
  }

  async updateModuleConfiguration(moduleId: string, tenantId: string, configuration: Record<string, any>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('module_installations')
        .update({ configuration, updated_at: new Date().toISOString() })
        .eq('module_id', moduleId)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating module configuration:', error);
      return false;
    }
  }

  private async updateModuleRatingAverage(moduleId: string, version: string): Promise<void> {
    try {
      const { data: ratings } = await supabase
        .from('module_ratings')
        .select('rating')
        .eq('module_id', moduleId)
        .eq('module_version', version);

      if (ratings && ratings.length > 0) {
        const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        await supabase
          .from('module_registry')
          .update({ 
            rating_average: Math.round(average * 100) / 100,
            rating_count: ratings.length 
          })
          .eq('module_id', moduleId)
          .eq('version', version);
      }
    } catch (error) {
      console.error('Error updating rating average:', error);
    }
  }

  private async incrementDownloadCount(moduleId: string, version: string): Promise<void> {
    try {
      const { data: module } = await supabase
        .from('module_registry')
        .select('download_count')
        .eq('module_id', moduleId)
        .eq('version', version)
        .single();

      if (module) {
        await supabase
          .from('module_registry')
          .update({ download_count: (module.download_count || 0) + 1 })
          .eq('module_id', moduleId)
          .eq('version', version);
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }
}

export const moduleRegistryService = ModuleRegistryService.getInstance();
