
// Explicit types for talent analytics to prevent circular references
export interface TalentData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  years_of_experience?: number;
  current_salary?: number;
  desired_salary?: number;
  availability_status?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface BehavioralPatternData {
  id: string;
  user_id: string;
  tenant_id?: string;
  pattern_type: string;
  pattern_data: Record<string, unknown>;
  frequency_score?: number;
  last_occurrence?: string;
  created_at: string;
  updated_at: string;
}

export interface TalentSkillData {
  id: string;
  talent_id: string;
  skill_id: string;
  proficiency_level?: string;
  years_of_experience?: number;
  created_at: string;
}

export interface TalentAnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'skills_gap' | 'retention_risk' | 'performance' | 'career_path';
  confidence: number;
  actionable: boolean;
  data: Record<string, unknown>;
}

export interface TalentAnalyticsPrediction {
  id: string;
  prediction_type: 'retention' | 'performance' | 'skills_development' | 'career_progression';
  probability: number;
  timeframe: string;
  factors: string[];
  data: Record<string, unknown>;
}

export interface TalentAnalyticsRecommendation {
  id: string;
  recommendation_type: 'action' | 'training' | 'hiring' | 'development';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  expected_impact: string;
  implementation_effort: 'low' | 'medium' | 'high';
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

export interface TalentAnalyticsResult {
  insights: TalentAnalyticsInsight[];
  predictions: TalentAnalyticsPrediction[];
  recommendations: TalentAnalyticsRecommendation[];
  confidence: number;
}

// Simple AI context interface specific to talent analytics
export interface TalentAIContext {
  user_id: string;
  tenant_id: string;
  module: 'smart_talent_analytics';
  action: string;
  entity_type?: 'talent';
  session_data?: Record<string, unknown>;
}

// Simple AI response interface to avoid circular references
export interface TalentAIResponse {
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
}
