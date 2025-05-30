
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, TrendingUp, Settings } from 'lucide-react';
import { useAIOrchestration } from '@/hooks/ai/useAIOrchestration';
import { useSystemModules } from '@/hooks/useSystemModules';
import { AIAgent } from '@/types/ai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AIOrchestrationManager: React.FC = () => {
  const { agents, agentsLoading, refreshAgents } = useAIOrchestration();
  const { data: modules, isLoading: modulesLoading } = useSystemModules();
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const handleRefreshAgents = () => {
    refreshAgents();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cognitive': return Brain;
      case 'predictive': return TrendingUp;
      case 'automation': return Settings;
      case 'analysis': return Activity;
      default: return Brain;
    }
  };

  // Filter agents based on selected module
  const filteredAgents = selectedModule === 'all' 
    ? agents 
    : agents.filter(agent => {
        // For now, we'll filter by capabilities that might contain module names
        // In a real implementation, you'd have a direct module association
        return agent.capabilities.some(capability => 
          capability.toLowerCase().includes(selectedModule.toLowerCase()) ||
          (selectedModule === 'smart_talent_analytics' && 
           (capability.toLowerCase().includes('talent') || 
            capability.toLowerCase().includes('analytics') ||
            capability.toLowerCase().includes('prediction')))
        );
      });

  if (agentsLoading || modulesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Orchestration</h1>
          <p className="text-muted-foreground">
            Manage AI agents and monitor their performance across the platform
          </p>
        </div>
        <Button onClick={handleRefreshAgents} variant="outline">
          Refresh Agents
        </Button>
      </div>

      {/* Module Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Filter by Module
          </CardTitle>
          <CardDescription>
            Select a module to filter AI agents by their associated capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label htmlFor="module-select" className="text-sm font-medium">
              Module:
            </label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules?.map((module) => (
                  <SelectItem key={module.id} value={module.name}>
                    {module.name === 'smart_talent_analytics' ? 'Smart Talent Analytics' : module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModule !== 'all' && (
              <Badge variant="outline">
                Filtering by: {
                  selectedModule === 'smart_talent_analytics' 
                    ? 'Smart Talent Analytics' 
                    : modules?.find(m => m.name === selectedModule)?.name || selectedModule
                }
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedModule === 'all' ? 'All modules' : `In ${selectedModule}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAgents.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cognitive Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAgents.filter(a => a.type === 'cognitive').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cognitive type
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictive Agents</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredAgents.filter(a => a.type === 'predictive').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Predictive type
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent: AIAgent) => {
              const IconComponent = getTypeIcon(agent.type);
              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <Badge variant="outline">{agent.type}</Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Capabilities</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.capabilities.slice(0, 3).map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {agent.capabilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agent.capabilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {agent.performance_metrics && Object.keys(agent.performance_metrics).length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Performance</p>
                          <div className="text-sm text-muted-foreground">
                            {agent.performance_metrics.accuracy && (
                              <div>Accuracy: {(agent.performance_metrics.accuracy * 100).toFixed(1)}%</div>
                            )}
                            {agent.performance_metrics.response_time && (
                              <div>Response: {agent.performance_metrics.response_time}ms</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredAgents.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {selectedModule === 'all' ? 'No AI Agents Found' : `No AI Agents for ${selectedModule}`}
                </h3>
                <p className="text-muted-foreground">
                  {selectedModule === 'all' 
                    ? 'AI agents will appear here once they are configured and activated.'
                    : `No AI agents are currently associated with the ${selectedModule} module.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
              <CardDescription>
                Monitor the performance and effectiveness of AI agents across the platform
                {selectedModule !== 'all' && ` for ${selectedModule} module`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI agents, models, and orchestration settings
                {selectedModule !== 'all' && ` for ${selectedModule} module`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                AI configuration interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
