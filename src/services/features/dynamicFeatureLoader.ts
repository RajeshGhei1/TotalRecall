/**
 * DYNAMIC FEATURE LOADER SERVICE
 * Implements Principle 3: Pluggability - Configuration-driven feature loading
 */

import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  StandardsCompliantFeature, 
  FeatureInterface, 
  FeatureContext, 
  FeatureExecutionResult,
  FeatureExecutor,
  FeatureRegistry,
  FeatureFilters
} from '@/types/standardsCompliantFeatures';

// Component cache to avoid re-importing
const componentCache = new Map<string, React.ComponentType>();
const serviceCache = new Map<string, FeatureExecutor>();

export class DynamicFeatureLoader implements FeatureRegistry {
  
  /**
   * Load a feature component dynamically based on its ui_component_path
   * Implements caching for performance
   */
  static async loadFeatureComponent(componentPath: string): Promise<React.ComponentType> {
    // Check cache first
    if (componentCache.has(componentPath)) {
      return componentCache.get(componentPath)!;
    }

    try {
      // Dynamic import with error handling
      const module = await import(componentPath);
      const Component = module.default || module[Object.keys(module)[0]];
      
      if (!Component) {
        throw new Error(`No component found in module: ${componentPath}`);
      }

      // Cache the component
      componentCache.set(componentPath, Component);
      
      console.log(`✅ Feature component loaded: ${componentPath}`);
      return Component;
      
    } catch (error) {
      console.error(`❌ Failed to load feature component: ${componentPath}`, error);
      
      // Return a fallback component that shows the error
      const FallbackComponent: React.ComponentType = () => React.createElement(
        'div',
        { 
          style: { 
            padding: '16px', 
            border: '1px solid #ef4444', 
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            color: '#dc2626'
          }
        },
        `Failed to load feature: ${componentPath.split('/').pop()}`
      );
      
      return FallbackComponent;
    }
  }

  /**
   * Load a feature service/executor dynamically
   */
  static async loadFeatureService(servicePath: string): Promise<FeatureExecutor> {
    // Check cache first
    if (serviceCache.has(servicePath)) {
      return serviceCache.get(servicePath)!;
    }

    try {
      const module = await import(servicePath);
      const Service = module.default || module[Object.keys(module)[0]];
      
      if (!Service) {
        throw new Error(`No service found in module: ${servicePath}`);
      }

      // Cache the service
      serviceCache.set(servicePath, Service);
      
      console.log(`✅ Feature service loaded: ${servicePath}`);
      return Service;
      
    } catch (error) {
      console.error(`❌ Failed to load feature service: ${servicePath}`, error);
      
      // Return a fallback service
      const fallbackService: FeatureExecutor = {
        async execute() {
          return {
            success: false,
            errors: [{ 
              code: 'SERVICE_LOAD_ERROR', 
              message: `Failed to load service: ${servicePath}`,
              recoverable: false
            }]
          };
        },
        validate() {
          return { valid: false, errors: [{ field: 'service', message: 'Service not loaded', code: 'SERVICE_ERROR' }] };
        },
        getSchema() {
          return { 
            input: { type: 'object' } as any, 
            output: { type: 'object' } as any 
          };
        },
        getMetadata() {
          return {
            name: 'Fallback Service',
            description: 'Service failed to load',
            version: '0.0.0',
            category: 'error',
            tags: ['error'],
            author: 'system'
          };
        }
      };
      
      return fallbackService;
    }
  }

  /**
   * Get feature interfaces from database
   */
  static async getFeatureInterfaces(featureId: string): Promise<FeatureInterface[]> {
    const { data, error } = await supabase
      .from('feature_interfaces')
      .select('*')
      .eq('feature_id', featureId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching feature interfaces:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Register a new feature in the system
   */
  async registerFeature(feature: StandardsCompliantFeature): Promise<void> {
    try {
      // Insert feature into module_features table (using standards-compliant columns)
      const { error: featureError } = await supabase
        .from('module_features')
        .upsert({
          feature_id: feature.feature_id,
          feature_name: feature.name,
          feature_description: feature.description,
          version: feature.version,
          is_active: feature.is_active,
          input_schema: feature.input_schema,
          output_schema: feature.output_schema,
          ui_component_path: feature.ui_component_path,
          feature_category: feature.category,
          tags: feature.tags,
          created_by: feature.created_by,
          feature_config: feature.feature_config,
          dependencies: feature.dependencies,
          requirements: feature.requirements,
          module_name: 'global', // Global features can be assigned to any module
          is_enabled_by_default: true,
          is_premium_feature: false,
          sort_order: 0
        }, {
          onConflict: 'feature_id'
        });

      if (featureError) {
        throw featureError;
      }

      console.log(`✅ Feature registered: ${feature.feature_id}`);
      
    } catch (error) {
      console.error(`❌ Failed to register feature: ${feature.feature_id}`, error);
      throw error;
    }
  }

  /**
   * Unregister a feature from the system
   */
  async unregisterFeature(featureId: string): Promise<void> {
    try {
      // Remove from caches
      const interfaces = await DynamicFeatureLoader.getFeatureInterfaces(featureId);
      interfaces.forEach(interface_ => {
        if (interface_.interface_type === 'component') {
          componentCache.delete(interface_.interface_path);
        } else if (interface_.interface_type === 'service') {
          serviceCache.delete(interface_.interface_path);
        }
      });

      // Deactivate in database (don't delete for audit trail)
      const { error } = await supabase
        .from('module_features')
        .update({ is_active: false })
        .eq('feature_id', featureId);

      if (error) {
        throw error;
      }

      console.log(`✅ Feature unregistered: ${featureId}`);
      
    } catch (error) {
      console.error(`❌ Failed to unregister feature: ${featureId}`, error);
      throw error;
    }
  }

  /**
   * Get a specific feature by ID
   */
  async getFeature(featureId: string): Promise<StandardsCompliantFeature | null> {
    try {
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .eq('feature_id', featureId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      // Convert database record to standards-compliant feature
      return this.mapDatabaseToFeature(data);
      
    } catch (error) {
      console.error(`❌ Failed to get feature: ${featureId}`, error);
      return null;
    }
  }

  /**
   * List features with optional filtering
   */
  async listFeatures(filters?: FeatureFilters): Promise<StandardsCompliantFeature[]> {
    try {
      let query = supabase
        .from('module_features')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters?.category) {
        query = query.eq('feature_category', filters.category);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      if (filters?.search) {
        query = query.or(`feature_name.ilike.%${filters.search}%,feature_description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('feature_name');

      if (error) {
        throw error;
      }

      // Convert database records to standards-compliant features
      return (data || []).map(record => this.mapDatabaseToFeature(record));
      
    } catch (error) {
      console.error('❌ Failed to list features:', error);
      return [];
    }
  }

  /**
   * Execute a feature with given input and context
   */
  async executeFeature(
    featureId: string, 
    input: unknown, 
    context: FeatureContext
  ): Promise<FeatureExecutionResult> {
    try {
      const feature = await this.getFeature(featureId);
      if (!feature) {
        return {
          success: false,
          errors: [{ 
            code: 'FEATURE_NOT_FOUND', 
            message: `Feature not found: ${featureId}`,
            recoverable: false
          }]
        };
      }

      // Get service interface
      const interfaces = await DynamicFeatureLoader.getFeatureInterfaces(featureId);
      const serviceInterface = interfaces.find(i => i.interface_type === 'service');
      
      if (!serviceInterface) {
        return {
          success: false,
          errors: [{ 
            code: 'SERVICE_NOT_FOUND', 
            message: `No service interface found for feature: ${featureId}`,
            recoverable: false
          }]
        };
      }

      // Load and execute service
      const service = await DynamicFeatureLoader.loadFeatureService(serviceInterface.interface_path);
      const startTime = Date.now();
      
      // Validate input first
      const validation = service.validate(input);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors?.map(e => ({
            code: e.code,
            message: e.message,
            recoverable: true
          })) || [],
          executionTime: Date.now() - startTime
        };
      }

      // Execute the feature
      const result = await service.execute(input);
      const executionTime = Date.now() - startTime;

      return {
        ...result,
        executionTime
      };
      
    } catch (error) {
      console.error(`❌ Failed to execute feature: ${featureId}`, error);
      return {
        success: false,
        errors: [{ 
          code: 'EXECUTION_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown execution error',
          recoverable: false
        }]
      };
    }
  }

  /**
   * Clear component and service caches
   */
  static clearCache(): void {
    componentCache.clear();
    serviceCache.clear();
    console.log('🧹 Feature loader cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { components: number; services: number } {
    return {
      components: componentCache.size,
      services: serviceCache.size
    };
  }

  /**
   * Map database record to standards-compliant feature
   */
  private mapDatabaseToFeature(record: any): StandardsCompliantFeature {
    return {
      feature_id: record.feature_id,
      name: record.feature_name,
      description: record.feature_description || '',
      version: record.version || 'v1.0.0',
      is_active: record.is_active,
      input_schema: record.input_schema || { type: 'object' },
      output_schema: record.output_schema || { type: 'object' },
      ui_component_path: record.ui_component_path || '',
      category: record.feature_category || 'general',
      tags: record.tags || [],
      created_by: record.created_by || 'system',
      updated_at: record.updated_at || new Date().toISOString(),
      feature_config: record.feature_config || { isolated: true, stateless: true, pluggable: true },
      dependencies: record.dependencies || [],
      requirements: record.requirements || []
    };
  }
}

// Export singleton instance
export const featureLoader = new DynamicFeatureLoader(); 