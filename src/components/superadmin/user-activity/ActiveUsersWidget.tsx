import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { sessionLogger } from '@/services/sessionLogger';
import { useAuth } from '@/contexts/AuthContext';

interface ActiveUsersWidgetProps {
  tenantId?: string;
  refreshInterval?: number; // in milliseconds
}

const ActiveUsersWidget: React.FC<ActiveUsersWidgetProps> = ({ 
  tenantId, 
  refreshInterval = 30000 // 30 seconds
}) => {
  const { user } = useAuth();
  const [activeCount, setActiveCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchActiveCount = async () => {
    setIsLoading(true);
    try {
      const count = await sessionLogger.getActiveUsersCount(tenantId);
      setActiveCount(count);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch active users count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCount();

    // Set up auto-refresh
    const interval = setInterval(fetchActiveCount, refreshInterval);

    return () => clearInterval(interval);
  }, [tenantId, refreshInterval]);

  const handleRefresh = () => {
    fetchActiveCount();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {lastUpdated.toLocaleTimeString()}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : activeCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last 24 hours</span>
            <span className="font-medium">{activeCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Auto-refresh</span>
            <span className="font-medium">{refreshInterval / 1000}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersWidget; 