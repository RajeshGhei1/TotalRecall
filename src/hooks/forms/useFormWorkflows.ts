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

      // Transform the data to match our types
      return (data || []).map(workflow => ({
        ...workflow,
        trigger_conditions: workflow.trigger_conditions as Record<string, any>,
        workflow_steps: Array.isArray(workflow.workflow_steps) ? workflow.workflow_steps as any[] : []
      })) as FormWorkflow[];
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
        .insert({
          ...workflowData,
          trigger_conditions: workflowData.trigger_conditions as any,
          workflow_steps: workflowData.workflow_steps as any
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating form workflow:', error);
        throw error;
      }

      return {
        ...data,
        trigger_conditions: data.trigger_conditions as Record<string, any>,
        workflow_steps: Array.isArray(data.workflow_steps) ? data.workflow_steps as any[] : []
      } as FormWorkflow;
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
        .update({
          ...updates,
          trigger_conditions: updates.trigger_conditions as any,
          workflow_steps: updates.workflow_steps as any
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form workflow:', error);
        throw error;
      }

      return {
        ...data,
        trigger_conditions: data.trigger_conditions as Record<string, any>,
        workflow_steps: Array.isArray(data.workflow_steps) ? data.workflow_steps as any[] : []
      } as FormWorkflow;
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

      return (data || []).map(notification => ({
        ...notification,
        template_data: notification.template_data as Record<string, any>,
        recipients: Array.isArray(notification.recipients) ? notification.recipients as string[] : []
      })) as FormNotification[];
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
        .insert({
          ...notificationData,
          template_data: notificationData.template_data as any,
          recipients: notificationData.recipients as any
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating form notification:', error);
        throw error;
      }

      return {
        ...data,
        template_data: data.template_data as Record<string, any>,
        recipients: Array.isArray(data.recipients) ? data.recipients as string[] : []
      } as FormNotification;
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

      return (data || []).map(log => ({
        id: log.id,
        workflow_id: log.workflow_id,
        response_id: log.response_id,
        status: log.execution_status || 'pending', // Map execution_status to status
        step_results: Array.isArray(log.step_results) ? log.step_results as Record<string, any>[] : [],
        error_message: log.error_message,
        created_at: log.created_at,
        completed_at: log.completed_at
      })) as WorkflowExecutionLog[];
    },
  });
};
