
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, Target, Calendar, PlayCircle } from 'lucide-react';

const TalentPredictiveAnalytics: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('retention');
  const [timeframe, setTimeframe] = useState('6months');

  // Mock data for different predictive models
  const retentionData = [
    { month: 'Jan', predicted: 92, actual: 90 },
    { month: 'Feb', predicted: 91, actual: 89 },
    { month: 'Mar', predicted: 93, actual: 92 },
    { month: 'Apr', predicted: 89, actual: null },
    { month: 'May', predicted: 88, actual: null },
    { month: 'Jun', predicted: 90, actual: null }
  ];

  const hiringDemandData = [
    { skill: 'AI/ML', demand: 85, currentSupply: 45 },
    { skill: 'Cloud', demand: 78, currentSupply: 62 },
    { skill: 'DevOps', demand: 72, currentSupply: 55 },
    { skill: 'Data Science', demand: 90, currentSupply: 38 },
    { skill: 'Mobile Dev', demand: 65, currentSupply: 70 }
  ];

  const performanceData = [
    { name: 'High Performers', value: 25, color: '#10B981' },
    { name: 'Above Average', value: 35, color: '#3B82F6' },
    { name: 'Average', value: 30, color: '#F59E0B' },
    { name: 'Below Average', value: 10, color: '#EF4444' }
  ];

  const runPrediction = () => {
    console.log(`Running ${selectedModel} prediction for ${timeframe}`);
    // TODO: Integrate with AI service
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predictive Models
            </CardTitle>
            <Button onClick={runPrediction} className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Run Prediction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose prediction model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retention">Talent Retention</SelectItem>
                  <SelectItem value="performance">Performance Trends</SelectItem>
                  <SelectItem value="hiring">Hiring Demand</SelectItem>
                  <SelectItem value="skills">Skills Evolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent Retention Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Talent Retention Prediction
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">94% Accuracy</Badge>
            <Badge variant="secondary">Updated Daily</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  name="Actual Retention"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="Predicted Retention"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-muted-foreground">Current Retention</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-muted-foreground">6-Month Prediction</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">-3%</div>
              <div className="text-sm text-muted-foreground">Predicted Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Demand Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Skills Demand vs Supply Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringDemandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#EF4444" name="Market Demand" />
                <Bar dataKey="currentSupply" fill="#10B981" name="Current Supply" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Hiring Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded border-l-4 border-red-400">
                <span className="text-sm">Critical shortage in AI/ML talent</span>
                <Badge variant="destructive">High Priority</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <span className="text-sm">Data Science skills gap widening</span>
                <Badge variant="outline">Medium Priority</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded border-l-4 border-green-400">
                <span className="text-sm">Mobile development well-staffed</span>
                <Badge variant="secondary">Low Priority</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Performance Distribution Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">AI Prediction</h4>
            <p className="text-sm text-blue-800">
              Based on current trends, high performer percentage is expected to increase by 3% 
              over the next 6 months through targeted development programs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentPredictiveAnalytics;
