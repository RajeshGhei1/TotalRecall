
import { supabase } from '@/integrations/supabase/client';
import { UserInteraction, BehavioralPattern } from '@/types/ai';

export class BehavioralAnalyticsService {
  private sessionId: string;
  private interactionBuffer: UserInteraction[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startPeriodicFlush();
  }

  async trackInteraction(
    userId: string,
    tenantId: string | undefined,
    interactionType: string,
    context: Record<string, any>,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const interaction: Omit<UserInteraction, 'id' | 'created_at'> = {
      user_id: userId,
      tenant_id: tenantId,
      interaction_type: interactionType,
      context,
      metadata: {
        ...metadata,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now()
      },
      session_id: this.sessionId,
      ip_address: undefined, // Will be set by server
      user_agent: navigator.userAgent
    };

    // Add to buffer for batch processing
    this.interactionBuffer.push(interaction as UserInteraction);

    // Immediate flush for critical interactions
    if (this.isCriticalInteraction(interactionType)) {
      await this.flushInteractions();
    }
  }

  private isCriticalInteraction(type: string): boolean {
    const criticalTypes = ['error', 'form_submission', 'data_creation', 'workflow_completion'];
    return criticalTypes.includes(type);
  }

  private async flushInteractions(): Promise<void> {
    if (this.interactionBuffer.length === 0) return;

    try {
      const interactions = [...this.interactionBuffer];
      this.interactionBuffer = [];

      const { error } = await supabase
        .from('user_interactions')
        .insert(interactions);

      if (error) {
        console.error('Error saving interactions:', error);
        // Re-add to buffer on error
        this.interactionBuffer.unshift(...interactions);
      } else {
        console.log(`Flushed ${interactions.length} user interactions`);
      }
    } catch (error) {
      console.error('Error in flushInteractions:', error);
    }
  }

  private startPeriodicFlush(): void {
    // Flush interactions every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushInteractions();
    }, 30000);
  }

  async getUserPatterns(userId: string, tenantId?: string): Promise<BehavioralPattern[]> {
    try {
      let query = supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('user_id', userId);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.order('frequency_score', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle Json type mismatch
      return (data || []).map(pattern => ({
        ...pattern,
        pattern_data: pattern.pattern_data as Record<string, any>
      })) as BehavioralPattern[];
    } catch (error) {
      console.error('Error fetching user patterns:', error);
      return [];
    }
  }

  async analyzeUserBehavior(userId: string, tenantId?: string): Promise<any> {
    try {
      // Get recent interactions
      let query = supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data: interactions, error } = await query;

      if (error) throw error;

      // Type assertion to handle Json type mismatch
      const typedInteractions = (interactions || []).map(interaction => ({
        ...interaction,
        context: interaction.context as Record<string, any>,
        metadata: interaction.metadata as Record<string, any>
      })) as UserInteraction[];

      // Simple behavior analysis
      const analysis = this.performBehaviorAnalysis(typedInteractions);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return { patterns: [], insights: [], recommendations: [] };
    }
  }

  private performBehaviorAnalysis(interactions: UserInteraction[]): any {
    const typeFrequency: Record<string, number> = {};
    const timePatterns: Record<string, number[]> = {};
    const contextPatterns: Record<string, any> = {};

    interactions.forEach(interaction => {
      // Count interaction types
      typeFrequency[interaction.interaction_type] = (typeFrequency[interaction.interaction_type] || 0) + 1;

      // Analyze time patterns
      const hour = new Date(interaction.created_at).getHours();
      if (!timePatterns[interaction.interaction_type]) {
        timePatterns[interaction.interaction_type] = [];
      }
      timePatterns[interaction.interaction_type].push(hour);

      // Context analysis
      if (interaction.context.module) {
        contextPatterns[interaction.context.module] = (contextPatterns[interaction.context.module] || 0) + 1;
      }
    });

    const insights = [];
    const recommendations = [];

    // Generate insights
    const mostCommonType = Object.entries(typeFrequency).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonType) {
      insights.push(`Most common interaction: ${mostCommonType[0]} (${mostCommonType[1]} times)`);
    }

    // Generate recommendations based on patterns
    if (typeFrequency['page_view'] > 10 && typeFrequency['form_submission'] < 2) {
      recommendations.push('User browses frequently but rarely submits forms - consider simplifying form processes');
    }

    return {
      patterns: {
        interactionTypes: typeFrequency,
        timePatterns,
        moduleUsage: contextPatterns
      },
      insights,
      recommendations,
      totalInteractions: interactions.length
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushInteractions(); // Final flush
  }
}

export const behavioralAnalyticsService = new BehavioralAnalyticsService();
