
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  BarChart3, 
  Cog, 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2,
  Activity,
  Clock,
  DollarSign,
  Target,
  Users
} from 'lucide-react';
import { useAIAgents } from '@/hooks/ai/useAIAgents';
import { useAIPerformance } from '@/hooks/ai/useAIPerformance';
import { AIAgent } from '@/types/ai';
import { CreateAIAgentDialog } from './CreateAIAgentDialog';
import { EditAIAgentDialog } from './EditAIAgentDialog';

const agentTypeIcons = {
  cognitive: Brain,
  predictive: TrendingUp,
  automation: Cog,
  analysis: BarChart3
};

const agentTypeColors = {
  cognitive: 'bg-blue-500',
  predictive: 'bg-purple-500',
  automation: 'bg-green-500',
  analysis: 'bg-orange-500'
};

export const AIAgentManagement = () => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { agents, isLoading, toggleAgentStatus, deleteAgent } = useAIAgents();
  const { aggregatedMetrics } = useAIPerformance();

  const handleToggleStatus = async (agent: AIAgent) => {
    await toggleAgentStatus.mutateAsync({
      id: agent.id,
      isActive: !agent.is_active
    });
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this AI agent?')) {
      await deleteAgent.mutateAsync(agentId);
    }
  };

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Agent Management</h2>
          <p className="text-gray-600">Manage and monitor your AI agents</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{agents.filter(a => a.is_active).length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{aggregatedMetrics?.avgResponseTime.toFixed(0) || 0}ms</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">${aggregatedMetrics?.totalCost.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = agentTypeIcons[agent.type];
          const colorClass = agentTypeColors[agent.type];
          
          return (
            <Card key={agent.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>{agent.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={agent.is_active}
                      onCheckedChange={() => handleToggleStatus(agent)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                  <Badge variant="outline">
                    {agent.type}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Capabilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAgent(agent)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CreateAIAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedAgent && (
        <EditAIAgentDialog
          agent={selectedAgent}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedAgent(null);
          }}
        />
      )}
    </div>
  );
};
