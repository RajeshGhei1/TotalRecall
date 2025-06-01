
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { AIAgent } from '@/types/ai';
import { AgentTypeIcon } from './AgentTypeIcon';
import { AgentCapabilitiesList } from './AgentCapabilitiesList';

interface AgentCardProps {
  agent: AIAgent;
  onToggleStatus: (agent: AIAgent) => void;
  onEdit: (agent: AIAgent) => void;
  onDelete: (agentId: string) => void;
}

export const AgentCard = ({ agent, onToggleStatus, onEdit, onDelete }: AgentCardProps) => {
  return (
    <Card key={agent.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <AgentTypeIcon type={agent.type} />
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={agent.is_active}
              onCheckedChange={() => onToggleStatus(agent)}
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

        <AgentCapabilitiesList capabilities={agent.capabilities} />

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(agent)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(agent.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
