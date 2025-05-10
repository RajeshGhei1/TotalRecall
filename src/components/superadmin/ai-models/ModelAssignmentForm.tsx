
import React from 'react';
import { useForm } from 'react-hook-form';
import { AIModel } from './types';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
}

const ModelAssignmentForm = ({ 
  selectedTenantId, 
  availableModels,
  defaultModelId 
}: ModelAssignmentFormProps) => {
  const form = useForm({
    defaultValues: {
      modelId: defaultModelId,
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
  );
};

export default ModelAssignmentForm;
