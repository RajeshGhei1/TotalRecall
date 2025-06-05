
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, BarChart3, Cog } from 'lucide-react';
import { useAISystem } from '@/hooks/ai/useAISystem';

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'cognitive':
      return <Brain className="h-4 w-4" />;
    case 'predictive':
      return <BarChart3 className="h-4 w-4" />;
    case 'automation':
      return <Cog className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

export const AIAgentsList = () => {
  const { agents, isLoadingAgents } = useAISystem();

  if (isLoadingAgents) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Agents</CardTitle>
          <CardDescription>Loading agents...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agents</CardTitle>
        <CardDescription>
          {agents.length} agents loaded ({agents.filter(a => a.isActive).length} active)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No agents configured</p>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    {getAgentIcon(agent.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{agent.name}</h4>
                    <p className="text-sm text-gray-600">
                      {agent.capabilities.join(', ') || 'No capabilities defined'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{agent.type}</Badge>
                  <Badge variant={agent.isActive ? 'default' : 'secondary'}>
                    {agent.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
