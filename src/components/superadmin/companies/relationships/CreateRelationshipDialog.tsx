
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompanyRelationshipTypes, useCompanyRelationshipMutations } from '@/hooks/useCompanyRelationships';
import { CompanyRelationshipAdvanced } from '@/types/company-relationships';

const relationshipSchema = z.object({
  parent_company_id: z.string().min(1, 'Parent company is required'),
  child_company_id: z.string().min(1, 'Child company is required'),
  relationship_type_id: z.string().min(1, 'Relationship type is required'),
  ownership_percentage: z.number().min(0).max(100).optional(),
  effective_date: z.date(),
  end_date: z.date().optional(),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

type RelationshipFormData = z.infer<typeof relationshipSchema>;

interface CreateRelationshipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  relationship?: CompanyRelationshipAdvanced | null;
  onSuccess: () => void;
}

const CreateRelationshipDialog: React.FC<CreateRelationshipDialogProps> = ({
  isOpen,
  onClose,
  companyId,
  relationship,
  onSuccess,
}) => {
  const { companies = [] } = useCompanies();
  const { data: relationshipTypes = [] } = useCompanyRelationshipTypes();
  const { createRelationship, updateRelationship } = useCompanyRelationshipMutations();

  const form = useForm<RelationshipFormData>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      parent_company_id: '',
      child_company_id: companyId,
      relationship_type_id: '',
      ownership_percentage: undefined,
      effective_date: new Date(),
      end_date: undefined,
      is_active: true,
      notes: '',
    },
  });

  const selectedRelationshipType = relationshipTypes.find(
    rt => rt.id === form.watch('relationship_type_id')
  );

  useEffect(() => {
    if (relationship) {
      form.reset({
        parent_company_id: relationship.parent_company_id,
        child_company_id: relationship.child_company_id,
        relationship_type_id: relationship.relationship_type_id,
        ownership_percentage: relationship.ownership_percentage || undefined,
        effective_date: new Date(relationship.effective_date),
        end_date: relationship.end_date ? new Date(relationship.end_date) : undefined,
        is_active: relationship.is_active,
        notes: relationship.notes || '',
      });
    } else {
      form.reset({
        parent_company_id: '',
        child_company_id: companyId,
        relationship_type_id: '',
        ownership_percentage: undefined,
        effective_date: new Date(),
        end_date: undefined,
        is_active: true,
        notes: '',
      });
    }
  }, [relationship, companyId, form]);

  const onSubmit = async (data: RelationshipFormData) => {
    try {
      const formattedData = {
        ...data,
        effective_date: format(data.effective_date, 'yyyy-MM-dd'),
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
        ownership_percentage: data.ownership_percentage || null,
        metadata: {},
      };

      if (relationship) {
        await updateRelationship.mutateAsync({
          id: relationship.id,
          ...formattedData,
        });
      } else {
        await createRelationship.mutateAsync(formattedData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving relationship:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {relationship ? 'Edit Relationship' : 'Create New Relationship'}
          </DialogTitle>
          <DialogDescription>
            {relationship 
              ? 'Modify the relationship details below.'
              : 'Define a new relationship between companies.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parent_company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="child_company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select child company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="relationship_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: type.color }}
                            />
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedRelationshipType?.allows_percentage && (
              <FormField
                control={form.control}
                name="ownership_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ownership Percentage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter ownership percentage"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="effective_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Effective Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Relationship</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Whether this relationship is currently active
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this relationship..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createRelationship.isPending || updateRelationship.isPending}
              >
                {(createRelationship.isPending || updateRelationship.isPending) && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                )}
                {relationship ? 'Update Relationship' : 'Create Relationship'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRelationshipDialog;
