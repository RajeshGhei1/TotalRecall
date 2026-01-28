
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Treemap } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyScope } from '@/hooks/useCompanies';
import { Building2, TrendingUp } from 'lucide-react';

interface IndustryData {
  name: string;
  count: number;
  percentage: number;
  size?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

interface IndustrySectorChartProps {
  scopeFilter: CompanyScope;
  tenantId: string | null;
  filters: Record<string, unknown>;
  cacheTtlMs: number;
  isLoading?: boolean;
}

const IndustrySectorChart: React.FC<IndustrySectorChartProps> = ({
  scopeFilter,
  tenantId,
  filters,
  cacheTtlMs,
  isLoading
}) => {
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'treemap'>('pie');
  const [industryField, setIndustryField] = useState<'industry' | 'industry1' | 'companysector'>('industry');

  const dimension = industryField === 'companysector' ? 'companysector' : 'industry1';

  const { data: industryData = [], isLoading: isIndustryLoading } = useQuery({
    queryKey: ['industry-distribution', scopeFilter, tenantId, filters, dimension],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_distribution', {
        p_scope: scopeFilter,
        p_tenant_id: tenantId,
        p_dimension: dimension,
        p_filters: filters,
        p_top: 50
      });
      if (error) throw error;
      const items = (data || []) as Array<{ name: string; count: number }>;
      const total = items.reduce((sum, item) => sum + item.count, 0);
      return items.map((item) => ({
        name: item.name,
        count: item.count,
        percentage: total ? Math.round((item.count / total) * 100) : 0,
        size: item.count
      }));
    },
    staleTime: cacheTtlMs
  });

  if (isLoading || isIndustryLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Industry Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading industry data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomizedContent = (props: unknown) => {
    const { root, depth, x, y, width, height, index, payload } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: COLORS[index % COLORS.length],
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            fillOpacity: 0.7,
          }}
        />
        {width > 60 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {payload.name}
          </text>
        )}
        {width > 60 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 15}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
          >
            {payload.count}
          </text>
        )}
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Industry Sector Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Select value={industryField} onValueChange={(value: unknown) => setIndustryField(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="industry1">Primary</SelectItem>
                <SelectItem value="companysector">Sector</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: unknown) => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="treemap">Treemap</SelectItem>
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
                data={industryData.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {industryData.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : chartType === 'bar' ? (
            <BarChart data={industryData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          ) : (
            <Treemap
              data={industryData.slice(0, 15)}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedContent />}
            />
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IndustrySectorChart;
