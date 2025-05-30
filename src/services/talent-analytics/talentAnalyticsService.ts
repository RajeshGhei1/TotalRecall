
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';
import { AIContext } from '@/types/ai';

export interface TalentAnalyticsRequest {
  tenantId: string;
  analysisType: 'skills_gap' | 'retention_risk' | 'performance_prediction' | 'career_path';
  parameters: Record<string, any>;
}

export interface TalentAnalyticsResult {
  insights: any[];
  predictions: any[];
  recommendations: any[];
  confidence: number;
}

class TalentAnalyticsService {
  async analyzeTalent(request: TalentAnalyticsRequest): Promise<TalentAnalyticsResult> {
    try {
      // Create AI context for talent analysis
      const aiContext: AIContext = {
        type: 'talent_analytics',
        tenant_id: request.tenantId,
        entity_type: 'talent',
        context_data: {
          analysis_type: request.analysisType,
          parameters: request.parameters
        }
      };

      // Use AI orchestration service for analysis
      const aiResult = await aiOrchestrationService.requestPrediction(aiContext, {
        model_type: 'analytics',
        analysis_depth: 'comprehensive'
      });

      // Process and structure the results
      return {
        insights: aiResult.insights || [],
        predictions: aiResult.predictions || [],
        recommendations: aiResult.recommendations || [],
        confidence: aiResult.confidence || 0
      };
    } catch (error) {
      console.error('Error in talent analytics:', error);
      throw error;
    }
  }

  async getSkillsGapAnalysis(tenantId: string): Promise<any> {
    // Fetch talent data from database
    const { data: talents } = await supabase
      .from('talents')
      .select('*')
      .eq('tenant_id', tenantId);

    const { data: people } = await supabase
      .from('people')
      .select('*');

    // Analyze skills gaps using AI
    return this.analyzeTalent({
      tenantId,
      analysisType: 'skills_gap',
      parameters: {
        talent_data: talents,
        people_data: people,
        market_trends: true
      }
    });
  }

  async getRetentionRiskAssessment(tenantId: string): Promise<any> {
    // Fetch behavioral patterns and performance data
    const { data: behavioralPatterns } = await supabase
      .from('behavioral_patterns')
      .select('*')
      .eq('tenant_id', tenantId);

    return this.analyzeTalent({
      tenantId,
      analysisType: 'retention_risk',
      parameters: {
        behavioral_patterns: behavioralPatterns,
        include_external_factors: true
      }
    });
  }

  async getCareerPathRecommendations(tenantId: string, userId: string): Promise<any> {
    // Fetch user's skills, performance, and goals
    const { data: userSkills } = await supabase
      .from('talent_skills')
      .select('*')
      .eq('talent_id', userId);

    return this.analyzeTalent({
      tenantId,
      analysisType: 'career_path',
      parameters: {
        user_id: userId,
        current_skills: userSkills,
        career_aspirations: true
      }
    });
  }

  async generateTalentInsights(tenantId: string): Promise<any[]> {
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

  private async storeInsights(tenantId: string, insights: any[]): Promise<void> {
    try {
      const insightsToStore = insights.map(insight => ({
        tenant_id: tenantId,
        insight_type: 'talent_analytics',
        insight_data: insight,
        confidence_score: insight.confidence || 0.8,
        applicable_modules: ['smart_talent_analytics'],
        is_active: true
      }));

      await supabase
        .from('ai_insights')
        .insert(insightsToStore);
    } catch (error) {
      console.error('Error storing insights:', error);
    }
  }
}

export const talentAnalyticsService = new TalentAnalyticsService();
