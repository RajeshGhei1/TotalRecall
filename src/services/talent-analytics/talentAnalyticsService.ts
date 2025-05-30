
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import type {
  TalentAnalyticsRequest,
  TalentAnalyticsResult,
  TalentAnalyticsInsight,
  TalentAnalyticsPrediction,
  TalentAnalyticsRecommendation,
  SimpleAIResponse,
  DatabaseInsightRecord,
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
        user_id: 'system' as const,
        tenant_id: request.tenantId,
        module: 'smart_talent_analytics' as const,
        action: `analyze_${request.analysisType}` as const,
        entity_type: 'talent' as const,
        session_data: {
          analysis_type: request.analysisType,
          parameters: request.parameters
        }
      };

      // Use AI orchestration service for analysis with simplified typing
      const aiResult = await aiOrchestrationService.requestPrediction(aiContext, {
        model_type: 'analytics',
        analysis_depth: 'comprehensive'
      }) as SimpleAIResponse;

      // Process and structure the results
      return {
        insights: this.extractInsights(aiResult),
        predictions: this.extractPredictions(aiResult),
        recommendations: this.extractRecommendations(aiResult),
        confidence: this.extractConfidence(aiResult)
      };
    } catch (error) {
      console.error('Error in talent analytics:', error);
      throw error;
    }
  }

  private extractInsights(result: SimpleAIResponse): TalentAnalyticsInsight[] {
    if (!result?.insights || !Array.isArray(result.insights)) {
      return [];
    }

    return result.insights.map(item => {
      if (typeof item === 'object' && item !== null) {
        const insight = item as Record<string, unknown>;
        return {
          type: String(insight.type || 'general'),
          title: String(insight.title || 'Insight'),
          description: String(insight.description || ''),
          confidence: Number(insight.confidence || 0.8),
          metadata: insight.metadata as Record<string, unknown> || {}
        };
      }
      return {
        type: 'general',
        title: 'Insight',
        description: String(item),
        confidence: 0.8,
        metadata: {}
      };
    });
  }

  private extractPredictions(result: SimpleAIResponse): TalentAnalyticsPrediction[] {
    if (!result?.predictions || !Array.isArray(result.predictions)) {
      return [];
    }

    return result.predictions.map(item => {
      if (typeof item === 'object' && item !== null) {
        const prediction = item as Record<string, unknown>;
        return {
          type: String(prediction.type || 'general'),
          outcome: String(prediction.outcome || ''),
          probability: Number(prediction.probability || 0.5),
          timeframe: prediction.timeframe ? String(prediction.timeframe) : undefined,
          factors: Array.isArray(prediction.factors) ? prediction.factors.map(String) : undefined
        };
      }
      return {
        type: 'general',
        outcome: String(item),
        probability: 0.5
      };
    });
  }

  private extractRecommendations(result: SimpleAIResponse): TalentAnalyticsRecommendation[] {
    if (!result?.suggestions || !Array.isArray(result.suggestions)) {
      return [];
    }

    return result.suggestions.map(item => {
      if (typeof item === 'object' && item !== null) {
        const recommendation = item as Record<string, unknown>;
        return {
          action: String(recommendation.action || 'Review'),
          priority: (recommendation.priority as 'high' | 'medium' | 'low') || 'medium',
          description: String(recommendation.description || ''),
          impact: recommendation.impact ? String(recommendation.impact) : undefined
        };
      }
      return {
        action: 'Review',
        priority: 'medium' as const,
        description: String(item)
      };
    });
  }

  private extractConfidence(result: SimpleAIResponse): number {
    if (typeof result?.confidence_score === 'number') {
      return Math.max(0, Math.min(1, result.confidence_score));
    }
    return 0.8;
  }

  async getSkillsGapAnalysis(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch talent data from database with explicit typing
      const { data: talents } = await supabase
        .from('talents')
        .select('*')
        .eq('tenant_id', tenantId);

      const { data: people } = await supabase
        .from('people')
        .select('*');

      // Convert to typed data
      const talentData: TalentData[] = (talents || []).map(talent => ({
        id: talent.id,
        full_name: talent.full_name,
        email: talent.email,
        phone: talent.phone || undefined,
        location: talent.location || undefined,
        availability_status: talent.availability_status || undefined,
        tenant_id: tenantId
      }));

      const peopleData: PersonData[] = (people || []).map(person => ({
        id: person.id,
        full_name: person.full_name,
        email: person.email,
        phone: person.phone || undefined,
        location: person.location || undefined,
        type: person.type
      }));

      // Analyze skills gaps using AI
      return this.analyzeTalent({
        tenantId,
        analysisType: 'skills_gap',
        parameters: {
          talent_data: talentData,
          people_data: peopleData,
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
        .eq('tenant_id', tenantId);

      const patternsData: BehavioralPatternData[] = (behavioralPatterns || []).map(pattern => ({
        id: pattern.id,
        user_id: pattern.user_id || undefined,
        tenant_id: pattern.tenant_id || undefined,
        pattern_type: pattern.pattern_type,
        pattern_data: pattern.pattern_data as Record<string, unknown>,
        frequency_score: pattern.frequency_score || undefined,
        last_occurrence: pattern.last_occurrence || undefined
      }));

      return this.analyzeTalent({
        tenantId,
        analysisType: 'retention_risk',
        parameters: {
          behavioral_patterns: patternsData,
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
        .eq('talent_id', userId);

      const skillsData: TalentSkillData[] = (userSkills || []).map(skill => ({
        id: skill.id,
        talent_id: skill.talent_id,
        skill_id: skill.skill_id,
        proficiency_level: skill.proficiency_level || undefined,
        years_of_experience: skill.years_of_experience || undefined
      }));

      return this.analyzeTalent({
        tenantId,
        analysisType: 'career_path',
        parameters: {
          user_id: userId,
          current_skills: skillsData,
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
      const insightsToStore: DatabaseInsightRecord[] = insights.map(insight => ({
        tenant_id: tenantId,
        insight_type: 'talent_analytics',
        insight_data: insight as unknown,
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
