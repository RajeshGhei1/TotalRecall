
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
import FeatureSelector from '@/components/common/FeatureSelector';

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

// Features and AI capabilities are now managed by the centralized FeatureSelector component

const CreateModuleDialog: React.FC<CreateModuleDialogProps> = ({ open, onOpenChange }) => {
  const { createModule } = useSystemModules();
  
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

  const handleFeaturesChange = (features: string[]) => {
    form.setValue('features', features);
  };

  const handleAICapabilitiesChange = (capabilities: string[]) => {
    form.setValue('ai_capabilities', capabilities);
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

          {/* Comprehensive Feature Selection */}
          <FeatureSelector
            selectedFeatures={selectedFeatures}
            selectedAICapabilities={selectedAICapabilities}
            onFeaturesChange={handleFeaturesChange}
            onAICapabilitiesChange={handleAICapabilitiesChange}
            moduleType={selectedType}
            moduleCategory={form.watch('category')}
            showRecommendations={true}
            showStats={true}
            title="Module Features & AI Capabilities"
            description="Select the features and AI capabilities this module will provide"
          />

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
