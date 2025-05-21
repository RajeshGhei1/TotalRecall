
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyRelationship } from '@/types/company-relationship';

interface OrgChartNode {
  id: string;
  name: string;
  role: string;
  email?: string;
  children: OrgChartNode[];
  type?: 'talent' | 'contact';
  isManager?: boolean;
}

export const useCompanyOrgChart = (companyId?: string) => {
  const { data: orgChartData, isLoading } = useQuery({
    queryKey: ['company-org-chart', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      // Fetch all current relationships for this company
      const { data: relationships, error } = await supabase
        .from('company_relationships')
        .select(`
          id,
          person_id,
          role,
          is_current,
          person:people(id, full_name, email, type)
        `)
        .eq('company_id', companyId)
        .eq('is_current', true);
        
      if (error) throw error;
      
      if (!relationships || relationships.length === 0) {
        return null;
      }
      
      // In a real implementation, we would have manager_id in the database
      // For now, let's infer based on roles to create a demo chart
      const allNodes: Record<string, OrgChartNode> = {};
      const rootNodes: OrgChartNode[] = [];
      let ceoNode: OrgChartNode | null = null;
      
      // First pass - create all nodes
      relationships.forEach((rel: any) => {
        const person = rel.person;
        if (!person) return;
        
        const node: OrgChartNode = {
          id: person.id,
          name: person.full_name,
          role: rel.role,
          email: person.email,
          children: [],
          type: person.type,
          isManager: isManagerRole(rel.role)
        };
        
        allNodes[person.id] = node;
        
        // If this looks like a CEO/Head role, mark as potential root
        if (isCEORole(rel.role)) {
          ceoNode = node;
        }
      });
      
      // If we have a CEO, use that as root, otherwise create a virtual company node
      if (ceoNode) {
        rootNodes.push(ceoNode);
      } else {
        // Create nodes for each department/role type
        const departments = groupByDepartment(relationships);
        
        Object.entries(departments).forEach(([dept, people]) => {
          // Find or create a manager for each department
          const manager = people.find((p: any) => isManagerRole(p.role));
          
          if (manager && manager.person) {
            const managerNode = allNodes[manager.person.id];
            if (managerNode) {
              rootNodes.push(managerNode);
              
              // Add other department members as children
              people.forEach((p: any) => {
                if (p.person && p.person.id !== manager.person.id) {
                  const personNode = allNodes[p.person.id];
                  if (personNode) {
                    managerNode.children.push(personNode);
                  }
                }
              });
            }
          } else if (people.length > 0) {
            // If no manager, add all to root
            people.forEach((p: any) => {
              if (p.person) {
                const personNode = allNodes[p.person.id];
                if (personNode) {
                  rootNodes.push(personNode);
                }
              }
            });
          }
        });
      }
      
      return { rootNodes, allNodes };
    },
    enabled: !!companyId
  });
  
  return { orgChartData, isLoading };
};

// Helper functions for organization chart building
const isManagerRole = (role?: string): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return lowerRole.includes('manager') || 
         lowerRole.includes('director') || 
         lowerRole.includes('head') || 
         lowerRole.includes('lead') ||
         lowerRole.includes('ceo') ||
         lowerRole.includes('cto') ||
         lowerRole.includes('cfo') ||
         lowerRole.includes('chief');
};

const isCEORole = (role?: string): boolean => {
  if (!role) return false;
  const lowerRole = role.toLowerCase();
  return lowerRole.includes('ceo') || 
         lowerRole.includes('chief executive') || 
         lowerRole.includes('founder') || 
         lowerRole.includes('president');
};

// Group relationships by inferred department based on role
const groupByDepartment = (relationships: any[]): Record<string, any[]> => {
  const departments: Record<string, any[]> = {
    'Executive': [],
    'Engineering': [],
    'Marketing': [],
    'Sales': [],
    'Operations': [],
    'Finance': [],
    'Other': []
  };
  
  relationships.forEach(rel => {
    if (!rel.role) {
      departments['Other'].push(rel);
      return;
    }
    
    const lowerRole = rel.role.toLowerCase();
    
    if (lowerRole.includes('ceo') || lowerRole.includes('coo') || lowerRole.includes('cto') || 
        lowerRole.includes('chief') || lowerRole.includes('president') || 
        lowerRole.includes('founder') || lowerRole.includes('director')) {
      departments['Executive'].push(rel);
    } else if (lowerRole.includes('engineer') || lowerRole.includes('developer') || 
              lowerRole.includes('programmer') || lowerRole.includes('tech') || 
              lowerRole.includes('architect')) {
      departments['Engineering'].push(rel);
    } else if (lowerRole.includes('market') || lowerRole.includes('content') || 
              lowerRole.includes('brand') || lowerRole.includes('communication')) {
      departments['Marketing'].push(rel);
    } else if (lowerRole.includes('sale') || lowerRole.includes('account') || 
              lowerRole.includes('business development')) {
      departments['Sales'].push(rel);
    } else if (lowerRole.includes('operation') || lowerRole.includes('product') || 
              lowerRole.includes('project')) {
      departments['Operations'].push(rel);
    } else if (lowerRole.includes('financ') || lowerRole.includes('account') || 
              lowerRole.includes('tax')) {
      departments['Finance'].push(rel);
    } else {
      departments['Other'].push(rel);
    }
  });
  
  // Remove empty departments
  return Object.fromEntries(
    Object.entries(departments).filter(([_, people]) => people.length > 0)
  );
};
