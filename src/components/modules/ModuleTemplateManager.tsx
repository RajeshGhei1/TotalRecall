
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Code, 
  Download,
  Upload,
  Eye,
  Copy
} from 'lucide-react';
import { useModuleTemplates } from '@/hooks/useModuleTemplates';
import { toast } from '@/hooks/use-toast';

const ModuleTemplateManager: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<unknown>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: templates = [], 
    isLoading, 
    createTemplate,
    updateTemplate,
    deleteTemplate 
  } = useModuleTemplates();

  const [newTemplate, setNewTemplate] = useState({
    template_id: '',
    name: '',
    description: '',
    category: 'custom',
    tags: [] as string[],
    manifest_template: {},
    files: {},
    dependencies: [] as string[]
  });

  const categories = [
    { value: 'core', label: 'Core System' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'custom', label: 'Custom Module' }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTemplate = async () => {
    try {
      await createTemplate.mutateAsync(newTemplate);
      setIsCreateDialogOpen(false);
      setNewTemplate({
        template_id: '',
        name: '',
        description: '',
        category: 'custom',
        tags: [],
        manifest_template: {},
        files: {},
        dependencies: []
      });
      toast({
        title: 'Template Created',
        description: 'Module template has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Failed to create module template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(templateId);
        toast({
          title: 'Template Deleted',
          description: 'Module template has been deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Deletion Failed',
          description: 'Failed to delete module template',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExportTemplate = (template: any) => {
    const exportData = {
      template_id: template.template_id,
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      manifest_template: template.manifest_template,
      files: template.files,
      dependencies: template.dependencies
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.template_id}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Exported',
      description: 'Template has been downloaded as JSON file',
    });
  };

  const handleDuplicateTemplate = async (template: any) => {
    const duplicatedTemplate = {
      ...template,
      template_id: `${template.template_id}-copy`,
      name: `${template.name} (Copy)`,
      is_built_in: false
    };

    try {
      await createTemplate.mutateAsync(duplicatedTemplate);
      toast({
        title: 'Template Duplicated',
        description: 'Template has been duplicated successfully',
      });
    } catch (error) {
      toast({
        title: 'Duplication Failed',
        description: 'Failed to duplicate template',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Module Template Manager</h3>
          <p className="text-muted-foreground">
            Create and manage reusable module templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Template
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge variant="outline">{template.category}</Badge>
                    {template.is_built_in && (
                      <Badge variant="secondary">Built-in</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description || 'No description available'}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {template.tags.slice(0, 4).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span>Dependencies: {template.dependencies.length}</span>
                    <span className="mx-2">•</span>
                    <span>Files: {Object.keys(template.files).length}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportTemplate(template)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!template.is_built_in && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Templates Found</h3>
              <p className="text-muted-foreground mb-4">
                No templates match your search criteria.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Module Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template_id">Template ID</Label>
                <Input
                  id="template_id"
                  value={newTemplate.template_id}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, template_id: e.target.value }))}
                  placeholder="my-template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Custom Template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the template"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTemplate}
                disabled={createTemplate.isPending || !newTemplate.template_id || !newTemplate.name}
              >
                {createTemplate.isPending ? 'Creating...' : 'Create Template'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleTemplateManager;
