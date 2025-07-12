
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';
import { useCacheInvalidation } from '@/hooks/security/useCacheInvalidation';
import { useAuth } from '@/contexts/AuthContext';

interface EntityVersion {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_number: number;
  data_snapshot: any;
  created_at: string;
  created_by: string;
  change_summary?: string;
  approval_status: string;
  is_published: boolean;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

interface ApprovalWorkflow {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_id: string;
  requested_by: string;
  status: string;
  workflow_config: any;
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  requested_at: string;
}

/**
 * Enhanced version control with approval workflows
 */
export const useEnhancedVersionControl = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { createSecureKey } = useSecureQueryKey();
  const { clearSecurityCaches } = useCacheInvalidation();
  const { user } = useAuth();

  // Get version history with approval status
  const useVersionHistory = (entityType: 'form' | 'report', entityId: string) => {
    return useQuery({
      queryKey: createSecureKey('enhanced-version-history', [entityType, entityId]),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('entity_versions')
          .select('*')
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

        if (error) throw error;
        return data as EntityVersion;
      },
      enabled: !!entityId,
    });
  };

  // Get approval workflows
  const useApprovalWorkflows = (entityType?: 'form' | 'report', entityId?: string) => {
    return useQuery({
      queryKey: createSecureKey('approval-workflows', [entityType, entityId]),
      queryFn: async () => {
        let query = supabase
          .from('workflow_approvals')
          .select('*')
          .order('requested_at', { ascending: false });

        if (entityType) {
          query = query.eq('entity_type', entityType);
        }
        if (entityId) {
          query = query.eq('entity_id', entityId);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data as ApprovalWorkflow[];
      },
      enabled: !!entityType || !!entityId,
    });
  };

  // Get pending approvals
  const usePendingApprovals = (entityType?: 'form' | 'report') => {
    return useQuery({
      queryKey: createSecureKey('pending-approvals', [entityType]),
      queryFn: async () => {
        let query = supabase
          .from('workflow_approvals')
          .select('*')
          .eq('status', 'pending')
          .order('requested_at', { ascending: false });

        if (entityType) {
          query = query.eq('entity_type', entityType);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data as ApprovalWorkflow[];
      },
    });
  };

  // Create version with approval workflow
  const createVersionWithApproval = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      data: unknown;
      changeSummary?: string;
      approvalRequired?: boolean;
      workflowConfig?: any;
    }) => {
      const { entityType, entityId, data, changeSummary, approvalRequired = true, workflowConfig } = params;
      
      // Get next version number
      const { data: latestVersion } = await supabase
        .from('entity_versions')
        .select('version_number')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestVersion?.version_number || 0) + 1;

      // Create version
      const { data: versionData, error: versionError } = await supabase
        .from('entity_versions')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_number: nextVersion,
          data_snapshot: data,
          change_summary: changeSummary,
          approval_status: approvalRequired ? 'draft' : 'approved',
          is_published: !approvalRequired,
          created_by: user?.id,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Create approval workflow if required
      if (approvalRequired && user?.id) {
        const { error: workflowError } = await supabase
          .from('workflow_approvals')
          .insert({
            entity_type: entityType,
            entity_id: entityId,
            version_id: versionData.id,
            requested_by: user.id,
            status: 'pending',
            workflow_config: workflowConfig || {},
          });

        if (workflowError) throw workflowError;
      }

      return versionData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history', [variables.entityType, variables.entityId])
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('approval-workflows', [variables.entityType, variables.entityId])
      });
      clearSecurityCaches();
      
      toast({
        title: 'Version Created',
        description: `Version ${data.version_number} created and ${variables.approvalRequired ? 'submitted for approval' : 'published'}`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Version Creation Failed',
        description: `Failed to create version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Publish version
  const publishVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const { data, error } = await supabase
        .from('entity_versions')
        .update({
          is_published: true,
          approval_status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', versionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history')
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('published-version')
      });
      clearSecurityCaches();
      
      toast({
        title: 'Version Published',
        description: 'Version has been successfully published',
      });
    },
    onError: (error: unknown) => {
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
      const { data: latestVersion } = await supabase
        .from('entity_versions')
        .select('version_number')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestVersion?.version_number || 0) + 1;

      const { data: restoredVersion, error: restoreError } = await supabase
        .from('entity_versions')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_number: nextVersion,
          data_snapshot: versionData.data_snapshot,
          change_summary: `Restored from version ${nextVersion - 1}`,
          approval_status: 'approved',
          is_published: true,
          created_by: user?.id,
        })
        .select()
        .single();

      if (restoreError) throw restoreError;
      return restoredVersion;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history', [variables.entityType, variables.entityId])
      });
      clearSecurityCaches();
      
      toast({
        title: 'Version Restored',
        description: `Successfully restored and created new version`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Restore Failed',
        description: `Failed to restore version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Review approval (approve/reject)
  const reviewVersion = useMutation({
    mutationFn: async (params: {
      workflowId: string;
      action: 'approve' | 'reject';
      reviewNotes?: string;
    }) => {
      const { workflowId, action, reviewNotes } = params;
      
      const { data: workflowData, error: updateError } = await supabase
        .from('workflow_approvals')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          review_notes: reviewNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', workflowId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // If approved, publish the version
      if (action === 'approve') {
        const { error: publishError } = await supabase
          .from('entity_versions')
          .update({
            approval_status: 'approved',
            is_published: true,
            approved_by: user?.id,
            approved_at: new Date().toISOString(),
          })
          .eq('id', workflowData.version_id);

        if (publishError) throw publishError;
      }

      return workflowData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('approval-workflows')
      });
      queryClient.invalidateQueries({
        queryKey: createSecureKey('enhanced-version-history')
      });
      clearSecurityCaches();
      
      toast({
        title: `Version ${variables.action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Version has been ${variables.action === 'approve' ? 'approved and published' : 'rejected'}`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Review Failed',
        description: `Failed to review version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Review approval alias for ApprovalWorkflowManager
  const reviewApproval = useMutation({
    mutationFn: async (params: {
      approvalId: string;
      action: 'approve' | 'reject';
      notes?: string;
      shouldPublish?: boolean;
    }) => {
      return reviewVersion.mutateAsync({
        workflowId: params.approvalId,
        action: params.action,
        reviewNotes: params.notes,
      });
    },
  });

  // Request approval placeholder
  const requestApproval = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      versionId: string;
    }) => {
      // This would trigger an approval workflow
      return { success: true };
    },
  });

  return {
    useVersionHistory,
    usePublishedVersion,
    useApprovalWorkflows,
    usePendingApprovals,
    createVersionWithApproval,
    publishVersion,
    restoreFromVersion,
    reviewVersion,
    reviewApproval,
    requestApproval,
  };
};
