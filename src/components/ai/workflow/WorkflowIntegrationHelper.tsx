
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Building2, BriefcaseIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkflowIntegrationHelperProps {
  context: {
    module: string;
    entityType?: string;
    entityId?: string;
    tenantId?: string;
  };
}

const WorkflowIntegrationHelper: React.FC<WorkflowIntegrationHelperProps> = ({ context }) => {
  const navigate = useNavigate();

  const getWorkflowSuggestions = () => {
    switch (context.module) {
      case 'people':
        return [
          {
            title: 'Employee Onboarding',
            description: 'Automate document collection, IT setup, and training scheduling',
            icon: Users,
            urgency: 'high'
          },
          {
            title: 'Performance Review',
            description: 'Schedule regular reviews and feedback collection',
            icon: Users,
            urgency: 'medium'
          }
        ];
      case 'companies':
        return [
          {
            title: 'Company Verification',
            description: 'Automated business registration and compliance checks',
            icon: Building2,
            urgency: 'high'
          },
          {
            title: 'Partnership Setup',
            description: 'Streamline contract and partnership workflows',
            icon: Building2,
            urgency: 'medium'
          }
        ];
      case 'ats':
        return [
          {
            title: 'Candidate Screening',
            description: 'AI-powered resume screening and initial assessment',
            icon: BriefcaseIcon,
            urgency: 'high'
          },
          {
            title: 'Interview Scheduling',
            description: 'Automated interview coordination and follow-ups',
            icon: BriefcaseIcon,
            urgency: 'medium'
          }
        ];
      default:
        return [
          {
            title: 'General Automation',
            description: 'Create custom workflows for this module',
            icon: Zap,
            urgency: 'low'
          }
        ];
    }
  };

  const suggestions = getWorkflowSuggestions();

  const handleCreateWorkflow = (suggestionTitle: string) => {
    navigate('/tenant-admin/intelligent-workflows', {
      state: { 
        suggestion: suggestionTitle,
        context: context
      }
    });
  };

  return (
    <Card className="border-dashed border-2 border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Zap className="h-5 w-5" />
          Workflow Automation Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-purple-700 mb-4">
          AI has identified automation opportunities for this {context.module} module:
        </p>
        
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <IconComponent className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <Badge 
                      variant={suggestion.urgency === 'high' ? 'destructive' : 
                              suggestion.urgency === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {suggestion.urgency} priority
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateWorkflow(suggestion.title)}
                className="border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                Setup <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          );
        })}

        <div className="pt-2 border-t">
          <Button
            onClick={() => navigate('/tenant-admin/intelligent-workflows')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            View All Workflow Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowIntegrationHelper;
