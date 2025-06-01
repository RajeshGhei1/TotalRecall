
import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIAgentType } from '@/types/ai';

interface DefaultAgentConfig {
  name: string;
  type: AIAgentType;
  description: string;
  capabilities: string[];
  model_config: Record<string, any>;
  performance_metrics: Record<string, any>;
}

export class AIAgentSeeder {
  private defaultAgents: DefaultAgentConfig[] = [
    {
      name: 'Cognitive Assistant',
      type: 'cognitive',
      description: 'General-purpose AI assistant for cognitive tasks and decision support',
      capabilities: ['conversation', 'support', 'guidance', 'problem_solving', 'analysis'],
      model_config: {
        temperature: 0.7,
        max_tokens: 1000,
        model_preference: 'gpt-4o-mini'
      },
      performance_metrics: {
        accuracy: 0.85,
        response_time: 800,
        user_satisfaction: 0.9
      }
    },
    {
      name: 'Predictive Analytics Engine',
      type: 'predictive',
      description: 'AI agent specialized in forecasting and predictive analytics',
      capabilities: ['prediction', 'analytics', 'forecasting', 'trend_analysis', 'risk_assessment'],
      model_config: {
        temperature: 0.3,
        max_tokens: 1500,
        model_preference: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.88,
        response_time: 1200,
        prediction_accuracy: 0.82
      }
    },
    {
      name: 'Workflow Automation Agent',
      type: 'automation',
      description: 'AI agent for process automation and workflow optimization',
      capabilities: ['automation', 'process_optimization', 'workflow', 'task_routing', 'scheduling'],
      model_config: {
        temperature: 0.2,
        max_tokens: 800,
        model_preference: 'gpt-4o-mini'
      },
      performance_metrics: {
        accuracy: 0.92,
        response_time: 600,
        automation_success_rate: 0.89
      }
    },
    {
      name: 'Data Analysis Specialist',
      type: 'analysis',
      description: 'AI agent for data analysis and insights generation',
      capabilities: ['analysis', 'insights', 'reporting', 'data_mining', 'pattern_recognition'],
      model_config: {
        temperature: 0.4,
        max_tokens: 2000,
        model_preference: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.87,
        response_time: 1000,
        insight_quality: 0.91
      }
    },
    {
      name: 'Deep Research Agent',
      type: 'deep_research',
      description: 'AI agent for comprehensive research and investigation tasks',
      capabilities: ['deep_research', 'multi_source_analysis', 'comprehensive_reporting', 'market_intelligence', 'investigation'],
      model_config: {
        temperature: 0.5,
        max_tokens: 3000,
        model_preference: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.89,
        response_time: 2000,
        research_depth: 0.93
      }
    }
  ];

  async seedDefaultAgents(): Promise<void> {
    console.log('Starting AI agent seeding process...');

    try {
      for (const agentConfig of this.defaultAgents) {
        await this.createAgentIfNotExists(agentConfig);
      }
      console.log('AI agent seeding completed successfully');
    } catch (error) {
      console.error('Error during AI agent seeding:', error);
      throw error;
    }
  }

  private async createAgentIfNotExists(config: DefaultAgentConfig): Promise<void> {
    // Check if agent already exists
    const { data: existingAgent } = await supabase
      .from('ai_agents')
      .select('id')
      .eq('name', config.name)
      .eq('type', config.type)
      .maybeSingle();

    if (existingAgent) {
      console.log(`Agent "${config.name}" already exists, skipping...`);
      return;
    }

    // Create new agent
    const { error } = await supabase
      .from('ai_agents')
      .insert({
        name: config.name,
        type: config.type,
        description: config.description,
        capabilities: config.capabilities,
        model_config: config.model_config as any,
        performance_metrics: config.performance_metrics as any,
        status: 'active',
        is_active: true,
        tenant_id: null, // Global agents
        created_by: null
      });

    if (error) {
      console.error(`Error creating agent "${config.name}":`, error);
      throw error;
    }

    console.log(`Created default agent: ${config.name}`);
  }

  async updateAgentCapabilities(): Promise<void> {
    console.log('Updating agent capabilities...');

    const capabilityUpdates = [
      {
        type: 'cognitive',
        newCapabilities: ['natural_language_processing', 'contextual_understanding', 'multi_turn_conversation']
      },
      {
        type: 'predictive',
        newCapabilities: ['time_series_analysis', 'statistical_modeling', 'machine_learning']
      },
      {
        type: 'automation',
        newCapabilities: ['rule_based_automation', 'intelligent_routing', 'process_mining']
      },
      {
        type: 'analysis',
        newCapabilities: ['statistical_analysis', 'visualization', 'correlation_analysis']
      },
      {
        type: 'deep_research',
        newCapabilities: ['web_research', 'document_analysis', 'cross_reference_validation']
      }
    ];

    for (const update of capabilityUpdates) {
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('id, capabilities')
        .eq('type', update.type);

      if (agents) {
        for (const agent of agents) {
          const existingCapabilities = agent.capabilities || [];
          const mergedCapabilities = [...new Set([...existingCapabilities, ...update.newCapabilities])];

          await supabase
            .from('ai_agents')
            .update({ capabilities: mergedCapabilities })
            .eq('id', agent.id);
        }
      }
    }

    console.log('Agent capabilities updated successfully');
  }
}

export const aiAgentSeeder = new AIAgentSeeder();
