
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Bot } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label'; // Add this import for standalone labels
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

type AIModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  isDefault: boolean;
};

type TenantAIModelAssignment = {
  tenantId: string;
  modelId: string;
};

const AIModelIntegration = () => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Mock AI models - in a real application, these would come from an API or database
  const availableModels: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Latest multimodal GPT model with vision capabilities',
      isDefault: true,
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      description: 'Smaller, faster version of GPT-4o',
      isDefault: false,
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Most powerful Claude model for complex reasoning',
      isDefault: false,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced Claude model for most use cases',
      isDefault: false,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Google\'s Gemini Pro model for general purpose tasks',
      isDefault: false,
    },
  ];

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['tenants-ai-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Mock function to get the current AI model for a tenant
  // In a real application, this would be fetched from the database
  const getTenantModel = (tenantId: string) => {
    // This is a placeholder. In a real application, this would be fetched from the database
    return availableModels[0].id;
  };

  const form = useForm({
    defaultValues: {
      modelId: selectedTenantId ? getTenantModel(selectedTenantId) : availableModels[0].id,
    },
  });

  const onSubmit = (data: { modelId: string }) => {
    if (!selectedTenantId) {
      toast({
        title: "Error",
        description: "Please select a tenant first",
        variant: "destructive",
      });
      return;
    }

    // Here you would update the tenant's AI model in your database
    // For now, we'll just show a success toast
    toast({
      title: "AI Model Updated",
      description: `Successfully assigned model to tenant`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available AI Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableModels.map((model) => (
            <div key={model.id} className="flex flex-col p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">{model.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Provider: {model.provider}</p>
              <p className="text-sm flex-1">{model.description}</p>
              {model.isDefault && (
                <div className="mt-2">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Default</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Assign AI Models to Tenants</h3>
        
        {isLoadingTenants ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              {/* Changed from FormLabel to Label since it's not in a Form context */}
              <Label>Select Tenant</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tenants.map((tenant) => (
                  <Button
                    key={tenant.id}
                    variant={tenant.id === selectedTenantId ? "default" : "outline"}
                    className="h-auto py-3 justify-start"
                    onClick={() => {
                      setSelectedTenantId(tenant.id);
                      form.setValue('modelId', getTenantModel(tenant.id));
                    }}
                  >
                    {tenant.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedTenantId && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select AI Model</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an AI model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name} ({model.provider})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This AI model will be used for all AI-related features for this tenant.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Assignment</Button>
                </form>
              </Form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModelIntegration;
