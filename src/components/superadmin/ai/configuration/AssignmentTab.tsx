
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AIAgent } from '@/hooks/ai/useUnifiedAIOrchestration';

interface AssignmentTabProps {
  agents: AIAgent[];
  directAssignment: string | null;
  preferredAgents: string[];
  onDirectAssignmentChange: (agentId: string | null) => void;
  onPreferredAgentsChange: (agentIds: string[]) => void;
}

export const AssignmentTab: React.FC<AssignmentTabProps> = ({
  agents,
  directAssignment,
  preferredAgents,
  onDirectAssignmentChange,
  onPreferredAgentsChange
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Direct Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={directAssignment || ''} onValueChange={onDirectAssignmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select agent for direct assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No direct assignment</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Agents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-2">
              <Checkbox
                checked={preferredAgents.includes(agent.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onPreferredAgentsChange([...preferredAgents, agent.id]);
                  } else {
                    onPreferredAgentsChange(preferredAgents.filter(id => id !== agent.id));
                  }
                }}
              />
              <span>{agent.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
