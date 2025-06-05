
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModuleAIAssignment, ModuleAIAssignmentType } from '@/types/ai';

export const useModuleAIAssignments = (moduleId?: string, tenantId?: string) => {
  const queryClient = useQueryClient();

  // Fetch assignments for a specific module
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['module-ai-assignments', moduleId, tenantId],
    queryFn: async () => {
      let query = supabase
        .from('module_ai_assignments')
        .select(`
          *,
          ai_agents(id, name, type, capabilities),
          system_modules(id, name, category)
        `)
        .eq('is_active', true);

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.is('tenant_id', null);
      }

      query = query.order('assignment_type', { ascending: false })
                   .order('priority', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as ModuleAIAssignment[];
    },
    enabled: !!moduleId,
  });

  // Create assignment
  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<ModuleAIAssignment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('module_ai_assignments')
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  // Update assignment
  const updateAssignment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ModuleAIAssignment> }) => {
      const { data, error } = await supabase
        .from('module_ai_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  // Delete assignment
  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('module_ai_assignments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  // Set direct assignment (ensures only one direct assignment per module/tenant)
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
      // First, deactivate any existing direct assignments for this module/tenant
      await supabase
        .from('module_ai_assignments')
        .update({ is_active: false })
        .eq('module_id', moduleId)
        .eq('assignment_type', 'direct')
        .eq('tenant_id', tenantId || null);

      // Then create the new direct assignment
      const { data, error } = await supabase
        .from('module_ai_assignments')
        .insert([{
          module_id: moduleId,
          agent_id: agentId,
          tenant_id: tenantId,
          assignment_type: 'direct' as ModuleAIAssignmentType,
          priority: 0,
          is_active: true,
          performance_weights: performanceWeights || { accuracy: 0.4, speed: 0.3, cost: 0.3 },
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-ai-assignments'] });
    },
  });

  // Add preferred assignment
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
      const { data, error } = await supabase
        .from('module_ai_assignments')
        .insert([{
          module_id: moduleId,
          agent_id: agentId,
          tenant_id: tenantId,
          assignment_type: 'preferred' as ModuleAIAssignmentType,
          priority,
          is_active: true,
          performance_weights: { accuracy: 0.4, speed: 0.3, cost: 0.3 },
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('module_ai_assignments')
        .select(`
          *,
          ai_agents(id, name, type, capabilities),
          system_modules(id, name, category),
          profiles!module_ai_assignments_assigned_by_fkey(id, full_name, email)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
