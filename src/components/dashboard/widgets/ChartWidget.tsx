
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface ChartWidgetProps {
  type: 'line_chart' | 'bar_chart' | 'pie_chart';
  data: any[];
  config: {
    title: string;
    x_axis?: string;
    y_axis?: string;
    data_column?: string;
    label_column?: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ChartWidget: React.FC<ChartWidgetProps> = ({ type, data, config }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.x_axis || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={config.y_axis || 'value'} 
                stroke="#8884d8" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.x_axis || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.y_axis || 'value'} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.data_column || 'value'}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unknown chart type</div>;
    }
  };

  return renderChart();
};

export default ChartWidget;
