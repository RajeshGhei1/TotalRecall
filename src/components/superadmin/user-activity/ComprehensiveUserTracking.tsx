import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Monitor, 
  Activity, 
  Clock, 
  MapPin, 
  Smartphone, 
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield
} from 'lucide-react';
import ActiveUsersWidget from './ActiveUsersWidget';
import UserSessionViewer from './UserSessionViewer';
import AuditLogTest from './AuditLogTest';
import { useUserSessionStats } from '@/hooks/audit/useUserSessions';
import { useAuditLogStats } from '@/hooks/audit/useAuditLogs';

interface ComprehensiveUserTrackingProps {
  tenantId?: string;
}

const ComprehensiveUserTracking: React.FC<ComprehensiveUserTrackingProps> = ({ 
  tenantId 
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(tenantId);
  const { data: sessionStats } = useUserSessionStats(selectedTenantId);
  const { data: auditStats } = useAuditLogStats(selectedTenantId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessionStats?.activeSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessionStats?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {sessionStats?.uniqueUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {sessionStats?.avgSessionDuration || 0}m
            </div>
            <p className="text-xs text-muted-foreground">
              Average duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="active-users" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Active Users
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Real-time Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveUsersWidget tenantId={selectedTenantId} />
              </CardContent>
            </Card>

            {/* Device & Location Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Device & Location Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Top Devices</h4>
                  <div className="space-y-2">
                    {sessionStats?.topDevices?.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{device.device}</span>
                        </div>
                        <Badge variant="secondary">{device.count}</Badge>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No device data available</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Top Locations</h4>
                  <div className="space-y-2">
                    {sessionStats?.topLocations?.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{location.location}</span>
                        </div>
                        <Badge variant="secondary">{location.count}</Badge>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No location data available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Recent Audit Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {auditStats?.criticalLogs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {auditStats?.highLogs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">High</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {auditStats?.mediumLogs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {auditStats?.lowLogs || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveUsersWidget tenantId={selectedTenantId} />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Real-time User Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Monitor active users across all tenants with real-time updates. 
                The widget automatically refreshes every 30 seconds to show current online users.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Real-time active user count</li>
                  <li>• Auto-refresh every 30 seconds</li>
                  <li>• Tenant-specific filtering</li>
                  <li>• Last 24 hours activity</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <UserSessionViewer 
            selectedTenantId={selectedTenantId} 
            onTenantChange={setSelectedTenantId}
          />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <AuditLogTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveUserTracking; 