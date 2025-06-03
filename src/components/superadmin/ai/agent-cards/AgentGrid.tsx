
import React from 'react';
import { AgentCard } from './AgentCard';
import { AIAgent } from '@/types/ai';
import { useAIPerformance } from '@/hooks/ai/useAIPerformance';

interface AgentGridProps {
  agents: AIAgent[];
  onToggleStatus: (agent: AIAgent) => void;
  onEdit: (agent: AIAgent) => void;
  onDelete: (agentId: string) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const { performanceMetrics } = useAIPerformance();

  const getPerformanceData = (agentId: string) => {
    return performanceMetrics.find(metric => metric.agent_id === agentId);
  };

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No AI agents found</div>
        <div className="text-sm text-gray-400">Create your first AI agent to get started</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          performanceData={getPerformanceData(agent.id)}
        />
      ))}
    </div>
  );
};
