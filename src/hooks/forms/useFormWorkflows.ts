
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormWorkflow, FormNotification, WorkflowExecutionLog, FormWorkflowInsert, FormNotificationInsert } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';

// Form Workflows
export const useFormWorkflows = (formId?: string) => {
  return useQuery({
    queryKey: ['form-workflows', formId],
    queryFn: async () => {
      let query = supabase
        .from('form_workflows')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (formId) {
        query = query.eq('form_id', formId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form workflows:', error);
        throw error;
      }

      return data as FormWorkflow[];
    },
  });
};

export const useCreateFormWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (workflowData: FormWorkflowInsert) => {
      const { data, error } = await supabase
        .from('form_workflows')
        .insert(workflowData)
        .select()
        .single();

      if (error) {
        console.error('Error creating form workflow:', error);
        throw error;
      }

      return data as FormWorkflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-workflows'] });
      toast({
        title: 'Success',
        description: 'Workflow created successfully',
      });
    },
  });
};

export const useUpdateFormWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormWorkflowInsert> }) => {
      const { data, error } = await supabase
        .from('form_workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form workflow:', error);
        throw error;
      }

      return data as FormWorkflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-workflows'] });
      toast({
        title: 'Success',
        description: 'Workflow updated successfully',
      });
    },
  });
};

// Form Notifications
export const useFormNotifications = (workflowId?: string) => {
  return useQuery({
    queryKey: ['form-notifications', workflowId],
    queryFn: async () => {
      let query = supabase
        .from('form_notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (workflowId) {
        query = query.eq('workflow_id', workflowId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form notifications:', error);
        throw error;
      }

      return data as FormNotification[];
    },
  });
};

export const useCreateFormNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notificationData: FormNotificationInsert) => {
      const { data, error } = await supabase
        .from('form_notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('Error creating form notification:', error);
        throw error;
      }

      return data as FormNotification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-notifications'] });
      toast({
        title: 'Success',
        description: 'Notification created successfully',
      });
    },
  });
};

// Workflow Execution Logs
export const useWorkflowExecutionLogs = (workflowId?: string, responseId?: string) => {
  return useQuery({
    queryKey: ['workflow-execution-logs', workflowId, responseId],
    queryFn: async () => {
      let query = supabase
        .from('workflow_execution_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (workflowId) {
        query = query.eq('workflow_id', workflowId);
      }

      if (responseId) {
        query = query.eq('response_id', responseId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching workflow execution logs:', error);
        throw error;
      }

      return data as WorkflowExecutionLog[];
    },
  });
};
