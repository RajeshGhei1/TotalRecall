
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity,
  Package,
  Settings,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Zap,
  Monitor,
  BarChart3
} from 'lucide-react';
import { OptimizedModuleInfo } from '@/hooks/useOptimizedModuleDiscovery';

interface ModuleStatusViewerProps {
  module: OptimizedModuleInfo;
  onClose: () => void;
}

const ModuleStatusViewer: React.FC<ModuleStatusViewerProps> = ({ module, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [moduleStatus, setModuleStatus] = useState({
    isRunning: module.status === 'active',
    health: 'healthy' as 'healthy' | 'warning' | 'error',
    uptime: '2h 34m',
    memoryUsage: '45MB',
    cpuUsage: '12%',
    activeConnections: 8,
    lastActivity: new Date(),
    errors: 0,
    warnings: 1
  });

  const handleOpenModule = () => {
    if (module.route) {
      // Open module in new tab/window
      window.open(module.route, '_blank');
    }
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    // Simulate status refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setModuleStatus(prev => ({
      ...prev,
      lastActivity: new Date(),
      activeConnections: Math.floor(Math.random() * 20) + 1
    }));
    setIsLoading(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefreshStatus}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="logs">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="mt-6">
                <div className="space-y-6">
                  {/* Health Status */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getHealthColor(moduleStatus.health)} border`}>
                            {getHealthIcon(moduleStatus.health)}
                            <span className="ml-1 capitalize">{moduleStatus.health}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Health Status</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{moduleStatus.uptime}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uptime</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{moduleStatus.activeConnections}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Active Users</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">
                            {moduleStatus.lastActivity.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last Activity</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resource Usage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Resource Usage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Memory</span>
                            <span>{moduleStatus.memoryUsage}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>CPU</span>
                            <span>{moduleStatus.cpuUsage}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '12%'}}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {module.route && (
                          <Button 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={handleOpenModule}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Module
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure Module
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Monitor className="h-4 w-4 mr-2" />
                          View Logs
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="configuration" className="mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Module Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Module ID:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">{module.id}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version:</span>
                          <span>{module.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="capitalize">{module.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access Method:</span>
                          <Badge variant="outline">{module.accessMethod}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Dependencies</h3>
                      {module.dependencies && module.dependencies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {module.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No dependencies</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">127</div>
                        <p className="text-xs text-gray-500">Total Requests</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">98.5%</div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">234ms</div>
                        <p className="text-xs text-gray-500">Avg Response</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{moduleStatus.errors}</div>
                        <p className="text-xs text-gray-500">Errors</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Performance Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500 text-sm flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Performance charts would be displayed here
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[
                        { time: '14:32:15', level: 'INFO', message: 'Module started successfully' },
                        { time: '14:30:22', level: 'INFO', message: 'Configuration loaded' },
                        { time: '14:29:45', level: 'WARN', message: 'High memory usage detected' },
                        { time: '14:25:33', level: 'INFO', message: 'User authenticated' },
                        { time: '14:23:11', level: 'INFO', message: 'Database connection established' }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm py-1">
                          <span className="text-gray-500 font-mono text-xs">{log.time}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              log.level === 'WARN' ? 'border-yellow-300 text-yellow-700' : 
                              log.level === 'ERROR' ? 'border-red-300 text-red-700' : 
                              'border-blue-300 text-blue-700'
                            }`}
                          >
                            {log.level}
                          </Badge>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleStatusViewer;
