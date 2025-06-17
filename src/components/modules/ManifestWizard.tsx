
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  CheckCircle,
  Plus,
  X,
  Info
} from 'lucide-react';
import { ModuleManifest } from '@/types/modules';

interface ManifestWizardProps {
  onComplete?: (manifest: ModuleManifest) => void;
  onCancel?: () => void;
}

const ManifestWizard: React.FC<ManifestWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [manifest, setManifest] = useState<Partial<ModuleManifest>>({
    category: 'custom',
    license: 'MIT',
    dependencies: [],
    requiredPermissions: [],
    subscriptionTiers: [],
    loadOrder: 100,
    autoLoad: false,
    canUnload: true,
    minCoreVersion: '1.0.0'
  });

  const [newDependency, setNewDependency] = useState('');
  const [newPermission, setNewPermission] = useState('');
  const [newTier, setNewTier] = useState('');

  const steps = [
    { id: 'basic', title: 'Basic Information', description: 'Module name, description, and category' },
    { id: 'metadata', title: 'Metadata', description: 'Author, license, and links' },
    { id: 'dependencies', title: 'Dependencies', description: 'Required modules and permissions' },
    { id: 'configuration', title: 'Configuration', description: 'Module behavior and settings' },
    { id: 'review', title: 'Review', description: 'Review and generate manifest' }
  ];

  const categories = [
    { id: 'core', label: 'Core System' },
    { id: 'business', label: 'Business Logic' },
    { id: 'recruitment', label: 'Recruitment' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'integration', label: 'Integration' },
    { id: 'communication', label: 'Communication' },
    { id: 'custom', label: 'Custom' }
  ];

  const updateManifest = (updates: Partial<ModuleManifest>) => {
    setManifest(prev => ({ ...prev, ...updates }));
  };

  const addDependency = () => {
    if (newDependency.trim()) {
      updateManifest({
        dependencies: [...(manifest.dependencies || []), newDependency.trim()]
      });
      setNewDependency('');
    }
  };

  const removeDependency = (index: number) => {
    const updated = [...(manifest.dependencies || [])];
    updated.splice(index, 1);
    updateManifest({ dependencies: updated });
  };

  const addPermission = () => {
    if (newPermission.trim()) {
      updateManifest({
        requiredPermissions: [...(manifest.requiredPermissions || []), newPermission.trim()]
      });
      setNewPermission('');
    }
  };

  const removePermission = (index: number) => {
    const updated = [...(manifest.requiredPermissions || [])];
    updated.splice(index, 1);
    updateManifest({ requiredPermissions: updated });
  };

  const addTier = () => {
    if (newTier.trim()) {
      updateManifest({
        subscriptionTiers: [...(manifest.subscriptionTiers || []), newTier.trim()]
      });
      setNewTier('');
    }
  };

  const removeTier = (index: number) => {
    const updated = [...(manifest.subscriptionTiers || [])];
    updated.splice(index, 1);
    updateManifest({ subscriptionTiers: updated });
  };

  const generateManifest = (): ModuleManifest => {
    return {
      id: manifest.id || '',
      name: manifest.name || '',
      version: manifest.version || '1.0.0',
      description: manifest.description || '',
      category: manifest.category as any || 'custom',
      author: manifest.author || '',
      license: manifest.license || 'MIT',
      homepage: manifest.homepage,
      repository: manifest.repository,
      dependencies: manifest.dependencies || [],
      peerDependencies: manifest.peerDependencies,
      minCoreVersion: manifest.minCoreVersion || '1.0.0',
      maxCoreVersion: manifest.maxCoreVersion,
      entryPoint: manifest.entryPoint || 'index.ts',
      routes: manifest.routes,
      components: manifest.components,
      services: manifest.services,
      hooks: manifest.hooks,
      requiredPermissions: manifest.requiredPermissions || [],
      subscriptionTiers: manifest.subscriptionTiers || [],
      resourceLimits: manifest.resourceLimits,
      loadOrder: manifest.loadOrder || 100,
      autoLoad: manifest.autoLoad || false,
      canUnload: manifest.canUnload !== false,
      developmentMode: manifest.developmentMode,
      hotReload: manifest.hotReload,
      sandboxed: manifest.sandboxed
    };
  };

  const downloadManifest = () => {
    const fullManifest = generateManifest();
    const blob = new Blob([JSON.stringify(fullManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.id || 'module'}-manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    const fullManifest = generateManifest();
    onComplete?.(fullManifest);
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(manifest.id && manifest.name && manifest.version && manifest.category);
      case 1:
        return !!(manifest.author);
      case 2:
        return true; // Dependencies are optional
      case 3:
        return !!(manifest.entryPoint);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderBasicStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Module ID *</label>
        <Input
          value={manifest.id || ''}
          onChange={(e) => updateManifest({ id: e.target.value })}
          placeholder="my-awesome-module"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Unique identifier for your module (lowercase, hyphens allowed)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Module Name *</label>
        <Input
          value={manifest.name || ''}
          onChange={(e) => updateManifest({ name: e.target.value })}
          placeholder="My Awesome Module"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Version *</label>
        <Input
          value={manifest.version || '1.0.0'}
          onChange={(e) => updateManifest({ version: e.target.value })}
          placeholder="1.0.0"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Semantic version (e.g., 1.0.0, 1.2.3-beta)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <select
          value={manifest.category || 'custom'}
          onChange={(e) => updateManifest({ category: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-md bg-background"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={manifest.description || ''}
          onChange={(e) => updateManifest({ description: e.target.value })}
          placeholder="A brief description of what your module does..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderMetadataStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Author *</label>
        <Input
          value={manifest.author || ''}
          onChange={(e) => updateManifest({ author: e.target.value })}
          placeholder="Your Name or Organization"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">License</label>
        <Input
          value={manifest.license || 'MIT'}
          onChange={(e) => updateManifest({ license: e.target.value })}
          placeholder="MIT"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Homepage URL</label>
        <Input
          value={manifest.homepage || ''}
          onChange={(e) => updateManifest({ homepage: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Repository URL</label>
        <Input
          value={manifest.repository || ''}
          onChange={(e) => updateManifest({ repository: e.target.value })}
          placeholder="https://github.com/user/repo"
        />
      </div>
    </div>
  );

  const renderDependenciesStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Module Dependencies</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newDependency}
            onChange={(e) => setNewDependency(e.target.value)}
            placeholder="dependency-module-id"
            onKeyPress={(e) => e.key === 'Enter' && addDependency()}
          />
          <Button onClick={addDependency} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {manifest.dependencies?.map((dep, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {dep}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeDependency(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Required Permissions</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            placeholder="read, write, admin"
            onKeyPress={(e) => e.key === 'Enter' && addPermission()}
          />
          <Button onClick={addPermission} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {manifest.requiredPermissions?.map((perm, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {perm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removePermission(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Subscription Tiers</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTier}
            onChange={(e) => setNewTier(e.target.value)}
            placeholder="basic, premium, enterprise"
            onKeyPress={(e) => e.key === 'Enter' && addTier()}
          />
          <Button onClick={addTier} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {manifest.subscriptionTiers?.map((tier, index) => (
            <Badge key={index} variant="default" className="flex items-center gap-1">
              {tier}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTier(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfigurationStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Entry Point *</label>
        <Input
          value={manifest.entryPoint || 'index.ts'}
          onChange={(e) => updateManifest({ entryPoint: e.target.value })}
          placeholder="index.ts"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Main file that exports your module
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Load Order</label>
        <Input
          type="number"
          value={manifest.loadOrder || 100}
          onChange={(e) => updateManifest({ loadOrder: parseInt(e.target.value) || 100 })}
          placeholder="100"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lower numbers load first (0-1000)
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={manifest.autoLoad || false}
            onChange={(e) => updateManifest({ autoLoad: e.target.checked })}
          />
          <span className="text-sm font-medium">Auto Load</span>
        </label>
        <p className="text-xs text-muted-foreground">
          Automatically load this module when the system starts
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={manifest.canUnload !== false}
            onChange={(e) => updateManifest({ canUnload: e.target.checked })}
          />
          <span className="text-sm font-medium">Can Unload</span>
        </label>
        <p className="text-xs text-muted-foreground">
          Allow this module to be unloaded at runtime
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={manifest.sandboxed || false}
            onChange={(e) => updateManifest({ sandboxed: e.target.checked })}
          />
          <span className="text-sm font-medium">Sandboxed</span>
        </label>
        <p className="text-xs text-muted-foreground">
          Run this module in a sandboxed environment
        </p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Generated Manifest Preview</h3>
        <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-96">
          {JSON.stringify(generateManifest(), null, 2)}
        </pre>
      </div>

      <div className="flex gap-2">
        <Button onClick={downloadManifest} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Manifest
        </Button>
        <Button onClick={handleComplete}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete & Save
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Module Manifest Wizard</h2>
          <p className="text-muted-foreground">
            Create a module manifest file step by step
          </p>
        </div>
      </div>

      <Tabs value={steps[currentStep].id} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > currentStep}
              className="text-xs"
            >
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the basic information about your module
              </p>
            </CardHeader>
            <CardContent>
              {renderBasicStep()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Metadata
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add metadata about the module author and links
              </p>
            </CardHeader>
            <CardContent>
              {renderMetadataStep()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dependencies & Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Specify module dependencies and required permissions
              </p>
            </CardHeader>
            <CardContent>
              {renderDependenciesStep()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure module behavior and settings
              </p>
            </CardHeader>
            <CardContent>
              {renderConfigurationStep()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Review & Generate</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review your manifest and download or save it
              </p>
            </CardHeader>
            <CardContent>
              {renderReviewStep()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onCancel?.()}
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep >= steps.length - 1 || !canProceed(currentStep)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ManifestWizard;
