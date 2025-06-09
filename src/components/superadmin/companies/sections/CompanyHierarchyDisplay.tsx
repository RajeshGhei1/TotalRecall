
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, ChevronDown, ChevronRight } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/hooks/useCompanies';

interface CompanyHierarchyDisplayProps {
  companyId: string;
  currentCompanyId?: string;
}

interface HierarchyNode {
  company: Company;
  children: HierarchyNode[];
  level: number;
}

const CompanyHierarchyDisplay: React.FC<CompanyHierarchyDisplayProps> = ({
  companyId,
  currentCompanyId
}) => {
  const { companies } = useCompanies();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hierarchyTree, setHierarchyTree] = useState<HierarchyNode | null>(null);

  useEffect(() => {
    if (!companies || !companyId) return;

    const buildHierarchy = (rootId: string, level: number = 0): HierarchyNode | null => {
      const company = companies.find(c => c.id === rootId);
      if (!company) return null;

      const children = companies
        .filter(c => c.parent_company_id === rootId)
        .map(child => buildHierarchy(child.id, level + 1))
        .filter(Boolean) as HierarchyNode[];

      return {
        company,
        children,
        level
      };
    };

    // Find the root company (walk up the parent chain)
    let rootCompany = companies.find(c => c.id === companyId);
    while (rootCompany?.parent_company_id) {
      const parent = companies.find(c => c.id === rootCompany!.parent_company_id);
      if (parent) {
        rootCompany = parent;
      } else {
        break;
      }
    }

    if (rootCompany) {
      const tree = buildHierarchy(rootCompany.id);
      setHierarchyTree(tree);
      // Auto-expand the path to current company
      if (currentCompanyId) {
        const pathToExpand = new Set<string>();
        const findPath = (node: HierarchyNode): boolean => {
          if (node.company.id === currentCompanyId) return true;
          for (const child of node.children) {
            if (findPath(child)) {
              pathToExpand.add(node.company.id);
              return true;
            }
          }
          return false;
        };
        if (tree) findPath(tree);
        setExpandedNodes(pathToExpand);
      }
    }
  }, [companies, companyId, currentCompanyId]);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: HierarchyNode) => {
    const isExpanded = expandedNodes.has(node.company.id);
    const hasChildren = node.children.length > 0;
    const isCurrent = node.company.id === currentCompanyId;

    return (
      <div key={node.company.id} className="space-y-2">
        <div
          className={`flex items-center space-x-2 p-2 rounded-md border ${
            isCurrent ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
          }`}
          style={{ marginLeft: `${node.level * 20}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(node.company.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <Building className="h-4 w-4 text-gray-500" />
          
          <div className="flex-1">
            <div className="font-medium">{node.company.name}</div>
            {node.company.company_group_name && (
              <div className="text-xs text-gray-500">
                Group: {node.company.company_group_name}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {node.level === 0 && (
              <Badge variant="outline" className="text-xs">
                Root
              </Badge>
            )}
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              Level {node.level}
            </Badge>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (!hierarchyTree) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Company Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            Loading hierarchy...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Building className="mr-2 h-4 w-4" />
          Company Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {renderNode(hierarchyTree)}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-xs text-gray-600">
            <strong>Legend:</strong> Click arrows to expand/collapse. Root = top-level company. 
            Level indicates depth in hierarchy.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyHierarchyDisplay;
