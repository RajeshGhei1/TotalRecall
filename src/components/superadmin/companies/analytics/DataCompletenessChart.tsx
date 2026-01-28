
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Company } from '@/hooks/useCompanies';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CompletenessData {
  field: string;
  label: string;
  filled: number;
  total: number;
  percentage: number;
}

interface DataCompletenessChartProps {
  companies: Company[];
  isLoading?: boolean;
}

const DataCompletenessChart: React.FC<DataCompletenessChartProps> = ({ companies, isLoading }) => {
  const completenessData = useMemo(() => {
    const total = companies.length || 0;
      
    const fieldsToCheck = [
      { field: 'email', label: 'Email' },
      { field: 'phone', label: 'Phone' },
      { field: 'website', label: 'Website' },
      { field: 'description', label: 'Description' },
      { field: 'industry', label: 'Industry' },
      { field: 'size', label: 'Company Size' },
      { field: 'location', label: 'Location' },
      { field: 'linkedin', label: 'LinkedIn' },
      { field: 'founded', label: 'Founded Year' },
      { field: 'country', label: 'Country' },
    ];

    const data = fieldsToCheck.map(({ field, label }) => {
      const filled = companies.filter(company =>
        company[field as keyof Company] && company[field as keyof Company] !== ''
      ).length;
      
      return {
        field,
        label,
        filled,
        total,
        percentage: total ? Math.round((filled / total) * 100) : 0
      };
    });

    return data.sort((a, b) => b.percentage - a.percentage);
  }, [companies]);

  const overallScore = completenessData.length > 0 
    ? Math.round(completenessData.reduce((sum, item) => sum + item.percentage, 0) / completenessData.length)
    : 0;

  // Function to get color based on percentage
  const getBarColor = (percentage: number) => {
    if (percentage > 80) return '#22c55e';
    if (percentage > 60) return '#eab308';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Data Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading completeness data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Data Completeness Analysis
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{overallScore}%</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          {overallScore < 70 && (
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Needs Improvement</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bars for each field */}
        <div className="space-y-4">
          {completenessData.map((item) => (
            <div key={item.field} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.filled}/{item.total} ({item.percentage}%)
                </span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Chart visualization */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completenessData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="label" type="category" width={80} />
              <Tooltip 
                formatter={(value: unknown) => [`${value}%`, 'Completeness']}
                labelFormatter={(label) => `Field: ${label}`}
              />
              <Bar dataKey="percentage">
                {completenessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCompletenessChart;
