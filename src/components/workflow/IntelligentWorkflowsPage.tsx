
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTenantContext } from '@/contexts/TenantContext';
import FormWorkflowManager from '@/components/forms/workflow/FormWorkflowManager';
import ContextualWorkflowSuggestions from '@/components/ai/workflow/ContextualWorkflowSuggestions';
import WorkflowHealthWidget from '@/components/dashboard/widgets/WorkflowHealthWidget';
import { Zap, Brain, BarChart3, Settings, Plus } from 'lucide-react';

const IntelligentWorkflowsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedTenantId } = useTenantContext();

  const handleSuggestionApplied = (suggestionId: string) => {
    console.log('Applied suggestion:', suggestionId);
    // Refresh workflow data or show success notification
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligent Workflows</h1>
          <p className="text-muted-foreground">
            AI-powered automation and optimization for your business processes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkflowHealthWidget tenantId={selectedTenantId} />
            <ContextualWorkflowSuggestions
              context={{
                module: 'workflows',
                tenantId: selectedTenantId
              }}
              onSuggestionApplied={handleSuggestionApplied}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common workflow management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Brain className="h-6 w-6" />
                  <span>AI Optimization</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Automation Rules</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Performance Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <FormWorkflowManager />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContextualWorkflowSuggestions
              context={{
                module: 'ai_insights',
                tenantId: selectedTenantId
              }}
              onSuggestionApplied={handleSuggestionApplied}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Insights
                </CardTitle>
                <CardDescription>
                  What AI has learned about your workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Pattern Recognition</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      AI has identified 3 recurring workflow patterns that could be automated
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Success Factors</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Workflows with pre-validation steps show 40% higher success rates
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Optimization Opportunity</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Parallel processing could reduce execution time by 35%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Executions</span>
                      <span className="font-medium">1,247</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">94.3%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Avg. Duration</span>
                      <span className="font-medium">2.4 min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Time Saved</span>
                      <span className="font-medium text-green-600">847 hours</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Error Reduction</span>
                      <span className="font-medium text-green-600">68%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Savings</span>
                      <span className="font-medium text-green-600">$12,450</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Onboarding Flow</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Document Processing</span>
                    <span className="font-medium">96.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approval Routing</span>
                    <span className="font-medium">94.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentWorkflowsPage;
