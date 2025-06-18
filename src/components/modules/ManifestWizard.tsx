
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ManifestWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ManifestWizard: React.FC<ManifestWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    version: '1.0.0',
    description: '',
    category: '',
    author: '',
    license: 'MIT',
    dependencies: [] as string[],
    requiredPermissions: [] as string[],
    subscriptionTiers: ['basic'] as string[]
  });

  const [newDependency, setNewDependency] = useState('');
  const [newPermission, setNewPermission] = useState('');

  const categories = [
    'recruitment',
    'analytics', 
    'core',
    'business',
    'ai',
    'integration',
    'communication',
    'custom'
  ];

  const permissions = ['read', 'write', 'admin', 'analytics_access'];
  const tiers = ['basic', 'pro', 'enterprise'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generated manifest:', formData);
    onComplete();
  };

  const addDependency = () => {
    if (newDependency && !formData.dependencies.includes(newDependency)) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, newDependency]
      }));
      setNewDependency('');
    }
  };

  const removeDependency = (dep: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d !== dep)
    }));
  };

  const addPermission = () => {
    if (newPermission && !formData.requiredPermissions.includes(newPermission)) {
      setFormData(prev => ({
        ...prev,
        requiredPermissions: [...prev.requiredPermissions, newPermission]
      }));
      setNewPermission('');
    }
  };

  const removePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      requiredPermissions: prev.requiredPermissions.filter(p => p !== perm)
    }));
  };

  const toggleTier = (tier: string) => {
    setFormData(prev => ({
      ...prev,
      subscriptionTiers: prev.subscriptionTiers.includes(tier)
        ? prev.subscriptionTiers.filter(t => t !== tier)
        : [...prev.subscriptionTiers, tier]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Module Manifest</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure your module's metadata and requirements
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Module ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="my-custom-module"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Module Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Custom Module"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what your module does..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Your name or organization"
              />
            </div>

            <div className="space-y-3">
              <Label>Dependencies</Label>
              <div className="flex gap-2">
                <Input
                  value={newDependency}
                  onChange={(e) => setNewDependency(e.target.value)}
                  placeholder="module-name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
                />
                <Button type="button" onClick={addDependency}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.dependencies.map(dep => (
                  <Badge key={dep} variant="secondary" className="flex items-center gap-1">
                    {dep}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeDependency(dep)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Required Permissions</Label>
              <div className="flex gap-2">
                <Select value={newPermission} onValueChange={setNewPermission}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissions.map(perm => (
                      <SelectItem key={perm} value={perm}>{perm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addPermission}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredPermissions.map(perm => (
                  <Badge key={perm} variant="secondary" className="flex items-center gap-1">
                    {perm}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removePermission(perm)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Subscription Tiers</Label>
              <div className="flex gap-2">
                {tiers.map(tier => (
                  <Badge
                    key={tier}
                    variant={formData.subscriptionTiers.includes(tier) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTier(tier)}
                  >
                    {tier}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Generate Manifest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestWizard;
