
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';

interface CompanyPeopleChartProps {
  companies: Company[];
  isLoading?: boolean;
}

const CompanyPeopleChart: React.FC<CompanyPeopleChartProps> = ({ companies, isLoading: isCompaniesLoading }) => {
  const companyIds = useMemo(() => companies.map((company) => company.id), [companies]);
  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach((company) => map.set(company.id, company.name));
    return map;
  }, [companies]);

  const { data, isLoading } = useQuery({
    queryKey: ['company-people-stats', companyIds],
    queryFn: async () => {
      if (companyIds.length === 0) {
        return [];
      }
      // Get top companies by number of people
      const companyCounts: Record<string, { id: string; name: string; count: number }> = {};

      const chunkSize = 1000;
      for (let i = 0; i < companyIds.length; i += chunkSize) {
        const chunk = companyIds.slice(i, i + chunkSize);
        const { data: relationships, error } = await supabase
          .from('company_relationships')
          .select('company_id')
          .in('company_id', chunk);

        if (error) throw error;

        (relationships || []).forEach((relationship) => {
          const companyId = relationship.company_id as string | undefined;
          if (!companyId) return;
          const companyName = nameById.get(companyId);
          if (!companyName) return;
          if (companyCounts[companyId]) {
            companyCounts[companyId].count += 1;
          } else {
            companyCounts[companyId] = { id: companyId, name: companyName, count: 1 };
          }
        });
      }

      return Object.values(companyCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
    enabled: companyIds.length > 0,
  });
  
  if (isCompaniesLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies by People Count</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies by People Count</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center text-muted-foreground">
          No relationship data available yet
        </CardContent>
      </Card>
    );
  }
  
  // Format data for the chart
  const chartData = data.map(company => ({
    name: company.name.length > 15 ? company.name.substring(0, 15) + '...' : company.name,
    count: company.count,
    fullName: company.name // For tooltip
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Companies by People Count</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'People']}
              labelFormatter={(label) => {
                // Find the corresponding chart data item
                const dataItem = chartData.find(item => item.name === label);
                // Return the full name if found, otherwise return the label
                return dataItem ? dataItem.fullName : label;
              }}
            />
            <Bar dataKey="count" fill="#8884d8" name="People" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompanyPeopleChart;
