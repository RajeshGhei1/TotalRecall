
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantContext } from '@/contexts/TenantContext';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

interface WorkspaceItem {
  id: string;
  type: 'form' | 'report';
  data: any;
  lastModified: number;
  version: number;
  isDraft: boolean;
  isBeingEdited: boolean;
}

interface WorkspaceState {
  items: Map<string, WorkspaceItem>;
  activeEditors: Map<string, string[]>; // itemId -> userIds[]
}

/**
 * Hook for managing user-specific workspaces with concurrent editing detection
 */
export const useUserWorkspace = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedTenantId } = useTenantContext();
  const { createSecureKey } = useSecureQueryKey();

  const [workspace, setWorkspace] = useState<WorkspaceState>({
    items: new Map(),
    activeEditors: new Map(),
  });

  const getWorkspaceKey = useCallback(() => {
    return createSecureKey('user-workspace', [selectedTenantId]);
  }, [createSecureKey, selectedTenantId]);

  // Add or update item in workspace
  const updateWorkspaceItem = useCallback((itemId: string, data: Partial<WorkspaceItem>) => {
    setWorkspace(prev => {
      const newItems = new Map(prev.items);
      const existing = newItems.get(itemId);
      
      newItems.set(itemId, {
        id: itemId,
        type: data.type || existing?.type || 'form',
        data: data.data || existing?.data || {},
        lastModified: Date.now(),
        version: (existing?.version || 0) + 1,
        isDraft: data.isDraft ?? existing?.isDraft ?? true,
        isBeingEdited: data.isBeingEdited ?? existing?.isBeingEdited ?? false,
      });

      return {
        ...prev,
        items: newItems,
      };
    });
  }, []);

  // Mark item as being edited by current user
  const startEditing = useCallback((itemId: string) => {
    if (!user?.id) return;

    setWorkspace(prev => {
      const newActiveEditors = new Map(prev.activeEditors);
      const currentEditors = newActiveEditors.get(itemId) || [];
      
      if (!currentEditors.includes(user.id)) {
        newActiveEditors.set(itemId, [...currentEditors, user.id]);
      }

      return {
        ...prev,
        activeEditors: newActiveEditors,
      };
    });

    updateWorkspaceItem(itemId, { isBeingEdited: true });
  }, [user?.id, updateWorkspaceItem]);

  // Stop editing item
  const stopEditing = useCallback((itemId: string) => {
    if (!user?.id) return;

    setWorkspace(prev => {
      const newActiveEditors = new Map(prev.activeEditors);
      const currentEditors = newActiveEditors.get(itemId) || [];
      const filteredEditors = currentEditors.filter(id => id !== user.id);
      
      if (filteredEditors.length === 0) {
        newActiveEditors.delete(itemId);
      } else {
        newActiveEditors.set(itemId, filteredEditors);
      }

      return {
        ...prev,
        activeEditors: newActiveEditors,
      };
    });

    updateWorkspaceItem(itemId, { isBeingEdited: false });
  }, [user?.id, updateWorkspaceItem]);

  // Check if item has concurrent editors
  const getConcurrentEditors = useCallback((itemId: string) => {
    const editors = workspace.activeEditors.get(itemId) || [];
    return editors.filter(id => id !== user?.id);
  }, [workspace.activeEditors, user?.id]);

  // Remove item from workspace
  const removeWorkspaceItem = useCallback((itemId: string) => {
    setWorkspace(prev => {
      const newItems = new Map(prev.items);
      const newActiveEditors = new Map(prev.activeEditors);
      
      newItems.delete(itemId);
      newActiveEditors.delete(itemId);

      return {
        items: newItems,
        activeEditors: newActiveEditors,
      };
    });
  }, []);

  // Clear entire workspace
  const clearWorkspace = useCallback(() => {
    setWorkspace({
      items: new Map(),
      activeEditors: new Map(),
    });
  }, []);

  return {
    workspace: Array.from(workspace.items.values()),
    updateWorkspaceItem,
    removeWorkspaceItem,
    clearWorkspace,
    startEditing,
    stopEditing,
    getConcurrentEditors,
    activeEditors: workspace.activeEditors,
  };
};
