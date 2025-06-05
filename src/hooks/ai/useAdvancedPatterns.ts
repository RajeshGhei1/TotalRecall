
import { useState, useEffect } from 'react';
import { usePatternRecognition } from './usePatternRecognition';
import { PatternRecognitionResult, WorkflowInefficiency, PredictiveInsight } from '@/services/ai/patternRecognition/advancedPatternRecognitionService';

export interface AdvancedPatternAnalysis {
  criticalIssues: Array<PatternRecognitionResult | WorkflowInefficiency>;
  recommendations: string[];
  riskScore: number;
  efficiencyScore: number;
  learningProgress: number;
  nextActions: string[];
}

export const useAdvancedPatterns = (userId: string, tenantId?: string) => {
  const {
    patterns,
    inefficiencies,
    insights,
    isLoading,
    error,
    refreshPatterns,
    getPatternSummary
  } = usePatternRecognition(userId, tenantId, { autoRefresh: true });

  const [analysis, setAnalysis] = useState<AdvancedPatternAnalysis | null>(null);

  useEffect(() => {
    if (patterns.length > 0 || inefficiencies.length > 0 || insights.length > 0) {
      generateAdvancedAnalysis();
    }
  }, [patterns, inefficiencies, insights]);

  const generateAdvancedAnalysis = () => {
    // Identify critical issues
    const criticalPatterns = patterns.filter(p => p.severity === 'critical' || p.severity === 'high');
    const highImpactInefficiencies = inefficiencies.filter(i => i.impact > 0.7);
    const criticalIssues = [...criticalPatterns, ...highImpactInefficiencies];

    // Generate recommendations
    const recommendations = [
      ...patterns.flatMap(p => p.recommendations),
      ...inefficiencies.flatMap(i => i.suggestedOptimizations),
      ...insights.filter(i => i.actionable).flatMap(i => i.recommendedActions)
    ].slice(0, 10); // Top 10 recommendations

    // Calculate risk score (0-1)
    const riskScore = Math.min(1, (
      criticalPatterns.length * 0.3 +
      patterns.filter(p => p.severity === 'medium').length * 0.1 +
      highImpactInefficiencies.length * 0.2
    ) / 10);

    // Calculate efficiency score (0-1)
    const efficiencyScore = Math.max(0, 1 - (
      inefficiencies.reduce((sum, i) => sum + i.impact, 0) / 
      Math.max(inefficiencies.length, 1)
    ));

    // Calculate learning progress (0-1)
    const learningPatterns = patterns.filter(p => p.patternType === 'learning_behavior');
    const learningProgress = learningPatterns.length > 0 ? 
      learningPatterns.reduce((sum, p) => sum + p.confidence, 0) / learningPatterns.length : 0.5;

    // Generate next actions
    const nextActions = [
      ...criticalIssues.slice(0, 3).map(issue => 
        'recommendations' in issue ? 
          `Address: ${issue.description}` : 
          `Fix: ${issue.description}`
      ),
      ...insights.filter(i => i.actionable).slice(0, 2).map(i => 
        `Prepare for: ${i.insight}`
      )
    ];

    setAnalysis({
      criticalIssues,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      riskScore,
      efficiencyScore,
      learningProgress,
      nextActions
    });
  };

  const getPatternInsights = () => {
    if (!analysis) return null;

    return {
      summary: getPatternSummary(),
      analysis,
      hasData: patterns.length > 0 || inefficiencies.length > 0 || insights.length > 0
    };
  };

  const exportPatternData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      patterns,
      inefficiencies,
      insights,
      analysis
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-analysis-${userId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    // Data
    patterns,
    inefficiencies,
    insights,
    analysis,
    
    // State
    isLoading,
    error,
    
    // Actions
    refreshPatterns,
    generateAdvancedAnalysis,
    exportPatternData,
    
    // Utilities
    getPatternInsights,
    getPatternSummary
  };
};
