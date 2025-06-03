
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Search, 
  Microscope,
  Power,
  PowerOff,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';
import { AIAgent } from '@/types/ai';

interface AgentCardProps {
  agent: AIAgent;
  onToggleStatus: (agent: AIAgent) => void;
  onEdit: (agent: AIAgent) => void;
  onDelete: (agentId: string) => void;
  performanceData?: {
    success_rate: number;
    average_response_time_ms: number;
    total_requests: number;
  };
}

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'cognitive':
      return Brain;
    case 'predictive':
      return TrendingUp;
    case 'automation':
      return Zap;
    case 'analysis':
      return Search;
    case 'deep_research':
      return Microscope;
    default:
      return Brain;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-gray-500';
    case 'training':
      return 'bg-blue-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onToggleStatus,
  onEdit,
  onDelete,
  performanceData
}) => {
  const Icon = getAgentIcon(agent.type);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${agent.is_active ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Icon className={`h-5 w-5 ${agent.is_active ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {agent.type.replace('_', ' ')}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(agent)}
              className="h-8 w-8 p-0"
            >
              {agent.is_active ? (
                <Power className="h-4 w-4 text-green-600" />
              ) : (
                <PowerOff className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(agent)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(agent.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm line-clamp-2">
          {agent.description || 'No description available'}
        </CardDescription>
        
        {/* Capabilities */}
        <div>
          <h4 className="text-sm font-medium mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability.replace('_', ' ')}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Performance Metrics */}
        {performanceData && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Performance
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-600">Success Rate</div>
                <div className="font-medium">{performanceData.success_rate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600">Avg Response</div>
                <div className="font-medium">{performanceData.average_response_time_ms}ms</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-600">Total Requests</div>
                <div className="font-medium">{performanceData.total_requests}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Model Configuration */}
        <div>
          <h4 className="text-sm font-medium mb-2">Configuration</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Model: {agent.model_config?.model || 'Default'}</div>
            <div>Temperature: {agent.model_config?.temperature || 0.7}</div>
            <div>Max Tokens: {agent.model_config?.max_tokens || 1000}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
