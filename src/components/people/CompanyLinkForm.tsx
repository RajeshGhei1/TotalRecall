
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: Array<{ id: string; name: string }>;
  personId?: string;
  personType?: string;
  isSubmitting: boolean;
}

const formSchema = z.object({
  company_id: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  is_current: z.boolean().default(true),
  relationship_type: z.enum(['employment', 'business_contact']).default('employment'),
  reports_to: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personId,
  personType,
  isSubmitting,
}) => {
  const { createRelationship } = useCompanyPeopleRelationship();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [people, setPeople] = useState<Array<{id: string; name: string}>>([]);

  const defaultValues: FormValues = {
    company_id: '',
    role: '',
    start_date: new Date(),
    end_date: null,
    is_current: true,
    relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
    reports_to: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { watch } = form;
  const isCurrentPosition = watch('is_current');
  const watchCompanyId = watch('company_id');

  // Fetch people when company is selected
  React.useEffect(() => {
    const fetchPeopleFromCompany = async () => {
      if (!watchCompanyId) {
        setPeople([]);
        return;
      }
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Get current people in the company for manager selection
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            person_id,
            person:people(id, full_name)
          `)
          .eq('company_id', watchCompanyId)
          .eq('is_current', true);
          
        if (error) throw error;
        
        if (data) {
          // Make sure we handle types properly by checking each item's structure
          const peopleList = data
            .filter(item => {
              // Only include items where person is not null, has valid data, and is not the current person
              return (
                item.person !== null && 
                typeof item.person === 'object' &&
                'id' in item.person &&
                'full_name' in item.person &&
                item.person_id !== personId
              );
            })
            .map(item => {
              // Now we can safely access the person properties with proper type checking
              const person = item.person as { id: string; full_name: string };
              return {
                id: person.id,
                name: person.full_name
              };
            });
            
          setPeople(peopleList);
        }
      } catch (error) {
        console.error('Error fetching company people:', error);
      }
    };
    
    fetchPeopleFromCompany();
  }, [watchCompanyId, personId]);
  
  const handleFormSubmit = async (values: FormValues) => {
    if (!personId) return;
    
    await createRelationship.mutateAsync({
      person_id: personId,
      company_id: values.company_id,
      role: values.role,
      start_date: format(values.start_date, 'yyyy-MM-dd'),
      end_date: values.end_date ? format(values.end_date, 'yyyy-MM-dd') : null,
      is_current: values.is_current,
      relationship_type: values.relationship_type,
      reports_to: values.reports_to,
    });
    
    form.reset(defaultValues);
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link to Company</DialogTitle>
          <DialogDescription>
            Create a relationship between this person and a company
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      setSelectedCompanyId(value);
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role/Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {people.length > 0 && (
              <FormField
                control={form.control}
                name="reports_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reports To (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a manager (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No manager</SelectItem>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                          date > new Date()
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
              name="is_current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Current Position</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {!isCurrentPosition && (
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || (form.getValues('start_date') && date < form.getValues('start_date'))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="relationship_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select 
                    onValueChange={(value: 'employment' | 'business_contact') => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="business_contact">Business Contact</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
