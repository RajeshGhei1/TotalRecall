
// Explicit types to prevent circular references
export interface TalentData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  availability_status?: string;
  tenant_id?: string;
}

export interface PersonData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  type: string;
}

export interface BehavioralPatternData {
  id: string;
  user_id?: string;
  tenant_id?: string;
  pattern_type: string;
  pattern_data: Record<string, unknown>;
  frequency_score?: number;
  last_occurrence?: string;
}

export interface TalentSkillData {
  id: string;
  talent_id: string;
  skill_id: string;
  proficiency_level?: string;
  years_of_experience?: number;
}

export interface TalentAnalyticsRequest {
  tenantId: string;
  analysisType: 'skills_gap' | 'retention_risk' | 'performance_prediction' | 'career_path';
  parameters: {
    talent_data?: TalentData[];
    people_data?: PersonData[];
    behavioral_patterns?: BehavioralPatternData[];
    user_id?: string;
    current_skills?: TalentSkillData[];
    market_trends?: boolean;
    include_external_factors?: boolean;
    career_aspirations?: boolean;
  };
}

export interface TalentAnalyticsInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface TalentAnalyticsPrediction {
  type: string;
  outcome: string;
  probability: number;
  timeframe?: string;
  factors?: string[];
}

export interface TalentAnalyticsRecommendation {
  action: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact?: string;
}

export interface TalentAnalyticsResult {
  insights: TalentAnalyticsInsight[];
  predictions: TalentAnalyticsPrediction[];
  recommendations: TalentAnalyticsRecommendation[];
  confidence: number;
}

// Simplified AI response interface to break circular dependencies
export interface SimpleAIResponse {
  insights?: unknown[];
  predictions?: unknown[];
  suggestions?: unknown[];
  confidence_score?: number;
}

// Database record interface for ai_insights table
export interface DatabaseInsightRecord {
  tenant_id: string;
  insight_type: string;
  insight_data: unknown; // Use unknown instead of Record to avoid conflicts
  confidence_score: number;
  applicable_modules: string[];
  is_active: boolean;
}
