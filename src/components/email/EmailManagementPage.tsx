
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIEmailResponseGenerator } from './AIEmailResponseGenerator';
import { EmailContext } from '@/hooks/email/useAIEmailResponse';
import { Mail, Inbox, Send } from 'lucide-react';

// Mock email data for demonstration
const mockEmails: EmailContext[] = [
  {
    sender: 'john.doe@company.com',
    subject: 'Urgent: Project Deadline Extension Request',
    body: 'Hi, I hope this email finds you well. Due to unexpected technical challenges, our team needs to request a 2-week extension for the current project. We have encountered some integration issues that require additional development time. Could we schedule a meeting to discuss this?',
    urgency: 'high',
    category: 'project_management'
  },
  {
    sender: 'customer.service@client.com',
    subject: 'Product Demo Request',
    body: 'Hello, we are interested in learning more about your software solutions. Could you please provide us with a product demonstration? We have a team of 50+ people and are looking for a comprehensive solution.',
    urgency: 'medium',
    category: 'sales'
  },
  {
    sender: 'hr@partner.com',
    subject: 'Partnership Opportunity Discussion',
    body: 'Good morning, we have been following your company and are impressed with your recent innovations. We would like to explore potential partnership opportunities. Are you available for a call next week?',
    urgency: 'low',
    category: 'partnerships'
  }
];

export const EmailManagementPage: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailContext | null>(null);
  const [emailResponse, setEmailResponse] = useState('');

  const handleEmailSelect = (email: EmailContext) => {
    setSelectedEmail(email);
    setEmailResponse('');
  };

  const handleResponseGenerated = (response: string) => {
    setEmailResponse(response);
  };

  const handleSendEmail = () => {
    if (emailResponse && selectedEmail) {
      console.log('Sending email response:', {
        to: selectedEmail.sender,
        subject: `Re: ${selectedEmail.subject}`,
        body: emailResponse
      });
      
      // Here you would integrate with your email sending service
      alert('Email response sent! (This is a demo - integrate with your email service)');
      setEmailResponse('');
      setSelectedEmail(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" />
          AI-Powered Email Management
        </h1>
        <p className="text-gray-600">Manage emails with intelligent AI assistance</p>
      </div>

      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            AI Response
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inbox ({mockEmails.length})</CardTitle>
                <CardDescription>Select an email to generate an AI response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockEmails.map((email, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedEmail === email 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{email.sender}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        email.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        email.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {email.urgency}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{email.subject}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{email.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedEmail && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">From:</label>
                      <p className="text-sm">{selectedEmail.sender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <p className="text-sm">{selectedEmail.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message:</label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedEmail.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compose">
          {selectedEmail ? (
            <div className="space-y-6">
              <AIEmailResponseGenerator
                emailContext={selectedEmail}
                onResponseGenerated={handleResponseGenerated}
              />
              
              {emailResponse && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Send</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <p className="text-sm text-green-800">
                          AI has generated a response. Review and send when ready.
                        </p>
                      </div>
                      <Button onClick={handleSendEmail} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Email Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Select an email from the inbox to generate an AI response</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
