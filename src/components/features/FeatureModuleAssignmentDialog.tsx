/**
 * SIMPLE FEATURE MODULE ASSIGNMENT DIALOG
 * Clean, easy-to-use interface for assigning features to modules
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, Search, CheckCircle, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StandardsCompliantFeature } from '@/types/standardsCompliantFeatures';

interface Module {
  name: string;
  category: string;
  description?: string;
}

interface FeatureModuleAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: StandardsCompliantFeature | null;
}

export const FeatureModuleAssignmentDialog: React.FC<FeatureModuleAssignmentDialogProps> = ({ open, onOpenChange, feature }) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedModules([]);
      setSearchTerm('');
    }
  }, [open]);

  // Fetch modules with simplified query
  const { data: allModules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['simple-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('name, category, description')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      // Clean up duplicate and similar module names
      const cleanModules = (data || [])
        .filter(module => {
          const name = module.name.toLowerCase();
          // Filter out test modules and duplicates
          return !name.includes('test') && 
                 !name.includes('simple-test') &&
                 name !== 'module registry & deployment';
        })
        .map(module => ({
          name: module.name,
          category: module.category || 'General',
          description: module.description
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      return cleanModules as Module[];
    },
    enabled: open
  });

  // Get current assignments
  const { data: currentAssignments = [] } = useQuery({
    queryKey: ['current-assignments', feature?.feature_id],
    queryFn: async () => {
      if (!feature) return [];
      const { data, error } = await supabase
        .from('module_features')
        .select('module_name')
        .eq('feature_id', feature.feature_id);
      
      if (error) throw error;
      return data.map(d => d.module_name);
    },
    enabled: !!feature && open
  });

  // Filter modules based on search and availability
  const filteredModules = allModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notAssigned = !currentAssignments.includes(module.name);
    return matchesSearch && notAssigned;
  });

  // Assignment mutation
  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!feature || selectedModules.length === 0) return;

      const assignments = selectedModules.map(moduleName => ({
        module_name: moduleName,
        feature_id: feature.feature_id,
        feature_name: feature.name,
        feature_description: feature.description,
        feature_category: feature.category,
        is_enabled_by_default: true,
        is_premium_feature: false,
        sort_order: 1,
        ui_component_path: feature.ui_component_path,
        input_schema: feature.input_schema,
        output_schema: feature.output_schema,
        tags: feature.tags,
        version: feature.version,
        is_active: feature.is_active,
        feature_config: feature.feature_config || {}
      }));

      const { error } = await supabase
        .from('module_features')
        .upsert(assignments);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['moduleFeatures'] });
      toast({
        title: "Success!",
        description: `${feature?.name} assigned to ${selectedModules.length} module(s)`,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign feature to modules",
        variant: "destructive",
      });
    }
  });

  if (!feature) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Assign "{feature.name}" to Modules
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Assignments Info */}
          {currentAssignments.length > 0 && (
            <Alert>
              <AlertDescription>
                <strong>Currently assigned to:</strong> {currentAssignments.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Module List with Simple Scrolling */}
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-gray-50">
              <h4 className="font-medium">Available Modules ({filteredModules.length})</h4>
            </div>
            
            {modulesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-5 w-5 animate-spin mr-2" />
                <span>Loading modules...</span>
              </div>
            ) : filteredModules.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No modules match your search' : 'All modules already have this feature'}
              </div>
            ) : (
              <div 
                className="p-2 space-y-1 overflow-y-auto" 
                style={{ maxHeight: '300px' }}
              >
                {filteredModules.map(module => (
                  <div key={module.name} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      id={module.name}
                      checked={selectedModules.includes(module.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedModules([...selectedModules, module.name]);
                        } else {
                          setSelectedModules(selectedModules.filter(m => m !== module.name));
                        }
                      }}
                    />
                    <Label htmlFor={module.name} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.name}</span>
                        <Badge variant="outline" className="text-xs">{module.category}</Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Modules Summary */}
          {selectedModules.length > 0 && (
            <Alert>
              <AlertDescription>
                <strong>Selected:</strong> {selectedModules.join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            onClick={() => assignMutation.mutate()}
            disabled={selectedModules.length === 0 || assignMutation.isPending}
          >
            {assignMutation.isPending ? (
              <Loader className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-1" />
            )}
            Assign to {selectedModules.length} Module{selectedModules.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModuleAssignmentDialog; 