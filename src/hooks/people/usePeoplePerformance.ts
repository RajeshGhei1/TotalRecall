
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePeoplePerformance = () => {
  // Memoized query for people data with optimized select
  const { data: people, isLoading, error } = useQuery({
    queryKey: ['people-optimized'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select(`
          id,
          full_name,
          email,
          phone,
          location,
          type,
          created_at,
          company_relationships!left (
            id,
            role,
            is_current,
            companies (
              id,
              name
            )
          )
        `)
        .eq('type', 'contact')
        .order('full_name');

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized processed data
  const processedData = useMemo(() => {
    if (!people) return null;

    return {
      totalContacts: people.length,
      contactsWithCompanies: people.filter(p => 
        p.company_relationships?.some(r => r.is_current)
      ).length,
      recentContacts: people.filter(p => {
        const createdAt = new Date(p.created_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return createdAt >= thirtyDaysAgo;
      }).length,
      companyDistribution: people.reduce((acc: Record<string, number>, person) => {
        const currentCompany = person.company_relationships?.find(r => r.is_current);
        if (currentCompany?.companies?.name) {
          acc[currentCompany.companies.name] = (acc[currentCompany.companies.name] || 0) + 1;
        }
        return acc;
      }, {}),
      locationDistribution: people.reduce((acc: Record<string, number>, person) => {
        if (person.location) {
          acc[person.location] = (acc[person.location] || 0) + 1;
        }
        return acc;
      }, {})
    };
  }, [people]);

  return {
    people,
    processedData,
    isLoading,
    error
  };
};

// Hook for batch operations
export const useBatchPeopleOperations = () => {
  const batchUpdatePeople = async (updates: Array<{ id: string; data: any }>) => {
    const promises = updates.map(({ id, data }) =>
      supabase
        .from('people')
        .update(data)
        .eq('id', id)
    );

    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { successful, failed };
  };

  const batchDeletePeople = async (ids: string[]) => {
    const { error } = await supabase
      .from('people')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { deleted: ids.length };
  };

  return {
    batchUpdatePeople,
    batchDeletePeople
  };
};

// Hook for search optimization
export const useOptimizedPeopleSearch = (searchTerm: string, filters: any) => {
  return useQuery({
    queryKey: ['people-search', searchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('people')
        .select(`
          id,
          full_name,
          email,
          phone,
          location,
          type,
          company_relationships!left (
            role,
            is_current,
            companies (name)
          )
        `)
        .eq('type', 'contact');

      // Optimized text search using full-text search when available
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply filters efficiently
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query
        .limit(100) // Limit results for performance
        .order('full_name');

      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 30 * 1000, // 30 seconds
    debounce: 300 // Debounce search requests
  });
};
