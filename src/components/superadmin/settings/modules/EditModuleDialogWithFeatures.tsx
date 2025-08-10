import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSystemModules } from '@/hooks/useSystemModules';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import FeatureSelector from '@/components/common/FeatureSelector';
import FeatureLibraryStatus from '@/components/common/FeatureLibraryStatus';

const editModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  type: z.enum(['super_admin', 'foundation', 'business']),
  version: z.string().min(1, "Version is required"),
  maturity_status: z.enum(['planning', 'alpha', 'beta', 'production']).optional(),
  ai_level: z.enum(['high', 'medium', 'low', 'none']).optional(),
  is_active: z.boolean(),
  features: z.array(z.string()).optional(),
  ai_capabilities: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional()
});

type EditModuleFormData = z.infer<typeof editModuleSchema>;

interface ModuleToEdit {
  id: string;
  name: string;
  description?: string;
  category: string;
  type?: string;
  version?: string;
  maturity_status?: string;
  ai_level?: string;
  is_active: boolean;
  features?: string[];
  ai_capabilities?: string[];
  dependencies?: string[];
  functionality_preserved?: string[]; // Legacy field
}

interface EditModuleDialogWithFeaturesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: ModuleToEdit | null;
}

export const EditModuleDialogWithFeatures: React.FC<EditModuleDialogWithFeaturesProps> = ({ 
  open, 
  onOpenChange, 
  module 
}) => {
  const { updateModule } = useSystemModules();
  
  // Safely convert module type with fallback
  const getModuleType = (type?: string): 'super_admin' | 'foundation' | 'business' => {
    if (type === 'super_admin' || type === 'foundation' || type === 'business') {
      return type;
    }
    return 'business'; // Default fallback
  };

  const getMaturityStatus = (status?: string): 'planning' | 'alpha' | 'beta' | 'production' => {
    if (status === 'planning' || status === 'alpha' || status === 'beta' || status === 'production') {
      return status;
    }
    return 'planning'; // Default fallback
  };

  const getAILevel = (level?: string): 'high' | 'medium' | 'low' | 'none' => {
    if (level === 'high' || level === 'medium' || level === 'low' || level === 'none') {
      return level;
    }
    return 'medium'; // Default fallback
  };

  const form = useForm<EditModuleFormData>({
    resolver: zodResolver(editModuleSchema),
    defaultValues: {
      name: module?.name || '',
      description: module?.description || '',
      category: module?.category || '',
      type: getModuleType(module?.type),
      version: module?.version || '1.0.0',
      maturity_status: getMaturityStatus(module?.maturity_status),
      ai_level: getAILevel(module?.ai_level),
      is_active: module?.is_active || true,
      // Use existing features or migrate from functionality_preserved
      features: module?.features || module?.functionality_preserved || [],
      ai_capabilities: module?.ai_capabilities || [],
      dependencies: module?.dependencies || []
    }
  });

  React.useEffect(() => {
    if (module) {
      form.reset({
        name: module.name,
        description: module.description || '',
        category: module.category,
        type: getModuleType(module.type),
        version: module.version || '1.0.0',
        maturity_status: getMaturityStatus(module.maturity_status),
        ai_level: getAILevel(module.ai_level),
        is_active: module.is_active,
        features: module.features || module.functionality_preserved || [],
        ai_capabilities: module.ai_capabilities || [],
        dependencies: module.dependencies || []
      });
    }
  }, [module, form]);

  const selectedFeatures = form.watch('features') || [];
  const selectedAICapabilities = form.watch('ai_capabilities') || [];
  const selectedType = form.watch('type');
  
  // Check if module has been upgraded with comprehensive features
  const hasFeatureLibraryData = Boolean(module?.features || module?.ai_capabilities);
  const isLegacyModule = Boolean(module?.functionality_preserved && !module?.features);

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

  const onSubmit = async (data: EditModuleFormData) => {
    if (!module) return;
    
    try {
      const updates = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        type: data.type,
        version: data.version || '1.0.0',
        maturity_status: data.maturity_status || 'planning',
        ai_level: data.ai_level || 'medium',
        is_active: data.is_active,
        features: data.features || [],
        ai_capabilities: data.ai_capabilities || [],
        dependencies: data.dependencies || [],
        // Remove legacy field when updating with new system
        functionality_preserved: data.features || [],
        updated_at: new Date().toISOString()
      };
      
      await updateModule.mutateAsync({ id: module.id, updates });
      
      toast({
        title: "Module Updated",
        description: `${data.name} has been updated with comprehensive features.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the module. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!module) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Module - {module.name}
            {isLegacyModule && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                Legacy Module
              </Badge>
            )}
            {hasFeatureLibraryData && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Enhanced
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Feature Library Status for Legacy Modules */}
          {isLegacyModule && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Upgrade to Comprehensive Feature Library</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This module was created before the comprehensive feature library. 
                    You can now select from 96 standard features and 43 AI capabilities.
                  </p>
                  {module.functionality_preserved && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600">Current features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {module.functionality_preserved.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs bg-white">
                            {feature}
                          </Badge>
                        ))}
                        {module.functionality_preserved.length > 3 && (
                          <span className="text-xs text-blue-600">
                            +{module.functionality_preserved.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Compact Feature Library Status */}
          <FeatureLibraryStatus compact={true} />

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., Smart CRM Analytics"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                {...form.register('version')}
                placeholder="1.0.0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of the module functionality"
              rows={3}
            />
          </div>

          {/* Category, Type, Status */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={form.watch('type')} 
                onValueChange={(value) => form.setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={form.watch('category')} 
                onValueChange={(value) => form.setValue('category', value)}
              >
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
              <Label htmlFor="maturity_status">Status</Label>
              <Select 
                value={form.watch('maturity_status')} 
                onValueChange={(value) => form.setValue('maturity_status', value as any)}
              >
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
              <Select 
                value={form.watch('ai_level')} 
                onValueChange={(value) => form.setValue('ai_level', value as any)}
              >
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

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active Module</Label>
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
            showStats={false}
            title="Module Features & AI Capabilities"
            description="Update the features and AI capabilities this module provides"
          />

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>
                {isLegacyModule ? 'Upgrading to comprehensive feature library' : 'Using enhanced feature system'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateModule.isPending}>
                {updateModule.isPending ? 'Updating...' : isLegacyModule ? 'Upgrade Module' : 'Update Module'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModuleDialogWithFeatures; 