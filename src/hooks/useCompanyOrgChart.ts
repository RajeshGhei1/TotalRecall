
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  email?: string;
  children: OrgNode[];
  type?: 'talent' | 'contact';
  isManager?: boolean;
}

interface OrgChartData {
  rootNodes: OrgNode[];
  allNodes: Record<string, OrgNode>;
}

export const useCompanyOrgChart = (companyId: string) => {
  return useQuery({
    queryKey: ['company-org-chart', companyId],
    queryFn: async () => {
      if (!companyId || companyId === 'new') {
        return { rootNodes: [], allNodes: {} };
      }

      try {
        // Fetch company relationships with person details
        const { data: relationships, error } = await supabase
          .from('company_relationships')
          .select(`
            id,
            person_id,
            role,
            reports_to,
            is_current,
            start_date,
            end_date,
            people:person_id (
              id,
              full_name,
              email,
              type
            )
          `)
          .eq('company_id', companyId)
          .eq('is_current', true);

        if (error) {
          console.error('Error fetching org chart data:', error);
          throw error;
        }

        if (!relationships || relationships.length === 0) {
          return { rootNodes: [], allNodes: {} };
        }

        // Build org chart structure
        const allNodes: Record<string, OrgNode> = {};
        const nodesByPersonId: Record<string, OrgNode> = {};

        // Create nodes for all people
        relationships.forEach(rel => {
          if (rel.people) {
            const person = Array.isArray(rel.people) ? rel.people[0] : rel.people;
            const node: OrgNode = {
              id: rel.id,
              name: person.full_name,
              role: rel.role,
              email: person.email,
              children: [],
              type: person.type as 'talent' | 'contact',
              isManager: false
            };
            
            allNodes[rel.id] = node;
            nodesByPersonId[person.id] = node;
          }
        });

        // Build hierarchy
        const rootNodes: OrgNode[] = [];
        
        relationships.forEach(rel => {
          const currentNode = allNodes[rel.id];
          if (!currentNode) return;

          if (rel.reports_to) {
            // Find the manager node
            const managerRel = relationships.find(r => r.person_id === rel.reports_to);
            if (managerRel && allNodes[managerRel.id]) {
              const managerNode = allNodes[managerRel.id];
              managerNode.children.push(currentNode);
              managerNode.isManager = true;
            } else {
              // If manager not found in current company, treat as root
              rootNodes.push(currentNode);
            }
          } else {
            // No manager, this is a root node
            rootNodes.push(currentNode);
          }
        });

        const orgChartData: OrgChartData = {
          rootNodes,
          allNodes
        };

        return orgChartData;
      } catch (error) {
        console.error('Error in useCompanyOrgChart:', error);
        throw error;
      }
    },
    enabled: !!companyId && companyId !== 'new',
  });
};
