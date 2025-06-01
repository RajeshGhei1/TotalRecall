
import React from 'react';
import { Brain, BarChart3, Cog, TrendingUp, Search } from 'lucide-react';
import { AIAgentType } from '@/types/ai';

const agentTypeIcons = {
  cognitive: Brain,
  predictive: TrendingUp,
  automation: Cog,
  analysis: BarChart3,
  deep_research: Search
};

const agentTypeColors = {
  cognitive: 'bg-blue-500',
  predictive: 'bg-purple-500',
  automation: 'bg-green-500',
  analysis: 'bg-orange-500',
  deep_research: 'bg-red-500'
};

interface AgentTypeIconProps {
  type: AIAgentType;
}

export const AgentTypeIcon = ({ type }: AgentTypeIconProps) => {
  const IconComponent = agentTypeIcons[type];
  const colorClass = agentTypeColors[type];

  return (
    <div className={`p-2 rounded-lg ${colorClass}`}>
      <IconComponent className="h-5 w-5 text-white" />
    </div>
  );
};
