
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useRealTimeDocumentation } from '@/hooks/documentation/useRealTimeDocumentation';

export function RealTimeDocumentationStatus() {
  const {
    isInitialized,
    isMonitoring,
    documentationChanges,
    clearChanges,
    refreshData
  } = useRealTimeDocumentation();

  const getStatusIcon = () => {
    if (!isInitialized) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (isMonitoring) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (!isInitialized) return 'Initializing...';
    if (isMonitoring) return 'Active & Monitoring';
    return 'Inactive';
  };

  const getStatusColor = () => {
    if (!isInitialized) return 'destructive';
    if (isMonitoring) return 'default';
    return 'secondary';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Real-Time Documentation System
            </CardTitle>
            <CardDescription>
              Automatically analyzes your codebase and generates live documentation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor() as any}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recent Changes</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChanges}
                disabled={documentationChanges.length === 0}
              >
                Clear History
              </Button>
            </div>
          </div>
          
          {documentationChanges.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recent documentation changes
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {documentationChanges.map((change, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {change.documentPath.replace('docs/', '').replace('.md', '')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(change.timestamp).toLocaleString()}
                      {change.changeType && ` • ${change.changeType}`}
                    </div>
                  </div>
                  <Badge
                    variant={change.updateType === 'auto' ? 'secondary' : 'default'}
                    className="ml-2"
                  >
                    {change.updateType}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
