
import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAIAgents } from '@/hooks/ai/useAIAgents';
import { AIAgentType } from '@/types/ai';
import { Loader2 } from 'lucide-react';

interface CreateAIAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AGENT_TYPES: { value: AIAgentType; label: string; description: string }[] = [
  {
    value: 'cognitive',
    label: 'Cognitive Assistant',
    description: 'General purpose AI for user assistance and decision support'
  },
  {
    value: 'predictive',
    label: 'Predictive Analytics',
    description: 'Specialized in forecasting and trend analysis'
  },
  {
    value: 'automation',
    label: 'Workflow Automation',
    description: 'Handles process automation and optimization'
  },
  {
    value: 'analysis',
    label: 'Data Analysis',
    description: 'Focused on data analysis and insight generation'
  },
  {
    value: 'deep_research',
    label: 'Deep Research',
    description: 'Advanced research and knowledge synthesis'
  }
];

const AVAILABLE_CAPABILITIES = [
  'conversation',
  'decision_support',
  'content_generation',
  'task_planning',
  'trend_analysis',
  'forecasting',
  'pattern_recognition',
  'risk_assessment',
  'workflow_design',
  'process_optimization',
  'task_automation',
  'integration_management',
  'data_analysis',
  'visualization',
  'statistical_analysis',
  'insight_generation',
  'research',
  'knowledge_synthesis',
  'literature_review',
  'expert_analysis'
];

export const CreateAIAgentDialog: React.FC<CreateAIAgentDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { createAgent } = useAIAgents();
  const [formData, setFormData] = useState({
    name: '',
    type: '' as AIAgentType,
    description: '',
    capabilities: [] as string[],
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type) {
      return;
    }

    try {
      await createAgent.mutateAsync({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        capabilities: formData.capabilities,
        model_config: {
          model: formData.model,
          temperature: formData.temperature,
          max_tokens: formData.max_tokens
        },
        performance_metrics: {
          accuracy: 0,
          response_time: 0,
          user_satisfaction: 0
        },
        status: 'active',
        is_active: true
      });

      // Reset form
      setFormData({
        name: '',
        type: '' as AIAgentType,
        description: '',
        capabilities: [],
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1000
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleCapabilityToggle = (capability: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capability]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        capabilities: prev.capabilities.filter(c => c !== capability)
      }));
    }
  };

  const selectedAgentType = AGENT_TYPES.find(type => type.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Configure a new AI agent for your system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Customer Support Assistant"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Agent Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: AIAgentType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedAgentType && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">{selectedAgentType.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this agent will do..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Capabilities</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {AVAILABLE_CAPABILITIES.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    id={capability}
                    checked={formData.capabilities.includes(capability)}
                    onCheckedChange={(checked) => handleCapabilityToggle(capability, checked as boolean)}
                  />
                  <Label 
                    htmlFor={capability} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {capability.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Model Configuration</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select 
                  value={formData.model} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                    <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
                    <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={formData.max_tokens}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_tokens: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAgent.isPending || !formData.name.trim() || !formData.type}>
              {createAgent.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
