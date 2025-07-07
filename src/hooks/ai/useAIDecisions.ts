import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';
import { 
  AIDecisionRule, 
  AIDecisionInstance,
  AIDecisionApproval,
  AIDecisionWorkflow,
  CreateDecisionRuleRequest, 
  UpdateDecisionRuleRequest,
  CreateDecisionInstanceRequest
} from '@/services/ai/aiDecisionService';
import { aiDecisionService } from '@/services/ai/aiDecisionService';

export const useAIDecisionRules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Get all decision rules
  const rulesQuery = useQuery({
    queryKey: ['ai-decision-rules', selectedTenantId],
    queryFn: () => aiDecisionService.getDecisionRules(selectedTenantId!),
    enabled: !!selectedTenantId
  });

  // Create decision rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (ruleData: CreateDecisionRuleRequest) => 
      aiDecisionService.createDecisionRule(selectedTenantId!, ruleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-rules', selectedTenantId] });
      toast({
        title: "Success",
        description: "Decision rule created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create decision rule",
        variant: "destructive"
      });
    }
  });

  // Update decision rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: ({ ruleId, updates }: { ruleId: string; updates: UpdateDecisionRuleRequest }) =>
      aiDecisionService.updateDecisionRule(ruleId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-rules', selectedTenantId] });
      toast({
        title: "Success",
        description: "Decision rule updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update decision rule",
        variant: "destructive"
      });
    }
  });

  // Delete decision rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: (ruleId: string) => aiDecisionService.deleteDecisionRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-rules', selectedTenantId] });
      toast({
        title: "Success",
        description: "Decision rule deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete decision rule",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    rules: rulesQuery.data || [],
    isLoading: rulesQuery.isLoading,
    error: rulesQuery.error,
    
    // Mutations
    createRule: createRuleMutation,
    updateRule: updateRuleMutation,
    deleteRule: deleteRuleMutation,
    
    // Utilities
    refetch: rulesQuery.refetch
  };
};

export const useAIDecisionInstances = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Get decision instances
  const instancesQuery = useQuery({
    queryKey: ['ai-decision-instances', selectedTenantId],
    queryFn: () => aiDecisionService.getDecisionInstances(selectedTenantId!),
    enabled: !!selectedTenantId
  });

  // Create decision instance mutation
  const createInstanceMutation = useMutation({
    mutationFn: (instanceData: CreateDecisionInstanceRequest) => 
      aiDecisionService.createDecisionInstance(selectedTenantId!, instanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-instances', selectedTenantId] });
      toast({
        title: "Success",
        description: "Decision instance created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create decision instance",
        variant: "destructive"
      });
    }
  });

  // Process decision mutation
  const processDecisionMutation = useMutation({
    mutationFn: (instanceId: string) => aiDecisionService.processDecision(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-instances', selectedTenantId] });
      toast({
        title: "Success",
        description: "Decision processed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process decision",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    instances: instancesQuery.data || [],
    isLoading: instancesQuery.isLoading,
    error: instancesQuery.error,
    
    // Mutations
    createInstance: createInstanceMutation,
    processDecision: processDecisionMutation,
    
    // Utilities
    refetch: instancesQuery.refetch
  };
};

export const useAIDecisionInstance = (instanceId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get specific decision instance
  const instanceQuery = useQuery({
    queryKey: ['ai-decision-instance', instanceId],
    queryFn: () => aiDecisionService.getDecisionInstance(instanceId),
    enabled: !!instanceId
  });

  // Get decision approvals
  const approvalsQuery = useQuery({
    queryKey: ['ai-decision-approvals', instanceId],
    queryFn: () => aiDecisionService.getDecisionApprovals(instanceId),
    enabled: !!instanceId
  });

  // Create approval mutation
  const createApprovalMutation = useMutation({
    mutationFn: (approvalData: Omit<AIDecisionApproval, 'id' | 'created_at' | 'updated_at'>) =>
      aiDecisionService.createDecisionApproval(approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-decision-approvals', instanceId] });
      queryClient.invalidateQueries({ queryKey: ['ai-decision-instance', instanceId] });
      toast({
        title: "Success",
        description: "Approval submitted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit approval",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    instance: instanceQuery.data,
    approvals: approvalsQuery.data || [],
    
    // Loading states
    isLoading: instanceQuery.isLoading,
    isLoadingApprovals: approvalsQuery.isLoading,
    
    // Errors
    error: instanceQuery.error,
    approvalsError: approvalsQuery.error,
    
    // Mutations
    createApproval: createApprovalMutation,
    
    // Utilities
    refetch: instanceQuery.refetch,
    refetchApprovals: approvalsQuery.refetch
  };
};

export const useAIDecisionWorkflows = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Get decision workflows
  const workflowsQuery = useQuery({
    queryKey: ['ai-decision-workflows', selectedTenantId],
    queryFn: () => aiDecisionService.getDecisionWorkflows(selectedTenantId!),
    enabled: !!selectedTenantId
  });

  return {
    // Data
    workflows: workflowsQuery.data || [],
    isLoading: workflowsQuery.isLoading,
    error: workflowsQuery.error,
    
    // Utilities
    refetch: workflowsQuery.refetch
  };
};

export const useAIDecisionAnalytics = (ruleId?: string, days = 30) => {
  const { selectedTenantId } = useTenantContext();

  // Get decision analytics
  const analyticsQuery = useQuery({
    queryKey: ['ai-decision-analytics', selectedTenantId, ruleId, days],
    queryFn: () => aiDecisionService.getDecisionAnalytics(selectedTenantId!, ruleId, days),
    enabled: !!selectedTenantId
  });

  return {
    // Data
    analytics: analyticsQuery.data || [],
    isLoading: analyticsQuery.isLoading,
    error: analyticsQuery.error,
    
    // Utilities
    refetch: analyticsQuery.refetch
  };
};