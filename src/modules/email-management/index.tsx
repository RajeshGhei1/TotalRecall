
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Star, 
  Search,
  Plus,
  Settings
} from 'lucide-react';

interface EmailManagementProps {
  mode?: 'full' | 'compose' | 'inbox';
  showTemplates?: boolean;
  allowCompose?: boolean;
}

const EmailManagement: React.FC<EmailManagementProps> = ({
  mode = 'full',
  showTemplates = true,
  allowCompose = true
}) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const emails = [
    {
      id: '1',
      from: 'john.doe@example.com',
      subject: 'Meeting follow-up',
      preview: 'Thank you for the productive meeting...',
      time: '2 hours ago',
      isRead: false,
      isStarred: true
    },
    {
      id: '2',
      from: 'system@platform.com',
      subject: 'System Update Notification',
      preview: 'Your system has been successfully updated...',
      time: '4 hours ago',
      isRead: true,
      isStarred: false
    },
    {
      id: '3',
      from: 'support@company.com',
      subject: 'Support Ticket #12345',
      preview: 'Your support ticket has been resolved...',
      time: '1 day ago',
      isRead: true,
      isStarred: false
    }
  ];

  const templates = [
    { id: '1', name: 'Welcome Email', subject: 'Welcome to our platform!' },
    { id: '2', name: 'Follow-up', subject: 'Following up on our conversation' },
    { id: '3', name: 'Meeting Invite', subject: 'Meeting invitation' }
  ];

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending email:', composeData);
    // Reset form
    setComposeData({ to: '', subject: '', message: '' });
  };

  const renderInbox = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search emails..." className="pl-10" />
        </div>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="space-y-2">
        {emails.map((email) => (
          <Card key={email.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${!email.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${!email.isRead ? 'font-bold' : ''}`}>
                      {email.from}
                    </span>
                    {email.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {!email.isRead && <Badge variant="secondary" className="text-xs">New</Badge>}
                  </div>
                  <div className={`text-sm ${!email.isRead ? 'font-semibold' : ''}`}>
                    {email.subject}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {email.preview}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {email.time}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCompose = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Compose Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleComposeSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="To: recipient@example.com"
              value={composeData.to}
              onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Subject"
              value={composeData.subject}
              onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Write your message..."
              value={composeData.message}
              onChange={(e) => setComposeData(prev => ({ ...prev, message: e.target.value }))}
              rows={8}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Templates</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.subject}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm">
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (mode === 'compose') {
    return renderCompose();
  }

  if (mode === 'inbox') {
    return renderInbox();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Email Management</h1>
        {allowCompose && (
          <Button onClick={() => setActiveTab('compose')}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Compose
          </TabsTrigger>
          {showTemplates && (
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Templates
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="inbox" className="mt-6">
          {renderInbox()}
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          {renderCompose()}
        </TabsContent>

        {showTemplates && (
          <TabsContent value="templates" className="mt-6">
            {renderTemplates()}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(EmailManagement as unknown).moduleMetadata = {
  id: 'email-management',
  name: 'Email Management',
  category: 'communication',
  version: '1.0.0',
  description: 'Comprehensive email management system with inbox, compose, and templates',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: [],
  props: {
    mode: { type: 'string', options: ['full', 'compose', 'inbox'], default: 'full' },
    showTemplates: { type: 'boolean', default: true },
    allowCompose: { type: 'boolean', default: true }
  }
};

export default EmailManagement;
