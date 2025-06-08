
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Play, Pause, Trash2, Zap } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  created_at: string;
}

interface AutomationRulesManagerProps {
  workflowId: string;
}

const AutomationRulesManager: React.FC<AutomationRulesManagerProps> = ({ workflowId }) => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Priority Escalation',
      trigger: 'form_submitted',
      condition: 'priority = high',
      action: 'send_slack_notification',
      isActive: true,
      created_at: '2024-01-15T10:00:00Z'
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    condition: '',
    action: ''
  });

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return;

    const rule: AutomationRule = {
      id: Date.now().toString(),
      ...newRule,
      isActive: true,
      created_at: new Date().toISOString()
    };

    setRules([...rules, rule]);
    setNewRule({ name: '', trigger: '', condition: '', action: '' });
    setIsCreating(false);
  };

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Automation Rules</h3>
          <p className="text-sm text-muted-foreground">
            Create intelligent rules to automate form processing
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {isCreating && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Create Automation Rule</CardTitle>
            <CardDescription>
              Define when and how this rule should execute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., High Priority Alert"
                />
              </div>
              <div>
                <Label htmlFor="rule-trigger">Trigger Event</Label>
                <Select 
                  value={newRule.trigger} 
                  onValueChange={(value) => setNewRule({ ...newRule, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form_submitted">Form Submitted</SelectItem>
                    <SelectItem value="field_updated">Field Updated</SelectItem>
                    <SelectItem value="status_changed">Status Changed</SelectItem>
                    <SelectItem value="time_elapsed">Time Elapsed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-condition">Condition (Optional)</Label>
                <Input
                  id="rule-condition"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  placeholder="e.g., priority = 'high'"
                />
              </div>
              <div>
                <Label htmlFor="rule-action">Action</Label>
                <Select 
                  value={newRule.action} 
                  onValueChange={(value) => setNewRule({ ...newRule, action: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_email">Send Email</SelectItem>
                    <SelectItem value="send_slack_notification">Slack Notification</SelectItem>
                    <SelectItem value="create_task">Create Task</SelectItem>
                    <SelectItem value="update_status">Update Status</SelectItem>
                    <SelectItem value="call_webhook">Call Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateRule}>
                Create Rule
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
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
                Create your first automation rule to streamline form processing.
              </p>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Zap className={`h-4 w-4 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        When <code>{rule.trigger}</code>
                        {rule.condition && (
                          <span> and <code>{rule.condition}</code></span>
                        )}
                        <span> then <code>{rule.action}</code></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRule(rule.id)}
                    >
                      {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationRulesManager;
