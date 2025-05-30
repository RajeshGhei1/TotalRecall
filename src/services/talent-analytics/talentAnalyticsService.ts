
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';

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
      // Create AI context for talent analysis - using any to avoid circular types
      const aiContext: any = {
        user_id: 'system', // Using system for analytics
        tenant_id: request.tenantId,
        module: 'smart_talent_analytics',
        action: `analyze_${request.analysisType}`,
        entity_type: 'talent',
        session_data: {
          analysis_type: request.analysisType,
          parameters: request.parameters
        }
      };

      // Use AI orchestration service for analysis - using any for parameters
      const aiResult: any = await aiOrchestrationService.requestPrediction(aiContext, {
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

  private extractInsights(result: any): any[] {
    if (result && typeof result === 'object' && result.insights) {
      return Array.isArray(result.insights) ? result.insights : [result.insights];
    }
    return [];
  }

  private extractPredictions(result: any): any[] {
    if (result && typeof result === 'object' && result.predictions) {
      return Array.isArray(result.predictions) ? result.predictions : [result.predictions];
    }
    return [];
  }

  private extractRecommendations(aiResult: any): any[] {
    if (aiResult && aiResult.suggestions) {
      return Array.isArray(aiResult.suggestions) ? aiResult.suggestions : [aiResult.suggestions];
    }
    return [];
  }

  private extractConfidence(aiResult: any): number {
    if (aiResult && typeof aiResult.confidence_score === 'number') {
      return aiResult.confidence_score;
    }
    return 0;
  }

  async getSkillsGapAnalysis(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
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
    } catch (error) {
      console.error('Error in skills gap analysis:', error);
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
    }
  }

  async getRetentionRiskAssessment(tenantId: string): Promise<TalentAnalyticsResult> {
    try {
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
    } catch (error) {
      console.error('Error in retention risk assessment:', error);
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
    }
  }

  async getCareerPathRecommendations(tenantId: string, userId: string): Promise<TalentAnalyticsResult> {
    try {
      // Fetch user's skills, performance, and goals - using any to avoid type issues
      const { data: userSkills }: { data: any } = await supabase
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
    } catch (error) {
      console.error('Error in career path recommendations:', error);
      return { insights: [], predictions: [], recommendations: [], confidence: 0 };
    }
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
      // Using any to avoid Supabase type conflicts
      const insightsToStore: any[] = insights.map(insight => ({
        tenant_id: tenantId,
        insight_type: 'talent_analytics',
        insight_data: insight as any, // Explicit cast to any
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
