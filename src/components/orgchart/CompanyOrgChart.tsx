
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompanyOrgChart } from '@/hooks/useCompanyOrgChart';
import { Users, User, AlertCircle, Loader2 } from 'lucide-react';

interface CompanyOrgChartProps {
  companyId: string;
}

interface OrgNodeProps {
  node: {
    id: string;
    name: string;
    role: string;
    email?: string;
    children: unknown[];
    type?: 'talent' | 'contact';
    isManager?: boolean;
  };
  level: number;
}

const OrgNode: React.FC<OrgNodeProps> = ({ node, level }) => {
  const marginLeft = level * 40;
  
  return (
    <div className="space-y-2">
      <Card className="relative">
        <CardContent className="p-4" style={{ marginLeft: `${marginLeft}px` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {node.isManager ? (
                  <Users className="h-8 w-8 text-blue-600" />
                ) : (
                  <User className="h-8 w-8 text-gray-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{node.name}</h4>
                <p className="text-sm text-muted-foreground">{node.role}</p>
                {node.email && (
                  <p className="text-xs text-gray-500">{node.email}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant={node.isManager ? "default" : "secondary"}>
                {node.isManager ? "Manager" : "Team Member"}
              </Badge>
              <Badge variant="outline">
                {node.type === 'talent' ? "Internal" : "Contact"}
              </Badge>
            </div>
          </div>
        </CardContent>
        
        {/* Connection line for hierarchy */}
        {level > 0 && (
          <div 
            className="absolute top-0 left-0 w-px h-full bg-gray-300"
            style={{ left: `${marginLeft - 20}px` }}
          />
        )}
      </Card>
      
      {/* Render children recursively */}
      {node.children && node.children.length > 0 && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <OrgNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CompanyOrgChart: React.FC<CompanyOrgChartProps> = ({ companyId }) => {
  const { data: orgChartData, isLoading, error } = useCompanyOrgChart(companyId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading organization chart...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span>Error loading organization chart</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orgChartData || !orgChartData.rootNodes || orgChartData.rootNodes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No organizational data available</p>
            <p className="text-sm">Add people and define reporting relationships to see the org chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPeople = Object.keys(orgChartData.allNodes).length;
  const managersCount = Object.values(orgChartData.allNodes).filter((node: unknown) => node.isManager).length;

  return (
    <div className="space-y-6">
      {/* Org Chart Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalPeople}</p>
                <p className="text-sm text-muted-foreground">Total People</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{managersCount}</p>
                <p className="text-sm text-muted-foreground">Managers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{totalPeople - managersCount}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Org Chart Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Organization Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {orgChartData.rootNodes.map((rootNode) => (
              <OrgNode key={rootNode.id} node={rootNode} level={0} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOrgChart;
