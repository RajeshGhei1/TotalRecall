
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import {
  TalentAnalyticsRequest,
  TalentAnalyticsResult,
  TalentAnalyticsInsight,
  TalentAnalyticsPrediction,
  TalentAnalyticsRecommendation,
  TalentAIContext,
  TalentData,
  PersonData,
  BehavioralPatternData,
  TalentSkillData
} from '@/types/talent-analytics';

// Simple AI response type to avoid circular references
type SimpleAIResponse = {
  request_id: string;
  agent_id: string;
  result: {
    insights?: unknown[];
    predictions?: unknown[];
    analysis?: string;
    [key: string]: unknown;
  };
  confidence_score: number;
  reasoning?: string[];
  suggestions?: string[];
};

class TalentAnalyticsService {
  async analyzeTalent(request: TalentAnalyticsRequest): Promise<TalentAnalyticsResult> {
    try {
      // Create AI context for talent analysis
      const aiContext: TalentAIContext = {
        user_id: 'system',
        tenant_id: request.tenantId,
        module: 'smart_talent_analytics',
        action: `analyze_${request.analysisType}`,
        entity_type: 'talent',
        session_data: {
          analysis_type: request.analysisType,
          parameters: request.parameters
        }
      };

      // Use AI orchestration service for analysis
      const aiResult = await aiOrchestrationService.requestPrediction(aiContext, {
        model_type: 'analytics',
        analysis_depth: 'comprehensive'
      }) as SimpleAIResponse;

      // Process and structure the results
      return {
        insights: this.extractInsights(aiResult.result),
        predictions: this.extractPredictions(aiResult.result),
        recommendations: this.extractRecommendations(aiResult),
        confidence: this.extractConfidence(aiResult)
      };
    } catch (error) {
      console.error('Error in talent analytics:', error);
      throw error;
    }
  }

  private extractInsights(result: SimpleAIResponse['result']): TalentAnalyticsInsight[] {
    if (!result || typeof result !== 'object') {
      return [];
    }
    
    const insights = result.insights;
    if (!Array.isArray(insights)) {
      return [];
    }

    return insights.map((insight, index): TalentAnalyticsInsight => ({
      id: `insight_${index}_${Date.now()}`,
      title: this.getStringValue(insight, 'title', 'AI Generated Insight'),
      description: this.getStringValue(insight, 'description', 'No description available'),
      type: this.getInsightType(insight),
      confidence: this.getNumberValue(insight, 'confidence', 0.8),
      actionable: this.getBooleanValue(insight, 'actionable', true),
      data: typeof insight === 'object' && insight !== null ? insight as Record<string, unknown> : {}
    }));
  }

  private extractPredictions(result: SimpleAIResponse['result']): TalentAnalyticsPrediction[] {
    if (!result || typeof result !== 'object') {
      return [];
    }
    
    const predictions = result.predictions;
    if (!Array.isArray(predictions)) {
      return [];
    }

    return predictions.map((prediction, index): TalentAnalyticsPrediction => ({
      id: `prediction_${index}_${Date.now()}`,
      prediction_type: this.getPredictionType(prediction),
      probability: this.getNumberValue(prediction, 'probability', 0.5),
      timeframe: this.getStringValue(prediction, 'timeframe', '3 months'),
      factors: this.getArrayValue(prediction, 'factors'),
      data: typeof prediction === 'object' && prediction !== null ? prediction as Record<string, unknown> : {}
    }));
  }

  private extractRecommendations(aiResult: SimpleAIResponse): TalentAnalyticsRecommendation[] {
    if (!aiResult || !aiResult.suggestions || !Array.isArray(aiResult.suggestions)) {
      return [];
    }

    return aiResult.suggestions.map((suggestion, index): TalentAnalyticsRecommendation => ({
      id: `recommendation_${index}_${Date.now()}`,
      recommendation_type: 'action',
      priority: 'medium',
      description: typeof suggestion === 'string' ? suggestion : 'AI recommendation',
      expected_impact: 'Positive impact on talent management',
      implementation_effort: 'medium'
    }));
  }

  private extractConfidence(aiResult: SimpleAIResponse): number {
    if (aiResult && typeof aiResult.confidence_score === 'number') {
      return Math.max(0, Math.min(1, aiResult.confidence_score));
    }
    return 0.8; // Default confidence
  }

  // Type-safe helper methods
  private getStringValue(obj: unknown, key: string, defaultValue: string): string {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === 'string' ? value : defaultValue;
    }
    return defaultValue;
  }

  private getNumberValue(obj: unknown, key: string, defaultValue: number): number {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === 'number' ? value : defaultValue;
    }
    return defaultValue;
  }

  private getBooleanValue(obj: unknown, key: string, defaultValue: boolean): boolean {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === 'boolean' ? value : defaultValue;
    }
    return defaultValue;
  }

  private getArrayValue(obj: unknown, key: string): string[] {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string');
      }
    }
    return [];
  }

  private getInsightType(insight: unknown): TalentAnalyticsInsight['type'] {
    const type = this.getStringValue(insight, 'type', 'performance');
    const validTypes: TalentAnalyticsInsight['type'][] = ['skills_gap', 'retention_risk', 'performance', 'career_path'];
    return validTypes.includes(type as TalentAnalyticsInsight['type']) 
      ? type as TalentAnalyticsInsight['type'] 
      : 'performance';
  }

  private getPredictionType(prediction: unknown): TalentAnalyticsPrediction['prediction_type'] {
    const type = this.getStringValue(prediction, 'type', 'performance');
    const validTypes: TalentAnalyticsPrediction['prediction_type'][] = ['retention', 'performance', 'skills_development', 'career_progression'];
    return validTypes.includes(type as TalentAnalyticsPrediction['prediction_type']) 
      ? type as TalentAnalyticsPrediction['prediction_type'] 
      : 'performance';
  }

  async getSkillsGapAnalysis(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch talent data from database
      const { data: talents } = await supabase
        .from('talents')
        .select('*')
        .eq('tenant_id', tenantId)
        .returns<TalentData[]>();

      const { data: people } = await supabase
        .from('people')
        .select('*')
        .returns<PersonData[]>();

      // Analyze skills gaps using AI
      return this.analyzeTalent({
        tenantId,
        analysisType: 'skills_gap',
        parameters: {
          talent_data: talents || [],
          people_data: people || [],
          market_trends: true
        }
      });
    } catch (error) {
      console.error('Error in skills gap analysis:', error);
      return this.getEmptyResult();
    }
  }

  async getRetentionRiskAssessment(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch behavioral patterns and performance data
      const { data: behavioralPatterns } = await supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('tenant_id', tenantId)
        .returns<BehavioralPatternData[]>();

      return this.analyzeTalent({
        tenantId,
        analysisType: 'retention_risk',
        parameters: {
          behavioral_patterns: behavioralPatterns || [],
          include_external_factors: true
        }
      });
    } catch (error) {
      console.error('Error in retention risk assessment:', error);
      return this.getEmptyResult();
    }
  }

  async getCareerPathRecommendations(tenantId: string, userId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch user's skills, performance, and goals
      const { data: userSkills } = await supabase
        .from('talent_skills')
        .select('*')
        .eq('talent_id', userId)
        .returns<TalentSkillData[]>();

      return this.analyzeTalent({
        tenantId,
        analysisType: 'career_path',
        parameters: {
          user_id: userId,
          current_skills: userSkills || [],
          career_aspirations: true
        }
      });
    } catch (error) {
      console.error('Error in career path recommendations:', error);
      return this.getEmptyResult();
    }
  }

  async generateTalentInsights(tenantId: string): Promise<TalentAnalyticsInsight[]> {
    try {
      // Combine multiple analysis types for comprehensive insights
      const [skillsGap, retentionRisk] = await Promise.all([
        this.getSkillsGapAnalysis(tenantId),
        this.getRetentionRiskAssessment(tenantId)
      ]);

      // Store insights in database for future reference
      const insights = [
        ...skillsGap.insights,
        ...retentionRisk.insights
      ];

      await this.storeInsights(tenantId, insights);

      return insights;
    } catch (error) {
      console.error('Error generating talent insights:', error);
      return [];
    }
  }

  private async storeInsights(tenantId: string, insights: TalentAnalyticsInsight[]): Promise<void> {
    try {
      const insightsToStore = insights.map(insight => ({
        tenant_id: tenantId,
        insight_type: 'talent_analytics',
        insight_data: insight as unknown as Record<string, unknown>,
        confidence_score: insight.confidence,
        applicable_modules: ['smart_talent_analytics'] as string[], // Mutable array for Supabase
        is_active: true
      }));

      await supabase
        .from('ai_insights')
        .insert(insightsToStore);
    } catch (error) {
      console.error('Error storing insights:', error);
    }
  }

  private getEmptyResult(): TalentAnalyticsResult {
    return {
      insights: [],
      predictions: [],
      recommendations: [],
      confidence: 0
    };
  }
}

export const talentAnalyticsService = new TalentAnalyticsService();
