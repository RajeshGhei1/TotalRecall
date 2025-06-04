
import React from 'react';
import { AIAgent } from '@/types/ai';
import { AgentCard } from './AgentCard';

interface AgentGridProps {
  agents: AIAgent[];
  onToggleStatus: (agent: AIAgent) => void;
  onEdit: (agent: AIAgent) => void;
  onDelete: (agentId: string) => void;
}

export const AgentGrid = ({ agents, onToggleStatus, onEdit, onDelete }: AgentGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
