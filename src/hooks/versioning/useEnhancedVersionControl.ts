
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

  // Get approval workflows
  const useApprovalWorkflows = (entityType?: 'form' | 'report', entityId?: string) => {
    return useQuery({
      queryKey: createSecureKey('approval-workflows', [entityType, entityId]),
      queryFn: async () => {
        let query = supabase
          .from('workflow_approvals')
          .select(`
            *,
            entity_versions!version_id (*),
            profiles!requested_by (
              id,
              email,
              full_name
            )
          `)
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

  // Create version with approval workflow
  const createVersionWithApproval = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      data: any;
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
    onError: (error: any) => {
      toast({
        title: 'Version Creation Failed',
        description: `Failed to create version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Approve or reject version
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
        .select(`
          *,
          entity_versions!version_id (*)
        `)
        .single();

      if (updateError) throw updateError;

      // If approved, publish the version
      if (action === 'approve' && workflowData.entity_versions) {
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
    onError: (error: any) => {
      toast({
        title: 'Review Failed',
        description: `Failed to ${error.action} version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    useVersionHistory,
    useApprovalWorkflows,
    createVersionWithApproval,
    reviewVersion,
  };
};
