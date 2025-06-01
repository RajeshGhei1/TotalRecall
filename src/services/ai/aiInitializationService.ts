
import { enhancedAIOrchestrationService } from './enhancedOrchestrationService';
import { aiAgentSeeder } from './aiAgentSeeder';
import { aiModelHealthService } from './aiModelHealthService';
import { aiCostTrackingService } from './aiCostTrackingService';
import { aiCacheService } from './aiCacheService';

export class AIInitializationService {
  private initialized = false;

  async initializeAIFoundation(): Promise<void> {
    if (this.initialized) {
      console.log('AI Foundation already initialized');
      return;
    }

    console.log('Initializing AI Foundation...');

    try {
      // Step 1: Seed default AI agents
      console.log('1. Seeding default AI agents...');
      await aiAgentSeeder.seedDefaultAgents();

      // Step 2: Initialize orchestration service
      console.log('2. Initializing AI orchestration service...');
      await enhancedAIOrchestrationService.initialize();

      // Step 3: Start model health monitoring
      console.log('3. Starting model health monitoring...');
      await aiModelHealthService.initializeHealthMonitoring();

      // Step 4: Initialize cache service
      console.log('4. Initializing cache service...');
      // Cache service is already initialized in the orchestration service

      // Step 5: Warm up the system with test requests
      console.log('5. Warming up AI system...');
      await this.warmUpSystem();

      this.initialized = true;
      console.log('✅ AI Foundation initialization completed successfully');

    } catch (error) {
      console.error('❌ AI Foundation initialization failed:', error);
      throw error;
    }
  }

  private async warmUpSystem(): Promise<void> {
    try {
      // Make a few test requests to warm up the system
      const testContext = {
        user_id: 'system',
        tenant_id: undefined,
        module: 'system',
        action: 'system_warmup'
      };

      await enhancedAIOrchestrationService.requestPrediction(
        testContext,
        { test: true, message: 'System warmup' },
        'low'
      );

      console.log('System warmup completed');
    } catch (error) {
      console.log('System warmup failed (non-critical):', error);
    }
  }

  async getSystemStatus(): Promise<{
    initialized: boolean;
    orchestrationStatus: string;
    healthMetrics: any;
    cacheMetrics: any;
    agentCount: number;
  }> {
    const healthMetrics = aiModelHealthService.getHealthMetrics();
    const cacheMetrics = aiCacheService.getCacheMetrics();
    const orchestrationMetrics = enhancedAIOrchestrationService.getMetrics();

    return {
      initialized: this.initialized,
      orchestrationStatus: this.initialized ? 'active' : 'inactive',
      healthMetrics,
      cacheMetrics,
      agentCount: orchestrationMetrics.activeAgents
    };
  }

  async updateAgentCapabilities(): Promise<void> {
    console.log('Updating agent capabilities...');
    await aiAgentSeeder.updateAgentCapabilities();
    await enhancedAIOrchestrationService.refreshAgents();
    console.log('Agent capabilities updated');
  }

  async reinitialize(): Promise<void> {
    console.log('Reinitializing AI Foundation...');
    this.initialized = false;
    await this.initializeAIFoundation();
  }
}

export const aiInitializationService = new AIInitializationService();
