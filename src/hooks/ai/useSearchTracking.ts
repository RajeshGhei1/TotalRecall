
import { useState, useCallback, useEffect } from 'react';
import { useRealTimeBehaviorTracking } from './useRealTimeBehaviorTracking';
import { useTenantContext } from '@/contexts/TenantContext';

export interface SearchTrackingOptions {
  module: string;
  searchType: string;
  debounceMs?: number;
}

export const useSearchTracking = (
  userId: string = 'demo-user',
  options: SearchTrackingOptions
) => {
  const { module, searchType, debounceMs = 1000 } = options;
  const { selectedTenantId } = useTenantContext();
  const { trackInteraction } = useRealTimeBehaviorTracking(userId);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);

  const trackSearchStart = useCallback((query: string) => {
    setSearchStartTime(Date.now());
    trackInteraction('search_initiated', {
      module,
      searchType,
      query: query.slice(0, 100), // Limit query length for privacy
      tenantId: selectedTenantId
    });
  }, [module, searchType, selectedTenantId, trackInteraction]);

  const trackSearchComplete = useCallback((query: string, resultCount: number) => {
    const duration = searchStartTime ? Date.now() - searchStartTime : 0;
    
    trackInteraction('search_completed', {
      module,
      searchType,
      query: query.slice(0, 100),
      resultCount,
      duration,
      tenantId: selectedTenantId
    });

    // Update search history
    setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 searches
    setSearchStartTime(null);
  }, [module, searchType, selectedTenantId, trackInteraction, searchStartTime]);

  const trackSearchResult = useCallback((query: string, selectedResult: unknown, position: number) => {
    trackInteraction('search_result_selected', {
      module,
      searchType,
      query: query.slice(0, 100),
      resultType: selectedResult?.type || 'unknown',
      position,
      tenantId: selectedTenantId
    });
  }, [module, searchType, selectedTenantId, trackInteraction]);

  const trackSearchAbandon = useCallback((query: string) => {
    const duration = searchStartTime ? Date.now() - searchStartTime : 0;
    
    trackInteraction('search_abandoned', {
      module,
      searchType,
      query: query.slice(0, 100),
      duration,
      tenantId: selectedTenantId
    });
    
    setSearchStartTime(null);
  }, [module, searchType, selectedTenantId, trackInteraction, searchStartTime]);

  return {
    searchHistory,
    trackSearchStart,
    trackSearchComplete,
    trackSearchResult,
    trackSearchAbandon
  };
};
