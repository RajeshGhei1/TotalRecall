
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { documentationService } from '@/services/documentationService';

export interface DocumentationChange {
  documentPath: string;
  updateType: 'auto' | 'manual';
  timestamp: string;
  content?: string;
}

export function useRealTimeDocumentation() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [documentationChanges, setDocumentationChanges] = useState<DocumentationChange[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    initializeDocumentationSystem();
    setupRealTimeSubscription();

    return () => {
      cleanup();
    };
  }, []);

  const initializeDocumentationSystem = async () => {
    try {
      await documentationService.initializeDocumentationSystem();
      setIsInitialized(true);
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to initialize documentation system:', error);
    }
  };

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel('documentation-updates')
      .on('broadcast', { event: 'documentation_updated' }, (payload) => {
        const change: DocumentationChange = {
          documentPath: payload.payload.documentPath,
          updateType: payload.payload.updateType,
          timestamp: payload.payload.timestamp
        };
        
        setDocumentationChanges(prev => [change, ...prev.slice(0, 49)]); // Keep last 50 changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const cleanup = () => {
    setIsMonitoring(false);
  };

  const getRecentChanges = () => {
    return documentationChanges.slice(0, 10);
  };

  const clearChanges = () => {
    setDocumentationChanges([]);
  };

  return {
    isInitialized,
    isMonitoring,
    documentationChanges: getRecentChanges(),
    allChanges: documentationChanges,
    clearChanges
  };
}
