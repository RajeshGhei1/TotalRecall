
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AIModel } from './types';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelAssignmentFormProps {
  selectedTenantId: string | null;
  availableModels: AIModel[];
  defaultModelId: string;
  existingApiKey?: string;
}

interface FormValues {
  modelId: string;
  apiKey: string;
}

const ModelAssignmentForm = ({ 
  selectedTenantId, 
  availableModels,
  defaultModelId,
  existingApiKey = ''
}: ModelAssignmentFormProps) => {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(
    availableModels.find(model => model.id === defaultModelId) || null
  );
  
  const form = useForm<FormValues>({
    defaultValues: {
      modelId: defaultModelId,
      apiKey: existingApiKey,
    },
  });

  useEffect(() => {
    // Update selected model when modelId changes
    const modelId = form.watch('modelId');
    const model = availableModels.find(m => m.id === modelId) || null;
    setSelectedModel(model);
  }, [form.watch('modelId'), availableModels]);

  const onSubmit = (data: FormValues) => {
    if (!selectedTenantId) {
      toast({
        title: "Error",
        description: "Please select a tenant first",
        variant: "destructive",
      });
      return;
    }

    // Here you would update the tenant's AI model and API key in your database
    // For now, we'll just show a success toast
    toast({
      title: "AI Model Updated",
      description: `Successfully assigned ${selectedModel?.name} model to tenant`,
    });
    
    console.log("Saved model assignment:", {
      tenantId: selectedTenantId,
      modelId: data.modelId,
      apiKey: data.apiKey,
    });
  };

  return (
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

        {selectedModel?.requiresApiKey && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter API key for this model"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The API key will be securely stored and used when making requests to {selectedModel.name}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit">Save Assignment</Button>
      </form>
    </Form>
  );
};

export default ModelAssignmentForm;
