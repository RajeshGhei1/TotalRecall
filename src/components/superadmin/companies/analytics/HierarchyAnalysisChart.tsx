
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Network } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyScope } from '@/hooks/useCompanies';

interface HierarchyData {
  level: number;
  count: number;
  companies: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface HierarchyAnalysisChartProps {
  scopeFilter: CompanyScope;
  tenantId: string | null;
  filters: Record<string, unknown>;
  cacheTtlMs: number;
  isLoading?: boolean;
}

const HierarchyAnalysisChart: React.FC<HierarchyAnalysisChartProps> = ({
  scopeFilter,
  tenantId,
  filters,
  cacheTtlMs,
  isLoading
}) => {
  const { data: hierarchyData, isLoading: isHierarchyLoading } = useQuery({
    queryKey: ['companies-hierarchy', scopeFilter, tenantId, filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_hierarchy_stats', {
        p_scope: scopeFilter,
        p_tenant_id: tenantId,
        p_filters: filters
      });
      if (error) throw error;
      return data as {
        levels: Array<{ level: number; count: number }>;
        parentCount: number;
        subsidiaryCount: number;
        maxDepth: number;
        groupCount: number;
      };
    },
    staleTime: cacheTtlMs
  });

  const levels = hierarchyData?.levels || [];

  const parentCompanies = hierarchyData?.parentCount || 0;
  const subsidiaries = hierarchyData?.subsidiaryCount || 0;
  const maxDepth = hierarchyData?.maxDepth || 0;
  const companiesWithGroups = hierarchyData?.groupCount || 0;

  if (isLoading || isHierarchyLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Hierarchy Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            {isHierarchyLoading ? 'Loading hierarchy data...' : 'No companies available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hierarchyData || levels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Hierarchy Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No companies available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Company Hierarchy Analysis
        </CardTitle>
        
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{parentCompanies}</div>
            <div className="text-xs text-muted-foreground">Parent Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{subsidiaries}</div>
            <div className="text-xs text-muted-foreground">Subsidiaries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{maxDepth}</div>
            <div className="text-xs text-muted-foreground">Max Depth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{companiesWithGroups}</div>
            <div className="text-xs text-muted-foreground">In Groups</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Hierarchy level distribution chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Distribution by Hierarchy Level</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={levels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="level"
                label={{ value: 'Hierarchy Level', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: unknown, name: unknown) => [value, 'Companies']}
                labelFormatter={(label) => `Level ${label}`}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Level breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-3">Level Breakdown</h4>
          <div className="space-y-3">
            {hierarchyData.map((level) => (
              <div key={level.level} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={level.level === 0 ? 'default' : 'secondary'}>
                    Level {level.level}
                  </Badge>
                  <div>
                    <div className="font-medium">{level.count} companies</div>
                    <div className="text-sm text-muted-foreground">
                      {level.level === 0 ? 'Parent companies' : `Subsidiaries at level ${level.level}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Examples:</div>
                  <div className="text-xs">
                    {level.companies.slice(0, 2).join(', ')}
                    {level.companies.length > 2 && ` +${level.companies.length - 2} more`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company groups pie chart */}
        {companiesWithGroups > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Group Structure Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'In Groups', value: companiesWithGroups },
                    { name: 'Independent', value: totalCompanies - companiesWithGroups }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HierarchyAnalysisChart;
