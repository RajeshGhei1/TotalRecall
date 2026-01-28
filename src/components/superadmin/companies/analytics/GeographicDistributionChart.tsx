
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyScope } from '@/hooks/useCompanies';
import { MapPin, Globe } from 'lucide-react';

interface LocationData {
  name: string;
  count: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface GeographicDistributionChartProps {
  scopeFilter: CompanyScope;
  tenantId: string | null;
  filters: Record<string, unknown>;
  cacheTtlMs: number;
  isLoading?: boolean;
}

const GeographicDistributionChart: React.FC<GeographicDistributionChartProps> = ({
  scopeFilter,
  tenantId,
  filters,
  cacheTtlMs,
  isLoading
}) => {
  const [viewType, setViewType] = useState<'country' | 'region' | 'city'>('country');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const dimension = viewType === 'country'
    ? 'country'
    : viewType === 'region'
    ? 'region'
    : 'location';

  const { data: locationData = [], isLoading: isLocationLoading } = useQuery({
    queryKey: ['geographic-distribution', scopeFilter, tenantId, filters, dimension],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_distribution', {
        p_scope: scopeFilter,
        p_tenant_id: tenantId,
        p_dimension: dimension,
        p_filters: filters,
        p_top: 10
      });
      if (error) throw error;
      const items = (data || []) as Array<{ name: string; count: number }>;
      const total = items.reduce((sum, item) => sum + item.count, 0);
      return items.map((item) => ({
        name: item.name,
        count: item.count,
        percentage: total ? Math.round((item.count / total) * 100) : 0
      }));
    },
    staleTime: cacheTtlMs
  });

  if (isLoading || isLocationLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading geographic data...
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
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <div className="flex gap-2">
            <Select value={viewType} onValueChange={(value: unknown) => setViewType(value)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="city">City</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: unknown) => setChartType(value)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <BarChart data={locationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GeographicDistributionChart;
