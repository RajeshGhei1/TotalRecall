
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useFormDeploymentPoints, 
  useFormPlacements, 
  useCreateFormPlacement,
  useUpdateFormPlacement,
  useDeleteFormPlacement 
} from '@/hooks/forms/useFormDeployments';
import { useFormDefinitions } from '@/hooks/forms/useFormDefinitions';
import { useTenantContext } from '@/contexts/TenantContext';
import { FormDefinition, FormPlacement } from '@/types/form-builder';
import { Plus, Trash2, MapPin, Settings, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormPlacementManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedPlacement, setSelectedPlacement] = useState<FormPlacement | null>(null);
  const [newPlacement, setNewPlacement] = useState({
    form_id: '',
    deployment_point_id: '',
    priority: 0,
    configuration: {}
  });

  const { selectedTenantId } = useTenantContext();
  const { data: deploymentPoints = [] } = useFormDeploymentPoints();
  const { data: forms = [] } = useFormDefinitions(selectedTenantId);
  const { data: placements = [] } = useFormPlacements(selectedTenantId);
  const createPlacementMutation = useCreateFormPlacement();
  const updatePlacementMutation = useUpdateFormPlacement();
  const deletePlacementMutation = useDeleteFormPlacement();
  const { toast } = useToast();

  const handleCreatePlacement = async () => {
    if (!newPlacement.form_id || !newPlacement.deployment_point_id) {
      toast({
        title: 'Validation Error',
        description: 'Please select both a form and deployment location',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPlacementMutation.mutateAsync({
        ...newPlacement,
        tenant_id: selectedTenantId,
        status: 'active' as const,
      });

      // Reset form
      setNewPlacement({
        form_id: '',
        deployment_point_id: '',
        priority: 0,
        configuration: {}
      });

      setActiveTab('manage');
    } catch (error) {
      console.error('Failed to create placement:', error);
    }
  };

  const handleUpdatePlacement = async (placementId: string, updates: Partial<FormPlacement>) => {
    try {
      await updatePlacementMutation.mutateAsync({ id: placementId, updates });
      setSelectedPlacement(null);
    } catch (error) {
      console.error('Failed to update placement:', error);
    }
  };

  const handleDeletePlacement = async (placementId: string) => {
    if (window.confirm('Are you sure you want to remove this form placement?')) {
      try {
        await deletePlacementMutation.mutateAsync(placementId);
      } catch (error) {
        console.error('Failed to delete placement:', error);
      }
    }
  };

  const getDeploymentPointName = (pointId: string) => {
    const point = deploymentPoints.find(p => p.id === pointId);
    return point?.name || 'Unknown';
  };

  const getFormName = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    return form?.name || 'Unknown Form';
  };

  const getLocationBadgeVariant = (location: string) => {
    switch (location) {
      case 'dashboard_widget': return 'default';
      case 'modal_dialog': return 'secondary';
      case 'navigation_item': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Form Placement Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Placement</TabsTrigger>
          <TabsTrigger value="manage">Manage Placements</TabsTrigger>
          <TabsTrigger value="locations">Deployment Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Form Placement</CardTitle>
              <CardDescription>
                Configure where and how a form should be displayed to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="form-select">Select Form</Label>
                  <Select
                    value={newPlacement.form_id}
                    onValueChange={(value) => setNewPlacement(prev => ({ ...prev, form_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a form" />
                    </SelectTrigger>
                    <SelectContent>
                      {forms.map((form) => (
                        <SelectItem key={form.id} value={form.id}>
                          {form.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deployment-point-select">Deployment Location</Label>
                  <Select
                    value={newPlacement.deployment_point_id}
                    onValueChange={(value) => setNewPlacement(prev => ({ ...prev, deployment_point_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose location" />
                    </SelectTrigger>
                    <SelectContent>
                      {deploymentPoints.map((point) => (
                        <SelectItem key={point.id} value={point.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant={getLocationBadgeVariant(point.location)}>
                              {point.location}
                            </Badge>
                            {point.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority (higher = more prominent)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={newPlacement.priority}
                    onChange={(e) => setNewPlacement(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreatePlacement}
                disabled={!newPlacement.form_id || !newPlacement.deployment_point_id || createPlacementMutation.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Placement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Form Placements</CardTitle>
              <CardDescription>
                Manage existing form placements and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {placements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Form Placements</h3>
                  <p>Create your first form placement to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {placements.map((placement) => {
                    const deploymentPoint = deploymentPoints.find(p => p.id === placement.deployment_point_id);
                    return (
                      <div 
                        key={placement.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{getFormName(placement.form_id)}</h4>
                            <Badge variant={getLocationBadgeVariant(deploymentPoint?.location || '')}>
                              {deploymentPoint?.location}
                            </Badge>
                            <Badge variant="outline">{getDeploymentPointName(placement.deployment_point_id)}</Badge>
                            {placement.priority > 0 && (
                              <Badge variant="secondary">Priority: {placement.priority}</Badge>
                            )}
                            <Badge variant={placement.status === 'active' ? 'default' : 'secondary'}>
                              {placement.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(placement.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPlacement(placement)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePlacement(placement.id)}
                            disabled={deletePlacementMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Deployment Locations</CardTitle>
              <CardDescription>
                Overview of all available locations where forms can be deployed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deploymentPoints.map((point) => (
                  <div key={point.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getLocationBadgeVariant(point.location)}>
                        {point.location}
                      </Badge>
                      <h3 className="font-medium">{point.name}</h3>
                    </div>
                    {point.description && (
                      <p className="text-sm text-muted-foreground mb-2">{point.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {point.target_path && `Path: ${point.target_path}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormPlacementManager;
