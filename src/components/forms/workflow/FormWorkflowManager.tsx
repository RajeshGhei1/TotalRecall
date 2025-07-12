import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormWorkflows, useCreateFormWorkflow, useFormNotifications } from '@/hooks/forms/useFormWorkflows';
import { useFormDefinitions } from '@/hooks/forms/useFormDefinitions';
import { useTenantContext } from '@/contexts/TenantContext';
import { FormWorkflow, WorkflowStep } from '@/types/form-builder';
import { Plus, Settings, Play, Pause, Trash2, Mail, Webhook, Database, GitBranch, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIWorkflowOptimizer from './AIWorkflowOptimizer';
import AutomationRulesManager from './AutomationRulesManager';

const FormWorkflowManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger_conditions: {},
    workflow_steps: [] as WorkflowStep[]
  });

  const { selectedTenantId } = useTenantContext();
  const { data: forms = [] } = useFormDefinitions(selectedTenantId);
  const { data: workflows = [] } = useFormWorkflows(selectedFormId);
  const { data: notifications = [] } = useFormNotifications();
  const createWorkflowMutation = useCreateFormWorkflow();
  const { toast } = useToast();

  const handleCreateWorkflow = async () => {
    if (!selectedFormId || !newWorkflow.name) {
      toast({
        title: 'Validation Error',
        description: 'Please select a form and provide a workflow name',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createWorkflowMutation.mutateAsync({
        form_id: selectedFormId,
        name: newWorkflow.name,
        description: newWorkflow.description,
        trigger_conditions: newWorkflow.trigger_conditions,
        workflow_steps: newWorkflow.workflow_steps,
        is_active: true
      });

      setNewWorkflow({
        name: '',
        description: '',
        trigger_conditions: {},
        workflow_steps: []
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const addWorkflowStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      step_type: 'notification',
      type: 'notification',
      action: 'send_email',
      step_config: {},
      config: {},
      order_index: newWorkflow.workflow_steps.length,
      order: newWorkflow.workflow_steps.length
    };
    setNewWorkflow(prev => ({
      ...prev,
      workflow_steps: [...prev.workflow_steps, newStep]
    }));
  };

  const updateWorkflowStep = (index: number, step: WorkflowStep) => {
    setNewWorkflow(prev => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((s, i) => i === index ? step : s)
    }));
  };

  const removeWorkflowStep = (index: number) => {
    setNewWorkflow(prev => ({
      ...prev,
      workflow_steps: prev.workflow_steps.filter((_, i) => i !== index)
    }));
  };

  const handleOptimizationApplied = (optimizedSteps: unknown[]) => {
    if (workflows.length > 0) {
      toast({
        title: 'Workflow Optimized',
        description: 'AI optimizations have been applied to your workflow.',
      });
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'notification': return Mail;
      case 'webhook': return Webhook;
      case 'data_processing': return Database;
      case 'condition': return GitBranch;
      default: return Settings;
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'notification': return 'bg-blue-100 text-blue-800';
      case 'webhook': return 'bg-green-100 text-green-800';
      case 'data_processing': return 'bg-purple-100 text-purple-800';
      case 'condition': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Intelligent Workflow Management</h2>
          <p className="text-muted-foreground">AI-enhanced workflow automation and optimization</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={!selectedFormId}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="form-select">Select Form</Label>
        <Select value={selectedFormId} onValueChange={setSelectedFormId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Choose a form to manage workflows" />
          </SelectTrigger>
          <SelectContent>
            {forms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {form.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCreating && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
            <CardDescription>
              Set up automated processes for form responses with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Customer Support Routing"
                />
              </div>
              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Workflow Steps</Label>
                <Button onClick={addWorkflowStep} variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              
              <div className="space-y-3">
                {newWorkflow.workflow_steps.map((step, index) => {
                  const StepIcon = getStepIcon(step.type);
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded ${getStepTypeColor(step.type)}`}>
                        <StepIcon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <Select
                          value={step.type}
                          onValueChange={(value) => updateWorkflowStep(index, { 
                            ...step, 
                            type: value,
                            step_type: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notification">Notification</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="data_processing">Data Processing</SelectItem>
                            <SelectItem value="condition">Condition</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={step.action}
                          onChange={(e) => updateWorkflowStep(index, { ...step, action: e.target.value })}
                          placeholder="Action name"
                        />
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => removeWorkflowStep(index)}
                            variant="outline"
                            size="sm"
                            className="px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {newWorkflow.workflow_steps.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No workflow steps defined. Add steps to automate form processing.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateWorkflow}
                disabled={createWorkflowMutation.isPending}
              >
                Create Workflow
              </Button>
              <Button 
                onClick={() => setIsCreating(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="ai-optimizer">
            <Brain className="h-4 w-4 mr-1" />
            AI Optimizer
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-1" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {workflows.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Workflows</h3>
                <p className="text-muted-foreground">
                  {selectedFormId 
                    ? "Create your first workflow to automate form processing."
                    : "Select a form to view and manage its workflows."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                            {workflow.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {workflow.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Workflow Steps ({workflow.workflow_steps.length})</Label>
                      <div className="flex flex-wrap gap-2">
                        {workflow.workflow_steps.map((step, index) => {
                          const StepIcon = getStepIcon(step.type);
                          return (
                            <div 
                              key={index}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStepTypeColor(step.type)}`}
                            >
                              <StepIcon className="h-3 w-3" />
                              {step.action}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-optimizer" className="space-y-4">
          {selectedFormId && workflows.length > 0 ? (
            <AIWorkflowOptimizer
              workflowId={workflows[0].id}
              workflowSteps={workflows[0].workflow_steps}
              onOptimizationApplied={handleOptimizationApplied}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">AI Optimizer</h3>
                <p className="text-muted-foreground">
                  {!selectedFormId 
                    ? "Select a form to enable AI optimization features."
                    : "Create a workflow to access AI-powered optimization suggestions."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          {selectedFormId ? (
            <AutomationRulesManager workflowId={selectedFormId} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Automation Rules</h3>
                <p className="text-muted-foreground">
                  Select a form to create and manage automation rules.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Manage email, SMS, and webhook notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p>Notification templates will appear here when workflows are created.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{notification.notification_type}</Badge>
                        <span className="font-medium">{notification.trigger_event}</span>
                        <span className="text-sm text-muted-foreground">
                          {notification.recipients.length} recipient(s)
                        </span>
                      </div>
                      <Badge variant={notification.is_active ? 'default' : 'secondary'}>
                        {notification.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>
                View workflow execution history and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Execution Logs</h3>
                <p>Workflow execution logs will appear here as forms are submitted.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormWorkflowManager;
