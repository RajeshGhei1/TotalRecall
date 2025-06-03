import { supabase } from '@/integrations/supabase/client';
import { AIContext } from '@/types/ai';

interface ContextAnalysis {
  contextComplexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  contextualRecommendations: ContextualRecommendation[];
  confidenceModifiers: number[];
}

interface ContextualRecommendation {
  recommended_agent: string;
  context_similarity: number;
  confidence_adjustment: number;
  reasoning: string;
}

interface ContextInsights {
  totalContextsAnalyzed: number;
  avgSuccessRate: number;
  riskDistribution: { low: number; medium: number; high: number };
  topPerformingContexts: any[];
  problematicContexts: any[];
}

export class DecisionContextManager {
  private contextHistory: Map<string, any[]> = new Map();
  private readonly MAX_HISTORY_SIZE = 100;

  async analyzeContext(context: AIContext): Promise<ContextAnalysis> {
    const contextKey = this.generateContextKey(context);
    
    // Get historical context data
    const historicalData = await this.getHistoricalContext(context);
    
    // Analyze complexity
    const contextComplexity = this.assessComplexity(context);
    
    // Assess risk level
    const riskLevel = this.assessRisk(context, historicalData);
    
    // Generate contextual recommendations
    const contextualRecommendations = await this.generateRecommendations(context, historicalData);
    
    // Calculate confidence modifiers
    const confidenceModifiers = this.calculateConfidenceModifiers(context, historicalData);
    
    // Store this analysis for future learning
    await this.storeContextAnalysis(context, {
      contextComplexity,
      riskLevel,
      timestamp: new Date()
    });

    return {
      contextComplexity,
      riskLevel,
      contextualRecommendations,
      confidenceModifiers
    };
  }

  private generateContextKey(context: AIContext): string {
    return `${context.module}-${context.action}-${context.entity_type || 'none'}`;
  }

  private assessComplexity(context: AIContext): 'low' | 'medium' | 'high' {
    let complexityScore = 0;
    
    // Factor 1: Module complexity
    const complexModules = ['dashboard', 'reports', 'workflows'];
    if (complexModules.includes(context.module)) {
      complexityScore += 2;
    }
    
    // Factor 2: Action complexity
    const complexActions = ['create', 'update', 'analyze', 'predict'];
    if (complexActions.includes(context.action)) {
      complexityScore += 1;
    }
    
    // Factor 3: Session data complexity
    if (context.session_data && Object.keys(context.session_data).length > 5) {
      complexityScore += 1;
    }
    
    // Factor 4: Entity relationships
    if (context.entity_id && context.entity_type) {
      complexityScore += 1;
    }
    
    if (complexityScore >= 4) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  }

  private assessRisk(context: AIContext, historicalData: any[]): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Factor 1: Historical failure rate
    const failures = historicalData.filter(d => d.success === false).length;
    const failureRate = historicalData.length > 0 ? failures / historicalData.length : 0;
    
    if (failureRate > 0.3) riskScore += 3;
    else if (failureRate > 0.1) riskScore += 2;
    else if (failureRate > 0.05) riskScore += 1;
    
    // Factor 2: Tenant-specific risk
    if (context.tenant_id && this.isHighRiskTenant(context.tenant_id)) {
      riskScore += 2;
    }
    
    // Factor 3: Action risk
    const riskActions = ['delete', 'update', 'publish'];
    if (riskActions.includes(context.action)) {
      riskScore += 1;
    }
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private async generateRecommendations(
    context: AIContext, 
    historicalData: any[]
  ): Promise<ContextualRecommendation[]> {
    const recommendations: ContextualRecommendation[] = [];
    
    // Find similar successful contexts
    const successfulContexts = historicalData.filter(d => d.success === true);
    
    for (const historicalContext of successfulContexts.slice(0, 3)) {
      const similarity = this.calculateContextSimilarity(context, historicalContext.context);
      
      if (similarity > 0.7) {
        recommendations.push({
          recommended_agent: historicalContext.agent_id,
          context_similarity: similarity,
          confidence_adjustment: this.calculateConfidenceAdjustment(similarity, historicalContext.confidence),
          reasoning: `Similar context achieved ${(historicalContext.confidence * 100).toFixed(1)}% confidence`
        });
      }
    }
    
    return recommendations.sort((a, b) => b.context_similarity - a.context_similarity);
  }

  private calculateContextSimilarity(context1: AIContext, context2: AIContext): number {
    let similarity = 0;
    let factors = 0;
    
    // Module similarity
    if (context1.module === context2.module) {
      similarity += 0.3;
    }
    factors += 0.3;
    
    // Action similarity
    if (context1.action === context2.action) {
      similarity += 0.3;
    }
    factors += 0.3;
    
    // Entity type similarity
    if (context1.entity_type === context2.entity_type) {
      similarity += 0.2;
    }
    factors += 0.2;
    
    // Tenant similarity
    if (context1.tenant_id === context2.tenant_id) {
      similarity += 0.2;
    }
    factors += 0.2;
    
    return factors > 0 ? similarity / factors : 0;
  }

  private calculateConfidenceAdjustment(similarity: number, historicalConfidence: number): number {
    // Adjust confidence based on similarity and historical performance
    const baseAdjustment = (similarity - 0.5) * 0.2; // -0.1 to +0.1 range
    const performanceModifier = (historicalConfidence - 0.5) * 0.1; // Additional adjustment based on historical performance
    
    return Math.max(-0.2, Math.min(0.2, baseAdjustment + performanceModifier));
  }

  private calculateConfidenceModifiers(context: AIContext, historicalData: any[]): number[] {
    const modifiers: number[] = [];
    
    // Historical success rate modifier
    const successRate = historicalData.length > 0 
      ? historicalData.filter(d => d.success).length / historicalData.length 
      : 0.5;
    
    modifiers.push((successRate - 0.5) * 0.2);
    
    // Context complexity modifier
    const complexity = this.assessComplexity(context);
    switch (complexity) {
      case 'high':
        modifiers.push(-0.1);
        break;
      case 'medium':
        modifiers.push(-0.05);
        break;
      case 'low':
        modifiers.push(0.05);
        break;
    }
    
    return modifiers;
  }

  private async getHistoricalContext(context: AIContext): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_decisions')
        .select('agent_id, confidence_score, was_accepted, context')
        .eq('context->>module', context.module)
        .eq('context->>action', context.action)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map(d => ({
        agent_id: d.agent_id,
        confidence: d.confidence_score,
        success: d.was_accepted !== false, // null or true = success
        context: d.context
      }));
    } catch (error) {
      console.error('Error getting historical context:', error);
      return [];
    }
  }

  private async storeContextAnalysis(context: AIContext, analysis: any): Promise<void> {
    // Store for learning and future improvements
    const contextKey = this.generateContextKey(context);
    const history = this.contextHistory.get(contextKey) || [];
    
    history.unshift({ context, analysis });
    
    // Keep only recent history
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.splice(this.MAX_HISTORY_SIZE);
    }
    
    this.contextHistory.set(contextKey, history);
  }

  private isHighRiskTenant(tenantId: string): boolean {
    // In a real implementation, this would check tenant risk profile
    return false; // Placeholder
  }

  async getContextInsights(tenantId?: string): Promise<ContextInsights> {
    try {
      let query = supabase
        .from('ai_decisions')
        .select('context, confidence_score, was_accepted, created_at');

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const totalContexts = data?.length || 0;
      const successfulDecisions = data?.filter(d => d.was_accepted !== false).length || 0;
      const avgSuccessRate = totalContexts > 0 ? successfulDecisions / totalContexts : 0;

      // Analyze risk distribution (placeholder implementation)
      const riskDistribution = { low: 70, medium: 25, high: 5 };

      return {
        totalContextsAnalyzed: totalContexts,
        avgSuccessRate,
        riskDistribution,
        topPerformingContexts: [],
        problematicContexts: []
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
