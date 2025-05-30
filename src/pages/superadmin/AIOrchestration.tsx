
import React, { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AIOrchestrationManager } from '@/components/superadmin/ai/AIOrchestrationManager';
import { aiOrchestrationService } from '@/services/ai/orchestrationService';

const AIOrchestration: React.FC = () => {
  useEffect(() => {
    // Initialize the AI orchestration service when the page loads
    const initializeService = async () => {
      try {
        await aiOrchestrationService.initialize();
      } catch (error) {
        console.error('Failed to initialize AI orchestration service:', error);
      }
    };

    initializeService();
  }, []);

  return (
    <ErrorBoundary>
      <AIOrchestrationManager />
    </ErrorBoundary>
  );
};

export default AIOrchestration;
