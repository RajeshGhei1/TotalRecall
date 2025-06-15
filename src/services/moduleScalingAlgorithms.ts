
import { moduleResourceManager, ModuleResourceUsage, ModulePerformanceMetrics } from './moduleResourceManager';

export interface ScalingDecision {
  moduleId: string;
  action: 'scale_up' | 'scale_down' | 'maintain';
  factor: number;
  confidence: number;
  reasoning: string;
  estimatedImpact: {
    performanceImprovement: number;
    costChange: number;
    resourceUtilization: number;
  };
}

export interface UsagePattern {
  type: 'spike' | 'steady' | 'declining' | 'cyclical';
  confidence: number;
  duration: number;
  intensity: number;
}

export class ModuleScalingAlgorithms {
  private static instance: ModuleScalingAlgorithms;

  static getInstance(): ModuleScalingAlgorithms {
    if (!ModuleScalingAlgorithms.instance) {
      ModuleScalingAlgorithms.instance = new ModuleScalingAlgorithms();
    }
    return ModuleScalingAlgorithms.instance;
  }

  /**
   * Analyze usage patterns for a module
   */
  analyzeUsagePattern(moduleId: string, tenantId?: string): UsagePattern {
    const usage = moduleResourceManager.getCurrentResourceUsage(moduleId, tenantId);
    
    if (usage.length < 5) {
      return {
        type: 'steady',
        confidence: 0.1,
        duration: 0,
        intensity: 0
      };
    }

    // Analyze CPU usage trends
    const cpuValues = usage.map(u => u.cpuUsage);
    const memoryValues = usage.map(u => u.memoryUsage);
    
    // Calculate variance and trends
    const cpuTrend = this.calculateTrend(cpuValues);
    const memoryTrend = this.calculateTrend(memoryValues);
    const variance = this.calculateVariance(cpuValues);
    
    // Determine pattern type
    if (variance > 0.5) {
      // High variance suggests spikes
      return {
        type: 'spike',
        confidence: Math.min(0.9, variance),
        duration: usage.length,
        intensity: Math.max(...cpuValues) / this.average(cpuValues)
      };
    }
    
    if (cpuTrend > 1.2 || memoryTrend > 1.2) {
      // Increasing trend
      return {
        type: 'spike',
        confidence: 0.7,
        duration: usage.length,
        intensity: Math.max(cpuTrend, memoryTrend)
      };
    }
    
    if (cpuTrend < 0.8 && memoryTrend < 0.8) {
      // Declining trend
      return {
        type: 'declining',
        confidence: 0.8,
        duration: usage.length,
        intensity: 1 - Math.min(cpuTrend, memoryTrend)
      };
    }

    // Check for cyclical patterns
    if (this.detectCyclicalPattern(cpuValues)) {
      return {
        type: 'cyclical',
        confidence: 0.6,
        duration: usage.length,
        intensity: variance
      };
    }

    return {
      type: 'steady',
      confidence: 0.8,
      duration: usage.length,
      intensity: variance
    };
  }

  /**
   * Make scaling decision based on usage patterns and performance
   */
  makeScalingDecision(moduleId: string, tenantId?: string): ScalingDecision {
    const pattern = this.analyzeUsagePattern(moduleId, tenantId);
    const recommendation = moduleResourceManager.getScalingRecommendation(moduleId);
    
    let action: 'scale_up' | 'scale_down' | 'maintain' = 'maintain';
    let factor = 1.0;
    let confidence = 0.5;
    let reasoning = 'No clear scaling signal detected';

    // Decision logic based on pattern and recommendations
    if (pattern.type === 'spike' && pattern.confidence > 0.6) {
      action = 'scale_up';
      factor = Math.min(2.0, 1.0 + pattern.intensity * 0.5);
      confidence = pattern.confidence;
      reasoning = `Spike pattern detected with ${(pattern.confidence * 100).toFixed(0)}% confidence`;
    } else if (pattern.type === 'declining' && pattern.confidence > 0.7) {
      action = 'scale_down';
      factor = Math.max(0.5, 1.0 - pattern.intensity * 0.3);
      confidence = pattern.confidence;
      reasoning = `Declining usage pattern detected with ${(pattern.confidence * 100).toFixed(0)}% confidence`;
    } else if (recommendation.shouldScale) {
      action = recommendation.direction === 'up' ? 'scale_up' : 'scale_down';
      factor = recommendation.factor;
      confidence = 0.7;
      reasoning = recommendation.reason;
    }

    // Estimate impact
    const estimatedImpact = this.estimateScalingImpact(moduleId, action, factor);

    return {
      moduleId,
      action,
      factor,
      confidence,
      reasoning,
      estimatedImpact
    };
  }

  /**
   * Predictive scaling based on historical patterns
   */
  predictiveScaling(moduleId: string): ScalingDecision {
    const usage = moduleResourceManager.getCurrentResourceUsage(moduleId);
    
    if (usage.length < 20) {
      return {
        moduleId,
        action: 'maintain',
        factor: 1.0,
        confidence: 0.1,
        reasoning: 'Insufficient historical data for predictive scaling',
        estimatedImpact: { performanceImprovement: 0, costChange: 0, resourceUtilization: 0 }
      };
    }

    // Predict next usage based on trends
    const cpuValues = usage.map(u => u.cpuUsage);
    const nextCpuUsage = this.predictNextValue(cpuValues);
    const currentCpu = cpuValues[cpuValues.length - 1];
    
    const limits = moduleResourceManager.getModuleResourceLimits(moduleId);
    const predictedUtilization = nextCpuUsage / limits.cpu;

    if (predictedUtilization > 0.8) {
      return {
        moduleId,
        action: 'scale_up',
        factor: 1.3,
        confidence: 0.75,
        reasoning: `Predictive model suggests CPU utilization will reach ${(predictedUtilization * 100).toFixed(0)}%`,
        estimatedImpact: {
          performanceImprovement: 0.3,
          costChange: 0.3,
          resourceUtilization: -0.2
        }
      };
    }

    if (predictedUtilization < 0.3) {
      return {
        moduleId,
        action: 'scale_down',
        factor: 0.8,
        confidence: 0.65,
        reasoning: `Predictive model suggests CPU utilization will drop to ${(predictedUtilization * 100).toFixed(0)}%`,
        estimatedImpact: {
          performanceImprovement: -0.1,
          costChange: -0.2,
          resourceUtilization: 0.2
        }
      };
    }

    return {
      moduleId,
      action: 'maintain',
      factor: 1.0,
      confidence: 0.8,
      reasoning: 'Predictive model suggests current scaling is optimal',
      estimatedImpact: { performanceImprovement: 0, costChange: 0, resourceUtilization: 0 }
    };
  }

  /**
   * Calculate trend in a series of values
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 1.0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return last / first;
  }

  /**
   * Calculate variance in values
   */
  private calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = this.average(values);
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    
    return this.average(squaredDiffs) / mean;
  }

  /**
   * Calculate average of values
   */
  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Detect cyclical patterns in values
   */
  private detectCyclicalPattern(values: number[]): boolean {
    if (values.length < 10) return false;
    
    // Simple cyclical detection - look for repeated patterns
    const halfLength = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, halfLength);
    const secondHalf = values.slice(halfLength, halfLength * 2);
    
    if (firstHalf.length !== secondHalf.length) return false;
    
    let correlation = 0;
    for (let i = 0; i < firstHalf.length; i++) {
      const diff = Math.abs(firstHalf[i] - secondHalf[i]);
      correlation += diff;
    }
    
    const avgValue = this.average(firstHalf);
    const normalizedCorrelation = correlation / (firstHalf.length * avgValue);
    
    return normalizedCorrelation < 0.2; // Strong correlation suggests cyclical pattern
  }

  /**
   * Predict next value in a series
   */
  private predictNextValue(values: number[]): number {
    if (values.length < 3) return values[values.length - 1] || 0;
    
    // Simple linear regression for prediction
    const recentValues = values.slice(-5);
    const trend = this.calculateTrend(recentValues);
    const currentValue = recentValues[recentValues.length - 1];
    
    return currentValue * trend;
  }

  /**
   * Estimate the impact of scaling
   */
  private estimateScalingImpact(moduleId: string, action: string, factor: number): {
    performanceImprovement: number;
    costChange: number;
    resourceUtilization: number;
  } {
    const baseImpact = {
      performanceImprovement: 0,
      costChange: 0,
      resourceUtilization: 0
    };

    if (action === 'scale_up') {
      baseImpact.performanceImprovement = (factor - 1) * 0.5;
      baseImpact.costChange = factor - 1;
      baseImpact.resourceUtilization = -(factor - 1) * 0.3;
    } else if (action === 'scale_down') {
      baseImpact.performanceImprovement = (1 - factor) * -0.2;
      baseImpact.costChange = -(1 - factor);
      baseImpact.resourceUtilization = (1 - factor) * 0.4;
    }

    return baseImpact;
  }
}

export const moduleScalingAlgorithms = ModuleScalingAlgorithms.getInstance();
