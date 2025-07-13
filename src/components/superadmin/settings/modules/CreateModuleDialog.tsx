
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSystemModules } from '@/hooks/useSystemModules';
import { X, Plus } from 'lucide-react';

const createModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(['super_admin', 'foundation', 'business']),
  maturity_status: z.enum(['planning', 'alpha', 'beta', 'production']),
  ai_level: z.enum(['high', 'medium', 'low', 'none']),
  is_active: z.boolean(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  ai_capabilities: z.array(z.string()),
  dependencies: z.array(z.string()),
  subscription_tiers: z.array(z.string()).min(1, "At least one subscription tier is required"),
});

type CreateModuleFormData = z.infer<typeof createModuleSchema>;

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Standard feature categories with predefined options
const STANDARD_FEATURES = {
  'Core Infrastructure': [
    'Multi-tenant isolation',
    'Real-time synchronization',
    'Data security and encryption',
    'Audit trail and logging',
    'API access and webhooks',
    'Performance monitoring',
    'Backup and recovery',
    'Scalability management'
  ],
  'User Management': [
    'User registration and authentication',
    'Role-based access control',
    'Permission management',
    'User profile management',
    'Team and group management',
    'Single sign-on (SSO)',
    'Multi-factor authentication',
    'Session management'
  ],
  'Data Management': [
    'Data import and export',
    'Data validation and cleaning',
    'Duplicate detection and merging',
    'Data archiving and retention',
    'Custom field management',
    'Data relationships and linking',
    'Search and filtering',
    'Data visualization'
  ],
  'Communication': [
    'Email composition and sending',
    'Template management and personalization',
    'Automated email sequences',
    'Email tracking and analytics',
    'SMS and messaging',
    'Notification management',
    'Communication history',
    'Multi-channel messaging'
  ],
  'Analytics & Reporting': [
    'Dashboard creation and customization',
    'Report generation and scheduling',
    'Data visualization and charts',
    'KPI tracking and alerts',
    'Predictive analytics',
    'Trend analysis',
    'Performance metrics',
    'Executive reporting'
  ],
  'Workflow & Automation': [
    'Business process automation',
    'Custom workflow creation',
    'Rule-based automation',
    'Event-driven triggers',
    'Approval workflows',
    'Task management and assignment',
    'Process optimization',
    'Integration workflows'
  ],
  'Forms & Templates': [
    'Dynamic form builder',
    'Drag-and-drop interface',
    'Custom field creation',
    'Form template library',
    'Form deployment and embedding',
    'Form analytics and submissions',
    'Validation and conditional logic',
    'Multi-step forms'
  ],
  'Sales & CRM': [
    'Lead capture and management',
    'Sales pipeline management',
    'Opportunity tracking',
    'Contact and account management',
    'Deal tracking and forecasting',
    'Sales automation workflows',
    'Customer lifecycle tracking',
    'Sales performance analytics'
  ],
  'Marketing': [
    'Campaign management and automation',
    'Lead nurturing workflows',
    'A/B testing capabilities',
    'Social media integration',
    'Content management',
    'SEO optimization',
    'Landing page creation',
    'Marketing analytics and ROI'
  ],
  'Project Management': [
    'Project planning and tracking',
    'Resource allocation',
    'Task management and collaboration',
    'Milestone tracking',
    'Time tracking and billing',
    'Project analytics and reporting',
    'Team collaboration tools',
    'Resource utilization analysis'
  ],
  'Integration': [
    'API connectivity and management',
    'Data synchronization',
    'Third-party integrations',
    'Webhook management',
    'Authentication handling',
    'Rate limiting and throttling',
    'Error handling and recovery',
    'Integration monitoring'
  ],
  'AI & Intelligence': [
    'Machine learning model management',
    'Natural language processing',
    'Predictive modeling',
    'Pattern recognition',
    'Automated insights generation',
    'Intelligent recommendations',
    'Anomaly detection',
    'Decision support systems'
  ]
};

const AI_CAPABILITIES = [
  'Behavioral authentication',
  'Intelligent role suggestions',
  'Anomaly detection',
  'Adaptive permissions',
  'Agent orchestration',
  'Cognitive processing',
  'Knowledge synthesis',
  'Decision support',
  'Learning algorithms',
  'Smart template suggestions',
  'Communication optimization',
  'Sentiment analysis',
  'Automated response suggestions',
  'Intelligent data mapping',
  'Automated integration setup',
  'Error prediction and resolution',
  'Performance optimization',
  'Automated insights generation',
  'Intelligent dashboard layouts',
  'Predictive analytics',
  'Smart form field suggestions',
  'Automated form layout optimization',
  'Intelligent validation rules',
  'Template recommendations',
  'Lead scoring algorithms',
  'Sales forecasting',
  'Customer behavior analysis',
  'Opportunity prioritization',
  'Churn prediction',
  'Campaign optimization',
  'Content personalization',
  'Market trend analysis',
  'Social media insights',
  'Automated segmentation',
  'Project timeline optimization',
  'Resource allocation optimization',
  'Risk prediction',
  'Workload balancing',
  'Performance insights',
  'Process optimization',
  'Bottleneck detection',
  'Intelligent routing',
  'Workflow recommendations'
];

const CreateModuleDialog: React.FC<CreateModuleDialogProps> = ({ open, onOpenChange }) => {
  const { createModule } = useSystemModules();
  const [customFeature, setCustomFeature] = useState('');
  const [customAICapability, setCustomAICapability] = useState('');
  
  const form = useForm<CreateModuleFormData>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      type: 'business',
      maturity_status: 'planning',
      ai_level: 'medium',
      is_active: true,
      features: [],
      ai_capabilities: [],
      dependencies: [],
      subscription_tiers: ['professional']
    }
  });

  const selectedFeatures = form.watch('features') || [];
  const selectedAICapabilities = form.watch('ai_capabilities') || [];
  const selectedType = form.watch('type');

  const categories = {
    'super_admin': [
      { value: 'administration', label: 'Administration' },
      { value: 'platform', label: 'Platform' },
      { value: 'monitoring', label: 'Monitoring' },
      { value: 'security', label: 'Security' }
    ],
    'foundation': [
      { value: 'ai_infrastructure', label: 'AI Infrastructure' },
      { value: 'communication', label: 'Communication' },
      { value: 'integration_infrastructure', label: 'Integration Infrastructure' },
      { value: 'analytics_infrastructure', label: 'Analytics Infrastructure' },
      { value: 'content_infrastructure', label: 'Content Infrastructure' }
    ],
    'business': [
      { value: 'analytics', label: 'Analytics' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'integrations', label: 'Integrations' },
      { value: 'operations', label: 'Operations' },
      { value: 'finance', label: 'Finance' },
      { value: 'project_management', label: 'Project Management' },
      { value: 'automation', label: 'Automation' }
    ]
  };

  const addCustomFeature = () => {
    if (customFeature.trim()) {
      const currentFeatures = form.getValues('features');
      form.setValue('features', [...currentFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const addCustomAICapability = () => {
    if (customAICapability.trim()) {
      const currentCapabilities = form.getValues('ai_capabilities');
      form.setValue('ai_capabilities', [...currentCapabilities, customAICapability.trim()]);
      setCustomAICapability('');
    }
  };

  const removeFeature = (feature: string) => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', currentFeatures.filter(f => f !== feature));
  };

  const removeAICapability = (capability: string) => {
    const currentCapabilities = form.getValues('ai_capabilities');
    form.setValue('ai_capabilities', currentCapabilities.filter(c => c !== capability));
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = form.getValues('features');
    if (currentFeatures.includes(feature)) {
      form.setValue('features', currentFeatures.filter(f => f !== feature));
    } else {
      form.setValue('features', [...currentFeatures, feature]);
    }
  };

  const toggleAICapability = (capability: string) => {
    const currentCapabilities = form.getValues('ai_capabilities');
    if (currentCapabilities.includes(capability)) {
      form.setValue('ai_capabilities', currentCapabilities.filter(c => c !== capability));
    } else {
      form.setValue('ai_capabilities', [...currentCapabilities, capability]);
    }
  };

  const onSubmit = async (data: CreateModuleFormData) => {
    try {
      const moduleData = {
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type,
        maturity_status: data.maturity_status,
        ai_level: data.ai_level,
        is_active: data.is_active,
        version: '1.0.0',
        dependencies: data.dependencies,
        ai_capabilities: data.ai_capabilities,
        // Store features in a custom field for now
        functionality_preserved: data.features,
        required_permissions: ['read', 'write'],
        subscription_tiers: data.subscription_tiers,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await createModule.mutateAsync(moduleData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., Smart Talent Analytics"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Module Type</Label>
              <Select value={selectedType} onValueChange={(value) => form.setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe what this module does and its key benefits"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={form.watch('category')} onValueChange={(value) => form.setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedType && categories[selectedType]?.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maturity_status">Maturity Status</Label>
              <Select value={form.watch('maturity_status')} onValueChange={(value) => form.setValue('maturity_status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai_level">AI Level</Label>
              <Select value={form.watch('ai_level')} onValueChange={(value) => form.setValue('ai_level', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High AI</SelectItem>
                  <SelectItem value="medium">Medium AI</SelectItem>
                  <SelectItem value="low">Low AI</SelectItem>
                  <SelectItem value="none">No AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Module Features</Label>
              <p className="text-sm text-gray-600">Select the business features and functionality this module provides</p>
            </div>

            {/* Selected Features */}
            {selectedFeatures.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Features ({selectedFeatures.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-50 rounded-md">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Categories */}
            <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-4">
              {Object.entries(STANDARD_FEATURES).map(([categoryName, features]) => (
                <div key={categoryName}>
                  <Label className="text-sm font-medium text-gray-700">{categoryName}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm cursor-pointer">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Feature */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom feature..."
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
              />
              <Button type="button" onClick={addCustomFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* AI Capabilities Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">AI Capabilities</Label>
              <p className="text-sm text-gray-600">Select AI features and intelligent capabilities this module provides</p>
            </div>

            {/* Selected AI Capabilities */}
            {selectedAICapabilities.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected AI Capabilities ({selectedAICapabilities.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-blue-50 rounded-md">
                  {selectedAICapabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="flex items-center gap-1 bg-blue-100">
                      {capability}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAICapability(capability)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Capabilities Grid */}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
              {AI_CAPABILITIES.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    id={capability}
                    checked={selectedAICapabilities.includes(capability)}
                    onCheckedChange={() => toggleAICapability(capability)}
                  />
                  <Label htmlFor={capability} className="text-sm cursor-pointer">
                    {capability}
                  </Label>
                </div>
              ))}
            </div>

            {/* Add Custom AI Capability */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom AI capability..."
                value={customAICapability}
                onChange={(e) => setCustomAICapability(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAICapability())}
              />
              <Button type="button" onClick={addCustomAICapability} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="space-y-2">
            <Label>Subscription Tiers</Label>
            <div className="flex gap-4">
              {['basic', 'professional', 'enterprise'].map((tier) => (
                <div key={tier} className="flex items-center space-x-2">
                  <Checkbox
                    id={tier}
                    checked={(form.watch('subscription_tiers') || []).includes(tier)}
                    onCheckedChange={(checked) => {
                      const current = form.watch('subscription_tiers') || [];
                      if (checked) {
                        form.setValue('subscription_tiers', [...current, tier]);
                      } else {
                        form.setValue('subscription_tiers', current.filter(t => t !== tier));
                      }
                    }}
                  />
                  <Label htmlFor={tier} className="capitalize cursor-pointer">
                    {tier}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active Module</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createModule.isPending}>
              {createModule.isPending ? 'Creating...' : 'Create Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModuleDialog;
