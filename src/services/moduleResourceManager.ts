import { ModuleManifest } from '@/types/modules';

export interface ModuleResourceLimits {
  memory: number; // MB
  cpu: number; // CPU units
  storage: number; // MB
  networkBandwidth: number; // MB/s
  concurrentRequests: number;
}

export interface ModuleResourceUsage {
  moduleId: string;
  tenantId: string;
  timestamp: Date;
  memoryUsage: number;
  cpuUsage: number;
  storageUsage: number;
  networkUsage: number;
  activeRequests: number;
  responseTime: number;
}

export interface ModulePerformanceMetrics {
  moduleId: string;
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  resourceEfficiency: number;
  scalingScore: number;
}

export class ModuleResourceManager {
  private static instance: ModuleResourceManager;
  private resourceUsageHistory: Map<string, ModuleResourceUsage[]> = new Map();
  private resourceLimits: Map<string, ModuleResourceLimits> = new Map();
  private performanceMetrics: Map<string, ModulePerformanceMetrics> = new Map();

  static getInstance(): ModuleResourceManager {
    if (!ModuleResourceManager.instance) {
      ModuleResourceManager.instance = new ModuleResourceManager();
    }
    return ModuleResourceManager.instance;
  }

  /**
   * Set resource limits for a module
   */
  setModuleResourceLimits(moduleId: string, limits: ModuleResourceLimits): void {
    this.resourceLimits.set(moduleId, limits);
    console.log(`Resource limits set for module ${moduleId}:`, limits);
  }

  /**
   * Get resource limits for a module
   */
  getModuleResourceLimits(moduleId: string): ModuleResourceLimits {
    return this.resourceLimits.get(moduleId) || {
      memory: 512, // Default 512MB
      cpu: 1.0, // Default 1 CPU unit
      storage: 1024, // Default 1GB
      networkBandwidth: 10, // Default 10MB/s
      concurrentRequests: 100 // Default 100 concurrent requests
    };
  }

  /**
   * Record resource usage for a module
   */
  recordResourceUsage(usage: ModuleResourceUsage): void {
    const key = `${usage.moduleId}:${usage.tenantId}`;
    
    if (!this.resourceUsageHistory.has(key)) {
      this.resourceUsageHistory.set(key, []);
    }
    
    const history = this.resourceUsageHistory.get(key)!;
    history.push(usage);
    
    // Keep only last 1000 records per module-tenant combination
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
    
    // Update performance metrics
    this.updatePerformanceMetrics(usage.moduleId);
  }

  /**
   * Get current resource usage for a module
   */
  getCurrentResourceUsage(moduleId: string, tenantId?: string): ModuleResourceUsage[] {
    if (tenantId) {
      const key = `${moduleId}:${tenantId}`;
      return this.resourceUsageHistory.get(key)?.slice(-10) || [];
    }
    
    // Get usage across all tenants for this module
    const allUsage: ModuleResourceUsage[] = [];
    for (const [key, history] of this.resourceUsageHistory) {
      if (key.startsWith(`${moduleId}:`)) {
        allUsage.push(...history.slice(-10));
      }
    }
    
    return allUsage;
  }

  /**
   * Check if module is exceeding resource limits
   */
  isModuleOverLimit(moduleId: string, tenantId: string): boolean {
    const limits = this.getModuleResourceLimits(moduleId);
    const currentUsage = this.getCurrentResourceUsage(moduleId, tenantId);
    
    if (currentUsage.length === 0) return false;
    
    const latestUsage = currentUsage[currentUsage.length - 1];
    
    return (
      latestUsage.memoryUsage > limits.memory ||
      latestUsage.cpuUsage > limits.cpu ||
      latestUsage.storageUsage > limits.storage ||
      latestUsage.activeRequests > limits.concurrentRequests
    );
  }

  /**
   * Get scaling recommendation for a module
   */
  getScalingRecommendation(moduleId: string): {
    shouldScale: boolean;
    direction: 'up' | 'down' | 'maintain';
    factor: number;
    reason: string;
  } {
    const metrics = this.performanceMetrics.get(moduleId);
    
    if (!metrics) {
      return {
        shouldScale: false,
        direction: 'maintain',
        factor: 1.0,
        reason: 'Insufficient data for scaling decision'
      };
    }

    // Scale up if performance is degrading
    if (metrics.averageResponseTime > 2000 || metrics.errorRate > 0.05) {
      return {
        shouldScale: true,
        direction: 'up',
        factor: 1.5,
        reason: 'High response time or error rate detected'
      };
    }

    // Scale down if resource efficiency is low
    if (metrics.resourceEfficiency < 0.3 && metrics.scalingScore > 1.0) {
      return {
        shouldScale: true,
        direction: 'down',
        factor: 0.8,
        reason: 'Low resource utilization detected'
      };
    }

    return {
      shouldScale: false,
      direction: 'maintain',
      factor: 1.0,
      reason: 'Performance within acceptable range'
    };
  }

  /**
   * Update performance metrics for a module
   */
  private updatePerformanceMetrics(moduleId: string): void {
    const allUsage = this.getCurrentResourceUsage(moduleId);
    
    if (allUsage.length === 0) return;

    const avgResponseTime = allUsage.reduce((sum, usage) => sum + usage.responseTime, 0) / allUsage.length;
    const throughput = allUsage.length / (Date.now() - allUsage[0].timestamp.getTime()) * 1000;
    const errorRate = 0; // Would be calculated from actual error data
    
    // Calculate resource efficiency (lower is better for scaling down)
    const limits = this.getModuleResourceLimits(moduleId);
    const avgMemoryUsage = allUsage.reduce((sum, usage) => sum + usage.memoryUsage, 0) / allUsage.length;
    const avgCpuUsage = allUsage.reduce((sum, usage) => sum + usage.cpuUsage, 0) / allUsage.length;
    
    const resourceEfficiency = (avgMemoryUsage / limits.memory + avgCpuUsage / limits.cpu) / 2;
    
    // Calculate scaling score based on various factors
    const scalingScore = this.calculateScalingScore(moduleId, allUsage);

    this.performanceMetrics.set(moduleId, {
      moduleId,
      averageResponseTime: avgResponseTime,
      throughput,
      errorRate,
      resourceEfficiency,
      scalingScore
    });
  }

  /**
   * Calculate scaling score for a module
   */
  private calculateScalingScore(moduleId: string, usage: ModuleResourceUsage[]): number {
    if (usage.length < 2) return 1.0;

    // Analyze trends in resource usage
    const recentUsage = usage.slice(-10);
    const olderUsage = usage.slice(-20, -10);
    
    if (olderUsage.length === 0) return 1.0;

    const recentAvgCpu = recentUsage.reduce((sum, u) => sum + u.cpuUsage, 0) / recentUsage.length;
    const olderAvgCpu = olderUsage.reduce((sum, u) => sum + u.cpuUsage, 0) / olderUsage.length;
    
    const trend = recentAvgCpu / olderAvgCpu;
    
    // Score above 1.0 suggests scaling up, below 1.0 suggests scaling down
    return Math.max(0.5, Math.min(2.0, trend));
  }

  /**
   * Get resource allocation strategy for a module
   */
  getResourceAllocationStrategy(moduleId: string): {
    strategy: 'conservative' | 'aggressive' | 'adaptive';
    allocatedResources: ModuleResourceLimits;
    reasoning: string;
  } {
    const metrics = this.performanceMetrics.get(moduleId);
    const baseLimits = this.getModuleResourceLimits(moduleId);
    
    if (!metrics) {
      return {
        strategy: 'conservative',
        allocatedResources: baseLimits,
        reasoning: 'No performance data available, using conservative allocation'
      };
    }

    if (metrics.scalingScore > 1.3) {
      // Aggressive scaling for high-demand modules
      return {
        strategy: 'aggressive',
        allocatedResources: {
          memory: baseLimits.memory * 1.5,
          cpu: baseLimits.cpu * 1.5,
          storage: baseLimits.storage * 1.2,
          networkBandwidth: baseLimits.networkBandwidth * 1.3,
          concurrentRequests: baseLimits.concurrentRequests * 1.5
        },
        reasoning: 'High demand detected, allocating additional resources'
      };
    }

    if (metrics.resourceEfficiency < 0.4) {
      // Conservative scaling for low-utilization modules
      return {
        strategy: 'conservative',
        allocatedResources: {
          memory: baseLimits.memory * 0.8,
          cpu: baseLimits.cpu * 0.8,
          storage: baseLimits.storage,
          networkBandwidth: baseLimits.networkBandwidth * 0.9,
          concurrentRequests: baseLimits.concurrentRequests * 0.8
        },
        reasoning: 'Low utilization detected, reducing resource allocation'
      };
    }

    // Adaptive scaling
    return {
      strategy: 'adaptive',
      allocatedResources: {
        memory: baseLimits.memory * metrics.scalingScore,
        cpu: baseLimits.cpu * metrics.scalingScore,
        storage: baseLimits.storage,
        networkBandwidth: baseLimits.networkBandwidth * Math.sqrt(metrics.scalingScore),
        concurrentRequests: Math.round(baseLimits.concurrentRequests * metrics.scalingScore)
      },
      reasoning: 'Adaptive scaling based on performance metrics and trends'
    };
  }
}

export const moduleResourceManager = ModuleResourceManager.getInstance();
