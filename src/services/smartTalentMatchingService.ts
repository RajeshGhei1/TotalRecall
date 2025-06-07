
import { supabase } from '@/integrations/supabase/client';

export interface MatchAnalysis {
  matchScore: number;
  skillAlignment: {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
    analysis: string;
  };
  experienceMatch: {
    score: number;
    analysis: string;
  };
  locationCompatibility: {
    score: number;
    analysis: string;
  };
  salaryAlignment: {
    score: number;
    analysis: string;
  };
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  summary: string;
}

export interface CandidateMatch {
  candidateId: string;
  candidate: {
    name: string;
    currentTitle: string;
    currentCompany: string;
    location: string;
    experienceYears: number;
  };
  matchAnalysis: MatchAnalysis;
}

export interface SmartMatchResult {
  jobId: string;
  jobTitle: string;
  matchResults: CandidateMatch[];
  generatedAt: string;
}

class SmartTalentMatchingService {
  async analyzeJobCandidateMatch(
    jobId: string, 
    candidateIds: string[], 
    tenantId: string
  ): Promise<SmartMatchResult> {
    try {
      const { data, error } = await supabase.functions.invoke('smart-talent-matching', {
        body: {
          jobId,
          candidateIds,
          tenantId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in smart talent matching:', error);
      throw error;
    }
  }

  async findBestCandidatesForJob(jobId: string, tenantId: string, limit = 10): Promise<SmartMatchResult> {
    try {
      // First get all candidates for this tenant
      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('id')
        .eq('tenant_id', tenantId)
        .limit(limit);

      if (candidatesError) throw candidatesError;

      const candidateIds = candidates.map(c => c.id);
      
      if (candidateIds.length === 0) {
        throw new Error('No candidates found for this tenant');
      }

      return this.analyzeJobCandidateMatch(jobId, candidateIds, tenantId);
    } catch (error) {
      console.error('Error finding best candidates:', error);
      throw error;
    }
  }

  getMatchScoreColor(score: number): string {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  getMatchScoreLabel(score: number): string {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 55) return 'Fair Match';
    return 'Poor Match';
  }
}

export const smartTalentMatchingService = new SmartTalentMatchingService();
