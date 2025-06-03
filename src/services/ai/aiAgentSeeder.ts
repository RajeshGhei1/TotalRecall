
import { supabase } from '@/integrations/supabase/client';
import { AIAgent } from '@/types/ai';

interface DefaultAgentConfig {
  name: string;
  type: 'cognitive' | 'predictive' | 'automation' | 'analysis' | 'deep_research';
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
      description: 'General purpose cognitive AI for user assistance and decision support',
      capabilities: ['conversation', 'decision_support', 'content_generation', 'task_planning'],
      model_config: {
        temperature: 0.7,
        max_tokens: 1000,
        model: 'gpt-4o-mini'
      },
      performance_metrics: {
        accuracy: 0.85,
        response_time: 500,
        user_satisfaction: 0.9
      }
    },
    {
      name: 'Predictive Analytics Agent',
      type: 'predictive',
      description: 'Specialized in predictive analytics and trend forecasting',
      capabilities: ['trend_analysis', 'forecasting', 'pattern_recognition', 'risk_assessment'],
      model_config: {
        temperature: 0.3,
        max_tokens: 800,
        model: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.92,
        response_time: 750,
        prediction_accuracy: 0.88
      }
    },
    {
      name: 'Workflow Automation Agent',
      type: 'automation',
      description: 'Handles workflow automation and process optimization',
      capabilities: ['workflow_design', 'process_optimization', 'task_automation', 'integration_management'],
      model_config: {
        temperature: 0.2,
        max_tokens: 1200,
        model: 'gpt-4o-mini'
      },
      performance_metrics: {
        accuracy: 0.90,
        response_time: 600,
        automation_success_rate: 0.95
      }
    },
    {
      name: 'Data Analysis Agent',
      type: 'analysis',
      description: 'Specialized in data analysis and insight generation',
      capabilities: ['data_analysis', 'visualization', 'statistical_analysis', 'insight_generation'],
      model_config: {
        temperature: 0.1,
        max_tokens: 1500,
        model: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.94,
        response_time: 800,
        insight_quality: 0.91
      }
    },
    {
      name: 'Deep Research Agent',
      type: 'deep_research',
      description: 'Advanced research and knowledge synthesis capabilities',
      capabilities: ['research', 'knowledge_synthesis', 'literature_review', 'expert_analysis'],
      model_config: {
        temperature: 0.4,
        max_tokens: 2000,
        model: 'gpt-4o'
      },
      performance_metrics: {
        accuracy: 0.96,
        response_time: 1200,
        research_depth: 0.93
      }
    }
  ];

  async seedDefaultAgents(): Promise<void> {
    console.log('Seeding default AI agents...');

    try {
      for (const agentConfig of this.defaultAgents) {
        // Check if agent already exists
        const { data: existingAgent } = await supabase
          .from('ai_agents')
          .select('id')
          .eq('name', agentConfig.name)
          .eq('type', agentConfig.type)
          .maybeSingle();

        if (!existingAgent) {
          await supabase
            .from('ai_agents')
            .insert({
              name: agentConfig.name,
              type: agentConfig.type,
              description: agentConfig.description,
              capabilities: agentConfig.capabilities,
              model_config: agentConfig.model_config as any,
              performance_metrics: agentConfig.performance_metrics as any,
              status: 'active',
              is_active: true
            });

          console.log(`Created agent: ${agentConfig.name}`);
        } else {
          console.log(`Agent already exists: ${agentConfig.name}`);
        }
      }

      console.log('✅ Default agents seeding completed');
    } catch (error) {
      console.error('❌ Error seeding default agents:', error);
      throw error;
    }
  }

  async updateAgentCapabilities(): Promise<void> {
    console.log('Updating agent capabilities...');

    try {
      for (const agentConfig of this.defaultAgents) {
        await supabase
          .from('ai_agents')
          .update({
            capabilities: agentConfig.capabilities,
            model_config: agentConfig.model_config as any,
            performance_metrics: agentConfig.performance_metrics as any
          })
          .eq('name', agentConfig.name)
          .eq('type', agentConfig.type);
      }

      console.log('✅ Agent capabilities updated');
    } catch (error) {
      console.error('❌ Error updating agent capabilities:', error);
      throw error;
    }
  }

  async getAgentStats(): Promise<{
    totalAgents: number;
    activeAgents: number;
    agentsByType: Record<string, number>;
  }> {
    const { data: agents } = await supabase
      .from('ai_agents')
      .select('type, is_active');

    const totalAgents = agents?.length || 0;
    const activeAgents = agents?.filter(a => a.is_active).length || 0;
    const agentsByType = agents?.reduce((acc, agent) => {
      acc[agent.type] = (acc[agent.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return { totalAgents, activeAgents, agentsByType };
  }
}

export const aiAgentSeeder = new AIAgentSeeder();
