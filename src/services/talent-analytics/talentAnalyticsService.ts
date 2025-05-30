
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import type {
  TalentAnalyticsRequest,
  TalentAnalyticsResult,
  TalentAnalyticsInsight,
  TalentAnalyticsPrediction,
  TalentAnalyticsRecommendation,
  AIOrchestrationResult,
  AIInsightRecord,
  TalentData,
  PersonData,
  BehavioralPatternData,
  TalentSkillData
} from '@/types/talent-analytics';

class TalentAnalyticsService {
  async analyzeTalent(request: TalentAnalyticsRequest): Promise<TalentAnalyticsResult> {
    try {
      // Create AI context for talent analysis
      const aiContext = {
        user_id: 'system',
        tenant_id: request.tenantId,
        module: 'smart_talent_analytics',
        action: `analyze_${request.analysisType}`,
        entity_type: 'talent',
        session_data: {
          analysis_type: request.analysisType,
          parameters: request.parameters
        }
      } as const;

      // Use AI orchestration service for analysis
      const aiResult: AIOrchestrationResult = await aiOrchestrationService.requestPrediction(aiContext, {
        model_type: 'analytics',
        analysis_depth: 'comprehensive'
      });

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

  private extractInsights(result: AIOrchestrationResult['result']): TalentAnalyticsInsight[] {
    if (!result || typeof result !== 'object') {
      return [];
    }

    const { insights } = result;
    if (!insights) {
      return [];
    }

    return Array.isArray(insights) ? insights : [insights];
  }

  private extractPredictions(result: AIOrchestrationResult['result']): TalentAnalyticsPrediction[] {
    if (!result || typeof result !== 'object') {
      return [];
    }

    const { predictions } = result;
    if (!predictions) {
      return [];
    }

    return Array.isArray(predictions) ? predictions : [predictions];
  }

  private extractRecommendations(aiResult: AIOrchestrationResult): TalentAnalyticsRecommendation[] {
    if (!aiResult || !aiResult.suggestions) {
      return [];
    }

    return Array.isArray(aiResult.suggestions) ? aiResult.suggestions : [aiResult.suggestions];
  }

  private extractConfidence(aiResult: AIOrchestrationResult): number {
    if (aiResult && typeof aiResult.confidence_score === 'number') {
      return aiResult.confidence_score;
    }
    return 0;
  }

  async getSkillsGapAnalysis(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch talent data from database with explicit typing
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
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
    }
  }

  async getRetentionRiskAssessment(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch behavioral patterns and performance data with explicit typing
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
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
    }
  }

  async getCareerPathRecommendations(tenantId: string, userId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch user's skills, performance, and goals with explicit typing
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
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
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
      const insights: TalentAnalyticsInsight[] = [
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
      const insightsToStore: AIInsightRecord[] = insights.map(insight => ({
        tenant_id: tenantId,
        insight_type: 'talent_analytics',
        insight_data: insight as Record<string, unknown>,
        confidence_score: insight.confidence || 0.8,
        applicable_modules: ['smart_talent_analytics'],
        is_active: true
      }));

      if (insightsToStore.length > 0) {
        await supabase
          .from('ai_insights')
          .insert(insightsToStore);
      }
    } catch (error) {
      console.error('Error storing insights:', error);
    }
  }
}

export const talentAnalyticsService = new TalentAnalyticsService();
