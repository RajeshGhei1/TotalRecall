
import { supabase } from '@/integrations/supabase/client';
import { ModuleLoader } from './moduleLoader';
import { ValidationResult } from './types';

export class ModuleValidator {
  private moduleLoader: ModuleLoader;

  constructor(moduleLoader: ModuleLoader) {
    this.moduleLoader = moduleLoader;
  }

  /**
   * Validate that a component matches its database manifest
   */
  async validateModuleComponent(moduleId: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      console.log(`🔍 Validating module: ${moduleId}`);
      
      // Get database manifest
      const { data: dbModule, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', moduleId)
        .single();

      if (error || !dbModule) {
        errors.push(`Module not found in database: ${moduleId}`);
        return { isValid: false, errors, warnings };
      }

      // Try to load component
      const component = await this.moduleLoader.loadModuleComponent(moduleId);
      if (!component) {
        errors.push(`Component file not found for module: ${moduleId}`);
        return { isValid: false, errors, warnings };
      }

      // Check if component has required metadata
      const componentMetadata = (component as unknown).moduleMetadata;
      if (!componentMetadata) {
        warnings.push(`Component missing moduleMetadata: ${moduleId}`);
      }

      const isValid = errors.length === 0;
      console.log(`✅ Validation complete for ${moduleId}: ${isValid ? 'VALID' : 'INVALID'}`);
      
      return { isValid, errors, warnings };

    } catch (error) {
      console.error(`❌ Validation error for ${moduleId}:`, error);
      errors.push(`Validation error: ${error}`);
      return { isValid: false, errors, warnings };
    }
  }
}
