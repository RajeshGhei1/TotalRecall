
import { AIDecisionRecord } from '@/types/aiCore';
import { supabase } from '@/integrations/supabase/client';

export class AIDecisionRecorder {
  private static instance: AIDecisionRecorder;
  private decisions: Map<string, AIDecisionRecord> = new Map();

  private constructor() {}

  static getInstance(): AIDecisionRecorder {
    if (!AIDecisionRecorder.instance) {
      AIDecisionRecorder.instance = new AIDecisionRecorder();
    }
    return AIDecisionRecorder.instance;
  }

  async recordDecision(decision: Omit<AIDecisionRecord, 'id' | 'timestamp'>): Promise<string> {
    const decisionId = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullDecision: AIDecisionRecord = {
      ...decision,
      id: decisionId,
      timestamp: Date.now()
    };

    // Store in memory
    this.decisions.set(decisionId, fullDecision);

    // Store in database - match the actual schema
    try {
      const { data, error } = await supabase
        .from('ai_decisions')
        .insert({
          agent_id: decision.agentId,
          user_id: decision.userId,
          tenant_id: decision.tenantId || null,
          decision: decision.decision as unknown,
          context: {
            module: 'ai-orchestration',
            action: 'decision_recorded',
            timestamp: new Date().toISOString(),
            metadata: {}
          } as unknown,
          confidence_score: decision.confidence,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      
      // Update our memory store with the actual database ID
      if (data?.id) {
        fullDecision.id = data.id;
        this.decisions.set(data.id, fullDecision);
        this.decisions.delete(decisionId);
        return data.id;
      }
    } catch (error) {
      console.error('Error storing decision in database:', error);
    }

    return decisionId;
  }

  async recordFeedback(decisionId: string, feedback: 'positive' | 'negative'): Promise<boolean> {
    const decision = this.decisions.get(decisionId);
    if (decision) {
      decision.feedback = feedback;
    }

    // Update in database
    try {
      const { error } = await supabase
        .from('ai_decisions')
        .update({
          was_accepted: feedback === 'positive',
          outcome_feedback: { 
            feedback, 
            timestamp: new Date().toISOString() 
          } as unknown
        })
        .eq('id', decisionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating decision feedback:', error);
      return false;
    }
  }

  getDecision(decisionId: string): AIDecisionRecord | undefined {
    return this.decisions.get(decisionId);
  }

  getDecisionsByUser(userId: string): AIDecisionRecord[] {
    return Array.from(this.decisions.values()).filter(d => d.userId === userId);
  }

  getDecisionsByAgent(agentId: string): AIDecisionRecord[] {
    return Array.from(this.decisions.values()).filter(d => d.agentId === agentId);
  }
}

export const aiDecisionRecorder = AIDecisionRecorder.getInstance();
