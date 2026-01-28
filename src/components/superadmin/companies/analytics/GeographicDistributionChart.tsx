
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Company } from '@/hooks/useCompanies';
import { MapPin, Globe } from 'lucide-react';

interface LocationData {
  name: string;
  count: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface GeographicDistributionChartProps {
  companies: Company[];
  isLoading?: boolean;
}

const GeographicDistributionChart: React.FC<GeographicDistributionChartProps> = ({ companies, isLoading }) => {
  const [viewType, setViewType] = useState<'country' | 'region' | 'city'>('country');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const locationData = useMemo(() => {
    let field: keyof Company = 'location';
    switch (viewType) {
      case 'country':
        field = 'country';
        break;
      case 'region':
        field = 'region';
        break;
      case 'city':
        field = 'location';
        break;
    }

    const locationCounts: Record<string, number> = {};
    companies.forEach(company => {
      const location = (company[field] as string) || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const total = Object.values(locationCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(locationCounts)
      .map(([name, count]) => ({
        name: name || 'Unknown',
        count,
        percentage: total ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [companies, viewType]);

  if (isLoading) {
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
