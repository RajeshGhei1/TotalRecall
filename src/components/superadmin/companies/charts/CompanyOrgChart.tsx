
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyOrgChart } from '@/hooks/useCompanyOrgChart';
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  Users, 
  Search, 
  Filter,
  Download,
  Maximize2,
  RefreshCw,
  UserCheck,
  Building2
} from 'lucide-react';

interface CompanyOrgChartProps {
  companyId: string;
}

const CompanyOrgChart: React.FC<CompanyOrgChartProps> = ({ companyId }) => {
  const { data: orgChartData, isLoading, refetch } = useCompanyOrgChart(companyId);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [filterByType, setFilterByType] = useState<string>('all');
  
  // Filter and search functionality
  const filteredData = useMemo(() => {
    if (!orgChartData) return null;
    
    const filterNode = (node: unknown): unknown | null => {
      const matchesSearch = !searchTerm || 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.email && node.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterByType === 'all' || node.type === filterByType;
      
      const filteredChildren = node.children
        ?.map(filterNode)
        .filter(Boolean) || [];
      
      if (matchesSearch && matchesFilter) {
        return { ...node, children: filteredChildren };
      } else if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      
      return null;
    };
    
    const filteredRootNodes = orgChartData.rootNodes
      .map(filterNode)
      .filter(Boolean);
    
    return { ...orgChartData, rootNodes: filteredRootNodes };
  }, [orgChartData, searchTerm, filterByType]);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const totalPeople = useMemo(() => {
    if (!orgChartData) return 0;
    return Object.keys(orgChartData.allNodes).length;
  }, [orgChartData]);
  
  const peopleByType = useMemo(() => {
    if (!orgChartData) return {};
    const types: Record<string, number> = {};
    Object.values(orgChartData.allNodes).forEach((node: unknown) => {
      types[node.type] = (types[node.type] || 0) + 1;
    });
    return types;
  }, [orgChartData]);
  
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
            <Building2 className="h-12 w-12 mb-4" />
            <p className="text-center">Not enough data to generate an organization chart.</p>
            <p className="text-center text-sm mt-2">
              Add more people with defined reporting relationships to see the organizational structure.
            </p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Organization Chart
            </CardTitle>
            <CardDescription>
              Visualize the company's organizational structure ({totalPeople} people)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandAll(!expandAll)}
            >
              {expandAll ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats and Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterByType}
              onChange={(e) => setFilterByType(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              {Object.keys(peopleByType).map(type => (
                <option key={type} value={type}>
                  {type} ({peopleByType[type]})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            {Object.entries(peopleByType).map(([type, count]) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-x-auto">
        <div className="min-w-max">
          <div className="p-4">
            {filteredData?.rootNodes.map((node) => (
              <OrgChartNode 
                key={node.id} 
                node={node} 
                onPersonClick={handlePersonClick}
                searchTerm={searchTerm}
                expandAll={expandAll}
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
  searchTerm?: string;
  expandAll?: boolean;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ 
  node, 
  onPersonClick,
  level = 0,
  searchTerm = '',
  expandAll = false
}) => {
  const [expanded, setExpanded] = useState(expandAll);
  const hasChildren = node.children && node.children.length > 0;
  
  // Auto expand if search matches this node or its children
  React.useEffect(() => {
    if (expandAll) {
      setExpanded(true);
    } else if (searchTerm) {
      const nodeMatches = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.role.toLowerCase().includes(searchTerm.toLowerCase());
      if (nodeMatches) {
        setExpanded(true);
      }
    }
  }, [searchTerm, expandAll, node]);
  
  const isHighlighted = searchTerm && (
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.email && node.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
            flex flex-col border rounded-lg p-4 min-w-[280px] transition-all
            ${node.isManager ? 'bg-primary/10 border-primary/30 shadow-md' : 'bg-card border-border'}
            ${isHighlighted ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}
            hover:shadow-lg hover:scale-105 cursor-pointer
          `}
          onClick={() => onPersonClick(node.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                node.type === 'talent' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {node.isManager ? (
                  <UserCheck size={20} className={
                    node.type === 'talent' ? 'text-blue-600' : 'text-purple-600'
                  } />
                ) : (
                  <User size={20} className={
                    node.type === 'talent' ? 'text-blue-600' : 'text-purple-600'
                  } />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{node.name}</div>
                <div className="text-sm text-muted-foreground font-medium">{node.role}</div>
                {node.email && (
                  <div className="text-xs text-muted-foreground">{node.email}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant={node.type === 'talent' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {node.type}
              </Badge>
              {node.isManager && (
                <Badge variant="outline" className="text-xs">
                  Manager
                </Badge>
              )}
              {hasChildren && (
                <Badge variant="outline" className="text-xs">
                  {node.children.length} reports
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="border-l-2 border-dashed border-muted pl-4 ml-2">
          {node.children.map((child: unknown) => (
            <OrgChartNode 
              key={child.id} 
              node={child} 
              onPersonClick={onPersonClick}
              level={level + 1}
              searchTerm={searchTerm}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyOrgChart;
