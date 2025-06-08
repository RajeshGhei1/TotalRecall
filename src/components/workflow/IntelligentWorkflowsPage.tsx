
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContextualWorkflowSuggestions } from '@/components/ai/workflow/ContextualWorkflowSuggestions';
import { useAuth } from '@/contexts/AuthContext';

const IntelligentWorkflowsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intelligent Workflows</h1>
        <p className="text-muted-foreground">
          AI-powered workflow automation and optimization
        </p>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="automations">Active Automations</TabsTrigger>
          <TabsTrigger value="analytics">Workflow Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContextualWorkflowSuggestions
              module="forms"
              formType="recruitment"
              userId={user?.id || 'anonymous'}
              tenantId="default-tenant"
            />
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900">Process Efficiency</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Identified 3 workflow steps that can be automated to save 2 hours daily.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900">Smart Routing</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      AI can intelligently route tasks based on team member expertise and availability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Automations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Form Validation Automation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically validates and routes form submissions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Response Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      AI generates contextual email responses
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ContextualWorkflowSuggestions
            module="automation"
            userId={user?.id || 'anonymous'}
            tenantId="default-tenant"
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Workflows Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Time Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">46h</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Automation accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentWorkflowsPage;
