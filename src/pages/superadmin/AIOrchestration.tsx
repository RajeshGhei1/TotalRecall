
import React, { useEffect } from 'react';
import { AIOrchestrationManager } from '@/components/superadmin/ai/AIOrchestrationManager';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';

const AIOrchestration: React.FC = () => {
  useEffect(() => {
    // Initialize the AI orchestration service when the page loads
    aiOrchestrationService.initialize();
  }, []);

  return <AIOrchestrationManager />;
};

export default AIOrchestration;
