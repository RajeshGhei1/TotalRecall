
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AIOrchestrationManager } from '@/components/superadmin/ai/AIOrchestrationManager';
import { aiInitializationService } from '@/services/ai/aiInitializationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const AIOrchestration: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await aiInitializationService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Error loading system status:', error);
    }
  };

  const handleInitializeAI = async () => {
    setIsInitializing(true);
    setInitError(null);
    
    try {
      await aiInitializationService.initializeAIFoundation();
      await loadSystemStatus();
    } catch (error) {
      console.error('Failed to initialize AI foundation:', error);
      setInitError((error as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleReinitialize = async () => {
    setIsInitializing(true);
    setInitError(null);
    
    try {
      await aiInitializationService.reinitialize();
      await loadSystemStatus();
    } catch (error) {
      console.error('Failed to reinitialize AI foundation:', error);
      setInitError((error as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Orchestration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* AI Foundation Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Foundation Status
                {systemStatus?.initialized ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Initialized
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Not Initialized
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Core AI infrastructure status and initialization controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {initError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{initError}</p>
                </div>
              )}

              {systemStatus && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{systemStatus.agentCount}</div>
                    <div className="text-sm text-gray-600">AI Agents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{systemStatus.healthMetrics?.uptime || 0}%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{systemStatus.cacheMetrics?.cacheHitRate || 0}%</div>
                    <div className="text-sm text-gray-600">Cache Hit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{systemStatus.healthMetrics?.healthyModels || 0}</div>
                    <div className="text-sm text-gray-600">Healthy Models</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!systemStatus?.initialized ? (
                  <Button 
                    onClick={handleInitializeAI} 
                    disabled={isInitializing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isInitializing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Initialize AI Foundation
                  </Button>
                ) : (
                  <Button 
                    onClick={handleReinitialize} 
                    disabled={isInitializing}
                    variant="outline"
                  >
                    {isInitializing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Reinitialize System
                  </Button>
                )}
                
                <Button 
                  onClick={loadSystemStatus} 
                  variant="outline"
                  disabled={isInitializing}
                >
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {systemStatus?.initialized && <AIOrchestrationManager />}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIOrchestration;
