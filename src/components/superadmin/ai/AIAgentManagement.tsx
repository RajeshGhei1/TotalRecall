
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAIAgents } from '@/hooks/ai/useAIAgents';
import { useAIPerformance } from '@/hooks/ai/useAIPerformance';
import { AIAgent } from '@/types/ai';
import { CreateAIAgentDialog } from './CreateAIAgentDialog';
import { EditAIAgentDialog } from './EditAIAgentDialog';
import { AIOverviewMetrics } from './metrics/AIOverviewMetrics';
import { AgentGrid } from './agent-cards/AgentGrid';

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

      <AIOverviewMetrics agents={agents} aggregatedMetrics={aggregatedMetrics} />

      <AgentGrid
        agents={agents}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditAgent}
        onDelete={handleDeleteAgent}
      />

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
