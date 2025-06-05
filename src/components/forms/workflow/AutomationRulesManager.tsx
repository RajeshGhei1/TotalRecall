
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { automationEngineService, AutomationRule, AutomationTrigger, AutomationCondition, AutomationAction } from '@/services/ai/workflow';
import { Plus, Play, Pause, Settings, Trash2, Zap, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationRulesManagerProps {
  workflowId: string;
}

export const AutomationRulesManager: React.FC<AutomationRulesManagerProps> = ({ workflowId }) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    trigger: { type: 'workflow_start', configuration: {} },
    conditions: [],
    actions: [],
    isActive: true,
    priority: 1
  });
  const { toast } = useToast();

  const createRule = async () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a name and description for the automation rule.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const createdRule = await automationEngineService.createAutomationRule({
        name: newRule.name!,
        description: newRule.description!,
        trigger: newRule.trigger!,
        conditions: newRule.conditions!,
        actions: newRule.actions!,
        isActive: newRule.isActive!,
        priority: newRule.priority!
      });

      setRules([...rules, createdRule]);
      setNewRule({
        name: '',
        description: '',
        trigger: { type: 'workflow_start', configuration: {} },
        conditions: [],
        actions: [],
        isActive: true,
        priority: 1
      });
      setIsCreating(false);

      toast({
        title: 'Success',
        description: 'Automation rule created successfully.',
      });
    } catch (error) {
      console.error('Failed to create automation rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create automation rule.',
        variant: 'destructive',
      });
    }
  };

  const addCondition = () => {
    const newCondition: AutomationCondition = {
      field: 'status',
      operator: 'equals',
      value: ''
    };
    setNewRule(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }));
  };

  const addAction = () => {
    const newAction: AutomationAction = {
      type: 'send_notification',
      configuration: {}
    };
    setNewRule(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction]
    }));
  };

  const updateCondition = (index: number, field: keyof AutomationCondition, value: any) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const updateAction = (index: number, field: keyof AutomationAction, value: any) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const removeCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index)
    }));
  };

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index)
    }));
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'workflow_start': return Play;
      case 'step_completion': return Settings;
      case 'error_detected': return AlertCircle;
      case 'time_based': return Settings;
      case 'user_action': return Zap;
      default: return Settings;
    }
  };

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'send_notification': return AlertCircle;
      case 'assign_task': return Settings;
      case 'update_status': return Settings;
      case 'auto_approve': return Settings;
      default: return Settings;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <p className="text-muted-foreground">Create rules to automate workflow actions</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {isCreating && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create Automation Rule</CardTitle>
            <CardDescription>
              Define conditions and actions for automatic workflow processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Auto-approve simple requests"
                />
              </div>
              <div>
                <Label htmlFor="rule-priority">Priority</Label>
                <Select
                  value={String(newRule.priority)}
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, priority: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">High (1)</SelectItem>
                    <SelectItem value="2">Medium (2)</SelectItem>
                    <SelectItem value="3">Low (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                value={newRule.description || ''}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this rule does..."
              />
            </div>

            <div>
              <Label>Trigger</Label>
              <Select
                value={newRule.trigger?.type}
                onValueChange={(value) => setNewRule(prev => ({
                  ...prev,
                  trigger: { type: value as any, configuration: {} }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow_start">Workflow Start</SelectItem>
                  <SelectItem value="step_completion">Step Completion</SelectItem>
                  <SelectItem value="error_detected">Error Detected</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="user_action">User Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Conditions</Label>
                <Button onClick={addCondition} variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Condition
                </Button>
              </div>
              
              <div className="space-y-2">
                {newRule.conditions?.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Input
                      placeholder="Field"
                      value={condition.field}
                      onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, 'operator', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="not_empty">Not Empty</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeCondition(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Actions</Label>
                <Button onClick={addAction} variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Action
                </Button>
              </div>
              
              <div className="space-y-2">
                {newRule.actions?.map((action, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Select
                      value={action.type}
                      onValueChange={(value) => updateAction(index, 'type', value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_notification">Send Notification</SelectItem>
                        <SelectItem value="assign_task">Assign Task</SelectItem>
                        <SelectItem value="update_status">Update Status</SelectItem>
                        <SelectItem value="auto_approve">Auto Approve</SelectItem>
                        <SelectItem value="escalate">Escalate</SelectItem>
                        <SelectItem value="skip_step">Skip Step</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Configuration (JSON)"
                      value={JSON.stringify(action.configuration)}
                      onChange={(e) => {
                        try {
                          const config = JSON.parse(e.target.value);
                          updateAction(index, 'configuration', config);
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeAction(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newRule.isActive}
                onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>Rule is active</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={createRule}>
                Create Rule
              </Button>
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Automation Rules</h3>
              <p className="text-muted-foreground">
                Create automation rules to streamline your workflow processes.
              </p>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => {
            const TriggerIcon = getTriggerIcon(rule.trigger.type);
            return (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TriggerIcon className="h-4 w-4" />
                      <CardTitle className="text-base">{rule.name}</CardTitle>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">Priority {rule.priority}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleRuleStatus(rule.id)}
                        variant="outline"
                        size="sm"
                      >
                        {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Trigger</h5>
                      <Badge variant="outline">{rule.trigger.type.replace('_', ' ')}</Badge>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Conditions ({rule.conditions.length})</h5>
                      <div className="space-y-1">
                        {rule.conditions.slice(0, 2).map((condition, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            {condition.field} {condition.operator} {condition.value}
                          </div>
                        ))}
                        {rule.conditions.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{rule.conditions.length - 2} more...
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Actions ({rule.actions.length})</h5>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action.type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
