
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleProgressMetrics {
  module_id: string;
  code_completion: number;
  test_coverage: number;
  feature_completion: number;
  documentation_completion: number;
  quality_score: number;
  overall_progress: number;
  last_updated: string;
  metrics_data: {
    total_files_planned: number;
    files_implemented: number;
    total_tests_planned: number;
    tests_written: number;
    tests_passing: number;
    features_planned: number;
    features_completed: number;
    docs_sections_planned: number;
    docs_sections_completed: number;
    code_review_score: number;
    bug_count: number;
    performance_score: number;
  };
}

export interface ProgressUpdate {
  module_id: string;
  metric_type: 'code' | 'test' | 'feature' | 'documentation' | 'quality';
  increment_value: number;
  metadata: Record<string, any>;
}

// Type guard to ensure metrics_data has the correct structure
const ensureMetricsData = (data: any): ModuleProgressMetrics['metrics_data'] => {
  const defaultMetrics = {
    total_files_planned: 0,
    files_implemented: 0,
    total_tests_planned: 0,
    tests_written: 0,
    tests_passing: 0,
    features_planned: 0,
    features_completed: 0,
    docs_sections_planned: 0,
    docs_sections_completed: 0,
    code_review_score: 0,
    bug_count: 0,
    performance_score: 0
  };

  if (typeof data === 'object' && data !== null) {
    return { ...defaultMetrics, ...data };
  }
  
  return defaultMetrics;
};

export const useModuleProgress = (moduleId: string) => {
  return useQuery({
    queryKey: ['module-progress', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_progress_tracking')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) return null;

      return {
        ...data,
        metrics_data: ensureMetricsData(data.metrics_data)
      } as ModuleProgressMetrics;
    },
  });
};

export const useAllModulesProgress = () => {
  return useQuery({
    queryKey: ['all-modules-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_progress_tracking')
        .select('*')
        .order('overall_progress', { ascending: false });

      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        metrics_data: ensureMetricsData(item.metrics_data)
      })) as ModuleProgressMetrics[];
    },
  });
};

export const useUpdateModuleProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: ProgressUpdate) => {
      console.log('Updating module progress:', update);

      // Call the stored procedure to update progress
      const { data, error } = await supabase
        .rpc('update_module_progress', {
          p_module_id: update.module_id,
          p_metric_type: update.metric_type,
          p_increment_value: update.increment_value,
          p_metadata: update.metadata
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress data
      queryClient.invalidateQueries({ queryKey: ['module-progress', variables.module_id] });
      queryClient.invalidateQueries({ queryKey: ['all-modules-progress'] });
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
    },
  });
};

export const useInitializeModuleProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      module_id: string;
      initial_planning_data: {
        total_files_planned: number;
        total_tests_planned: number;
        features_planned: number;
        docs_sections_planned: number;
      };
    }) => {
      const { data, error } = await supabase
        .rpc('initialize_module_progress', {
          p_module_id: params.module_id,
          p_planning_data: params.initial_planning_data
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-modules-progress'] });
    },
  });
};

/**
 * Calculate overall progress based on weighted metrics
 */
export const calculateOverallProgress = (metrics: ModuleProgressMetrics['metrics_data']): number => {
  const weights = {
    code_completion: 0.35,      // 35% weight
    test_coverage: 0.25,        // 25% weight  
    feature_completion: 0.25,   // 25% weight
    documentation: 0.10,        // 10% weight
    quality: 0.05              // 5% weight
  };

  const codeCompletion = metrics.total_files_planned > 0 
    ? (metrics.files_implemented / metrics.total_files_planned) * 100 
    : 0;

  const testCoverage = metrics.total_tests_planned > 0 
    ? (metrics.tests_passing / metrics.total_tests_planned) * 100 
    : 0;

  const featureCompletion = metrics.features_planned > 0 
    ? (metrics.features_completed / metrics.features_planned) * 100 
    : 0;

  const docsCompletion = metrics.docs_sections_planned > 0 
    ? (metrics.docs_sections_completed / metrics.docs_sections_planned) * 100 
    : 0;

  const qualityScore = Math.max(0, metrics.code_review_score - (metrics.bug_count * 5));

  const overallProgress = (
    codeCompletion * weights.code_completion +
    testCoverage * weights.test_coverage +
    featureCompletion * weights.feature_completion +
    docsCompletion * weights.documentation +
    qualityScore * weights.quality
  );

  return Math.min(100, Math.max(0, overallProgress));
};

/**
 * Get progress status and next milestones
 */
export const getProgressStatus = (progress: number) => {
  if (progress >= 90) return { status: 'production-ready', stage: 'production' };
  if (progress >= 80) return { status: 'beta-ready', stage: 'beta' };
  if (progress >= 60) return { status: 'alpha-complete', stage: 'beta' };
  if (progress >= 40) return { status: 'development-active', stage: 'alpha' };
  if (progress >= 20) return { status: 'foundation-laid', stage: 'alpha' };
  return { status: 'planning', stage: 'planning' };
};

/**
 * Get next milestone requirements
 */
export const getNextMilestoneRequirements = (progress: number, metrics: ModuleProgressMetrics['metrics_data']) => {
  const requirements: string[] = [];

  if (progress < 20) {
    requirements.push('Complete initial code structure');
    requirements.push('Define test cases');
  } else if (progress < 40) {
    requirements.push('Implement core features');
    requirements.push('Add basic test coverage');
  } else if (progress < 60) {
    requirements.push('Complete feature development');
    requirements.push('Achieve 70%+ test coverage');
  } else if (progress < 80) {
    requirements.push('Complete documentation');
    requirements.push('Fix critical bugs');
    requirements.push('Achieve 85%+ test coverage');
  } else if (progress < 90) {
    requirements.push('Complete integration testing');
    requirements.push('Performance optimization');
    requirements.push('Security review');
  } else {
    requirements.push('Production deployment ready');
  }

  return requirements;
};
