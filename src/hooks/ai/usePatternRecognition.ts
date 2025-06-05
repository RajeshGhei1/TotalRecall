
import { useState, useEffect, useCallback } from 'react';
import { advancedPatternRecognitionService, PatternRecognitionResult, WorkflowInefficiency, PredictiveInsight } from '@/services/ai/patternRecognition/advancedPatternRecognitionService';

export interface PatternRecognitionState {
  patterns: PatternRecognitionResult[];
  inefficiencies: WorkflowInefficiency[];
  insights: PredictiveInsight[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface PatternRecognitionOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  timeRange?: number; // in days
}

export const usePatternRecognition = (
  userId: string,
  tenantId?: string,
  options: PatternRecognitionOptions = {}
) => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    timeRange = 30
  } = options;

  const [state, setState] = useState<PatternRecognitionState>({
    patterns: [],
    inefficiencies: [],
    insights: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const loadPatternData = useCallback(async () => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [patterns, inefficiencies, insights] = await Promise.all([
        advancedPatternRecognitionService.recognizePatterns(userId, tenantId, timeRange),
        advancedPatternRecognitionService.detectWorkflowInefficiencies(userId, tenantId),
        advancedPatternRecognitionService.generatePredictiveInsights(userId, tenantId)
      ]);

      setState({
        patterns,
        inefficiencies,
        insights,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error loading pattern data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load pattern data'
      }));
    }
  }, [userId, tenantId, timeRange]);

  const refreshPatterns = useCallback(() => {
    loadPatternData();
  }, [loadPatternData]);

  const getPatternsByType = useCallback((type: string) => {
    return state.patterns.filter(pattern => pattern.patternType === type);
  }, [state.patterns]);

  const getPatternsBySeverity = useCallback((severity: string) => {
    return state.patterns.filter(pattern => pattern.severity === severity);
  }, [state.patterns]);

  const getHighConfidencePatterns = useCallback((threshold: number = 0.8) => {
    return state.patterns.filter(pattern => pattern.confidence >= threshold);
  }, [state.patterns]);

  const getInefficienciesByType = useCallback((type: string) => {
    return state.inefficiencies.filter(inefficiency => inefficiency.type === type);
  }, [state.inefficiencies]);

  const getInsightsByCategory = useCallback((category: string) => {
    return state.insights.filter(insight => insight.category === category);
  }, [state.insights]);

  const getActionableInsights = useCallback(() => {
    return state.insights.filter(insight => insight.actionable);
  }, [state.insights]);

  const getPatternSummary = useCallback(() => {
    const totalPatterns = state.patterns.length;
    const criticalPatterns = state.patterns.filter(p => p.severity === 'critical').length;
    const highConfidencePatterns = state.patterns.filter(p => p.confidence >= 0.8).length;
    const totalInefficiencies = state.inefficiencies.length;
    const actionableInsights = state.insights.filter(i => i.actionable).length;

    return {
      totalPatterns,
      criticalPatterns,
      highConfidencePatterns,
      totalInefficiencies,
      actionableInsights,
      lastUpdated: state.lastUpdated
    };
  }, [state]);

  // Initial load
  useEffect(() => {
    if (userId) {
      loadPatternData();
    }
  }, [userId, loadPatternData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(() => {
      loadPatternData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, userId, refreshInterval, loadPatternData]);

  return {
    // State
    ...state,
    
    // Actions
    refreshPatterns,
    loadPatternData,
    
    // Selectors
    getPatternsByType,
    getPatternsBySeverity,
    getHighConfidencePatterns,
    getInefficienciesByType,
    getInsightsByCategory,
    getActionableInsights,
    getPatternSummary
  };
};
