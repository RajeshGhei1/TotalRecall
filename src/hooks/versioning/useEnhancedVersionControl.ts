
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

interface EntityVersion {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_number: number;
  data_snapshot: any;
  created_at: string;
  created_by: string;
  change_summary?: string;
  is_published: boolean;
  approval_status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

interface WorkflowApproval {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_id: string;
  requested_by: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  workflow_config: any;
}

/**
 * Enhanced version control hook with approval workflows and publishing
 */
export const useEnhancedVersionControl = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { createSecureKey } = useSecureQueryKey();
  
  const [pendingApprovals, setPendingApprovals] = useState<Map<string, WorkflowApproval>>(new Map());

  // Get version history for an entity with approval status
  const useVersionHistory = (entityType: 'form' | 'report', entityId: string) => {
    return useQuery({
      queryKey: createSecureKey('enhanced-version-history', [entityType, entityId]),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('entity_versions')
          .select(`
            *,
            profiles:created_by (
              id,
              email,
              full_name
            )
          `)
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .order('version_number', { ascending: false });

        if (error) throw error;
        return data as EntityVersion[];
      },
      enabled: !!entityId,
    });
  };

  // Get published version
  const usePublishedVersion = (entityType: 'form' | 'report', entityId: string) => {
    return useQuery({
      queryKey: createSecureKey('published-version', [entityType, entityId]),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('entity_versions')
          .select('*')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .eq('is_published', true)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data as EntityVersion | null;
      },
      enabled: !!entityId,
    });
  };

  // Get pending approvals
  const usePendingApprovals = (entityType?: 'form' | 'report') => {
    return useQuery({
      queryKey: createSecureKey('pending-approvals', [entityType]),
      queryFn: async () => {
        let query = supabase
          .from('workflow_approvals')
          .select(`
            *,
            entity_versions:version_id (
              entity_type,
              entity_id,
              version_number,
              change_summary
            ),
            profiles:requested_by (
              id,
              email,
              full_name
            )
          `)
          .eq('status', 'pending');

        if (entityType) {
          query = query.eq('entity_type', entityType);
        }

        const { data, error } = await query.order('requested_at', { ascending: false });
        if (error) throw error;
        return data as WorkflowApproval[];
      },
    });
  };

  // Create a new version
  const createVersion = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      data: any;
      changeSummary?: string;
      isDraft?: boolean;
    }) => {
      const { entityType, entityId, data, changeSummary, isDraft = true } = params;
      
      // Get next version number
      const { data: nextVersionResponse, error: versionError } = await supabase
        .rpc('get_next_version_number', {
          p_entity_type: entityType,
          p_entity_id: entityId
        });

      if (versionError) throw versionError;

      const { data: versionData, error } = await supabase
        .from('entity_versions')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_number: nextVersionResponse,
          data_snapshot: data,
          change_summary: changeSummary,
          approval_status: isDraft ? 'draft' : 'pending_approval',
        })
        .select()
        .single();

      if (error) throw error;
      return versionData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history', [variables.entityType, variables.entityId])
      });
      
      toast({
        title: 'Version Created',
        description: `Version ${data.version_number} created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Version Creation Failed',
        description: `Failed to create version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Request approval for a version
  const requestApproval = useMutation({
    mutationFn: async (params: {
      versionId: string;
      entityType: 'form' | 'report';
      entityId: string;
      workflowConfig?: any;
    }) => {
      const { versionId, entityType, entityId, workflowConfig = {} } = params;
      
      const { data, error } = await supabase
        .from('workflow_approvals')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_id: versionId,
          workflow_config: workflowConfig,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('pending-approvals')
      });
      
      toast({
        title: 'Approval Requested',
        description: 'Version has been submitted for approval',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Request Failed',
        description: `Failed to request approval: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Approve/reject a version
  const reviewApproval = useMutation({
    mutationFn: async (params: {
      approvalId: string;
      action: 'approve' | 'reject';
      notes?: string;
      shouldPublish?: boolean;
    }) => {
      const { approvalId, action, notes, shouldPublish = true } = params;
      
      // Update approval status
      const { data: approvalData, error: approvalError } = await supabase
        .from('workflow_approvals')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
        })
        .eq('id', approvalId)
        .select()
        .single();

      if (approvalError) throw approvalError;

      // If approved and should publish, publish the version
      if (action === 'approve' && shouldPublish) {
        const { error: publishError } = await supabase
          .rpc('publish_version', { p_version_id: approvalData.version_id });
        
        if (publishError) throw publishError;
      }

      return approvalData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('pending-approvals')
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history')
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('published-version')
      });
      
      toast({
        title: variables.action === 'approve' ? 'Version Approved' : 'Version Rejected',
        description: `The version has been ${variables.action === 'approve' ? 'approved and published' : 'rejected'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Review Failed',
        description: `Failed to review approval: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Publish a version directly (for users with permissions)
  const publishVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const { data, error } = await supabase
        .rpc('publish_version', { p_version_id: versionId });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, versionId) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history')
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('published-version')
      });
      
      toast({
        title: 'Version Published',
        description: 'Version has been published successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Publish Failed',
        description: `Failed to publish version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Restore from version
  const restoreFromVersion = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      versionId: string;
    }) => {
      const { entityType, entityId, versionId } = params;
      
      // Get version data
      const { data: versionData, error: versionError } = await supabase
        .from('entity_versions')
        .select('data_snapshot')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Create new version from restored data
      return createVersion.mutateAsync({
        entityType,
        entityId,
        data: versionData.data_snapshot,
        changeSummary: `Restored from version`,
        isDraft: true,
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Version Restored',
        description: `Successfully restored and created new draft version`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Restore Failed',
        description: `Failed to restore version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    useVersionHistory,
    usePublishedVersion,
    usePendingApprovals,
    createVersion,
    requestApproval,
    reviewApproval,
    publishVersion,
    restoreFromVersion,
    pendingApprovals: Array.from(pendingApprovals.values()),
    isCreatingVersion: createVersion.isPending,
    isRequestingApproval: requestApproval.isPending,
    isReviewingApproval: reviewApproval.isPending,
    isPublishing: publishVersion.isPending,
    isRestoring: restoreFromVersion.isPending,
  };
};
