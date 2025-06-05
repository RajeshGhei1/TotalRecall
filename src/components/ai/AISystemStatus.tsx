
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useAISystem } from '@/hooks/ai/useAISystem';

export const AISystemStatus = () => {
  const {
    initializationResult,
    metrics,
    agents,
    isInitializing,
    isReinitializing,
    isRefreshingAgents,
    isInitialized,
    reinitialize,
    refreshAgents
  } = useAISystem();

  const handleReinitialize = async () => {
    try {
      await reinitialize();
    } catch (error) {
      console.error('Failed to reinitialize AI system:', error);
    }
  };

  const handleRefreshAgents = async () => {
    try {
      await refreshAgents();
    } catch (error) {
      console.error('Failed to refresh agents:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* System Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI System Status
            {isInitialized ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Inactive
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Core AI infrastructure status and controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {initializationResult && (
            <div className="text-sm">
              <p className="font-medium">Initialization Result:</p>
              <p className="text-gray-600">{initializationResult.message}</p>
              {initializationResult.errors && initializationResult.errors.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 text-xs">Errors:</p>
                  <ul className="text-red-700 text-xs">
                    {initializationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleReinitialize}
              disabled={isInitializing || isReinitializing}
              variant="outline"
              size="sm"
            >
              {isReinitializing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Reinitialize
            </Button>
            <Button
              onClick={handleRefreshAgents}
              disabled={isRefreshingAgents}
              variant="outline"
              size="sm"
            >
              {isRefreshingAgents ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Agents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{agents.length}</div>
                <div className="text-sm text-gray-600">Total Agents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.activeAgents}</div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.queueSize}</div>
                <div className="text-sm text-gray-600">Queue Size</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
