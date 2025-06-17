
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Settings, 
  Layers, 
  Route, 
  Shield, 
  Cpu,
  Code,
  Eye
} from 'lucide-react';
import { ModuleManifest } from '@/types/modules';

interface ManifestWizardProps {
  onComplete: (manifest: ModuleManifest) => void;
  onCancel: () => void;
  initialManifest?: Partial<ModuleManifest>;
}

const ManifestWizard: React.FC<ManifestWizardProps> = ({
  onComplete,
  onCancel,
  initialManifest = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [manifest, setManifest] = useState<Partial<ModuleManifest>>({
    category: 'custom',
    author: 'Developer',
    license: 'MIT',
    dependencies: [],
    requiredPermissions: [],
    subscriptionTiers: ['professional'],
    loadOrder: 100,
    autoLoad: true,
    canUnload: true,
    minCoreVersion: '1.0.0',
    ...initialManifest
  });

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: FileText },
    { id: 'dependencies', title: 'Dependencies', icon: Layers },
    { id: 'components', title: 'Components', icon: Code },
    { id: 'routes', title: 'Routes', icon: Route },
    { id: 'permissions', title: 'Permissions', icon: Shield },
    { id: 'resources', title: 'Resources', icon: Cpu },
    { id: 'preview', title: 'Preview', icon: Eye }
  ];

  const updateManifest = (updates: Partial<ModuleManifest>) => {
    setManifest(prev => ({ ...prev, ...updates }));
  };

  const addToArray = (field: keyof ModuleManifest, value: string) => {
    const currentArray = (manifest[field] as string[]) || [];
    if (!currentArray.includes(value) && value.trim()) {
      updateManifest({
        [field]: [...currentArray, value.trim()]
      });
    }
  };

  const removeFromArray = (field: keyof ModuleManifest, index: number) => {
    const currentArray = (manifest[field] as string[]) || [];
    updateManifest({
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!(manifest.id && manifest.name && manifest.version && manifest.description);
      case 1: // Dependencies
        return true; // Optional step
      case 2: // Components
        return !!(manifest.entryPoint);
      case 3: // Routes
        return true; // Optional step
      case 4: // Permissions
        return true; // Optional step
      case 5: // Resources
        return true; // Optional step
      case 6: // Preview
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateCurrentStep()) {
      onComplete(manifest as ModuleManifest);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="module-id">Module ID*</Label>
                <Input
                  id="module-id"
                  value={manifest.id || ''}
                  onChange={(e) => updateManifest({ id: e.target.value })}
                  placeholder="my-module"
                />
              </div>
              <div>
                <Label htmlFor="module-name">Module Name*</Label>
                <Input
                  id="module-name"
                  value={manifest.name || ''}
                  onChange={(e) => updateManifest({ name: e.target.value })}
                  placeholder="My Module"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="version">Version*</Label>
                <Input
                  id="version"
                  value={manifest.version || ''}
                  onChange={(e) => updateManifest({ version: e.target.value })}
                  placeholder="1.0.0"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={manifest.category} onValueChange={(value) => updateManifest({ category: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={manifest.description || ''}
                onChange={(e) => updateManifest({ description: e.target.value })}
                placeholder="Describe what this module does..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={manifest.author || ''}
                  onChange={(e) => updateManifest({ author: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label htmlFor="license">License</Label>
                <Input
                  id="license"
                  value={manifest.license || ''}
                  onChange={(e) => updateManifest({ license: e.target.value })}
                  placeholder="MIT"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Dependencies
        return (
          <div className="space-y-4">
            <div>
              <Label>Module Dependencies</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter dependency name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('dependencies', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('dependencies', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {manifest.dependencies?.map((dep, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('dependencies', index)}>
                    {dep} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-core-version">Min Core Version</Label>
                <Input
                  id="min-core-version"
                  value={manifest.minCoreVersion || ''}
                  onChange={(e) => updateManifest({ minCoreVersion: e.target.value })}
                  placeholder="1.0.0"
                />
              </div>
              <div>
                <Label htmlFor="max-core-version">Max Core Version</Label>
                <Input
                  id="max-core-version"
                  value={manifest.maxCoreVersion || ''}
                  onChange={(e) => updateManifest({ maxCoreVersion: e.target.value })}
                  placeholder="2.0.0"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Components
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="entry-point">Entry Point*</Label>
              <Input
                id="entry-point"
                value={manifest.entryPoint || ''}
                onChange={(e) => updateManifest({ entryPoint: e.target.value })}
                placeholder="index.js"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="load-order">Load Order</Label>
                <Input
                  id="load-order"
                  type="number"
                  value={manifest.loadOrder || 100}
                  onChange={(e) => updateManifest({ loadOrder: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-load"
                  checked={manifest.autoLoad}
                  onCheckedChange={(checked) => updateManifest({ autoLoad: checked as boolean })}
                />
                <Label htmlFor="auto-load">Auto Load</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="can-unload"
                  checked={manifest.canUnload}
                  onCheckedChange={(checked) => updateManifest({ canUnload: checked as boolean })}
                />
                <Label htmlFor="can-unload">Can Unload</Label>
              </div>
            </div>
          </div>
        );

      case 3: // Routes
        return (
          <div className="space-y-4">
            <div>
              <Label>Module Routes</Label>
              <p className="text-sm text-muted-foreground">Define the routes this module will handle</p>
              <div className="mt-4 p-4 border rounded-lg bg-muted">
                <p className="text-sm">Routes configuration will be implemented in future versions</p>
              </div>
            </div>
          </div>
        );

      case 4: // Permissions
        return (
          <div className="space-y-4">
            <div>
              <Label>Required Permissions</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter permission name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('requiredPermissions', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('requiredPermissions', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {manifest.requiredPermissions?.map((perm, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('requiredPermissions', index)}>
                    {perm} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Subscription Tiers</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter subscription tier"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('subscriptionTiers', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('subscriptionTiers', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {manifest.subscriptionTiers?.map((tier, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('subscriptionTiers', index)}>
                    {tier} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Resources
        return (
          <div className="space-y-4">
            <div>
              <Label>Resource Limits</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="memory-limit">Memory (MB)</Label>
                  <Input
                    id="memory-limit"
                    type="number"
                    placeholder="512"
                    onChange={(e) => updateManifest({
                      resourceLimits: {
                        ...manifest.resourceLimits,
                        memory: parseInt(e.target.value) || undefined
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="cpu-limit">CPU (%)</Label>
                  <Input
                    id="cpu-limit"
                    type="number"
                    placeholder="50"
                    onChange={(e) => updateManifest({
                      resourceLimits: {
                        ...manifest.resourceLimits,
                        cpu: parseInt(e.target.value) || undefined
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="storage-limit">Storage (MB)</Label>
                  <Input
                    id="storage-limit"
                    type="number"
                    placeholder="100"
                    onChange={(e) => updateManifest({
                      resourceLimits: {
                        ...manifest.resourceLimits,
                        storage: parseInt(e.target.value) || undefined
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="development-mode"
                  checked={manifest.developmentMode}
                  onCheckedChange={(checked) => updateManifest({ developmentMode: checked as boolean })}
                />
                <Label htmlFor="development-mode">Development Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hot-reload"
                  checked={manifest.hotReload}
                  onCheckedChange={(checked) => updateManifest({ hotReload: checked as boolean })}
                />
                <Label htmlFor="hot-reload">Hot Reload</Label>
              </div>
            </div>
          </div>
        );

      case 6: // Preview
        return (
          <div className="space-y-4">
            <div>
              <Label>Manifest Preview</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Module Manifest Generator
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-muted-foreground bg-background text-muted-foreground'}
                `}>
                  <StepIcon className="h-4 w-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          <h3 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h3>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!validateCurrentStep()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!validateCurrentStep()}>
                Complete Manifest
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManifestWizard;
