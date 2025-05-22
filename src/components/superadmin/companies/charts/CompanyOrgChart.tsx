
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyOrgChart } from '@/hooks/useCompanyOrgChart';
import { ChevronDown, ChevronRight, User, Users } from 'lucide-react';

interface CompanyOrgChartProps {
  companyId: string;
}

const CompanyOrgChart: React.FC<CompanyOrgChartProps> = ({ companyId }) => {
  const { orgChartData, isLoading } = useCompanyOrgChart(companyId);
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Chart</CardTitle>
          <CardDescription>Loading company organization structure...</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <div className="flex justify-center items-center h-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!orgChartData || orgChartData.rootNodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Chart</CardTitle>
          <CardDescription>Visualize the company's organizational structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Users className="h-12 w-12 mb-4" />
            <p className="text-center">Not enough data to generate an organization chart.</p>
            <p className="text-center text-sm mt-2">
              Add more people with defined reporting relationships to see the organizational structure.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handlePersonClick = (personId: string) => {
    navigate(`/superadmin/people/${personId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Chart</CardTitle>
        <CardDescription>Visualize the company's organizational structure</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-max">
          <div className="p-4">
            {orgChartData.rootNodes.map((node) => (
              <OrgChartNode 
                key={node.id} 
                node={node} 
                onPersonClick={handlePersonClick} 
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface OrgChartNodeProps {
  node: any;
  onPersonClick: (personId: string) => void;
  level?: number;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ 
  node, 
  onPersonClick,
  level = 0 
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="ml-6">
      <div className="flex items-start my-2">
        <div 
          className={`mr-2 ${hasChildren ? 'cursor-pointer' : ''} mt-1.5`}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren && (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </div>
        <div 
          className={`
            flex flex-col border rounded-md p-3
            ${node.isManager ? 'bg-primary/10 border-primary/20' : 'bg-card'}
            hover:shadow-md transition-shadow cursor-pointer
          `}
          onClick={() => onPersonClick(node.id)}
        >
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full mr-2 ${
              node.type === 'talent' ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              <User size={16} className={
                node.type === 'talent' ? 'text-blue-600' : 'text-purple-600'
              } />
            </div>
            <div>
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-muted-foreground">{node.role}</div>
              {node.email && <div className="text-xs">{node.email}</div>}
            </div>
          </div>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="border-l-2 border-dashed border-muted pl-4">
          {node.children.map((child: any) => (
            <OrgChartNode 
              key={child.id} 
              node={child} 
              onPersonClick={onPersonClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyOrgChart;
