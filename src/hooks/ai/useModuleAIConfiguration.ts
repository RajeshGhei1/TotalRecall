
import { useState, useEffect } from 'react';

export interface ModuleConfig {
  direct_assignment: string | null;
  preferred_agents: string[];
  token_budget: number;
  overage_policy: string;
  performance_weights?: {
    accuracy: number;
    speed: number;
    cost: number;
  };
}

export const useModuleAIConfiguration = (moduleId: string) => {
  const [currentConfig, setCurrentConfig] = useState<ModuleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (moduleId) {
      // Mock loading config
      setTimeout(() => {
        setCurrentConfig({
          direct_assignment: null,
          preferred_agents: [],
          token_budget: 1000,
          overage_policy: 'block',
          performance_weights: {
            accuracy: 0.5,
            speed: 0.3,
            cost: 0.2
          }
        });
        setIsLoading(false);
      }, 500);
    }
  }, [moduleId]);

  const updateModuleConfig = (moduleId: string, updates: Partial<ModuleConfig>) => {
    if (currentConfig) {
      setCurrentConfig({ ...currentConfig, ...updates });
    }
  };

  const saveConfiguration = async (moduleId: string) => {
    setIsSaving(true);
    // Mock save
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return {
    currentConfig,
    updateModuleConfig,
    saveConfiguration,
    isLoading,
    isSaving
  };
};
