
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Package, 
  Settings, 
  Layers,
  Code,
  Database,
  Download,
  Upload
} from 'lucide-react';
import { useModuleTemplates } from '@/hooks/useModuleTemplates';
import { moduleTemplateService } from '@/services/moduleTemplates';
import { toast } from '@/hooks/use-toast';

interface ManifestWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const ManifestWizard: React.FC<ManifestWizardProps> = ({ onComplete, onCancel }) => {
  const [activeStep, setActiveStep] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [manifestData, setManifestData] = useState({
    id: '',
    name: '',
    description: '',
    category: 'custom',
    version: '1.0.0',
    author: 'Developer',
    license: 'MIT',
    dependencies: [] as string[],
    requiredPermissions: ['read'] as string[],
    subscriptionTiers: ['basic', 'pro', 'enterprise'] as string[],
    entryPoint: 'index.tsx'
  });

  const { data: templates = [], isLoading } = useModuleTemplates();

  const categories = [
    { value: 'core', label: 'Core System' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'custom', label: 'Custom Module' }
  ];

  const permissions = [
    { id: 'read', label: 'Read Access' },
    { id: 'write', label: 'Write Access' },
    { id: 'admin', label: 'Admin Access' },
    { id: 'analytics_access', label: 'Analytics Access' },
    { id: 'recruitment_access', label: 'Recruitment Access' }
  ];

  const subscriptionTiers = [
    { id: 'basic', label: 'Basic' },
    { id: 'pro', label: 'Pro' },
    { id: 'enterprise', label: 'Enterprise' }
  ];

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId && templateId !== 'scratch') {
      const template = templates.find(t => t.template_id === templateId);
      if (template) {
        // Pre-fill manifest data from template
        setManifestData(prev => ({
          ...prev,
          category: template.category,
          dependencies: template.dependencies || [],
          ...template.manifest_template
        }));
      }
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || selectedTemplate === 'scratch') {
      setActiveStep('details');
      return;
    }

    try {
      const result = await moduleTemplateService.createModuleFromTemplate(
        selectedTemplate,
        {
          id: manifestData.id,
          name: manifestData.name,
          description: manifestData.description
        }
      );

      if (result) {
        setManifestData(prev => ({
          ...prev,
          ...result.manifest
        }));
        setActiveStep('details');
      }
    } catch (error) {
      toast({
        title: 'Template Error',
        description: 'Failed to create module from template',
        variant: 'destructive',
      });
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setManifestData(prev => ({
      ...prev,
      requiredPermissions: checked
        ? [...prev.requiredPermissions, permission]
        : prev.requiredPermissions.filter(p => p !== permission)
    }));
  };

  const handleTierChange = (tier: string, checked: boolean) => {
    setManifestData(prev => ({
      ...prev,
      subscriptionTiers: checked
        ? [...prev.subscriptionTiers, tier]
        : prev.subscriptionTiers.filter(t => t !== tier)
    }));
  };

  const handleComplete = () => {
    const manifest = {
      ...manifestData,
      loadOrder: 100,
      autoLoad: false,
      canUnload: true,
      minCoreVersion: '1.0.0'
    };

    // Create downloadable manifest file
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifestData.id}-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Manifest Created',
      description: 'Module manifest has been generated and downloaded',
    });

    onComplete?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${activeStep === 'template' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'template' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <Database className="h-4 w-4" />
          </div>
          <span className="font-medium">Template</span>
        </div>
        <div className="flex-1 h-px bg-muted"></div>
        <div className={`flex items-center space-x-2 ${activeStep === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-medium">Details</span>
        </div>
        <div className="flex-1 h-px bg-muted"></div>
        <div className={`flex items-center space-x-2 ${activeStep === 'config' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'config' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <Settings className="h-4 w-4" />
          </div>
          <span className="font-medium">Configuration</span>
        </div>
      </div>

      {activeStep === 'template' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Choose a Template
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Start with a template or create from scratch
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Start from scratch option */}
              <Card 
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === 'scratch' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleTemplateSelect('scratch')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Code className="h-6 w-6 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Start from Scratch</h3>
                      <p className="text-sm text-muted-foreground">
                        Create a completely custom module manifest
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Template options */}
              {templates.map((template) => (
                <Card 
                  key={template.template_id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate === template.template_id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleTemplateSelect(template.template_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Package className="h-6 w-6 mt-1 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline">{template.category}</Badge>
                          {template.is_built_in && (
                            <Badge variant="secondary">Built-in</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {template.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFromTemplate}
                disabled={!selectedTemplate}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeStep === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Module Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure basic module information
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Module ID</Label>
                <Input
                  id="id"
                  value={manifestData.id}
                  onChange={(e) => setManifestData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="my-custom-module"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={manifestData.version}
                  onChange={(e) => setManifestData(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                value={manifestData.name}
                onChange={(e) => setManifestData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Custom Module"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={manifestData.description}
                onChange={(e) => setManifestData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the module functionality"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={manifestData.category}
                  onValueChange={(value) => setManifestData(prev => ({ ...prev, category: value }))}
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
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={manifestData.author}
                  onChange={(e) => setManifestData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Developer"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveStep('template')}>
                Back
              </Button>
              <Button onClick={() => setActiveStep('config')}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeStep === 'config' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure permissions and subscription requirements
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="permissions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Required Permissions</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the permissions this module requires
                  </p>
                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={manifestData.requiredPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="subscriptions" className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Subscription Tiers</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select which subscription tiers can access this module
                  </p>
                  <div className="space-y-3">
                    {subscriptionTiers.map((tier) => (
                      <div key={tier.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tier.id}
                          checked={manifestData.subscriptionTiers.includes(tier.id)}
                          onCheckedChange={(checked) => handleTierChange(tier.id, checked as boolean)}
                        />
                        <Label htmlFor={tier.id}>{tier.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveStep('details')}>
                Back
              </Button>
              <Button onClick={handleComplete}>
                <Download className="h-4 w-4 mr-2" />
                Generate Manifest
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManifestWizard;
