import { supabase } from '@/integrations/supabase/client';

interface LearningInsights {
  totalFeedback: number;
  positiveRatio: number;
  topIssues: string[];
  improvementAreas: string[];
  recentPatterns: any[];
}

export class AILearningDataService {
  async recordFeedback(
    decisionId: string,
    userId: string,
    tenantId?: string,
    feedbackType: 'positive' | 'negative',
    feedbackData: any = {},
    learningWeight: number = 1.0
  ): Promise<void> {
    try {
      await supabase
        .from('ai_learning_data')
        .insert({
          decision_id: decisionId,
          user_id: userId,
          tenant_id: tenantId,
          feedback_type: feedbackType,
          feedback_data: feedbackData as any,
          learning_weight: learningWeight,
          is_processed: false
        });

      console.log(`Learning feedback recorded: ${feedbackType} for decision ${decisionId}`);
    } catch (error) {
      console.error('Error recording learning feedback:', error);
      throw error;
    }
  }

  async recordDecisionOutcome(
    decisionId: string,
    outcome: 'success' | 'failure' | 'partial_success',
    outcomeData?: any
  ): Promise<void> {
    try {
      await supabase
        .from('ai_learning_data')
        .insert({
          decision_id: decisionId,
          user_id: 'system',
          feedback_type: 'outcome_tracking',
          feedback_data: {
            outcome,
            outcome_data: outcomeData,
            timestamp: new Date().toISOString()
          } as any,
          learning_weight: outcome === 'success' ? 1.0 : outcome === 'failure' ? 1.5 : 1.2,
          is_processed: false
        });

      console.log(`Decision outcome recorded: ${outcome} for decision ${decisionId}`);
    } catch (error) {
      console.error('Error recording decision outcome:', error);
      throw error;
    }
  }

  async getLearningInsights(tenantId?: string): Promise<LearningInsights> {
    try {
      let query = supabase
        .from('ai_learning_data')
        .select('feedback_type, feedback_data, learning_weight, created_at');

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data: learningData, error } = await query
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const totalFeedback = learningData?.length || 0;
      const positiveFeedback = learningData?.filter(d => d.feedback_type === 'positive').length || 0;
      const positiveRatio = totalFeedback > 0 ? positiveFeedback / totalFeedback : 0;

      // Analyze top issues from negative feedback
      const negativeData = learningData?.filter(d => d.feedback_type === 'negative') || [];
      const topIssues = this.extractTopIssues(negativeData);

      // Identify improvement areas
      const improvementAreas = this.identifyImprovementAreas(learningData || []);

      // Get recent patterns
      const recentPatterns = this.extractRecentPatterns(learningData?.slice(0, 100) || []);

      return {
        totalFeedback,
        positiveRatio,
        topIssues,
        improvementAreas,
        recentPatterns
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

  private extractTopIssues(negativeData: any[]): string[] {
    const issues: Record<string, number> = {};
    
    negativeData.forEach(data => {
      const feedbackData = data.feedback_data || {};
      if (feedbackData.issue_category) {
        issues[feedbackData.issue_category] = (issues[feedbackData.issue_category] || 0) + 1;
      }
      if (feedbackData.details) {
        // Extract keywords from details for common issues
        const keywords = this.extractKeywords(feedbackData.details);
        keywords.forEach(keyword => {
          issues[keyword] = (issues[keyword] || 0) + 0.5;
        });
      }
    });

    return Object.entries(issues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);
  }

  private identifyImprovementAreas(allData: any[]): string[] {
    const areas = new Set<string>();
    
    // Analyze patterns in feedback data
    allData.forEach(data => {
      const feedbackData = data.feedback_data || {};
      
      if (feedbackData.satisfaction_score && feedbackData.satisfaction_score < 0.7) {
        areas.add('User Satisfaction');
      }
      
      if (feedbackData.context_relevance && feedbackData.context_relevance < 0.8) {
        areas.add('Context Understanding');
      }
      
      if (data.feedback_type === 'outcome_tracking' && feedbackData.outcome === 'failure') {
        areas.add('Decision Accuracy');
      }
    });

    return Array.from(areas).slice(0, 3);
  }

  private extractRecentPatterns(recentData: any[]): any[] {
    // Group by time periods and identify patterns
    const patterns: any[] = [];
    
    // Pattern 1: Feedback trend over time
    const timeGroups = this.groupByTimeInterval(recentData, 'day', 7);
    patterns.push({
      type: 'feedback_trend',
      data: timeGroups,
      insight: 'Recent feedback patterns'
    });

    // Pattern 2: Common issues clustering
    const issuePatterns = this.findIssuePatterns(recentData);
    if (issuePatterns.length > 0) {
      patterns.push({
        type: 'issue_clustering',
        data: issuePatterns,
        insight: 'Recurring issue patterns'
      });
    }

    return patterns;
  }

  private extractKeywords(text: string): string[] {
    const commonIssues = [
      'slow', 'inaccurate', 'confusing', 'unhelpful', 'irrelevant',
      'performance', 'accuracy', 'relevance', 'usability', 'clarity'
    ];
    
    const lowerText = text.toLowerCase();
    return commonIssues.filter(keyword => lowerText.includes(keyword));
  }

  private groupByTimeInterval(data: any[], interval: 'hour' | 'day' | 'week', count: number): any[] {
    // Implementation for time-based grouping
    return []; // Placeholder
  }

  private findIssuePatterns(data: any[]): any[] {
    // Implementation for pattern detection
    return []; // Placeholder
  }

  async markDataAsProcessed(dataIds: string[]): Promise<void> {
    try {
      await supabase
        .from('ai_learning_data')
        .update({ is_processed: true })
        .in('id', dataIds);
    } catch (error) {
      console.error('Error marking learning data as processed:', error);
    }
  }
}

export const aiLearningDataService = new AILearningDataService();
