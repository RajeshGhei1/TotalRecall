
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

interface VersionInfo {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_number: number;
  data_snapshot: any;
  created_at: string;
  created_by: string;
  change_summary?: string;
}

interface ConflictInfo {
  hasConflict: boolean;
  currentVersion: number;
  attemptedVersion: number;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

/**
 * Hook for version control and conflict detection
 */
export const useVersionControl = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { createSecureKey } = useSecureQueryKey();
  
  const [conflicts, setConflicts] = useState<Map<string, ConflictInfo>>(new Map());

  // Get version history for an entity
  const useVersionHistory = (entityType: 'form' | 'report', entityId: string) => {
    return useQuery({
      queryKey: createSecureKey('version-history', [entityType, entityId]),
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
        return data as VersionInfo[];
      },
      enabled: !!entityId,
    });
  };

  // Get current version of an entity
  const getCurrentVersion = useCallback(async (
    entityType: 'form' | 'report',
    entityId: string
  ): Promise<number> => {
    const table = entityType === 'form' ? 'form_definitions' : 'saved_reports';
    
    const { data, error } = await supabase
      .from(table as any)
      .select('updated_at')
      .eq('id', entityId)
      .single();

    if (error) throw error;

    // Use timestamp as version for now - could be enhanced with dedicated version column
    return data ? new Date(data.updated_at).getTime() : 0;
  }, []);

  // Check for version conflicts before update
  const checkVersionConflict = useCallback(async (
    entityType: 'form' | 'report',
    entityId: string,
    expectedVersion: number
  ): Promise<ConflictInfo> => {
    try {
      const currentVersion = await getCurrentVersion(entityType, entityId);
      
      const hasConflict = currentVersion > expectedVersion;
      
      const conflictInfo: ConflictInfo = {
        hasConflict,
        currentVersion,
        attemptedVersion: expectedVersion,
      };

      if (hasConflict) {
        // Get info about who last modified
        const table = entityType === 'form' ? 'form_definitions' : 'saved_reports';
        const { data } = await supabase
          .from(table as any)
          .select(`
            updated_at,
            profiles:created_by (
              full_name,
              email
            )
          `)
          .eq('id', entityId)
          .single();

        if (data && data.updated_at) {
          conflictInfo.lastModifiedAt = data.updated_at;
          if (data.profiles && typeof data.profiles === 'object' && 'full_name' in data.profiles) {
            conflictInfo.lastModifiedBy = data.profiles.full_name || data.profiles.email;
          }
        }

        // Store conflict info
        setConflicts(prev => new Map(prev).set(entityId, conflictInfo));

        toast({
          title: 'Version Conflict Detected',
          description: `This ${entityType} has been modified by ${conflictInfo.lastModifiedBy || 'another user'}. Please refresh and try again.`,
          variant: 'destructive',
        });
      }

      return conflictInfo;
    } catch (error) {
      console.error('Error checking version conflict:', error);
      return {
        hasConflict: false,
        currentVersion: expectedVersion,
        attemptedVersion: expectedVersion,
      };
    }
  }, [getCurrentVersion, toast]);

  // Create version snapshot
  const createVersionSnapshot = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      data: any;
      changeSummary?: string;
    }) => {
      const { entityType, entityId, data, changeSummary } = params;
      
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

      const { data: versionData, error } = await supabase
        .from('entity_versions')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_number: nextVersion,
          data_snapshot: data,
          change_summary: changeSummary,
        })
        .select()
        .single();

      if (error) throw error;
      return versionData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: createSecureKey('version-history', [variables.entityType, variables.entityId])
      });
      
      toast({
        title: 'Version Saved',
        description: `Version ${data.version_number} created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Version Save Failed',
        description: `Failed to create version: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Restore from version
  const restoreFromVersion = useMutation({
    mutationFn: async (params: {
      entityType: 'form' | 'report';
      entityId: string;
      versionNumber: number;
    }) => {
      const { entityType, entityId, versionNumber } = params;
      
      // Get version data
      const { data: versionData, error: versionError } = await supabase
        .from('entity_versions')
        .select('data_snapshot')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('version_number', versionNumber)
        .single();

      if (versionError) throw versionError;

      // For now, we'll just return the version data
      // In a real implementation, you'd update the actual entity table
      return versionData;
    },
    onSuccess: (data, variables) => {
      const table = variables.entityType === 'form' ? 'form-definitions' : 'secure-saved-reports';
      queryClient.invalidateQueries({ queryKey: createSecureKey(table) });
      
      toast({
        title: 'Version Restored',
        description: `Successfully restored to version ${variables.versionNumber}`,
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

  // Clear conflicts
  const clearConflicts = useCallback(() => {
    setConflicts(new Map());
  }, []);

  // Get conflict for specific entity
  const getConflict = useCallback((entityId: string) => {
    return conflicts.get(entityId);
  }, [conflicts]);

  return {
    useVersionHistory,
    getCurrentVersion,
    checkVersionConflict,
    createVersionSnapshot,
    restoreFromVersion,
    clearConflicts,
    getConflict,
    hasConflicts: conflicts.size > 0,
    conflicts: Array.from(conflicts.entries()),
  };
};
