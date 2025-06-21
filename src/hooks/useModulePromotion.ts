
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ModulePromotionData {
  moduleId: string;
  currentStage: string;
  targetStage: string;
  progressData?: {
    code_completion?: number;
    test_coverage?: number;
    feature_completion?: number;
    documentation_completion?: number;
  };
}

export const useModulePromotion = () => {
  const queryClient = useQueryClient();

  const promoteModule = useMutation({
    mutationFn: async (data: ModulePromotionData) => {
      console.log('🚀 Promoting module:', data);

      // Update the module's development stage
      const { error: updateError } = await supabase
        .from('system_modules')
        .update({
          development_stage: {
            stage: data.targetStage,
            progress: getProgressForStage(data.targetStage),
            promoted_at: new Date().toISOString(),
            promoted_from: data.currentStage
          }
        })
        .eq('name', data.moduleId);

      if (updateError) throw updateError;

      // If promoting to production, mark as system module
      if (data.targetStage === 'production') {
        const { error: prodError } = await supabase
          .from('system_modules')
          .update({
            promoted_to_production_at: new Date().toISOString(),
            is_active: true
          })
          .eq('name', data.moduleId);

        if (prodError) throw prodError;
      }

      // Update progress tracking if data provided
      if (data.progressData) {
        const { error: progressError } = await supabase
          .from('module_progress_tracking')
          .upsert({
            module_id: data.moduleId,
            code_completion: data.progressData.code_completion || 0,
            test_coverage: data.progressData.test_coverage || 0,
            feature_completion: data.progressData.feature_completion || 0,
            documentation_completion: data.progressData.documentation_completion || 0,
            overall_progress: getProgressForStage(data.targetStage),
            last_updated: new Date().toISOString()
          });

        if (progressError) console.warn('Progress tracking update failed:', progressError);
      }

      return { moduleId: data.moduleId, newStage: data.targetStage };
    },
    onSuccess: (result) => {
      toast({
        title: 'Module Promoted',
        description: `${result.moduleId} has been promoted to ${result.newStage}`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-modules-progress'] });
    },
    onError: (error) => {
      console.error('Module promotion failed:', error);
      toast({
        title: 'Promotion Failed',
        description: 'Failed to promote module. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    promoteModule: promoteModule.mutateAsync,
    isPromoting: promoteModule.isPending,
  };
};

// Helper function to get progress percentage for each stage
const getProgressForStage = (stage: string): number => {
  switch (stage) {
    case 'planning': return 15;
    case 'alpha': return 45;
    case 'beta': return 75;
    case 'production': return 95;
    default: return 0;
  }
};

// Helper function to get next stage
export const getNextStage = (currentStage: string): string | null => {
  const stageFlow = {
    'planning': 'alpha',
    'alpha': 'beta',
    'beta': 'production',
    'production': null
  };
  return stageFlow[currentStage as keyof typeof stageFlow] || null;
};

// Helper function to get promotion requirements
export const getPromotionRequirements = (currentStage: string): string[] => {
  const requirements = {
    'planning': [
      'Complete basic module structure',
      'Define core components',
      'Write initial documentation'
    ],
    'alpha': [
      'Implement core functionality',
      'Add basic test coverage (40%+)',
      'Complete API documentation'
    ],
    'beta': [
      'Feature complete implementation',
      'Comprehensive test coverage (70%+)',
      'User acceptance testing',
      'Performance optimization'
    ],
    'production': [
      'All tests passing',
      'Security review completed',
      'Documentation finalized',
      'Ready for deployment'
    ]
  };
  
  return requirements[currentStage as keyof typeof requirements] || [];
};
