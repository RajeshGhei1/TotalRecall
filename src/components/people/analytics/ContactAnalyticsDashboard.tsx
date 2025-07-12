
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building, TrendingUp, Calendar, Phone, Mail } from 'lucide-react';

const ContactAnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['contact-analytics'],
    queryFn: async () => {
      // Get basic counts
      const { data: totalContacts } = await supabase
        .from('people')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'contact');

      const { data: contactsWithCompanies } = await supabase
        .from('company_relationships')
        .select('id', { count: 'exact', head: true })
        .eq('is_current', true);

      const { data: recentContacts } = await supabase
        .from('people')
        .select('created_at')
        .eq('type', 'contact')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Get contact distribution by company
      const { data: companyDistribution } = await supabase
        .from('company_relationships')
        .select(`
          company_id,
          companies:company_id (name)
        `)
        .eq('is_current', true)
        .limit(10);

      // Get contact creation trends (last 6 months)
      const { data: trends } = await supabase
        .from('people')
        .select('created_at')
        .eq('type', 'contact')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      return {
        totalContacts: totalContacts?.length || 0,
        contactsWithCompanies: contactsWithCompanies?.length || 0,
        recentContacts: recentContacts?.length || 0,
        companyDistribution: companyDistribution || [],
        trends: trends || []
      };
    },
  });

  const processCompanyData = (data: unknown[]) => {
    const companyCount: Record<string, number> = {};
    data.forEach((item: unknown) => {
      const companyName = item.companies?.name || 'Unknown';
      companyCount[companyName] = (companyCount[companyName] || 0) + 1;
    });

    return Object.entries(companyCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const processTrendsData = (trends: unknown[]) => {
    const monthlyCount: Record<string, number> = {};
    trends.forEach((contact: unknown) => {
      const month = new Date(contact.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    });

    return Object.entries(monthlyCount).map(([month, count]) => ({ month, count }));
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const companyData = processCompanyData(analytics?.companyDistribution || []);
  const trendsData = processTrendsData(analytics?.trends || []);
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{analytics?.totalContacts || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Companies</p>
                <p className="text-2xl font-bold">{analytics?.contactsWithCompanies || 0}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Added This Month</p>
                <p className="text-2xl font-bold">{analytics?.recentContacts || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage Rate</p>
                <p className="text-2xl font-bold">
                  {analytics?.totalContacts ? 
                    Math.round((analytics.contactsWithCompanies / analytics.totalContacts) * 100) : 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution">Company Distribution</TabsTrigger>
          <TabsTrigger value="trends">Growth Trends</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Companies by Contact Count</CardTitle>
                <CardDescription>Distribution of contacts across companies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={companyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Distribution</CardTitle>
                <CardDescription>Visual breakdown by company</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={companyData.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {companyData.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Growth Trends</CardTitle>
              <CardDescription>New contacts added over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Methods</CardTitle>
                <CardDescription>Available contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email Addresses</span>
                  </div>
                  <Badge variant="secondary">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>Phone Numbers</span>
                  </div>
                  <Badge variant="secondary">65%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Quality</CardTitle>
                <CardDescription>Contact profile completeness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Complete Profiles</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>LinkedIn Profiles</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactAnalyticsDashboard;
