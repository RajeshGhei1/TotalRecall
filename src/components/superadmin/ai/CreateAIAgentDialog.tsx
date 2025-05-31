
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAIAgents } from '@/hooks/ai/useAIAgents';
import { useAIModels } from '@/hooks/ai/useAIModels';
import { AIAgentType, AIAgentStatus } from '@/types/ai';

const agentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['cognitive', 'predictive', 'automation', 'analysis']),
  capabilities: z.string().min(1, 'At least one capability is required'),
  preferredModel: z.string().min(1, 'Preferred model is required'),
  temperature: z.number().min(0).max(2).default(0.7),
  tenant_id: z.string().optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface CreateAIAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAIAgentDialog = ({ open, onOpenChange }: CreateAIAgentDialogProps) => {
  const { createAgent } = useAIAgents();
  const { models } = useAIModels();

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      type: 'cognitive',
      temperature: 0.7,
    },
  });

  const onSubmit = async (data: AgentFormData) => {
    try {
      const agentData = {
        name: data.name,
        description: data.description,
        type: data.type as AIAgentType,
        capabilities: data.capabilities.split(',').map(cap => cap.trim()),
        model_config: {
          preferred_model: data.preferredModel,
          temperature: data.temperature,
        },
        performance_metrics: {
          accuracy: 0,
          response_time: 0,
        },
        status: 'active' as AIAgentStatus,
        is_active: true,
        tenant_id: data.tenant_id || null,
        created_by: null,
      };

      await createAgent.mutateAsync(agentData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create AI Agent</DialogTitle>
          <DialogDescription>
            Configure a new AI agent with specific capabilities and model preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter agent name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the agent's purpose and functionality"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Agent Type</Label>
            <Select onValueChange={(value) => form.setValue('type', value as AIAgentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cognitive">Cognitive</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="capabilities">Capabilities</Label>
            <Input
              id="capabilities"
              {...form.register('capabilities')}
              placeholder="conversation, support, analysis (comma separated)"
            />
            {form.formState.errors.capabilities && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.capabilities.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="preferredModel">Preferred Model</Label>
            <Select onValueChange={(value) => form.setValue('preferredModel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preferred AI model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.model_id}>
                    {model.name} ({model.provider})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              {...form.register('temperature', { valueAsNumber: true })}
              placeholder="0.7"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower values make output more focused, higher values more creative
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAgent.isPending}>
              {createAgent.isPending ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
