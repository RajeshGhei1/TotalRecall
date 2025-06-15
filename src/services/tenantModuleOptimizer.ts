import { ModuleManifest } from '@/types/modules';
import { moduleResourceManager } from './moduleResourceManager';

export interface TenantModuleMapping {
  tenantId: string;
  subscribedModules: string[];
  activeModules: string[];
  preloadedModules: string[];
  lazyModules: string[];
  lastOptimized: Date;
}

export interface ModulePreloadStrategy {
  moduleId: string;
  strategy: 'eager' | 'lazy' | 'on_demand' | 'predictive';
  priority: number;
  conditions?: {
    timeOfDay?: string[];
    userActivity?: string[];
    resourceThreshold?: number;
  };
}

export interface OptimizationResult {
  tenantId: string;
  optimizations: {
    modulesPreloaded: string[];
    modulesUnloaded: string[];
    strategiesApplied: string[];
  };
  performanceGain: number;
  resourceSavings: number;
}

export class TenantModuleOptimizer {
  private static instance: TenantModuleOptimizer;
  private tenantMappings: Map<string, TenantModuleMapping> = new Map();
  private preloadStrategies: Map<string, ModulePreloadStrategy> = new Map();
  private usagePatterns: Map<string, Map<string, number[]>> = new Map(); // tenant -> module -> usage times

  static getInstance(): TenantModuleOptimizer {
    if (!TenantModuleOptimizer.instance) {
      TenantModuleOptimizer.instance = new TenantModuleOptimizer();
    }
    return TenantModuleOptimizer.instance;
  }

  /**
   * Optimize module loading for a tenant based on their subscriptions and usage
   */
  async optimizeTenantModules(tenantId: string): Promise<OptimizationResult> {
    console.log(`Optimizing modules for tenant: ${tenantId}`);

    const currentMapping = this.getTenantModuleMapping(tenantId);
    const usageData = this.analyzeModuleUsage(tenantId);
    const subscriptions = await this.getTenantSubscriptions(tenantId);

    // Determine which modules should be preloaded, lazy loaded, or unloaded
    const optimizedMapping = this.calculateOptimalMapping(
      tenantId,
      currentMapping,
      usageData,
      subscriptions
    );

    // Apply optimizations
    const result = await this.applyOptimizations(tenantId, currentMapping, optimizedMapping);

    // Update stored mapping
    this.tenantMappings.set(tenantId, optimizedMapping);

    return result;
  }

  /**
   * Set preload strategy for a module
   */
  setModulePreloadStrategy(moduleId: string, strategy: ModulePreloadStrategy): void {
    this.preloadStrategies.set(moduleId, strategy);
    console.log(`Preload strategy set for module ${moduleId}:`, strategy.strategy);
  }

  /**
   * Get tenant module mapping
   */
  getTenantModuleMapping(tenantId: string): TenantModuleMapping {
    return this.tenantMappings.get(tenantId) || {
      tenantId,
      subscribedModules: [],
      activeModules: [],
      preloadedModules: [],
      lazyModules: [],
      lastOptimized: new Date(0)
    };
  }

  /**
   * Record module usage for optimization
   */
  recordModuleUsage(tenantId: string, moduleId: string): void {
    if (!this.usagePatterns.has(tenantId)) {
      this.usagePatterns.set(tenantId, new Map());
    }

    const tenantUsage = this.usagePatterns.get(tenantId)!;
    if (!tenantUsage.has(moduleId)) {
      tenantUsage.set(moduleId, []);
    }

    const moduleUsage = tenantUsage.get(moduleId)!;
    const now = Date.now();
    moduleUsage.push(now);

    // Keep only last 1000 usage records
    if (moduleUsage.length > 1000) {
      moduleUsage.splice(0, moduleUsage.length - 1000);
    }
  }

  /**
   * Implement lazy loading for unused modules
   */
  async implementLazyLoading(tenantId: string): Promise<string[]> {
    const mapping = this.getTenantModuleMapping(tenantId);
    const usageData = this.analyzeModuleUsage(tenantId);
    const currentTime = Date.now();
    const oneHourAgo = currentTime - (60 * 60 * 1000);

    const unusedModules: string[] = [];

    for (const moduleId of mapping.activeModules) {
      const usage = usageData.get(moduleId);
      const lastUsed = usage && usage.length > 0 ? Math.max(...usage) : 0;

      // Mark module for lazy loading if not used in the last hour
      if (lastUsed < oneHourAgo) {
        unusedModules.push(moduleId);
      }
    }

    // Update mapping to move unused modules to lazy
    mapping.lazyModules.push(...unusedModules);
    mapping.activeModules = mapping.activeModules.filter(m => !unusedModules.includes(m));
    mapping.lastOptimized = new Date();

    this.tenantMappings.set(tenantId, mapping);

    console.log(`Implemented lazy loading for ${unusedModules.length} modules for tenant ${tenantId}`);
    return unusedModules;
  }

  /**
   * Implement module preloading strategies
   */
  async implementPreloadingStrategies(tenantId: string): Promise<string[]> {
    const mapping = this.getTenantModuleMapping(tenantId);
    const usageData = this.analyzeModuleUsage(tenantId);
    const preloadedModules: string[] = [];

    for (const moduleId of mapping.subscribedModules) {
      const strategy = this.preloadStrategies.get(moduleId);
      const shouldPreload = this.shouldPreloadModule(tenantId, moduleId, strategy, usageData);

      if (shouldPreload && !mapping.preloadedModules.includes(moduleId)) {
        preloadedModules.push(moduleId);
      }
    }

    // Update mapping
    mapping.preloadedModules.push(...preloadedModules);
    mapping.lazyModules = mapping.lazyModules.filter(m => !preloadedModules.includes(m));
    mapping.lastOptimized = new Date();

    this.tenantMappings.set(tenantId, mapping);

    console.log(`Preloaded ${preloadedModules.length} modules for tenant ${tenantId}`);
    return preloadedModules;
  }

  /**
   * Analyze module usage patterns for a tenant
   */
  private analyzeModuleUsage(tenantId: string): Map<string, number[]> {
    return this.usagePatterns.get(tenantId) || new Map();
  }

  /**
   * Get tenant subscriptions (mock implementation)
   */
  private async getTenantSubscriptions(tenantId: string): Promise<string[]> {
    // This would integrate with the subscription system
    return [
      'tenant_management',
      'user_management',
      'forms_management',
      'analytics',
      'workflow_automation'
    ];
  }

  /**
   * Calculate optimal module mapping for a tenant
   */
  private calculateOptimalMapping(
    tenantId: string,
    current: TenantModuleMapping,
    usageData: Map<string, number[]>,
    subscriptions: string[]
  ): TenantModuleMapping {
    const optimized: TenantModuleMapping = {
      tenantId,
      subscribedModules: subscriptions,
      activeModules: [],
      preloadedModules: [],
      lazyModules: [],
      lastOptimized: new Date()
    };

    const currentTime = Date.now();
    const oneHourAgo = currentTime - (60 * 60 * 1000);
    const oneDayAgo = currentTime - (24 * 60 * 60 * 1000);

    for (const moduleId of subscriptions) {
      const usage = usageData.get(moduleId) || [];
      const strategy = this.preloadStrategies.get(moduleId);
      
      // Recent usage (last hour) -> active
      const recentUsage = usage.filter(time => time > oneHourAgo);
      if (recentUsage.length > 0) {
        optimized.activeModules.push(moduleId);
        continue;
      }

      // Frequent usage (last day) -> preload
      const dailyUsage = usage.filter(time => time > oneDayAgo);
      if (dailyUsage.length > 5 || strategy?.strategy === 'eager') {
        optimized.preloadedModules.push(moduleId);
        continue;
      }

      // Infrequent usage -> lazy load
      optimized.lazyModules.push(moduleId);
    }

    return optimized;
  }

  /**
   * Apply optimizations to a tenant's modules
   */
  private async applyOptimizations(
    tenantId: string,
    current: TenantModuleMapping,
    optimized: TenantModuleMapping
  ): Promise<OptimizationResult> {
    const result: OptimizationResult = {
      tenantId,
      optimizations: {
        modulesPreloaded: [],
        modulesUnloaded: [],
        strategiesApplied: []
      },
      performanceGain: 0,
      resourceSavings: 0
    };

    // Modules to preload
    const toPreload = optimized.preloadedModules.filter(
      m => !current.preloadedModules.includes(m) && !current.activeModules.includes(m)
    );
    result.optimizations.modulesPreloaded = toPreload;

    // Modules to unload (move to lazy)
    const toUnload = current.activeModules.filter(
      m => optimized.lazyModules.includes(m)
    );
    result.optimizations.modulesUnloaded = toUnload;

    // Applied strategies
    const strategies = ['lazy_loading', 'predictive_preloading', 'usage_based_optimization'];
    result.optimizations.strategiesApplied = strategies;

    // Calculate estimated gains
    result.performanceGain = toPreload.length * 0.2; // 20% improvement per preloaded module
    result.resourceSavings = toUnload.length * 0.15; // 15% resource savings per unloaded module

    console.log(`Applied optimizations for tenant ${tenantId}:`, result.optimizations);
    return result;
  }

  /**
   * Determine if a module should be preloaded
   */
  private shouldPreloadModule(
    tenantId: string,
    moduleId: string,
    strategy?: ModulePreloadStrategy,
    usageData?: Map<string, number[]>
  ): boolean {
    if (!strategy) return false;

    switch (strategy.strategy) {
      case 'eager':
        return true;

      case 'lazy':
        return false;

      case 'on_demand':
        return false;

      case 'predictive':
        return this.predictModuleUsage(tenantId, moduleId, usageData);

      default:
        return false;
    }
  }

  /**
   * Predict if a module will be used soon
   */
  private predictModuleUsage(
    tenantId: string,
    moduleId: string,
    usageData?: Map<string, number[]>
  ): boolean {
    if (!usageData) return false;

    const usage = usageData.get(moduleId);
    if (!usage || usage.length < 5) return false;

    // Analyze usage patterns to predict future usage
    const currentTime = Date.now();
    const currentHour = new Date(currentTime).getHours();
    
    // Check if module is typically used at this time of day
    const historicalUsageAtThisHour = usage.filter(time => {
      const hour = new Date(time).getHours();
      return Math.abs(hour - currentHour) <= 1;
    });

    // If frequently used at this time, predict usage
    return historicalUsageAtThisHour.length >= 2;
  }

  /**
   * Get optimization recommendations for a tenant
   */
  getOptimizationRecommendations(tenantId: string): {
    recommendations: string[];
    estimatedImpact: {
      performanceImprovement: number;
      resourceSavings: number;
      loadTimeReduction: number;
    };
  } {
    const mapping = this.getTenantModuleMapping(tenantId);
    const usageData = this.analyzeModuleUsage(tenantId);
    const recommendations: string[] = [];

    // Check for unused active modules
    const currentTime = Date.now();
    const oneHourAgo = currentTime - (60 * 60 * 1000);
    
    const unusedActiveModules = mapping.activeModules.filter(moduleId => {
      const usage = usageData.get(moduleId) || [];
      const lastUsed = usage.length > 0 ? Math.max(...usage) : 0;
      return lastUsed < oneHourAgo;
    });

    if (unusedActiveModules.length > 0) {
      recommendations.push(`Consider lazy loading ${unusedActiveModules.length} unused active modules`);
    }

    // Check for frequently used lazy modules
    const frequentLazyModules = mapping.lazyModules.filter(moduleId => {
      const usage = usageData.get(moduleId) || [];
      const recentUsage = usage.filter(time => time > oneHourAgo);
      return recentUsage.length > 3;
    });

    if (frequentLazyModules.length > 0) {
      recommendations.push(`Consider preloading ${frequentLazyModules.length} frequently used modules`);
    }

    // Check optimization freshness
    const daysSinceOptimization = (currentTime - mapping.lastOptimized.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceOptimization > 7) {
      recommendations.push('Module optimization is over a week old, consider re-optimizing');
    }

    const estimatedImpact = {
      performanceImprovement: (frequentLazyModules.length * 0.15) + (recommendations.length > 2 ? 0.1 : 0),
      resourceSavings: unusedActiveModules.length * 0.1,
      loadTimeReduction: frequentLazyModules.length * 0.2
    };

    return { recommendations, estimatedImpact };
  }
}

export const tenantModuleOptimizer = TenantModuleOptimizer.getInstance();
