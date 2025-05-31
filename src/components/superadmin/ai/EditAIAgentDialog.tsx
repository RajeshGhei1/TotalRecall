
import React, { useEffect } from 'react';
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
import { AIAgent, AIAgentType } from '@/types/ai';

const agentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['cognitive', 'predictive', 'automation', 'analysis']),
  capabilities: z.string().min(1, 'At least one capability is required'),
  preferredModel: z.string().min(1, 'Preferred model is required'),
  temperature: z.number().min(0).max(2).default(0.7),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface EditAIAgentDialogProps {
  agent: AIAgent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditAIAgentDialog = ({ agent, open, onOpenChange }: EditAIAgentDialogProps) => {
  const { updateAgent } = useAIAgents();
  const { models } = useAIModels();

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
  });

  useEffect(() => {
    if (agent) {
      form.reset({
        name: agent.name,
        description: agent.description || '',
        type: agent.type,
        capabilities: agent.capabilities.join(', '),
        preferredModel: (agent.model_config as any)?.preferred_model || '',
        temperature: (agent.model_config as any)?.temperature || 0.7,
      });
    }
  }, [agent, form]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      const updates = {
        name: data.name,
        description: data.description,
        type: data.type as AIAgentType,
        capabilities: data.capabilities.split(',').map(cap => cap.trim()),
        model_config: {
          ...(agent.model_config as any),
          preferred_model: data.preferredModel,
          temperature: data.temperature,
        },
      };

      await updateAgent.mutateAsync({ id: agent.id, updates });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit AI Agent</DialogTitle>
          <DialogDescription>
            Update the agent's configuration and capabilities.
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
            <Select 
              value={form.watch('type')} 
              onValueChange={(value) => form.setValue('type', value as AIAgentType)}
            >
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
            <Select 
              value={form.watch('preferredModel')}
              onValueChange={(value) => form.setValue('preferredModel', value)}
            >
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
            <Button type="submit" disabled={updateAgent.isPending}>
              {updateAgent.isPending ? 'Updating...' : 'Update Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
