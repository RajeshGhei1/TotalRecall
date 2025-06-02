
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { 
  Settings, 
  Brain, 
  DollarSign, 
  Target, 
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';

export const ModuleAIConfiguration: React.FC = () => {
  const { data: modules, isLoading: modulesLoading } = useSystemModules();
  const { agents, isRequesting } = useUnifiedAIOrchestration();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [activeTab, setActiveTab] = useState('assignments');

  // Mock configuration data - will be replaced with real data
  const [moduleConfigs, setModuleConfigs] = useState<Record<string, any>>({});

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    if (!moduleConfigs[moduleId]) {
      setModuleConfigs(prev => ({
        ...prev,
        [moduleId]: {
          direct_assignment: null,
          preferred_agents: [],
          token_budget: 10000,
          overage_policy: 'warn',
          performance_weights: {
            accuracy: 0.4,
            speed: 0.3,
            cost: 0.3
          }
        }
      }));
    }
  };

  const updateModuleConfig = (moduleId: string, updates: any) => {
    setModuleConfigs(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        ...updates
      }
    }));
  };

  const selectedModuleData = modules?.find(m => m.id === selectedModule);
  const currentConfig = moduleConfigs[selectedModule] || {};

  if (modulesLoading) {
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
        {/* Module Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Module</CardTitle>
            <CardDescription>Choose a module to configure AI settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules?.map((module) => (
              <div
                key={module.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedModule === module.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModuleSelect(module.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{module.name}</h4>
                    <p className="text-sm text-gray-600">{module.category}</p>
                  </div>
                  <Badge variant={module.is_active ? 'default' : 'secondary'}>
                    {module.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          {selectedModule && selectedModuleData ? (
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
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="assignments">Agent Assignment</TabsTrigger>
                    <TabsTrigger value="budget">Token Budget</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="assignments" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="direct-assignment">Direct Agent Assignment</Label>
                        <Select 
                          value={currentConfig.direct_assignment || ''} 
                          onValueChange={(value) => updateModuleConfig(selectedModule, { direct_assignment: value || null })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select an agent (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No direct assignment (use preferences)</SelectItem>
                            {agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} ({agent.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-600 mt-1">
                          Direct assignment overrides all other selection logic
                        </p>
                      </div>

                      <div>
                        <Label>Preferred Agents (in order of preference)</Label>
                        <div className="space-y-2 mt-2">
                          {currentConfig.preferred_agents?.map((agentId: string, index: number) => (
                            <div key={agentId} className="flex items-center justify-between p-2 border rounded">
                              <span>{agents.find(a => a.id === agentId)?.name || agentId}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const updated = currentConfig.preferred_agents.filter((_: any, i: number) => i !== index);
                                  updateModuleConfig(selectedModule, { preferred_agents: updated });
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )) || []}
                          
                          <Select onValueChange={(value) => {
                            const updated = [...(currentConfig.preferred_agents || []), value];
                            updateModuleConfig(selectedModule, { preferred_agents: updated });
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add preferred agent" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents
                                .filter(agent => !currentConfig.preferred_agents?.includes(agent.id))
                                .map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name} ({agent.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="budget" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="token-budget">Monthly Token Budget</Label>
                        <Input
                          id="token-budget"
                          type="number"
                          value={currentConfig.token_budget || 10000}
                          onChange={(e) => updateModuleConfig(selectedModule, { token_budget: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Maximum tokens this module can use per month
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="overage-policy">Overage Policy</Label>
                        <Select 
                          value={currentConfig.overage_policy || 'warn'} 
                          onValueChange={(value) => updateModuleConfig(selectedModule, { overage_policy: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block">Block requests when budget exceeded</SelectItem>
                            <SelectItem value="warn">Allow with warnings</SelectItem>
                            <SelectItem value="charge">Charge for overages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold">$0.00</div>
                          <div className="text-sm text-gray-600">Current Cost</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold">0</div>
                          <div className="text-sm text-gray-600">Tokens Used</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold">0%</div>
                          <div className="text-sm text-gray-600">Budget Used</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Performance Weights (for dynamic selection)</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Accuracy</span>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={currentConfig.performance_weights?.accuracy || 0.4}
                                onChange={(e) => updateModuleConfig(selectedModule, {
                                  performance_weights: {
                                    ...currentConfig.performance_weights,
                                    accuracy: parseFloat(e.target.value)
                                  }
                                })}
                                className="w-20"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Speed</span>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={currentConfig.performance_weights?.speed || 0.3}
                                onChange={(e) => updateModuleConfig(selectedModule, {
                                  performance_weights: {
                                    ...currentConfig.performance_weights,
                                    speed: parseFloat(e.target.value)
                                  }
                                })}
                                className="w-20"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Cost Efficiency</span>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={currentConfig.performance_weights?.cost || 0.3}
                                onChange={(e) => updateModuleConfig(selectedModule, {
                                  performance_weights: {
                                    ...currentConfig.performance_weights,
                                    cost: parseFloat(e.target.value)
                                  }
                                })}
                                className="w-20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-6">
                  <Button disabled={isRequesting}>
                    {isRequesting ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
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
