
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Edit, Copy } from 'lucide-react';

interface EmailTemplatesManagerProps {
  tenantId: string;
}

const EmailTemplatesManager: React.FC<EmailTemplatesManagerProps> = ({ tenantId }) => {
  const templates = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}',
      description: 'Email sent to new candidates when they join',
      type: 'candidate_welcome'
    },
    {
      id: '2',
      name: 'Interview Invitation',
      subject: 'Interview Invitation - {{job_title}}',
      description: 'Email sent to invite candidates for interviews',
      type: 'interview_invitation'
    },
    {
      id: '3',
      name: 'Application Confirmation',
      subject: 'Application Received - {{job_title}}',
      description: 'Confirmation email sent when application is received',
      type: 'application_confirmation'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Email Templates</h3>
          <p className="text-sm text-muted-foreground">
            Manage email templates for automated communications
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm">
                <strong>Subject:</strong> {template.subject}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplatesManager;
