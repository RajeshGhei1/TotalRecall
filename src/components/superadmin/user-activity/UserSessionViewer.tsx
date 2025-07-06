import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Download, Power, Monitor, Clock, MapPin } from 'lucide-react';
import { useUserSessions, useTerminateSession } from '@/hooks/audit/useUserSessions';
import { UserSessionFilters } from '@/types/user-sessions';
import { format } from 'date-fns';
import TenantSelector from '@/components/superadmin/user-activity/TenantSelector';

interface UserSessionViewerProps {
  selectedTenantId?: string;
  onTenantChange?: (tenantId: string | undefined) => void;
}

const UserSessionViewer: React.FC<UserSessionViewerProps> = ({ 
  selectedTenantId, 
  onTenantChange 
}) => {
  // By default, do not apply any filters (show all sessions)
  const [filters, setFilters] = useState<UserSessionFilters>({});
  const [page, setPage] = useState(1);

  const { data: sessionData, isLoading } = useUserSessions(filters, page);
  const terminateSession = useTerminateSession();

  const handleFilterChange = (key: keyof UserSessionFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setPage(1);
  };

  const handleTenantChange = (tenantId: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      tenant_id: tenantId
    }));
    if (onTenantChange) {
      onTenantChange(tenantId);
    }
    setPage(1);
  };

  const handleTerminateSession = (sessionId: string) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      terminateSession.mutate(sessionId);
    }
  };

  const calculateSessionDuration = (loginAt: string, logoutAt?: string) => {
    const start = new Date(loginAt);
    const end = logoutAt ? new Date(logoutAt) : new Date();
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tenant</label>
              <TenantSelector 
                selectedTenantId={selectedTenantId}
                onTenantChange={handleTenantChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IP, device..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.is_active?.toString() || 'all'} onValueChange={(value) => 
                handleFilterChange('is_active', value === 'all' ? 'all' : value)
              }>
                <SelectTrigger>
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Login Method</label>
              <Select value={filters.login_method || 'all'} onValueChange={(value) => handleFilterChange('login_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="sso">SSO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({});
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionData?.data.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {session.profiles?.full_name || session.profiles?.email || 'Unknown User'}
                              {session.profiles?.role === 'super_admin' && (
                                <Badge variant="destructive" className="ml-2">Super Admin</Badge>
                              )}
                            </div>
                            {session.tenants && (
                              <div className="text-sm text-muted-foreground">
                                {session.tenants.name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={session.is_active ? "default" : "secondary"}>
                            <span className="flex items-center gap-1">
                              {session.is_active ? (
                                <>
                                  <Monitor className="h-3 w-3" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Ended
                                </>
                              )}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(session.login_at), 'MMM dd, HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          {calculateSessionDuration(session.login_at, session.logout_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{session.login_method}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {session.ip_address || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {session.device_info?.type || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {session.is_active && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={terminateSession.isPending}
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Pagination */}
              {sessionData && sessionData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, sessionData.count)} of {sessionData.count} sessions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page} of {sessionData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(sessionData.totalPages, p + 1))}
                      disabled={page === sessionData.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSessionViewer;
