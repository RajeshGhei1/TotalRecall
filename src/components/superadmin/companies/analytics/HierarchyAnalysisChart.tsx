
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Network, Building } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';

interface HierarchyData {
  level: number;
  count: number;
  companies: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const HierarchyAnalysisChart: React.FC = () => {
  const { companies = [] } = useCompanies();

  const { data: hierarchyData = [], isLoading } = useQuery({
    queryKey: ['hierarchy_analysis', companies.length],
    queryFn: async () => {
      if (!companies.length) return [];

      // Analyze hierarchy levels
      const levelCounts: Record<number, { count: number; companies: string[] }> = {};
      
      companies.forEach(company => {
        const level = company.hierarchy_level || 0;
        if (!levelCounts[level]) {
          levelCounts[level] = { count: 0, companies: [] };
        }
        levelCounts[level].count++;
        levelCounts[level].companies.push(company.name);
      });

      const hierarchyData: HierarchyData[] = Object.entries(levelCounts)
        .map(([level, data]) => ({
          level: parseInt(level),
          count: data.count,
          companies: data.companies.slice(0, 5) // Show first 5 companies
        }))
        .sort((a, b) => a.level - b.level);

      return hierarchyData;
    },
    enabled: companies.length > 0
  });

  // Calculate statistics
  const totalCompanies = companies.length;
  const parentCompanies = companies.filter(c => !c.parent_company_id).length;
  const subsidiaries = companies.filter(c => c.parent_company_id).length;
  const maxDepth = Math.max(...hierarchyData.map(h => h.level), 0);
  const companiesWithGroups = companies.filter(c => c.company_group_name).length;

  if (isLoading || !companies.length) {
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
            {isLoading ? 'Loading hierarchy data...' : 'No companies available'}
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
            <BarChart data={hierarchyData}>
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
