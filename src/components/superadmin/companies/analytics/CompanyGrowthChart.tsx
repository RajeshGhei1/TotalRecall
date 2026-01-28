
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyScope } from '@/hooks/useCompanies';
import { CalendarDays, TrendingUp } from 'lucide-react';

interface GrowthData {
  period: string;
  total: number;
  new_companies: number;
  cumulative: number;
}

interface CompanyGrowthChartProps {
  scopeFilter: CompanyScope;
  tenantId: string | null;
  filters: Record<string, unknown>;
  cacheTtlMs: number;
  isLoading?: boolean;
}

const CompanyGrowthChart: React.FC<CompanyGrowthChartProps> = ({
  scopeFilter,
  tenantId,
  filters,
  cacheTtlMs,
  isLoading,
}) => {
  const [timeRange, setTimeRange] = useState('12months');
  const [chartType, setChartType] = useState('line');

  const months = timeRange === '3months'
    ? 3
    : timeRange === '6months'
    ? 6
    : timeRange === '24months'
    ? 24
    : 12;

  const { data: growthData = [], isLoading: isGrowthLoading } = useQuery({
    queryKey: ['company-growth', scopeFilter, tenantId, filters, months],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_growth', {
        p_scope: scopeFilter,
        p_tenant_id: tenantId,
        p_filters: filters,
        p_months: months
      });
      if (error) throw error;
      return (data || []) as GrowthData[];
    },
    staleTime: cacheTtlMs
  });

  if (isLoading || isGrowthLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Company Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading growth data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Company Growth Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
                <SelectItem value="24months">24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'line' ? (
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="new_companies" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="New Companies"
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Total Companies"
              />
            </LineChart>
          ) : (
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="new_companies" fill="#8884d8" name="New Companies" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompanyGrowthChart;
