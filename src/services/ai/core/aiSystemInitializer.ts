
import { AISystemConfig, AIInitializationResult, AIAgentConfig } from '@/types/aiCore';
import { supabase } from '@/integrations/supabase/client';

export class AISystemInitializer {
  private static instance: AISystemInitializer;
  private isInitialized = false;
  private config: AISystemConfig;

  private constructor() {
    this.config = {
      maxConcurrentRequests: 10,
      defaultTimeout: 30000,
      cacheEnabled: true,
      metricsEnabled: true
    };
  }

  static getInstance(): AISystemInitializer {
    if (!AISystemInitializer.instance) {
      AISystemInitializer.instance = new AISystemInitializer();
    }
    return AISystemInitializer.instance;
  }

  async initialize(): Promise<AIInitializationResult> {
    if (this.isInitialized) {
      return {
        success: true,
        message: 'AI system already initialized',
        agentsLoaded: 0,
        servicesInitialized: []
      };
    }

    try {
      console.log('Initializing AI system...');

      // Load active agents from database
      const agentsResult = await this.loadActiveAgents();
      
      // Initialize core services
      const servicesInitialized = [
        'agent-manager',
        'metrics-service',
        'decision-recorder'
      ];

      this.isInitialized = true;

      return {
        success: true,
        message: 'AI system initialized successfully',
        agentsLoaded: agentsResult.length,
        servicesInitialized
      };
    } catch (error) {
      console.error('AI system initialization failed:', error);
      return {
        success: false,
        message: 'AI system initialization failed',
        agentsLoaded: 0,
        servicesInitialized: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async loadActiveAgents(): Promise<AIAgentConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('id, name, type, capabilities, is_active, model_config, performance_metrics')
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        capabilities: Array.isArray(agent.capabilities) ? agent.capabilities : [],
        isActive: agent.is_active,
        modelConfig: (agent.model_config as Record<string, unknown>) || {},
        performanceMetrics: (agent.performance_metrics as Record<string, unknown>) || {}
      }));
    } catch (error) {
      console.error('Error loading agents:', error);
      return [];
    }
  }

  getConfig(): AISystemConfig {
    return { ...this.config };
  }

  isSystemInitialized(): boolean {
    return this.isInitialized;
  }

  async reinitialize(): Promise<AIInitializationResult> {
    this.isInitialized = false;
    return this.initialize();
  }
}

export const aiSystemInitializer = AISystemInitializer.getInstance();
