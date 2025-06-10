
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, TrendingUp } from 'lucide-react';

interface GrowthData {
  period: string;
  total: number;
  new_companies: number;
  cumulative: number;
}

const CompanyGrowthChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12months');
  const [chartType, setChartType] = useState('line');

  const { data: growthData = [], isLoading } = useQuery({
    queryKey: ['company_growth', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '12months':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        case '24months':
          startDate.setFullYear(endDate.getFullYear() - 2);
          break;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      if (error) throw error;

      // Process data by month
      const monthlyData: Record<string, number> = {};
      data?.forEach(company => {
        const month = new Date(company.created_at).toISOString().slice(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      // Convert to chart format
      const chartData: GrowthData[] = [];
      let cumulative = 0;
      
      const months = Object.keys(monthlyData).sort();
      months.forEach(month => {
        cumulative += monthlyData[month];
        chartData.push({
          period: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: monthlyData[month],
          new_companies: monthlyData[month],
          cumulative
        });
      });

      return chartData;
    }
  });

  if (isLoading) {
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
