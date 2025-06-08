
import { useState, useEffect } from 'react';

export interface ModuleConfig {
  direct_assignment: string | null;
  preferred_agents: string[];
  token_budget: number;
  overage_policy: string;
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
          overage_policy: 'block'
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
