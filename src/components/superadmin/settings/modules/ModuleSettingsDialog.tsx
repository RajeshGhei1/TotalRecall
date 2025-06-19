
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Code, 
  Database, 
  Shield,
  Zap,
  Package
} from 'lucide-react';
import { SystemModule } from '@/hooks/useSystemModules';

interface ModuleSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: SystemModule;
  onSave?: (updatedModule: Partial<SystemModule>) => void;
}

const ModuleSettingsDialog: React.FC<ModuleSettingsDialogProps> = ({
  open,
  onOpenChange,
  module,
  onSave
}) => {
  const [settings, setSettings] = useState({
    name: module.name,
    description: module.description || '',
    version: module.version || '1.0.0',
    is_active: module.is_active,
    dependencies: module.dependencies || [],
    default_limits: module.default_limits || {}
  });

  // Reset settings when module changes or dialog opens
  useEffect(() => {
    if (open) {
      setSettings({
        name: module.name,
        description: module.description || '',
        version: module.version || '1.0.0',
        is_active: module.is_active,
        dependencies: module.dependencies || [],
        default_limits: module.default_limits || {}
      });
    }
  }, [open, module]);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    onSave?.(settings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    console.log('Settings dialog cancelled');
    onOpenChange(false);
  };

  const addDependency = () => {
    setSettings(prev => ({
      ...prev,
      dependencies: [...prev.dependencies, '']
    }));
  };

  const removeDependency = (index: number) => {
    setSettings(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter((_, i) => i !== index)
    }));
  };

  const updateDependency = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      dependencies: prev.dependencies.map((dep, i) => i === index ? value : dep)
    }));
  };

  console.log('ModuleSettingsDialog render - open:', open, 'module:', module.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Module Settings: {module.name}
          </DialogTitle>
          <DialogDescription>
            Configure module settings, dependencies, and limits
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-version">Version</Label>
                <Input
                  id="module-version"
                  value={settings.version}
                  onChange={(e) => setSettings(prev => ({ ...prev, version: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module-description">Description</Label>
              <Textarea
                id="module-description"
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="module-active"
                checked={settings.is_active}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="module-active">Module Active</Label>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{module.category}</Badge>
              <Badge variant={module.maturity_status === 'production' ? 'default' : 'secondary'}>
                {module.maturity_status || 'planning'}
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Module Dependencies</Label>
              <Button variant="outline" size="sm" onClick={addDependency}>
                <Package className="h-4 w-4 mr-2" />
                Add Dependency
              </Button>
            </div>
            
            <div className="space-y-2">
              {settings.dependencies.map((dep, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={dep}
                    onChange={(e) => updateDependency(index, e.target.value)}
                    placeholder="Enter module dependency"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDependency(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {settings.dependencies.length === 0 && (
                <p className="text-sm text-muted-foreground">No dependencies configured</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Label>Default Resource Limits</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-requests">Max Requests/Hour</Label>
                <Input
                  id="max-requests"
                  type="number"
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-storage">Max Storage (MB)</Label>
                <Input
                  id="max-storage"
                  type="number"
                  placeholder="100"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure default resource limits for this module
            </p>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label>Security Settings</Label>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="require-auth" />
                  <Label htmlFor="require-auth">Require Authentication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sandbox-mode" />
                  <Label htmlFor="sandbox-mode">Sandbox Mode</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <Label>Performance Settings</Label>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="cache-enabled" defaultChecked />
                  <Label htmlFor="cache-enabled">Enable Caching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-scale" />
                  <Label htmlFor="auto-scale">Auto Scaling</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleSettingsDialog;
