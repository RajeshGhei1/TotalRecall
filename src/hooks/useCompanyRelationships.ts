
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyRelationshipType, CompanyRelationshipAdvanced, CompanyRelationshipHistory } from '@/types/company-relationships';

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

export const useCompanyRelationshipsAdvanced = (companyId?: string) => {
  return useQuery({
    queryKey: ['company-relationships-advanced', companyId],
    queryFn: async () => {
      let query = supabase
        .from('company_relationships_advanced')
        .select(`
          *,
          parent_company:companies!parent_company_id(id, name),
          child_company:companies!child_company_id(id, name),
          relationship_type:company_relationship_types(*)
        `)
        .eq('is_active', true);
      
      if (companyId) {
        query = query.or(`parent_company_id.eq.${companyId},child_company_id.eq.${companyId}`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CompanyRelationshipAdvanced[];
    },
    enabled: !!companyId,
  });
};

export const useCompanyNetwork = (companyId?: string, depth: number = 2) => {
  return useQuery({
    queryKey: ['company-network', companyId, depth],
    queryFn: async () => {
      if (!companyId) return { nodes: [], edges: [] };
      
      // Get all relationships within specified depth using recursive query
      const { data: relationships, error } = await supabase.rpc(
        'get_company_network',
        { 
          root_company_id: companyId, 
          max_depth: depth 
        }
      );
      
      if (error) {
        console.warn('Network RPC failed, falling back to basic query:', error);
        // Fallback to basic query
        const { data: basicData, error: basicError } = await supabase
          .from('company_relationships_advanced')
          .select(`
            *,
            parent_company:companies!parent_company_id(id, name, industry, size, location),
            child_company:companies!child_company_id(id, name, industry, size, location),
            relationship_type:company_relationship_types(*)
          `)
          .or(`parent_company_id.eq.${companyId},child_company_id.eq.${companyId}`)
          .eq('is_active', true);
        
        if (basicError) throw basicError;
        return transformToNetworkData(basicData as CompanyRelationshipAdvanced[], companyId);
      }
      
      return transformToNetworkData(relationships, companyId);
    },
    enabled: !!companyId,
  });
};

const transformToNetworkData = (relationships: CompanyRelationshipAdvanced[], rootCompanyId: string) => {
  const nodeMap = new Map();
  const edges: any[] = [];
  
  // Add root company if not already present
  relationships.forEach(rel => {
    if (rel.parent_company && !nodeMap.has(rel.parent_company.id)) {
      nodeMap.set(rel.parent_company.id, {
        id: rel.parent_company.id,
        data: { 
          label: rel.parent_company.name,
          company: rel.parent_company,
          isRoot: rel.parent_company.id === rootCompanyId
        },
        position: { x: 0, y: 0 },
        type: 'companyNode'
      });
    }
    
    if (rel.child_company && !nodeMap.has(rel.child_company.id)) {
      nodeMap.set(rel.child_company.id, {
        id: rel.child_company.id,
        data: { 
          label: rel.child_company.name,
          company: rel.child_company,
          isRoot: rel.child_company.id === rootCompanyId
        },
        position: { x: 0, y: 0 },
        type: 'companyNode'
      });
    }
    
    // Create edge
    edges.push({
      id: rel.id,
      source: rel.parent_company_id,
      target: rel.child_company_id,
      data: {
        relationship: rel,
        label: rel.relationship_type?.name || 'Relationship',
        percentage: rel.ownership_percentage
      },
      type: 'relationshipEdge',
      animated: rel.relationship_type?.is_hierarchical || false
    });
  });
  
  return {
    nodes: Array.from(nodeMap.values()),
    edges
  };
};

export const useCompanyRelationshipHistory = (relationshipId?: string) => {
  return useQuery({
    queryKey: ['company-relationship-history', relationshipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_relationship_history')
        .select('*')
        .eq('relationship_id', relationshipId)
        .order('changed_at', { ascending: false });
      
      if (error) throw error;
      return data as CompanyRelationshipHistory[];
    },
    enabled: !!relationshipId,
  });
};

export const useCompanyRelationshipMutations = () => {
  const queryClient = useQueryClient();
  
  const createRelationship = useMutation({
    mutationFn: async (data: Omit<CompanyRelationshipAdvanced, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: relationship, error } = await supabase
        .from('company_relationships_advanced')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return relationship;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships-advanced'] });
      queryClient.invalidateQueries({ queryKey: ['company-network'] });
      toast.success('Relationship created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating relationship:', error);
      toast.error(`Failed to create relationship: ${error.message}`);
    }
  });
  
  const updateRelationship = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CompanyRelationshipAdvanced> & { id: string }) => {
      const { data: relationship, error } = await supabase
        .from('company_relationships_advanced')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return relationship;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-relationships-advanced'] });
      queryClient.invalidateQueries({ queryKey: ['company-network'] });
      toast.success('Relationship updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating relationship:', error);
      toast.error(`Failed to update relationship: ${error.message}`);
    }
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
      toast.success('Relationship deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting relationship:', error);
      toast.error(`Failed to delete relationship: ${error.message}`);
    }
  });
  
  return {
    createRelationship,
    updateRelationship,
    deleteRelationship
  };
};
