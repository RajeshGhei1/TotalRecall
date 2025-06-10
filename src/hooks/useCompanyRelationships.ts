
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyRelationshipAdvanced, CompanyRelationshipType } from '@/types/company-relationships';

// Hook for fetching relationship types
export const useCompanyRelationshipTypes = () => {
  return useQuery({
    queryKey: ['company-relationship-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_relationship_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as CompanyRelationshipType[];
    },
  });
};

// Hook for fetching company relationships
export const useCompanyRelationshipsAdvanced = (companyId: string) => {
  return useQuery({
    queryKey: ['company-relationships-advanced', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_relationships_advanced')
        .select(`
          *,
          parent_company:companies!parent_company_id(id, name, industry, size, location),
          child_company:companies!child_company_id(id, name, industry, size, location),
          relationship_type:company_relationship_types(*)
        `)
        .or(`parent_company_id.eq.${companyId},child_company_id.eq.${companyId}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CompanyRelationshipAdvanced[];
    },
    enabled: !!companyId,
  });
};

// Hook for fetching company network data
export const useCompanyNetwork = (companyId: string, depth: number = 2) => {
  return useQuery({
    queryKey: ['company-network', companyId, depth],
    queryFn: async () => {
      // For now, we'll use the basic relationships query
      // until we implement the recursive network function
      const { data: relationships, error } = await supabase
        .from('company_relationships_advanced')
        .select(`
          *,
          parent_company:companies!parent_company_id(id, name, industry, size, location),
          child_company:companies!child_company_id(id, name, industry, size, location),
          relationship_type:company_relationship_types(*)
        `)
        .or(`parent_company_id.eq.${companyId},child_company_id.eq.${companyId}`)
        .eq('is_active', true);
      
      if (error) throw error;

      // Transform data for React Flow
      const nodes = [];
      const edges = [];
      const processedCompanies = new Set();

      // Add the root company node
      const { data: rootCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (rootCompany) {
        nodes.push({
          id: companyId,
          type: 'companyNode',
          position: { x: 0, y: 0 },
          data: {
            label: rootCompany.name,
            company: rootCompany,
            isRoot: true,
          },
        });
        processedCompanies.add(companyId);
      }

      // Add related company nodes and edges
      relationships?.forEach((rel, index) => {
        const isParent = rel.parent_company_id === companyId;
        const relatedCompany = isParent ? rel.child_company : rel.parent_company;
        
        if (relatedCompany && !processedCompanies.has(relatedCompany.id)) {
          nodes.push({
            id: relatedCompany.id,
            type: 'companyNode',
            position: { x: (index + 1) * 200, y: 100 },
            data: {
              label: relatedCompany.name,
              company: relatedCompany,
              isRoot: false,
            },
          });
          processedCompanies.add(relatedCompany.id);
        }

        // Add edge
        edges.push({
          id: rel.id,
          source: rel.parent_company_id,
          target: rel.child_company_id,
          type: 'smoothstep',
          label: rel.relationship_type?.name || 'Related',
          data: {
            relationship: rel,
            label: rel.relationship_type?.name || 'Related',
            percentage: rel.ownership_percentage,
          },
        });
      });

      return { nodes, edges };
    },
    enabled: !!companyId,
  });
};

// Mutation hooks for relationship management
export const useCompanyRelationshipMutations = () => {
  const queryClient = useQueryClient();

  const createRelationship = useMutation({
    mutationFn: async (data: Omit<CompanyRelationshipAdvanced, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('company_relationships_advanced')
        .insert([{
          ...data,
          metadata: data.metadata || {}
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships-advanced'] });
      queryClient.invalidateQueries({ queryKey: ['company-network'] });
    },
  });

  const updateRelationship = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CompanyRelationshipAdvanced> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('company_relationships_advanced')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships-advanced'] });
      queryClient.invalidateQueries({ queryKey: ['company-network'] });
    },
  });

  const deleteRelationship = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_relationships_advanced')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships-advanced'] });
      queryClient.invalidateQueries({ queryKey: ['company-network'] });
    },
  });

  return {
    createRelationship,
    updateRelationship,
    deleteRelationship,
  };
};
