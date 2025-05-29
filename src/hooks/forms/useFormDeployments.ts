
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormDeploymentPoint, FormPlacement, FormTrigger, FormDeploymentPointInsert, FormPlacementInsert, FormTriggerInsert } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Type for deployment locations from the database enum
type DeploymentLocation = Database['public']['Enums']['deployment_location'];

// Form Deployment Points
export const useFormDeploymentPoints = () => {
  return useQuery({
    queryKey: ['form-deployment-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_deployment_points')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching deployment points:', error);
        throw error;
      }

      return data as FormDeploymentPoint[];
    },
  });
};

// Form Placements
export const useFormPlacements = (tenantId?: string) => {
  return useQuery({
    queryKey: ['form-placements', tenantId],
    queryFn: async () => {
      let query = supabase
        .from('form_placements')
        .select(`
          *,
          form_definitions(*),
          form_deployment_points(*),
          system_modules(*)
        `)
        .eq('status', 'active');

      if (tenantId) {
        query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
      }

      const { data, error } = await query.order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching form placements:', error);
        throw error;
      }

      return data as (FormPlacement & {
        form_definitions: any;
        form_deployment_points: FormDeploymentPoint;
        system_modules?: any;
      })[];
    },
    enabled: !!tenantId,
  });
};

export const useFormPlacementsByLocation = (location: DeploymentLocation, tenantId?: string) => {
  return useQuery({
    queryKey: ['form-placements-by-location', location, tenantId],
    queryFn: async () => {
      let query = supabase
        .from('form_placements')
        .select(`
          *,
          form_definitions(*),
          form_deployment_points!inner(*),
          form_triggers(*)
        `)
        .eq('status', 'active')
        .eq('form_deployment_points.location', location);

      if (tenantId) {
        query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
      }

      const { data, error } = await query.order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching placements by location:', error);
        throw error;
      }

      return data as (FormPlacement & {
        form_definitions: any;
        form_deployment_points: FormDeploymentPoint;
        form_triggers: FormTrigger[];
      })[];
    },
  });
};

export const useCreateFormPlacement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (placementData: FormPlacementInsert) => {
      const { data, error } = await supabase
        .from('form_placements')
        .insert(placementData)
        .select()
        .single();

      if (error) {
        console.error('Error creating form placement:', error);
        throw error;
      }

      return data as FormPlacement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-placements'] });
      toast({
        title: 'Success',
        description: 'Form placement created successfully',
      });
    },
  });
};

export const useUpdateFormPlacement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormPlacementInsert> }) => {
      const { data, error } = await supabase
        .from('form_placements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form placement:', error);
        throw error;
      }

      return data as FormPlacement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-placements'] });
      toast({
        title: 'Success',
        description: 'Form placement updated successfully',
      });
    },
  });
};

export const useDeleteFormPlacement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_placements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting form placement:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-placements'] });
      toast({
        title: 'Success',
        description: 'Form placement deleted successfully',
      });
    },
  });
};
