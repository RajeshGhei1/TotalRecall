
import { useState, useEffect } from 'react';
import { useModuleAIAssignments } from './useModuleAIAssignments';
import { toast } from 'sonner';

interface ModuleConfig {
  direct_assignment: string | null;
  preferred_agents: string[];
  token_budget: number;
  overage_policy: 'warn' | 'block' | 'charge';
  performance_weights: {
    accuracy: number;
    speed: number;
    cost: number;
  };
}

export const useModuleAIConfiguration = (selectedModule: string, tenantId?: string) => {
  const { 
    assignments, 
    isLoading, 
    setDirectAssignment, 
    addPreferredAssignment, 
    deleteAssignment,
    updateAssignment 
  } = useModuleAIAssignments(selectedModule, tenantId);

  const [moduleConfigs, setModuleConfigs] = useState<Record<string, ModuleConfig>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize config from database assignments
  useEffect(() => {
    if (selectedModule && assignments) {
      const directAssignment = assignments.find(a => a.assignment_type === 'direct');
      const preferredAssignments = assignments
        .filter(a => a.assignment_type === 'preferred')
        .sort((a, b) => b.priority - a.priority);

      const config: ModuleConfig = {
        direct_assignment: directAssignment?.agent_id || null,
        preferred_agents: preferredAssignments.map(a => a.agent_id),
        token_budget: directAssignment?.token_budget_override || 10000,
        overage_policy: 'warn',
        performance_weights: directAssignment?.performance_weights || {
          accuracy: 0.4,
          speed: 0.3,
          cost: 0.3
        }
      };

      setModuleConfigs(prev => ({
        ...prev,
        [selectedModule]: config
      }));
    }
  }, [selectedModule, assignments]);

  const updateModuleConfig = (moduleId: string, updates: Partial<ModuleConfig>) => {
    setModuleConfigs(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        ...updates
      }
    }));
  };

  const saveConfiguration = async (moduleId: string) => {
    const config = moduleConfigs[moduleId];
    if (!config) return;

    setIsSaving(true);
    try {
      // Handle direct assignment
      if (config.direct_assignment) {
        await setDirectAssignment.mutateAsync({
          moduleId,
          agentId: config.direct_assignment,
          tenantId,
          performanceWeights: config.performance_weights
        });
      }

      // Handle preferred agents
      // First, remove existing preferred assignments
      const existingPreferred = assignments?.filter(a => a.assignment_type === 'preferred') || [];
      for (const assignment of existingPreferred) {
        if (!config.preferred_agents.includes(assignment.agent_id)) {
          await deleteAssignment.mutateAsync(assignment.id);
        }
      }

      // Add new preferred agents
      for (let i = 0; i < config.preferred_agents.length; i++) {
        const agentId = config.preferred_agents[i];
        const existingAssignment = existingPreferred.find(a => a.agent_id === agentId);
        
        if (!existingAssignment) {
          await addPreferredAssignment.mutateAsync({
            moduleId,
            agentId,
            tenantId,
            priority: config.preferred_agents.length - i
          });
        } else if (existingAssignment.priority !== config.preferred_agents.length - i) {
          await updateAssignment.mutateAsync({
            id: existingAssignment.id,
            updates: { priority: config.preferred_agents.length - i }
          });
        }
      }

      toast.success('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    moduleConfigs,
    currentConfig: moduleConfigs[selectedModule],
    updateModuleConfig,
    saveConfiguration,
    isSaving,
    isLoading
  };
};
