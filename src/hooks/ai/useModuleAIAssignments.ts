
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModuleAIAssignment, ModuleAIAssignmentType } from '@/types/ai';

// Mock data for development until the database table is created
const mockAssignments: ModuleAIAssignment[] = [
  {
    id: '1',
    module_id: 'hr-module',
    agent_id: 'cognitive-agent-1',
    tenant_id: null,
    assignment_type: 'direct',
    priority: 0,
    is_active: true,
    performance_weights: { accuracy: 0.4, speed: 0.3, cost: 0.3 },
    token_budget_override: 10000,
    assigned_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    module_id: 'hr-module',
    agent_id: 'predictive-agent-1',
    tenant_id: null,
    assignment_type: 'preferred',
    priority: 1,
    is_active: true,
    performance_weights: { accuracy: 0.5, speed: 0.2, cost: 0.3 },
    assigned_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useModuleAIAssignments = (moduleId?: string, tenantId?: string) => {
  const queryClient = useQueryClient();

  // Mock query that filters assignments by moduleId
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['module-ai-assignments', moduleId, tenantId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = mockAssignments;
      
      if (moduleId) {
        filtered = filtered.filter(assignment => assignment.module_id === moduleId);
      }
      
      if (tenantId) {
        filtered = filtered.filter(assignment => assignment.tenant_id === tenantId);
      } else {
        filtered = filtered.filter(assignment => assignment.tenant_id === null);
      }
      
      return filtered;
    },
    enabled: !!moduleId,
  });

  // Mock mutations
  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<ModuleAIAssignment, 'id' | 'created_at' | 'updated_at'>) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const newAssignment = {
        ...assignment,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockAssignments.push(newAssignment);
      return newAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ModuleAIAssignment> }) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockAssignments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssignments[index] = { ...mockAssignments[index], ...updates, updated_at: new Date().toISOString() };
        return mockAssignments[index];
      }
      throw new Error('Assignment not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockAssignments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAssignments[index].is_active = false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  const setDirectAssignment = useMutation({
    mutationFn: async ({ 
      moduleId, 
      agentId, 
      tenantId, 
      performanceWeights 
    }: { 
      moduleId: string; 
      agentId: string; 
      tenantId?: string;
      performanceWeights?: { accuracy: number; speed: number; cost: number };
    }) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Deactivate existing direct assignments
      mockAssignments.forEach(assignment => {
        if (assignment.module_id === moduleId && 
            assignment.assignment_type === 'direct' && 
            assignment.tenant_id === (tenantId || null)) {
          assignment.is_active = false;
        }
      });
      
      // Create new direct assignment
      const newAssignment: ModuleAIAssignment = {
        id: `direct-${Date.now()}`,
        module_id: moduleId,
        agent_id: agentId,
        tenant_id: tenantId || null,
        assignment_type: 'direct',
        priority: 0,
        is_active: true,
        performance_weights: performanceWeights || { accuracy: 0.4, speed: 0.3, cost: 0.3 },
        token_budget_override: 10000,
        assigned_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockAssignments.push(newAssignment);
      return newAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  const addPreferredAssignment = useMutation({
    mutationFn: async ({ 
      moduleId, 
      agentId, 
      tenantId, 
      priority = 1 
    }: { 
      moduleId: string; 
      agentId: string; 
      tenantId?: string;
      priority?: number;
    }) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newAssignment: ModuleAIAssignment = {
        id: `preferred-${Date.now()}`,
        module_id: moduleId,
        agent_id: agentId,
        tenant_id: tenantId || null,
        assignment_type: 'preferred',
        priority,
        is_active: true,
        performance_weights: { accuracy: 0.4, speed: 0.3, cost: 0.3 },
        assigned_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockAssignments.push(newAssignment);
      return newAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  return {
    assignments,
    isLoading,
    error,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setDirectAssignment,
    addPreferredAssignment,
  };
};

// Hook for fetching all assignments (for admin views)
export const useAllModuleAIAssignments = () => {
  return useQuery({
    queryKey: ['all-module-ai-assignments'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAssignments.filter(a => a.is_active);
    },
  });
};
