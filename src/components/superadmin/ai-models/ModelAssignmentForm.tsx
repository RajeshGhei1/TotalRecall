
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AIModel } from './types';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
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
import { useTenantModel, getModelById, useAssignModelToTenant } from './AIModelData';

interface ModelAssignmentFormProps {
  selectedTenantId: string | null;
  availableModels: AIModel[];
}

interface FormValues {
  modelId: string;
  apiKey: string;
}

const ModelAssignmentForm = ({ 
  selectedTenantId, 
  availableModels
}: ModelAssignmentFormProps) => {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const { data: tenantModelData, isLoading: isLoadingTenantModel } = useTenantModel(selectedTenantId);
  const assignModelMutation = useAssignModelToTenant();
  
  const form = useForm<FormValues>({
    defaultValues: {
      modelId: '',
      apiKey: '',
    },
  });

  // Update form values when tenant model data changes
  useEffect(() => {
    if (tenantModelData) {
      form.setValue('modelId', tenantModelData.model_id);
      if (tenantModelData.api_key) {
        form.setValue('apiKey', tenantModelData.api_key);
      }
      
      // Set selected model
      const model = getModelById(tenantModelData.model_id, availableModels);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, [tenantModelData, form, availableModels]);

  // Update selected model when modelId changes
  useEffect(() => {
    const modelId = form.watch('modelId');
    if (modelId) {
      const model = availableModels.find(m => m.id === modelId) || null;
      setSelectedModel(model);
    }
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

    assignModelMutation.mutate({
      tenantId: selectedTenantId,
      modelId: data.modelId,
      apiKey: data.apiKey
    });
  };

  if (isLoadingTenantModel) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                value={field.value}
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
        
        <Button 
          type="submit" 
          disabled={assignModelMutation.isPending}
          className="flex items-center gap-2"
        >
          {assignModelMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Save Assignment
        </Button>
      </form>
    </Form>
  );
};

export default ModelAssignmentForm;
