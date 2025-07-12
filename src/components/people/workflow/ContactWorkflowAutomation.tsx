
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Mail, 
  Calendar, 
  Bell,
  GitBranch,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface WorkflowRule {
  id: string;
  name: string;
  trigger: 'contact_created' | 'company_linked' | 'data_updated' | 'scheduled';
  actions: string[];
  isActive: boolean;
  conditions: Record<string, unknown>;
}

const ContactWorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Welcome New Contacts',
      trigger: 'contact_created',
      actions: ['send_welcome_email', 'create_follow_up_task'],
      isActive: true,
      conditions: { type: 'contact' }
    },
    {
      id: '2',
      name: 'LinkedIn Profile Enrichment',
      trigger: 'contact_created',
      actions: ['enrich_linkedin_profile', 'update_company_info'],
      isActive: true,
      conditions: { has_email: true }
    },
    {
      id: '3',
      name: 'Monthly Contact Review',
      trigger: 'scheduled',
      actions: ['generate_contact_report', 'check_stale_contacts'],
      isActive: false,
      conditions: { schedule: 'monthly' }
    }
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id ? { ...workflow, isActive: !workflow.isActive } : workflow
    ));
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'contact_created': return <Zap className="h-4 w-4" />;
      case 'company_linked': return <GitBranch className="h-4 w-4" />;
      case 'data_updated': return <Bell className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('email')) return 'bg-blue-100 text-blue-800';
    if (action.includes('task')) return 'bg-green-100 text-green-800';
    if (action.includes('enrich')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatActionName = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Contact Workflow Automation</h3>
        <p className="text-sm text-muted-foreground">
          Automate repetitive tasks and keep your contact data up-to-date
        </p>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTriggerIcon(workflow.trigger)}
                    <div>
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        Trigger: {workflow.trigger.replace(/_/g, ' ')}
                        <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Actions</h5>
                    <div className="flex flex-wrap gap-2">
                      {workflow.actions.map((action, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className={getActionBadgeColor(action)}
                        >
                          {formatActionName(action)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Last executed: 2 hours ago</span>
                    <span>Success rate: 95%</span>
                    <span>Avg. execution time: 1.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium mb-2">Create New Workflow</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Automate contact management tasks with custom workflows
                </p>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'New Contact Onboarding',
                description: 'Welcome email + profile enrichment + task creation',
                icon: <Mail className="h-6 w-6" />,
                category: 'Onboarding'
              },
              {
                name: 'Data Enrichment Pipeline',
                description: 'LinkedIn search + company matching + profile updates',
                icon: <GitBranch className="h-6 w-6" />,
                category: 'Data Quality'
              },
              {
                name: 'Engagement Tracking',
                description: 'Email opens + meeting scheduling + follow-up reminders',
                icon: <Bell className="h-6 w-6" />,
                category: 'Engagement'
              },
              {
                name: 'Quarterly Review',
                description: 'Contact health check + data validation + cleanup tasks',
                icon: <Calendar className="h-6 w-6" />,
                category: 'Maintenance'
              }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">127</div>
                <div className="text-sm text-muted-foreground">Workflows Executed Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">96%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg. Execution Time</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>Recent workflow execution history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { workflow: 'Welcome New Contacts', status: 'success', time: '2 min ago', duration: '1.2s' },
                  { workflow: 'LinkedIn Profile Enrichment', status: 'success', time: '5 min ago', duration: '3.1s' },
                  { workflow: 'Welcome New Contacts', status: 'failed', time: '12 min ago', duration: '0.8s' },
                  { workflow: 'Data Enrichment Pipeline', status: 'success', time: '18 min ago', duration: '4.2s' }
                ].map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        execution.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium">{execution.workflow}</div>
                        <div className="text-sm text-muted-foreground">{execution.time}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {execution.duration}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactWorkflowAutomation;
