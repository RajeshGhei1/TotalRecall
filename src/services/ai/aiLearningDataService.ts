
import { supabase } from '@/integrations/supabase/client';

export interface LearningDataEntry {
  id: string;
  decision_id: string;
  user_id: string;
  tenant_id?: string;
  feedback_type: 'positive' | 'negative' | 'correction' | 'enhancement';
  feedback_data: {
    original_decision: Record<string, unknown>;
    user_correction?: any;
    satisfaction_score?: number;
    improvement_suggestions?: string[];
    context_relevance?: number;
    outcome_success?: boolean;
  };
  learning_weight: number;
  is_processed: boolean;
  created_at: string;
}

export interface LearningPattern {
  pattern_type: string;
  confidence: number;
  frequency: number;
  context_conditions: Record<string, unknown>;
  recommended_actions: string[];
}

export class AILearningDataService {
  async recordFeedback(
    decisionId: string,
    userId: string,
    tenantId: string | undefined,
    feedbackType: 'positive' | 'negative' | 'correction' | 'enhancement',
    feedbackData: any,
    learningWeight: number = 1.0
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_learning_data')
        .insert({
          decision_id: decisionId,
          user_id: userId,
          tenant_id: tenantId,
          feedback_type: feedbackType,
          feedback_data: feedbackData,
          learning_weight: learningWeight,
          is_processed: false
        });

      if (error) throw error;
      
      console.log(`Learning feedback recorded for decision ${decisionId}`);
      
      // Trigger pattern analysis for high-weight feedback
      if (learningWeight > 0.7) {
        await this.triggerPatternAnalysis(tenantId);
      }
    } catch (error) {
      console.error('Error recording learning feedback:', error);
      throw error;
    }
  }

  async recordDecisionOutcome(
    decisionId: string,
    outcome: 'success' | 'failure' | 'partial_success',
    outcomeData: any
  ): Promise<void> {
    try {
      // Update the original decision with outcome
      const { error: updateError } = await supabase
        .from('ai_decisions')
        .update({
          outcome_feedback: {
            outcome,
            outcome_data: outcomeData,
            recorded_at: new Date().toISOString()
          }
        })
        .eq('id', decisionId);

      if (updateError) throw updateError;

      // Create learning data entry
      const { error: insertError } = await supabase
        .from('ai_learning_data')
        .insert({
          decision_id: decisionId,
          user_id: null, // System generated
          tenant_id: null,
          feedback_type: outcome === 'success' ? 'positive' : 'negative',
          feedback_data: {
            outcome_type: outcome,
            outcome_data: outcomeData,
            automated_feedback: true
          },
          learning_weight: outcome === 'success' ? 0.8 : 0.9, // Failures are weighted higher for learning
          is_processed: false
        });

      if (insertError) throw insertError;
      
      console.log(`Decision outcome recorded: ${outcome} for decision ${decisionId}`);
    } catch (error) {
      console.error('Error recording decision outcome:', error);
      throw error;
    }
  }

  async analyzeLearningPatterns(tenantId?: string): Promise<LearningPattern[]> {
    try {
      const { data: learningData, error } = await supabase
        .from('ai_learning_data')
        .select(`
          *,
          ai_decisions!inner(
            context,
            decision,
            confidence_score,
            agent_id
          )
        `)
        .eq('tenant_id', tenantId || null)
        .eq('is_processed', false);

      if (error) throw error;

      const patterns: LearningPattern[] = [];

      // Group by feedback type and context
      const groupedData = this.groupLearningData(learningData || []);

      for (const [contextKey, entries] of Object.entries(groupedData)) {
        if (entries.length < 3) continue; // Need minimum data points

        const pattern = this.extractPattern(contextKey, entries);
        if (pattern.confidence > 0.6) {
          patterns.push(pattern);
        }
      }

      // Mark data as processed
      if (learningData && learningData.length > 0) {
        await this.markDataAsProcessed(learningData.map(d => d.id));
      }

      return patterns;
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      return [];
    }
  }

  private groupLearningData(data: unknown[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};

    data.forEach(entry => {
      const context = entry.ai_decisions?.context;
      if (!context) return;

      const key = `${context.module}_${context.action}_${entry.feedback_type}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });

    return grouped;
  }

  private extractPattern(contextKey: string, entries: unknown[]): LearningPattern {
    const [module, action, feedbackType] = contextKey.split('_');
    
    // Calculate confidence based on consistency of feedback
    const totalEntries = entries.length;
    const positiveWeight = entries
      .filter(e => e.feedback_type === 'positive')
      .reduce((sum, e) => sum + e.learning_weight, 0);
    const negativeWeight = entries
      .filter(e => e.feedback_type === 'negative')
      .reduce((sum, e) => sum + e.learning_weight, 0);

    const confidence = Math.abs(positiveWeight - negativeWeight) / (positiveWeight + negativeWeight);

    // Extract common context conditions
    const contextConditions = this.extractCommonContexts(entries);

    // Generate recommendations
    const recommendedActions = this.generateRecommendations(feedbackType, entries);

    return {
      pattern_type: `${module}_${action}_optimization`,
      confidence: Math.min(confidence, 1.0),
      frequency: totalEntries,
      context_conditions: contextConditions,
      recommended_actions: recommendedActions
    };
  }

  private extractCommonContexts(entries: unknown[]): unknown {
    const contexts = entries
      .map(e => e.ai_decisions?.context)
      .filter(Boolean);

    if (contexts.length === 0) return {};

    // Find common properties across contexts
    const commonContext: unknown = {};
    const firstContext = contexts[0];

    Object.keys(firstContext).forEach(key => {
      const values = contexts.map(c => c[key]).filter(v => v !== undefined);
      const uniqueValues = [...new Set(values)];
      
      if (uniqueValues.length === 1) {
        commonContext[key] = uniqueValues[0];
      } else if (uniqueValues.length <= contexts.length * 0.7) {
        commonContext[`${key}_common`] = uniqueValues;
      }
    });

    return commonContext;
  }

  private generateRecommendations(feedbackType: string, entries: unknown[]): string[] {
    const recommendations: string[] = [];

    if (feedbackType === 'negative') {
      recommendations.push('Review decision criteria for this context');
      recommendations.push('Consider alternative AI agent selection');
      recommendations.push('Adjust confidence thresholds');
    } else if (feedbackType === 'positive') {
      recommendations.push('Replicate successful decision patterns');
      recommendations.push('Increase confidence in similar contexts');
      recommendations.push('Use as training example for other agents');
    }

    // Analyze specific feedback data for more targeted recommendations
    entries.forEach(entry => {
      const feedbackData = entry.feedback_data as unknown;
      if (feedbackData && typeof feedbackData === 'object' && feedbackData.improvement_suggestions) {
        const suggestions = feedbackData.improvement_suggestions;
        if (Array.isArray(suggestions)) {
          recommendations.push(...suggestions);
        }
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private async markDataAsProcessed(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_learning_data')
        .update({ is_processed: true })
        .in('id', ids);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking learning data as processed:', error);
    }
  }

  private async triggerPatternAnalysis(tenantId?: string): Promise<void> {
    try {
      // Run pattern analysis in the background
      setTimeout(async () => {
        const patterns = await this.analyzeLearningPatterns(tenantId);
        if (patterns.length > 0) {
          console.log(`Discovered ${patterns.length} new learning patterns for tenant ${tenantId}`);
          // In a production environment, this would trigger notifications or updates
        }
      }, 1000);
    } catch (error) {
      console.error('Error triggering pattern analysis:', error);
    }
  }

  async getLearningInsights(tenantId?: string): Promise<{
    totalFeedback: number;
    positiveRatio: number;
    topIssues: string[];
    improvementAreas: string[];
    recentPatterns: LearningPattern[];
  }> {
    try {
      const { data: learningData, error } = await supabase
        .from('ai_learning_data')
        .select('*')
        .eq('tenant_id', tenantId || null)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const totalFeedback = learningData?.length || 0;
      const positiveFeedback = learningData?.filter(d => d.feedback_type === 'positive').length || 0;
      const positiveRatio = totalFeedback > 0 ? positiveFeedback / totalFeedback : 0;

      const recentPatterns = await this.analyzeLearningPatterns(tenantId);

      // Extract top issues and improvement areas with proper type checking
      const issues: string[] = [];
      learningData?.filter(d => d.feedback_type === 'negative').forEach(d => {
        const feedbackData = d.feedback_data as unknown;
        if (feedbackData && typeof feedbackData === 'object' && feedbackData.improvement_suggestions) {
          const suggestions = feedbackData.improvement_suggestions;
          if (Array.isArray(suggestions)) {
            issues.push(...suggestions.filter(s => typeof s === 'string'));
          }
        }
      });

      const topIssues = this.getTopItems(issues, 5);
      const improvementAreas = recentPatterns
        .map(p => p.recommended_actions)
        .flat()
        .slice(0, 5);

      return {
        totalFeedback,
        positiveRatio,
        topIssues,
        improvementAreas,
        recentPatterns: recentPatterns.slice(0, 3)
      };
    } catch (error) {
      console.error('Error getting learning insights:', error);
      return {
        totalFeedback: 0,
        positiveRatio: 0,
        topIssues: [],
        improvementAreas: [],
        recentPatterns: []
      };
    }
  }

  private getTopItems(items: string[], limit: number): string[] {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item);
  }
}

export const aiLearningDataService = new AILearningDataService();
