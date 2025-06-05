
import React from 'react';
import { AISystemStatus } from './AISystemStatus';
import { AIAgentsList } from './AIAgentsList';

export const AISystemDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI System Dashboard</h2>
        <p className="text-gray-600">
          Monitor and manage the AI orchestration system
        </p>
      </div>
      
      <AISystemStatus />
      <AIAgentsList />
    </div>
  );
};
