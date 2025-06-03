
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmailTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    template_key: '',
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    variables: [] as string[],
    is_active: true
  });

  const { data: templates, isLoading } = useQuery({
    queryKey: ['global-email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('global_email_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-email-templates'] });
      toast({
        title: 'Template Created',
        description: 'Email template has been created successfully.',
      });
      resetForm();
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EmailTemplate> }) => {
      const { data, error } = await supabase
        .from('global_email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-email-templates'] });
      toast({
        title: 'Template Updated',
        description: 'Email template has been updated successfully.',
      });
      resetForm();
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('global_email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-email-templates'] });
      toast({
        title: 'Template Deleted',
        description: 'Email template has been deleted successfully.',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      template_key: '',
      name: '',
      subject: '',
      html_content: '',
      text_content: '',
      variables: [],
      is_active: true
    });
    setEditingId(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateTemplate.mutateAsync({
        id: editingId,
        updates: formData
      });
    } else {
      await createTemplate.mutateAsync(formData);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setFormData({
      template_key: template.template_key,
      name: template.name,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content || '',
      variables: template.variables || [],
      is_active: template.is_active
    });
    setEditingId(template.id);
    setShowCreateForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Global Email Templates
              </CardTitle>
              <CardDescription>
                Manage system-wide email templates and notifications
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? 'Edit Template' : 'Create New Template'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template_key">Template Key</Label>
                      <Input
                        id="template_key"
                        value={formData.template_key}
                        onChange={(e) => setFormData(prev => ({ ...prev, template_key: e.target.value }))}
                        placeholder="welcome_email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Welcome Email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Welcome to {{system_name}}"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="html_content">HTML Content</Label>
                    <Textarea
                      id="html_content"
                      value={formData.html_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                      rows={8}
                      placeholder="<h1>Welcome {{user_name}}!</h1>"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text_content">Text Content (Optional)</Label>
                    <Textarea
                      id="text_content"
                      value={formData.text_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                      rows={4}
                      placeholder="Welcome {{user_name}}!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variables">Variables (comma-separated)</Label>
                    <Input
                      id="variables"
                      value={formData.variables.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
                      }))}
                      placeholder="user_name, system_name, company_name"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active</Label>
                      <p className="text-sm text-muted-foreground">
                        Whether this template is available for use
                      </p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createTemplate.isPending || updateTemplate.isPending}>
                      {(createTemplate.isPending || updateTemplate.isPending) && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Template Key</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates?.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {template.template_key}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                    <TableCell>
                      <Badge variant={template.is_active ? 'default' : 'secondary'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {template.variables.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 2).map((variable) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                          {template.variables.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.variables.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTemplate.mutate(template.id)}
                          disabled={deleteTemplate.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!templates || templates.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No email templates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {previewTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Template Preview: {previewTemplate.name}</CardTitle>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Subject:</Label>
                <p className="text-sm bg-muted p-2 rounded">{previewTemplate.subject}</p>
              </div>
              <div>
                <Label>HTML Content:</Label>
                <div className="text-sm bg-muted p-4 rounded max-h-64 overflow-auto">
                  <pre className="whitespace-pre-wrap">{previewTemplate.html_content}</pre>
                </div>
              </div>
              {previewTemplate.text_content && (
                <div>
                  <Label>Text Content:</Label>
                  <div className="text-sm bg-muted p-4 rounded max-h-32 overflow-auto">
                    <pre className="whitespace-pre-wrap">{previewTemplate.text_content}</pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTab;
