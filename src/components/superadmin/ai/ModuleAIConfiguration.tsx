
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSystemModules } from '@/hooks/useSystemModules';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { useModuleAIConfiguration } from '@/hooks/ai/useModuleAIConfiguration';
import { 
  Settings, 
  Brain
} from 'lucide-react';
import { ModuleSelector } from './configuration/ModuleSelector';
import { AssignmentTab } from './configuration/AssignmentTab';
import { BudgetTab } from './configuration/BudgetTab';
import { PerformanceTab } from './configuration/PerformanceTab';

export const ModuleAIConfiguration: React.FC = () => {
  const { data: modules, isLoading: modulesLoading } = useSystemModules();
  const { agents, agentsLoading, error, isInitialized } = useUnifiedAIOrchestration();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [activeTab, setActiveTab] = useState('assignments');

  const {
    currentConfig,
    updateModuleConfig,
    saveConfiguration,
    isSaving,
    isLoading: configLoading
  } = useModuleAIConfiguration(selectedModule);

  const selectedModuleData = modules?.find(m => m.id === selectedModule);

  // Enhanced debug logging
  console.log('ModuleAIConfiguration - Initialization status:', isInitialized);
  console.log('ModuleAIConfiguration - agents:', agents);
  console.log('ModuleAIConfiguration - agentsLoading:', agentsLoading);
  console.log('ModuleAIConfiguration - agents length:', agents?.length);
  console.log('ModuleAIConfiguration - error:', error);

  if (modulesLoading || (agentsLoading && !isInitialized)) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there's an error loading agents
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Module AI Configuration
            </h2>
            <p className="text-gray-600">Configure AI agent assignments and preferences for modules</p>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <p className="text-red-600 mb-2">Error loading AI agents</p>
            <p className="text-sm text-gray-500">{error?.message || 'Unknown error occurred'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveConfiguration = async () => {
    if (selectedModule) {
      await saveConfiguration(selectedModule);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            Module AI Configuration
          </h2>
          <p className="text-gray-600">Configure AI agent assignments and preferences for modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModuleSelector
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />

        <div className="lg:col-span-2">
          {selectedModule && selectedModuleData && currentConfig ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  {selectedModuleData.name} Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI agent preferences and budget settings for this module
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!agents || agents.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">No AI agents available</p>
                    <p className="text-sm text-gray-500">
                      {agentsLoading ? 'Loading agents...' : 'Please create AI agents first in the Agents tab'}
                    </p>
                    {!agentsLoading && isInitialized && (
                      <p className="text-xs text-gray-400 mt-2">
                        Service initialized: {isInitialized ? 'Yes' : 'No'} | Agents loaded: {agents?.length || 0}
                      </p>
                    )}
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="assignments">Agent Assignment</TabsTrigger>
                      <TabsTrigger value="budget">Token Budget</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assignments" className="space-y-4 mt-4">
                      <AssignmentTab
                        agents={agents}
                        directAssignment={currentConfig.direct_assignment}
                        preferredAgents={currentConfig.preferred_agents}
                        onDirectAssignmentChange={(agentId) => 
                          updateModuleConfig(selectedModule, { direct_assignment: agentId })
                        }
                        onPreferredAgentsChange={(agentIds) => 
                          updateModuleConfig(selectedModule, { preferred_agents: agentIds })
                        }
                      />
                    </TabsContent>

                    <TabsContent value="budget" className="space-y-4 mt-4">
                      <BudgetTab
                        tokenBudget={currentConfig.token_budget}
                        overagePolicy={currentConfig.overage_policy}
                        onTokenBudgetChange={(budget) => 
                          updateModuleConfig(selectedModule, { token_budget: budget })
                        }
                        onOveragePolicyChange={(policy) => 
                          updateModuleConfig(selectedModule, { overage_policy: policy })
                        }
                      />
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4 mt-4">
                      <PerformanceTab
                        performanceWeights={currentConfig.performance_weights}
                        onPerformanceWeightsChange={(weights) => 
                          updateModuleConfig(selectedModule, { performance_weights: weights })
                        }
                      />
                    </TabsContent>
                  </Tabs>
                )}

                {agents && agents.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleSaveConfiguration}
                      disabled={isSaving || configLoading}
                    >
                      {isSaving ? 'Saving...' : 'Save Configuration'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Select a module to configure AI settings</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
