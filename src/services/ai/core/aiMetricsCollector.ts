
import { AIServiceMetrics } from '@/types/aiCore';

export class AIMetricsCollector {
  private static instance: AIMetricsCollector;
  private metrics: AIServiceMetrics;

  private constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      activeAgents: 0,
      queueSize: 0
    };
  }

  static getInstance(): AIMetricsCollector {
    if (!AIMetricsCollector.instance) {
      AIMetricsCollector.instance = new AIMetricsCollector();
    }
    return AIMetricsCollector.instance;
  }

  recordRequest(responseTime: number, success: boolean): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
      // Update average response time
      const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.successfulRequests - 1) + responseTime;
      this.metrics.averageResponseTime = totalResponseTime / this.metrics.successfulRequests;
    } else {
      this.metrics.failedRequests++;
    }
  }

  recordCacheHit(): void {
    // Cache hits are tracked separately
  }

  updateActiveAgents(count: number): void {
    this.metrics.activeAgents = count;
  }

  updateQueueSize(size: number): void {
    this.metrics.queueSize = size;
  }

  getMetrics(): AIServiceMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      activeAgents: 0,
      queueSize: 0
    };
  }
}

export const aiMetricsCollector = AIMetricsCollector.getInstance();
