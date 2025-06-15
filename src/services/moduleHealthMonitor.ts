
import { ModuleResourceUsage } from './moduleResourceManager';

export interface ModuleHealthStatus {
  moduleId: string;
  tenantId?: string;
  status: 'healthy' | 'warning' | 'critical' | 'failed';
  score: number; // 0-100
  checks: HealthCheck[];
  lastChecked: Date;
  recoveryActions: RecoveryAction[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  value?: number;
  threshold?: number;
  weight: number; // Importance weight for overall score
}

export interface RecoveryAction {
  type: 'restart' | 'scale' | 'migrate' | 'clear_cache' | 'notify_admin';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  automated: boolean;
  estimatedDuration: number; // minutes
}

export class ModuleHealthMonitor {
  private static instance: ModuleHealthMonitor;
  private healthStatuses: Map<string, ModuleHealthStatus> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): ModuleHealthMonitor {
    if (!ModuleHealthMonitor.instance) {
      ModuleHealthMonitor.instance = new ModuleHealthMonitor();
    }
    return ModuleHealthMonitor.instance;
  }

  /**
   * Start health monitoring for all modules
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks();
    }, intervalMs);

    console.log(`Module health monitoring started with ${intervalMs}ms interval`);
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Module health monitoring stopped');
    }
  }

  /**
   * Get health status for a specific module
   */
  getModuleHealth(moduleId: string, tenantId?: string): ModuleHealthStatus | null {
    const key = tenantId ? `${moduleId}:${tenantId}` : moduleId;
    return this.healthStatuses.get(key) || null;
  }

  /**
   * Get health status for all modules
   */
  getAllModuleHealth(): ModuleHealthStatus[] {
    return Array.from(this.healthStatuses.values());
  }

  /**
   * Perform health checks for all modules
   */
  async performHealthChecks(): Promise<void> {
    // Get list of active modules (this would come from module manager)
    const activeModules = this.getActiveModules();

    for (const { moduleId, tenantId } of activeModules) {
      const healthStatus = await this.checkModuleHealth(moduleId, tenantId);
      const key = tenantId ? `${moduleId}:${tenantId}` : moduleId;
      this.healthStatuses.set(key, healthStatus);

      // Trigger auto-recovery if needed
      if (healthStatus.status === 'critical' || healthStatus.status === 'failed') {
        await this.triggerAutoRecovery(healthStatus);
      }
    }
  }

  /**
   * Check health of a specific module
   */
  async checkModuleHealth(moduleId: string, tenantId?: string): Promise<ModuleHealthStatus> {
    const checks: HealthCheck[] = [];

    // Performance checks
    const performanceCheck = await this.checkPerformance(moduleId, tenantId);
    checks.push(performanceCheck);

    // Resource usage checks
    const resourceCheck = await this.checkResourceUsage(moduleId, tenantId);
    checks.push(resourceCheck);

    // Error rate checks
    const errorCheck = await this.checkErrorRate(moduleId, tenantId);
    checks.push(errorCheck);

    // Availability checks
    const availabilityCheck = await this.checkAvailability(moduleId, tenantId);
    checks.push(availabilityCheck);

    // Memory leak checks
    const memoryCheck = await this.checkMemoryLeaks(moduleId, tenantId);
    checks.push(memoryCheck);

    // Calculate overall health score
    const score = this.calculateHealthScore(checks);
    const status = this.determineHealthStatus(score, checks);

    // Generate recovery actions if needed
    const recoveryActions = this.generateRecoveryActions(checks, status);

    return {
      moduleId,
      tenantId,
      status,
      score,
      checks,
      lastChecked: new Date(),
      recoveryActions
    };
  }

  /**
   * Check module performance
   */
  private async checkPerformance(moduleId: string, tenantId?: string): Promise<HealthCheck> {
    // This would get actual performance metrics from monitoring system
    const avgResponseTime = 150; // Mock data
    const threshold = 1000; // 1 second threshold

    return {
      name: 'Response Time',
      status: avgResponseTime > threshold ? 'fail' : avgResponseTime > threshold * 0.7 ? 'warn' : 'pass',
      message: `Average response time: ${avgResponseTime}ms`,
      value: avgResponseTime,
      threshold,
      weight: 0.3
    };
  }

  /**
   * Check resource usage
   */
  private async checkResourceUsage(moduleId: string, tenantId?: string): Promise<HealthCheck> {
    // This would get actual resource usage from resource manager
    const cpuUsage = 65; // Mock data - percentage
    const threshold = 80;

    return {
      name: 'CPU Usage',
      status: cpuUsage > threshold ? 'fail' : cpuUsage > threshold * 0.8 ? 'warn' : 'pass',
      message: `CPU usage: ${cpuUsage}%`,
      value: cpuUsage,
      threshold,
      weight: 0.25
    };
  }

  /**
   * Check error rate
   */
  private async checkErrorRate(moduleId: string, tenantId?: string): Promise<HealthCheck> {
    // This would get actual error rate from logs
    const errorRate = 2.1; // Mock data - percentage
    const threshold = 5;

    return {
      name: 'Error Rate',
      status: errorRate > threshold ? 'fail' : errorRate > threshold * 0.6 ? 'warn' : 'pass',
      message: `Error rate: ${errorRate}%`,
      value: errorRate,
      threshold,
      weight: 0.25
    };
  }

  /**
   * Check module availability
   */
  private async checkAvailability(moduleId: string, tenantId?: string): Promise<HealthCheck> {
    // This would perform actual availability checks
    const uptime = 99.5; // Mock data - percentage
    const threshold = 99.0;

    return {
      name: 'Availability',
      status: uptime < threshold ? 'fail' : uptime < threshold * 1.01 ? 'warn' : 'pass',
      message: `Uptime: ${uptime}%`,
      value: uptime,
      threshold,
      weight: 0.2
    };
  }

  /**
   * Check for memory leaks
   */
  private async checkMemoryLeaks(moduleId: string, tenantId?: string): Promise<HealthCheck> {
    // This would analyze memory usage trends
    const memoryGrowthRate = 1.2; // Mock data - growth factor
    const threshold = 1.5;

    return {
      name: 'Memory Stability',
      status: memoryGrowthRate > threshold ? 'fail' : memoryGrowthRate > threshold * 0.8 ? 'warn' : 'pass',
      message: `Memory growth rate: ${memoryGrowthRate}x`,
      value: memoryGrowthRate,
      threshold,
      weight: 0.15
    };
  }

  /**
   * Calculate overall health score
   */
  private calculateHealthScore(checks: HealthCheck[]): number {
    let totalWeight = 0;
    let weightedScore = 0;

    for (const check of checks) {
      let checkScore = 0;
      if (check.status === 'pass') checkScore = 100;
      else if (check.status === 'warn') checkScore = 60;
      else if (check.status === 'fail') checkScore = 20;

      weightedScore += checkScore * check.weight;
      totalWeight += check.weight;
    }

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  /**
   * Determine health status from score and checks
   */
  private determineHealthStatus(score: number, checks: HealthCheck[]): 'healthy' | 'warning' | 'critical' | 'failed' {
    const criticalFailures = checks.filter(c => c.status === 'fail' && c.weight >= 0.2).length;
    
    if (criticalFailures > 0 || score < 30) return 'failed';
    if (score < 60) return 'critical';
    if (score < 80) return 'warning';
    return 'healthy';
  }

  /**
   * Generate recovery actions based on health checks
   */
  private generateRecoveryActions(checks: HealthCheck[], status: string): RecoveryAction[] {
    const actions: RecoveryAction[] = [];

    // Performance-based actions
    const performanceCheck = checks.find(c => c.name === 'Response Time');
    if (performanceCheck?.status === 'fail') {
      actions.push({
        type: 'scale',
        description: 'Scale up module resources to improve response time',
        priority: 'high',
        automated: true,
        estimatedDuration: 5
      });
    }

    // Resource-based actions
    const cpuCheck = checks.find(c => c.name === 'CPU Usage');
    if (cpuCheck?.status === 'fail') {
      actions.push({
        type: 'scale',
        description: 'Scale up CPU resources',
        priority: 'high',
        automated: true,
        estimatedDuration: 3
      });
    }

    // Error-based actions
    const errorCheck = checks.find(c => c.name === 'Error Rate');
    if (errorCheck?.status === 'fail') {
      actions.push({
        type: 'restart',
        description: 'Restart module to clear error state',
        priority: 'medium',
        automated: false,
        estimatedDuration: 2
      });
    }

    // Memory-based actions
    const memoryCheck = checks.find(c => c.name === 'Memory Stability');
    if (memoryCheck?.status === 'fail') {
      actions.push({
        type: 'restart',
        description: 'Restart module to clear memory leaks',
        priority: 'medium',
        automated: true,
        estimatedDuration: 3
      });
    }

    // Critical status actions
    if (status === 'failed') {
      actions.push({
        type: 'notify_admin',
        description: 'Notify system administrators of critical module failure',
        priority: 'critical',
        automated: true,
        estimatedDuration: 1
      });
    }

    return actions;
  }

  /**
   * Trigger auto-recovery for a module
   */
  private async triggerAutoRecovery(healthStatus: ModuleHealthStatus): Promise<void> {
    const automatedActions = healthStatus.recoveryActions.filter(a => a.automated);
    
    for (const action of automatedActions) {
      console.log(`Triggering auto-recovery action: ${action.type} for module ${healthStatus.moduleId}`);
      
      try {
        await this.executeRecoveryAction(action, healthStatus);
        console.log(`Auto-recovery action ${action.type} completed successfully`);
      } catch (error) {
        console.error(`Auto-recovery action ${action.type} failed:`, error);
      }
    }
  }

  /**
   * Execute a recovery action
   */
  private async executeRecoveryAction(action: RecoveryAction, healthStatus: ModuleHealthStatus): Promise<void> {
    switch (action.type) {
      case 'restart':
        // This would trigger module restart
        console.log(`Restarting module ${healthStatus.moduleId}`);
        break;
      
      case 'scale':
        // This would trigger module scaling
        console.log(`Scaling module ${healthStatus.moduleId}`);
        break;
      
      case 'clear_cache':
        // This would clear module cache
        console.log(`Clearing cache for module ${healthStatus.moduleId}`);
        break;
      
      case 'notify_admin':
        // This would send notifications
        console.log(`Notifying admins about module ${healthStatus.moduleId}`);
        break;
      
      case 'migrate':
        // This would migrate module to different infrastructure
        console.log(`Migrating module ${healthStatus.moduleId}`);
        break;
    }
  }

  /**
   * Get list of active modules (mock implementation)
   */
  private getActiveModules(): Array<{ moduleId: string; tenantId?: string }> {
    // This would get actual active modules from module manager
    return [
      { moduleId: 'tenant_management' },
      { moduleId: 'user_management' },
      { moduleId: 'subscription_management' },
      { moduleId: 'forms_management', tenantId: 'tenant-1' },
      { moduleId: 'analytics', tenantId: 'tenant-2' }
    ];
  }
}

export const moduleHealthMonitor = ModuleHealthMonitor.getInstance();
