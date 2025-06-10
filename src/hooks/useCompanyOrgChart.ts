
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const { data: orgChartData, isLoading, error, refetch } = useQuery({
    queryKey: ['company-org-chart', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      try {
        console.log(`Fetching org chart for company: ${companyId}`);
        
        // Fetch all current relationships for this company
        const { data: relationships, error } = await supabase
          .from('company_relationships')
          .select(`
            id,
            person_id,
            role,
            is_current,
            reports_to,
            person:people(id, full_name, email, type)
          `)
          .eq('company_id', companyId)
          .eq('is_current', true);
          
        if (error) {
          console.error('Error fetching company relationships:', error);
          throw error;
        }
        
        console.log(`Found ${relationships?.length || 0} relationships`);
        
        if (!relationships || relationships.length === 0) {
          return { rootNodes: [], allNodes: {} };
        }
        
        // Process relationships using reports_to field
        const allNodes: Record<string, OrgChartNode> = {};
        const rootNodes: OrgChartNode[] = [];
        
        // First pass - create all nodes
        relationships.forEach((rel: any) => {
          const person = rel.person;
          if (!person) return;
          
          const node: OrgChartNode = {
            id: person.id,
            name: person.full_name || 'Unknown',
            role: rel.role || 'No role specified',
            email: person.email,
            children: [],
            type: person.type || 'contact',
            isManager: isManagerRole(rel.role)
          };
          
          allNodes[person.id] = node;
        });
        
        console.log(`Created ${Object.keys(allNodes).length} nodes`);
        
        // Second pass - build the hierarchy based on reports_to
        relationships.forEach((rel: any) => {
          const personId = rel.person?.id;
          if (!personId || !allNodes[personId]) return;
          
          const node = allNodes[personId];
          
          if (rel.reports_to && allNodes[rel.reports_to]) {
            // This person reports to someone, add as child
            const managerNode = allNodes[rel.reports_to];
            managerNode.children.push(node);
            managerNode.isManager = true; // Mark as manager since they have reports
          } else {
            // This person doesn't report to anyone in the company, add to root
            rootNodes.push(node);
          }
        });
        
        console.log(`Built hierarchy with ${rootNodes.length} root nodes`);
        
        // If no explicit hierarchy is defined, fall back to inferring based on roles
        if (rootNodes.length === 0 && Object.keys(allNodes).length > 0) {
          console.log('No explicit hierarchy found, inferring from roles...');
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
        
        // Sort root nodes by manager status and name
        rootNodes.sort((a, b) => {
          if (a.isManager && !b.isManager) return -1;
          if (!a.isManager && b.isManager) return 1;
          return a.name.localeCompare(b.name);
        });
        
        // Sort children for each node
        const sortChildren = (node: OrgChartNode) => {
          node.children.sort((a, b) => {
            if (a.isManager && !b.isManager) return -1;
            if (!a.isManager && b.isManager) return 1;
            return a.name.localeCompare(b.name);
          });
          node.children.forEach(sortChildren);
        };
        
        rootNodes.forEach(sortChildren);
        
        const result = { rootNodes, allNodes };
        console.log('Org chart data processed successfully:', result);
        return result;
        
      } catch (error) {
        console.error('Error in useCompanyOrgChart:', error);
        throw error;
      }
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
  
  return { 
    orgChartData, 
    isLoading, 
    error,
    refetch: () => refetch()
  };
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
         lowerRole.includes('chief') ||
         lowerRole.includes('supervisor') ||
         lowerRole.includes('team lead') ||
         lowerRole.includes('senior');
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
    'HR': [],
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
        lowerRole.includes('founder') || lowerRole.includes('executive')) {
      departments['Executive'].push(rel);
    } else if (lowerRole.includes('engineer') || lowerRole.includes('developer') || 
              lowerRole.includes('programmer') || lowerRole.includes('tech') || 
              lowerRole.includes('architect') || lowerRole.includes('dev')) {
      departments['Engineering'].push(rel);
    } else if (lowerRole.includes('market') || lowerRole.includes('content') || 
              lowerRole.includes('brand') || lowerRole.includes('communication') ||
              lowerRole.includes('social') || lowerRole.includes('digital')) {
      departments['Marketing'].push(rel);
    } else if (lowerRole.includes('sale') || lowerRole.includes('account') || 
              lowerRole.includes('business development') || lowerRole.includes('client')) {
      departments['Sales'].push(rel);
    } else if (lowerRole.includes('operation') || lowerRole.includes('product') || 
              lowerRole.includes('project') || lowerRole.includes('quality')) {
      departments['Operations'].push(rel);
    } else if (lowerRole.includes('financ') || lowerRole.includes('account') || 
              lowerRole.includes('tax') || lowerRole.includes('audit')) {
      departments['Finance'].push(rel);
    } else if (lowerRole.includes('hr') || lowerRole.includes('human resource') || 
              lowerRole.includes('recruit') || lowerRole.includes('talent')) {
      departments['HR'].push(rel);
    } else {
      departments['Other'].push(rel);
    }
  });
  
  // Remove empty departments
  return Object.fromEntries(
    Object.entries(departments).filter(([_, people]) => people.length > 0)
  );
};
