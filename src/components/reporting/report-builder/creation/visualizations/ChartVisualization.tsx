
import React from 'react';
import {
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { FieldOption } from '../../hooks/useReportFields';

interface ChartVisualizationProps {
  visualizationType: string;
  data: any[];
  columns: string[];
  availableFields: FieldOption[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const ChartVisualization: React.FC<ChartVisualizationProps> = ({
  visualizationType,
  data,
  columns,
  availableFields
}) => {
  if (!data || data.length === 0 || columns.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No data available for visualization
      </div>
    );
  }

  // Get field labels for better display
  const getFieldLabel = (field: string) => {
    const fieldOption = availableFields.find(f => f.value === field);
    return fieldOption?.label || field;
  };

  // Prepare chart configuration
  const chartConfig = columns.reduce((config, column) => {
    config[column] = {
      label: getFieldLabel(column),
      theme: {
        light: COLORS[Object.keys(config).length % COLORS.length],
        dark: COLORS[Object.keys(config).length % COLORS.length]
      }
    };
    return config;
  }, {} as Record<string, any>);

  // Render based on visualization type
  switch (visualizationType) {
    case 'bar':
      return (
        <div className="h-96 w-full mt-6">
          <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={columns[0]} 
                tick={{ fontSize: 12 }}
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {columns.slice(1).map((column, index) => (
                <Bar 
                  key={column} 
                  dataKey={column} 
                  fill={COLORS[index % COLORS.length]} 
                  name={getFieldLabel(column)}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      );

    case 'pie':
      // For pie charts, we need to transform the data
      const pieData = data.map(item => ({
        name: String(item[columns[0]]),
        value: Number(item[columns[1]] || 0)
      }));

      return (
        <div className="h-96 w-full mt-6">
          <ChartContainer config={{}}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
      );

    case 'line':
      return (
        <div className="h-96 w-full mt-6">
          <ChartContainer config={chartConfig}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={columns[0]} 
                tick={{ fontSize: 12 }}
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {columns.slice(1).map((column, index) => (
                <Line 
                  key={column} 
                  type="monotone" 
                  dataKey={column} 
                  stroke={COLORS[index % COLORS.length]} 
                  activeDot={{ r: 8 }}
                  name={getFieldLabel(column)}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      );

    default:
      return null;
  }
};

export default ChartVisualization;
