
import { supabase } from '@/integrations/supabase/client';
import { AIContext } from '@/types/ai';

export interface ContextualDecision {
  decision_id: string;
  context_hash: string;
  context_similarity: number;
  historical_outcome: 'success' | 'failure' | 'partial_success';
  confidence_adjustment: number;
  recommended_agent?: string;
}

export interface ContextPattern {
  pattern_id: string;
  context_fingerprint: Record<string, unknown>;
  success_rate: number;
  common_outcomes: unknown[];
  optimal_agent_type: string;
  confidence_range: [number, number];
}

export class DecisionContextManager {
  async analyzeContext(context: AIContext): Promise<{
    contextualRecommendations: ContextualDecision[];
    similarContexts: unknown[];
    contextComplexity: number;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      const contextHash = this.generateContextHash(context);
      
      // Find similar historical contexts
      const similarContexts = await this.findSimilarContexts(context);
      
      // Generate contextual recommendations
      const contextualRecommendations = await this.generateContextualRecommendations(
        contextHash, 
        similarContexts
      );

      // Calculate context complexity and risk
      const contextComplexity = this.calculateContextComplexity(context);
      const riskLevel = this.assessRiskLevel(context, similarContexts);

      return {
        contextualRecommendations,
        similarContexts,
        contextComplexity,
        riskLevel
      };
    } catch (error) {
      console.error('Error analyzing context:', error);
      return {
        contextualRecommendations: [],
        similarContexts: [],
        contextComplexity: 0.5,
        riskLevel: 'medium'
      };
    }
  }

  private generateContextHash(context: AIContext): string {
    const contextString = JSON.stringify({
      module: context.module,
      action: context.action,
      entity_type: context.entity_type,
      tenant_id: context.tenant_id
    });
    
    // Simple hash function (in production, use a proper hash library)
    let hash = 0;
    for (let i = 0; i < contextString.length; i++) {
      const char = contextString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private async findSimilarContexts(context: AIContext): Promise<any[]> {
    try {
      const { data: decisions, error } = await supabase
        .from('ai_decisions')
        .select(`
          *,
          ai_learning_data(feedback_type, feedback_data)
        `)
        .eq('tenant_id', context.tenant_id || null)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
        .limit(100);

      if (error) throw error;

      // Filter and rank by similarity
      const similarContexts = (decisions || [])
        .filter(decision => this.calculateContextSimilarity(context, decision.context) > 0.6)
        .map(decision => ({
          ...decision,
          similarity: this.calculateContextSimilarity(context, decision.context)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10);

      return similarContexts;
    } catch (error) {
      console.error('Error finding similar contexts:', error);
      return [];
    }
  }

  private calculateContextSimilarity(context1: AIContext, context2: unknown): number {
    if (!context2) return 0;

    let similarity = 0;
    let totalWeight = 0;

    // Module similarity (high weight)
    if (context1.module === context2.module) {
      similarity += 0.4;
    }
    totalWeight += 0.4;

    // Action similarity (high weight)
    if (context1.action === context2.action) {
      similarity += 0.3;
    }
    totalWeight += 0.3;

    // Entity type similarity (medium weight)
    if (context1.entity_type === context2.entity_type) {
      similarity += 0.2;
    }
    totalWeight += 0.2;

    // Tenant similarity (low weight, but important for multi-tenancy)
    if (context1.tenant_id === context2.tenant_id) {
      similarity += 0.1;
    }
    totalWeight += 0.1;

    return totalWeight > 0 ? similarity / totalWeight : 0;
  }

  private async generateContextualRecommendations(
    contextHash: string, 
    similarContexts: unknown[]
  ): Promise<ContextualDecision[]> {
    const recommendations: ContextualDecision[] = [];

    for (const similarContext of similarContexts) {
      const outcome = this.determineOutcome(similarContext);
      const confidenceAdjustment = this.calculateConfidenceAdjustment(outcome, similarContext.confidence_score);

      recommendations.push({
        decision_id: similarContext.id,
        context_hash: contextHash,
        context_similarity: similarContext.similarity,
        historical_outcome: outcome,
        confidence_adjustment: confidenceAdjustment,
        recommended_agent: this.getOptimalAgent(similarContext)
      });
    }

    return recommendations.sort((a, b) => b.context_similarity - a.context_similarity);
  }

  private determineOutcome(decision: unknown): 'success' | 'failure' | 'partial_success' {
    if (decision.ai_learning_data && decision.ai_learning_data.length > 0) {
      const feedbacks = decision.ai_learning_data;
      const positiveCount = feedbacks.filter((f: unknown) => f.feedback_type === 'positive').length;
      const negativeCount = feedbacks.filter((f: unknown) => f.feedback_type === 'negative').length;

      if (positiveCount > negativeCount) return 'success';
      if (negativeCount > positiveCount) return 'failure';
      return 'partial_success';
    }

    // Fallback: use confidence score and was_accepted
    if (decision.was_accepted === true && decision.confidence_score > 0.7) return 'success';
    if (decision.was_accepted === false || decision.confidence_score < 0.3) return 'failure';
    return 'partial_success';
  }

  private calculateConfidenceAdjustment(
    outcome: 'success' | 'failure' | 'partial_success',
    originalConfidence: number
  ): number {
    switch (outcome) {
      case 'success':
        return Math.min(0.2, (1.0 - originalConfidence) * 0.5); // Boost confidence
      case 'failure':
        return Math.max(-0.3, -originalConfidence * 0.7); // Reduce confidence
      case 'partial_success':
        return 0; // No adjustment
      default:
        return 0;
    }
  }

  private getOptimalAgent(decision: unknown): string | undefined {
    // If this decision was successful, recommend the same agent
    const outcome = this.determineOutcome(decision);
    if (outcome === 'success') {
      return decision.agent_id;
    }
    return undefined;
  }

  private calculateContextComplexity(context: AIContext): number {
    let complexity = 0.3; // Base complexity

    // Module complexity mapping
    const moduleComplexity: Record<string, number> = {
      'workflow': 0.8,
      'analytics': 0.7,
      'automation': 0.6,
      'reporting': 0.5,
      'simple_query': 0.2
    };

    complexity += moduleComplexity[context.module] || 0.5;

    // Action complexity
    const actionComplexity: Record<string, number> = {
      'create': 0.6,
      'update': 0.5,
      'delete': 0.7,
      'analyze': 0.8,
      'predict': 0.9,
      'read': 0.2
    };

    complexity += actionComplexity[context.action] || 0.5;

    // Entity complexity
    if (context.entity_type && context.entity_id) {
      complexity += 0.1; // Specific entity operations are slightly more complex
    }

    return Math.min(complexity / 2, 1.0); // Normalize to 0-1 range
  }

  private assessRiskLevel(
    context: AIContext, 
    similarContexts: unknown[]
  ): 'low' | 'medium' | 'high' {
    if (similarContexts.length === 0) return 'high'; // Unknown territory

    const successRate = similarContexts.filter(ctx => 
      this.determineOutcome(ctx) === 'success'
    ).length / similarContexts.length;

    const avgConfidence = similarContexts.reduce((sum, ctx) => 
      sum + (ctx.confidence_score || 0), 0) / similarContexts.length;

    const complexity = this.calculateContextComplexity(context);

    // Risk assessment logic
    if (successRate > 0.8 && avgConfidence > 0.7 && complexity < 0.5) return 'low';
    if (successRate > 0.6 && avgConfidence > 0.5 && complexity < 0.7) return 'medium';
    return 'high';
  }

  async storeContextPattern(
    contextFingerprint: unknown,
    successRate: number,
    outcomes: unknown[],
    optimalAgentType: string
  ): Promise<void> {
    try {
      // Store in ai_insights table as a context pattern
      const { error } = await supabase
        .from('ai_insights')
        .insert({
          agent_id: null, // System generated insight
          tenant_id: contextFingerprint.tenant_id || null,
          insight_type: 'context_pattern',
          source_entities: [contextFingerprint],
          insight_data: {
            context_fingerprint: contextFingerprint,
            success_rate: successRate,
            common_outcomes: outcomes,
            optimal_agent_type: optimalAgentType,
            pattern_strength: this.calculatePatternStrength(successRate, outcomes.length),
            last_updated: new Date().toISOString()
          },
          confidence_score: successRate,
          applicable_modules: [contextFingerprint.module],
          is_active: true
        });

      if (error) throw error;
      
      console.log('Context pattern stored successfully');
    } catch (error) {
      console.error('Error storing context pattern:', error);
    }
  }

  private calculatePatternStrength(successRate: number, sampleSize: number): number {
    // Pattern strength increases with both success rate and sample size
    const sampleWeight = Math.min(sampleSize / 20, 1.0); // Max weight at 20+ samples
    return (successRate * 0.7) + (sampleWeight * 0.3);
  }

  async getContextInsights(tenantId?: string): Promise<{
    totalContextsAnalyzed: number;
    avgSuccessRate: number;
    riskDistribution: Record<'low' | 'medium' | 'high', number>;
    topPerformingContexts: unknown[];
    problematicContexts: unknown[];
  }> {
    try {
      const { data: insights, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('tenant_id', tenantId || null)
        .eq('insight_type', 'context_pattern')
        .eq('is_active', true);

      if (error) throw error;

      const patterns = insights || [];
      const totalContexts = patterns.length;
      
      if (totalContexts === 0) {
        return {
          totalContextsAnalyzed: 0,
          avgSuccessRate: 0,
          riskDistribution: { low: 0, medium: 0, high: 0 },
          topPerformingContexts: [],
          problematicContexts: []
        };
      }

      // Safe access to success_rate with proper type checking
      const avgSuccessRate = patterns.reduce((sum, p) => {
        const insightData = p.insight_data as unknown;
        const successRate = (insightData && typeof insightData === 'object' && insightData.success_rate) 
          ? Number(insightData.success_rate) : 0;
        return sum + successRate;
      }, 0) / totalContexts;

      // Calculate risk distribution
      const riskDistribution = { low: 0, medium: 0, high: 0 };
      patterns.forEach(pattern => {
        const insightData = pattern.insight_data as unknown;
        const successRate = (insightData && typeof insightData === 'object' && insightData.success_rate) 
          ? Number(insightData.success_rate) : 0;
        
        if (successRate > 0.8) riskDistribution.low++;
        else if (successRate > 0.6) riskDistribution.medium++;
        else riskDistribution.high++;
      });

      const topPerforming = patterns
        .filter(p => {
          const insightData = p.insight_data as unknown;
          const successRate = (insightData && typeof insightData === 'object' && insightData.success_rate) 
            ? Number(insightData.success_rate) : 0;
          return successRate > 0.8;
        })
        .sort((a, b) => {
          const aData = a.insight_data as unknown;
          const bData = b.insight_data as unknown;
          const aRate = (aData && typeof aData === 'object' && aData.success_rate) ? Number(aData.success_rate) : 0;
          const bRate = (bData && typeof bData === 'object' && bData.success_rate) ? Number(bData.success_rate) : 0;
          return bRate - aRate;
        })
        .slice(0, 5);

      const problematic = patterns
        .filter(p => {
          const insightData = p.insight_data as unknown;
          const successRate = (insightData && typeof insightData === 'object' && insightData.success_rate) 
            ? Number(insightData.success_rate) : 0;
          return successRate < 0.5;
        })
        .sort((a, b) => {
          const aData = a.insight_data as unknown;
          const bData = b.insight_data as unknown;
          const aRate = (aData && typeof aData === 'object' && aData.success_rate) ? Number(aData.success_rate) : 0;
          const bRate = (bData && typeof bData === 'object' && bData.success_rate) ? Number(bData.success_rate) : 0;
          return aRate - bRate;
        })
        .slice(0, 5);

      return {
        totalContextsAnalyzed: totalContexts,
        avgSuccessRate,
        riskDistribution,
        topPerformingContexts: topPerforming,
        problematicContexts: problematic
      };
    } catch (error) {
      console.error('Error getting context insights:', error);
      return {
        totalContextsAnalyzed: 0,
        avgSuccessRate: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 },
        topPerformingContexts: [],
        problematicContexts: []
      };
    }
  }
}

export const decisionContextManager = new DecisionContextManager();
