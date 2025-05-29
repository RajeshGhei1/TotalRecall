
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  useFormDeploymentPoints, 
  useFormPlacements, 
  useCreateFormPlacement,
  useDeleteFormPlacement 
} from '@/hooks/forms/useFormDeployments';
import { useFormDefinitions } from '@/hooks/forms/useFormDefinitions';
import { useTenantContext } from '@/contexts/TenantContext';
import { useSystemModules } from '@/hooks/useSystemModules';
import { FormDefinition } from '@/types/form-builder';
import { Plus, Trash2, MapPin, Settings } from 'lucide-react';

interface FormDeploymentManagerProps {
  selectedForm?: FormDefinition;
}

const FormDeploymentManager: React.FC<FormDeploymentManagerProps> = ({ selectedForm }) => {
  const [newPlacement, setNewPlacement] = useState({
    form_id: selectedForm?.id || '',
    deployment_point_id: '',
    priority: 0,
    configuration: {}
  });

  const { selectedTenantId } = useTenantContext();
  const { data: deploymentPoints = [] } = useFormDeploymentPoints();
  const { data: forms = [] } = useFormDefinitions();
  const { data: placements = [] } = useFormPlacements(selectedTenantId);
  const { data: modules = [] } = useSystemModules();
  const createPlacementMutation = useCreateFormPlacement();
  const deletePlacementMutation = useDeleteFormPlacement();

  const handleCreatePlacement = async () => {
    if (!newPlacement.form_id || !newPlacement.deployment_point_id) return;

    try {
      await createPlacementMutation.mutateAsync({
        ...newPlacement,
        tenant_id: selectedTenantId,
        status: 'active' as const,
      });

      // Reset form
      setNewPlacement({
        form_id: selectedForm?.id || '',
        deployment_point_id: '',
        priority: 0,
        configuration: {}
      });
    } catch (error) {
      console.error('Failed to create placement:', error);
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

  const filteredPlacements = selectedForm 
    ? placements.filter(p => p.form_id === selectedForm.id)
    : placements;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Form Deployment Manager
          </CardTitle>
          <CardDescription>
            Configure where and how forms appear to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="form-select">Form</Label>
              <Select
                value={newPlacement.form_id}
                onValueChange={(value) => setNewPlacement(prev => ({ ...prev, form_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a form" />
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
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {deploymentPoints.map((point) => (
                    <SelectItem key={point.id} value={point.id}>
                      {point.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={newPlacement.priority}
                onChange={(e) => setNewPlacement(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                placeholder="0"
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

      <Card>
        <CardHeader>
          <CardTitle>Active Placements</CardTitle>
          <CardDescription>
            {selectedForm ? `Placements for "${selectedForm.name}"` : 'All form placements'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPlacements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No form placements configured
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlacements.map((placement) => (
                <div 
                  key={placement.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{getFormName(placement.form_id)}</h4>
                      <Badge variant="outline">{getDeploymentPointName(placement.deployment_point_id)}</Badge>
                      {placement.priority > 0 && (
                        <Badge variant="secondary">Priority: {placement.priority}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Status: {placement.status} • Created: {new Date(placement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormDeploymentManager;
