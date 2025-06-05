
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  name: string;
  type: string;
}

interface AssignmentTabProps {
  agents: Agent[];
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
  const addPreferredAgent = (agentId: string) => {
    if (!preferredAgents.includes(agentId)) {
      onPreferredAgentsChange([...preferredAgents, agentId]);
    }
  };

  const removePreferredAgent = (index: number) => {
    const updated = preferredAgents.filter((_, i) => i !== index);
    onPreferredAgentsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="direct-assignment">Direct Agent Assignment</Label>
        <Select 
          value={directAssignment || ''} 
          onValueChange={(value) => onDirectAssignmentChange(value || null)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select an agent (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No direct assignment (use preferences)</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} ({agent.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-600 mt-1">
          Direct assignment overrides all other selection logic
        </p>
      </div>

      <div>
        <Label>Preferred Agents (in order of preference)</Label>
        <div className="space-y-2 mt-2">
          {preferredAgents.map((agentId, index) => (
            <div key={agentId} className="flex items-center justify-between p-2 border rounded">
              <span>{agents.find(a => a.id === agentId)?.name || agentId}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removePreferredAgent(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          
          <Select onValueChange={addPreferredAgent}>
            <SelectTrigger>
              <SelectValue placeholder="Add preferred agent" />
            </SelectTrigger>
            <SelectContent>
              {agents
                .filter(agent => !preferredAgents.includes(agent.id))
                .map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name} ({agent.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
