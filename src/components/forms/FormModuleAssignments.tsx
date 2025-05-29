
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { FormDefinition } from '@/types/form-builder';
import { useFormModuleAssignments, useAssignFormToModule, useRemoveFormModuleAssignment, useAvailableModules } from '@/hooks/forms/useFormModuleAssignments';

interface FormModuleAssignmentsProps {
  form: FormDefinition;
}

const FormModuleAssignments: React.FC<FormModuleAssignmentsProps> = ({ form }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  const { data: assignments = [], isLoading } = useFormModuleAssignments(form.id);
  const { data: availableModules = [] } = useAvailableModules();
  const assignMutation = useAssignFormToModule();
  const removeMutation = useRemoveFormModuleAssignment();

  const assignedModuleIds = assignments.map(a => a.module_id);
  const unassignedModules = availableModules.filter(m => !assignedModuleIds.includes(m.id));

  const handleAssign = async () => {
    if (!selectedModuleId) return;
    
    try {
      await assignMutation.mutateAsync({
        form_id: form.id,
        module_id: selectedModuleId,
      });
      setSelectedModuleId('');
    } catch (error) {
      console.error('Failed to assign module:', error);
    }
  };

  const handleRemove = async (assignmentId: string) => {
    try {
      await removeMutation.mutateAsync(assignmentId);
    } catch (error) {
      console.error('Failed to remove assignment:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Module Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Assignments</CardTitle>
        <CardDescription>
          Assign this form to specific modules to control when it's available to users.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Assignments */}
        <div>
          <h4 className="font-medium mb-2">Assigned Modules</h4>
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No modules assigned. Form will be globally available.</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{assignment.system_modules.category}</Badge>
                    <span className="font-medium">{assignment.system_modules.name}</span>
                    {assignment.system_modules.description && (
                      <span className="text-sm text-muted-foreground">
                        - {assignment.system_modules.description}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(assignment.id)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Assignment */}
        {unassignedModules.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Assign to Module</h4>
            <div className="flex gap-2">
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{module.category}</Badge>
                        {module.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssign}
                disabled={!selectedModuleId || assignMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormModuleAssignments;
