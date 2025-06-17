
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Settings, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu
} from 'lucide-react';

interface AiOrchestrationProps {
  showAgents?: boolean;
  showMetrics?: boolean;
  showLogs?: boolean;
  mode?: 'full' | 'dashboard' | 'monitoring';
}

const AiOrchestration: React.FC<AiOrchestrationProps> = ({
  showAgents = true,
  showMetrics = true,
  showLogs = true,
  mode = 'full'
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const agents = [
    {
      id: '1',
      name: 'Recruitment AI',
      status: 'active',
      type: 'recruitment',
      requests: 1245,
      accuracy: 94.2,
      lastActive: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Content Analyzer',
      status: 'active',
      type: 'analysis',
      requests: 856,
      accuracy: 97.8,
      lastActive: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Workflow Assistant',
      status: 'idle',
      type: 'automation',
      requests: 342,
      accuracy: 89.5,
      lastActive: '1 hour ago'
    },
    {
      id: '4',
      name: 'Data Processor',
      status: 'error',
      type: 'processing',
      requests: 0,
      accuracy: 0,
      lastActive: '3 hours ago'
    }
  ];

  const systemMetrics = [
    { label: 'Total Requests', value: '12.4K', change: '+23%', icon: Zap },
    { label: 'Active Agents', value: '8', change: '+2', icon: Brain },
    { label: 'Avg Response Time', value: '245ms', change: '-12%', icon: Clock },
    { label: 'Success Rate', value: '97.2%', change: '+1.2%', icon: CheckCircle }
  ];

  const recentLogs = [
    {
      id: '1',
      timestamp: '14:23:45',
      agent: 'Recruitment AI',
      action: 'Candidate Analysis',
      status: 'success',
      duration: '1.2s'
    },
    {
      id: '2',
      timestamp: '14:22:10',
      agent: 'Content Analyzer',
      action: 'Document Processing',
      status: 'success',
      duration: '0.8s'
    },
    {
      id: '3',
      timestamp: '14:20:33',
      agent: 'Data Processor',
      action: 'Batch Update',
      status: 'error',
      duration: '5.2s'
    },
    {
      id: '4',
      timestamp: '14:19:15',
      agent: 'Workflow Assistant',
      action: 'Task Automation',
      status: 'success',
      duration: '2.1s'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {showMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{metric.change}</span> from last hour
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">AI Orchestration Online</h3>
              <p className="text-sm text-green-700">All core systems operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Agents</h3>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(agent.status)}
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{agent.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Requests:</span>
                  <span className="font-medium">{agent.requests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium">{agent.accuracy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span className="font-medium">{agent.lastActive}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Button size="sm" variant="outline">
          View All Logs
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.agent}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{log.timestamp}</span>
                      <span>Duration: {log.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (mode === 'dashboard') {
    return renderOverview();
  }

  if (mode === 'monitoring') {
    return renderLogs();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Orchestration</h1>
        <Button>
          <Cpu className="h-4 w-4 mr-2" />
          System Status
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {showAgents && <TabsTrigger value="agents">Agents</TabsTrigger>}
          {showLogs && <TabsTrigger value="logs">Activity</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        {showAgents && (
          <TabsContent value="agents" className="mt-6">
            {renderAgents()}
          </TabsContent>
        )}

        {showLogs && (
          <TabsContent value="logs" className="mt-6">
            {renderLogs()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(AiOrchestration as any).moduleMetadata = {
  id: 'ai-orchestration',
  name: 'AI Orchestration',
  category: 'ai',
  version: '1.0.0',
  description: 'Central AI system management and orchestration platform',
  author: 'System',
  requiredPermissions: ['read', 'admin'],
  dependencies: [],
  props: {
    showAgents: { type: 'boolean', default: true },
    showMetrics: { type: 'boolean', default: true },
    showLogs: { type: 'boolean', default: true },
    mode: { type: 'string', options: ['full', 'dashboard', 'monitoring'], default: 'full' }
  }
};

export default AiOrchestration;
