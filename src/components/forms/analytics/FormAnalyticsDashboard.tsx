
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormAnalyticsSummary, useFormPerformanceAnalytics } from '@/hooks/forms/useFormAnalytics';
import { useFormDefinitions } from '@/hooks/forms/useFormDefinitions';
import { useTenantContext } from '@/contexts/TenantContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Eye, MousePointer, CheckCircle, XCircle, Calendar, Download } from 'lucide-react';

const FormAnalyticsDashboard: React.FC = () => {
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [dateRange, setDateRange] = useState<number>(30);
  const { selectedTenantId } = useTenantContext();
  
  const { data: forms = [] } = useFormDefinitions(selectedTenantId);
  const { data: summary, isLoading: summaryLoading } = useFormAnalyticsSummary(
    selectedFormId,
    dateRange ? {
      start: new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    } : undefined
  );
  const { data: performanceData = [] } = useFormPerformanceAnalytics(selectedFormId, dateRange);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  const pieData = summary ? [
    { name: 'Submissions', value: summary.total_submissions },
    { name: 'Abandons', value: summary.total_abandons },
    { name: 'Views Only', value: summary.total_views - summary.total_starts },
  ] : [];

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend,
    color = 'default'
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    color?: 'default' | 'success' | 'warning' | 'destructive';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(trend)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!selectedFormId && forms.length > 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Analytics Dashboard</CardTitle>
            <CardDescription>
              Select a form to view detailed analytics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Form</label>
                <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a form to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedForm = forms.find(f => f.id === selectedFormId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Form Analytics</h1>
          <p className="text-muted-foreground">
            Analytics for: <Badge variant="outline">{selectedForm?.name}</Badge>
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedFormId} onValueChange={setSelectedFormId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select form" />
            </SelectTrigger>
            <SelectContent>
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateRange.toString()} onValueChange={(value) => setDateRange(parseInt(value))}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={summary?.total_views || 0}
          subtitle="Form page views"
          icon={Eye}
        />
        <MetricCard
          title="Form Starts"
          value={summary?.total_starts || 0}
          subtitle="Users who began filling"
          icon={MousePointer}
        />
        <MetricCard
          title="Submissions"
          value={summary?.total_submissions || 0}
          subtitle="Completed submissions"
          icon={CheckCircle}
          color="success"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${summary?.conversion_rate || 0}%`}
          subtitle="Views to submissions"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
                <CardDescription>Form interactions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="starts" fill="#82ca9d" name="Starts" />
                    <Bar dataKey="submissions" fill="#ffc658" name="Submissions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rates</CardTitle>
                <CardDescription>Success vs abandonment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <Badge variant="outline">{summary?.completion_rate || 0}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Abandon Rate</span>
                    <Badge variant="secondary">{summary?.abandon_rate || 0}%</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey through the form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Form Views</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{summary?.total_views || 0}</div>
                    <div className="text-sm text-muted-foreground">100%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Form Starts</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{summary?.total_starts || 0}</div>
                    <div className="text-sm text-muted-foreground">
                      {summary?.total_views ? Math.round((summary.total_starts / summary.total_views) * 100) : 0}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Submissions</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{summary?.total_submissions || 0}</div>
                    <div className="text-sm text-muted-foreground">{summary?.conversion_rate || 0}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission Trends</CardTitle>
              <CardDescription>Form submission patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Submissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormAnalyticsDashboard;
