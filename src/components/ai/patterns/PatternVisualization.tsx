
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PatternRecognitionResult, WorkflowInefficiency, PredictiveInsight } from '@/services/ai/patternRecognition/advancedPatternRecognitionService';

interface PatternVisualizationProps {
  patterns: PatternRecognitionResult[];
  inefficiencies: WorkflowInefficiency[];
  insights: PredictiveInsight[];
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const PatternVisualization: React.FC<PatternVisualizationProps> = ({
  patterns,
  inefficiencies,
  insights,
  className = ''
}) => {
  // Prepare data for pattern types distribution
  const patternTypeData = patterns.reduce((acc, pattern) => {
    acc[pattern.patternType] = (acc[pattern.patternType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patternTypeChartData = Object.entries(patternTypeData).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    value: count
  }));

  // Prepare data for severity distribution
  const severityData = patterns.reduce((acc, pattern) => {
    acc[pattern.severity] = (acc[pattern.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityChartData = Object.entries(severityData).map(([severity, count]) => ({
    name: severity,
    count
  }));

  // Prepare data for confidence distribution
  const confidenceRanges = ['0-0.5', '0.5-0.7', '0.7-0.8', '0.8-1.0'];
  const confidenceData = confidenceRanges.map(range => {
    const [min, max] = range.split('-').map(Number);
    const count = patterns.filter(p => p.confidence >= min && p.confidence < max).length;
    return { name: range, count };
  });

  // Prepare data for inefficiency types
  const inefficiencyTypeData = inefficiencies.reduce((acc, inefficiency) => {
    acc[inefficiency.type] = (acc[inefficiency.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inefficiencyChartData = Object.entries(inefficiencyTypeData).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    count
  }));

  // Prepare data for insight categories
  const insightCategoryData = insights.reduce((acc, insight) => {
    acc[insight.category] = (acc[insight.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const insightChartData = Object.entries(insightCategoryData).map(([category, count]) => ({
    name: category,
    count
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pattern Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Type Distribution</CardTitle>
          <CardDescription>Breakdown of recognized pattern types</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patternTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {patternTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pattern Severity</CardTitle>
            <CardDescription>Distribution by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Confidence Ranges</CardTitle>
            <CardDescription>Pattern confidence distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Inefficiencies */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Inefficiencies</CardTitle>
            <CardDescription>Types of detected inefficiencies</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inefficiencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insight Categories</CardTitle>
            <CardDescription>Distribution of predictive insights</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={insightChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Confidence Over Time */}
      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pattern Confidence Analysis</CardTitle>
            <CardDescription>Average confidence by pattern type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patternTypeChartData.map(item => ({
                name: item.name,
                avgConfidence: patterns
                  .filter(p => p.patternType.replace(/_/g, ' ') === item.name)
                  .reduce((sum, p) => sum + p.confidence, 0) / 
                  patterns.filter(p => p.patternType.replace(/_/g, ' ') === item.name).length
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Avg Confidence']} />
                <Bar dataKey="avgConfidence" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
