
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditLogs, useAuditLogStats } from '@/hooks/audit/useAuditLogs';
import { useUserSessions, useUserSessionStats } from '@/hooks/audit/useUserSessions';
import { useTenantContext } from '@/contexts/TenantContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AuditLogFilters, UserSessionFilters } from '@/types/audit';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Users, 
  Calendar,
  Filter,
  Download,
  Search
} from 'lucide-react';

const SecurityAuditDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [auditFilters, setAuditFilters] = useState<AuditLogFilters>({
    action: '',
    entity_type: '',
    severity: undefined,
    search: '',
    date_from: '',
    date_to: ''
  });
  const [sessionFilters, setSessionFilters] = useState<UserSessionFilters>({
    is_active: undefined,
    login_method: '',
    search: '',
    date_from: '',
    date_to: ''
  });

  const { selectedTenantId } = useTenantContext();
  
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs(auditFilters);
  const { data: auditStats } = useAuditLogStats(selectedTenantId);
  const { data: userSessions, isLoading: sessionsLoading } = useUserSessions(sessionFilters);
  const { data: sessionStats } = useUserSessionStats(selectedTenantId);

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
            <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Security Audit Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system security, user activities, and audit logs
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="user-sessions">User Sessions</TabsTrigger>
          <TabsTrigger value="security-metrics">Security Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Audit Logs</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditStats?.totalLogs || 0}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditStats?.criticalLogs || 0}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessionStats?.activeSessions || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sessionStats?.uniqueUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Activity Trends</CardTitle>
                <CardDescription>Daily audit log volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={Object.entries(auditStats?.activityByDay || {}).map(([date, count]) => ({ 
                    date, 
                    count: typeof count === 'number' ? count : 0 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
                <CardDescription>Most frequent audit events</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={auditStats?.topActions || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search actions, entities..."
                    value={auditFilters.search || ''}
                    onChange={(e) => setAuditFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Severity</label>
                  <Select 
                    value={auditFilters.severity || ''} 
                    onValueChange={(value) => setAuditFilters(prev => ({ 
                      ...prev, 
                      severity: value === '' ? undefined : value as 'low' | 'medium' | 'high' | 'critical'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All severities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Entity Type</label>
                  <Input
                    placeholder="e.g., user, form, report"
                    value={auditFilters.entity_type || ''}
                    onChange={(e) => setAuditFilters(prev => ({ ...prev, entity_type: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Action</label>
                  <Input
                    placeholder="e.g., CREATE, UPDATE, DELETE"
                    value={auditFilters.action || ''}
                    onChange={(e) => setAuditFilters(prev => ({ ...prev, action: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>
                {auditLoading ? 'Loading...' : `${auditLogs?.data?.length || 0} logs found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs?.data?.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          log.severity === 'critical' ? 'destructive' :
                          log.severity === 'high' ? 'destructive' :
                          log.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {log.severity}
                        </Badge>
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground">on {log.entity_type}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {log.profiles?.email || 'System'} • {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.ip_address}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-sessions" className="space-y-6">
          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Sessions"
              value={sessionStats?.totalSessions || 0}
              subtitle="Last 7 days"
              icon={Activity}
            />
            <MetricCard
              title="Average Duration"
              value={`${sessionStats?.avgSessionDuration || 0}m`}
              subtitle="Session length"
              icon={Calendar}
            />
            <MetricCard
              title="Active Now"
              value={sessionStats?.activeSessions || 0}
              subtitle="Currently online"
              icon={Users}
              color="success"
            />
          </div>

          {/* Session Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select 
                    value={sessionFilters.is_active?.toString() || ''} 
                    onValueChange={(value) => setSessionFilters(prev => ({ 
                      ...prev, 
                      is_active: value === '' ? undefined : value === 'true' 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All sessions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All sessions</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Login Method</label>
                  <Input
                    placeholder="e.g., email, oauth"
                    value={sessionFilters.login_method}
                    onChange={(e) => setSessionFilters(prev => ({ ...prev, login_method: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search IP, user agent..."
                    value={sessionFilters.search}
                    onChange={(e) => setSessionFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Sessions</CardTitle>
              <CardDescription>
                {sessionsLoading ? 'Loading...' : `${userSessions?.data?.length || 0} sessions found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userSessions?.data?.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={session.is_active ? 'default' : 'secondary'}>
                          {session.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="font-medium">{session.profiles?.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Login: {new Date(session.login_at).toLocaleString()} • 
                        Method: {session.login_method}
                        {session.logout_at && ` • Logout: ${new Date(session.logout_at).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.ip_address}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Session distribution by device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessionStats?.topDevices?.map((device, index) => (
                    <div key={`device-${index}`} className="flex justify-between items-center">
                      <span>{device.device}</span>
                      <Badge variant="outline">{device.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Audit log severity levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Critical</span>
                    <Badge variant="destructive">{auditStats?.criticalLogs || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>High</span>
                    <Badge variant="destructive">{auditStats?.highLogs || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium</span>
                    <Badge variant="default">{auditStats?.mediumLogs || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low</span>
                    <Badge variant="secondary">{auditStats?.lowLogs || 0}</Badge>
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

export default SecurityAuditDashboard;
