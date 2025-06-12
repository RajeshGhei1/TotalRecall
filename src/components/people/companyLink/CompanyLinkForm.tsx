
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: { id: string; name: string }[];
  personType?: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

interface PotentialManager {
  id: string;
  full_name: string;
  role?: string;
}

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personType = 'contact',
  personId,
  isSubmitting: externalIsSubmitting
}) => {
  // Form state
  const [companyId, setCompanyId] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reportsTo, setReportsTo] = useState('');
  const [potentialManagers, setPotentialManagers] = useState<PotentialManager[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log('CompanyLinkForm opened for person:', personId, 'type:', personType);
      // Reset all form fields
      setCompanyId('');
      setRole('');
      setStartDate(undefined);
      setEndDate(undefined);
      setReportsTo('');
      setPotentialManagers([]);
    }
  }, [isOpen, personId, personType]);

  // Fetch potential managers when company changes
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!companyId || !personId) {
        setPotentialManagers([]);
        return;
      }
      
      try {
        console.log('Fetching potential managers for company:', companyId);
        
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            role,
            person:people(id, full_name)
          `)
          .eq('company_id', companyId)
          .eq('is_current', true)
          .neq('person_id', personId);
          
        if (error) {
          console.error('Error fetching potential managers:', error);
          throw error;
        }
        
        const managers = data?.map(item => ({
          id: item.person?.id || '',
          full_name: item.person?.full_name || '',
          role: item.role
        })).filter(manager => manager.id && manager.full_name) || [];
        
        console.log('Found potential managers:', managers);
        setPotentialManagers(managers);
      } catch (error) {
        console.error('Error fetching potential managers:', error);
        toast({
          title: "Error",
          description: "Failed to load potential managers",
          variant: "destructive"
        });
        setPotentialManagers([]);
      }
    };
    
    fetchPotentialManagers();
  }, [companyId, personId, toast]);

  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!personId || !companyId || !role || !startDate) {
        throw new Error("Missing required fields.");
      }
      
      console.log('Creating relationship with data:', {
        person_id: personId,
        company_id: companyId,
        role,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        is_current: !endDate,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
        reports_to: reportsTo || null
      });
      
      // If this is a current role, make sure no other current roles exist for this person
      if (!endDate) {
        const { error: updateError } = await supabase
          .from('company_relationships')
          .update({ 
            is_current: false,
            end_date: new Date().toISOString().split('T')[0]
          })
          .eq('person_id', personId)
          .eq('is_current', true);
          
        if (updateError) {
          console.error('Error updating existing relationships:', updateError);
          throw updateError;
        }
      }
      
      const dataToSubmit = {
        person_id: personId,
        company_id: companyId,
        role,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        is_current: !endDate,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
        reports_to: reportsTo || null
      };
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        console.error('Error creating relationship:', error);
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company relationship created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['company-relationships'] });
      onSubmit();
      onClose();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create company relationship.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    createRelationshipMutation.mutate();
  };

  const handleCompanyChange = (value: string) => {
    console.log('Company changed to:', value);
    setCompanyId(value);
    setReportsTo(''); // Reset manager when company changes
  };

  const isSubmitting = createRelationshipMutation.isPending || externalIsSubmitting;
  const canSubmit = companyId && role && startDate && !isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Person to Company</DialogTitle>
          <DialogDescription>
            Create a new company relationship for this person.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company_select">Company</Label>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Input */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter role"
            />
          </div>

          {/* Date Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => 
                      date > new Date() || 
                      (startDate && date < startDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Manager Selection */}
          {companyId && potentialManagers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="reports_to">Reports To</Label>
              <Select value={reportsTo} onValueChange={setReportsTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {potentialManagers.map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      <div className="flex flex-col">
                        <span>{manager.full_name}</span>
                        {manager.role && (
                          <span className="text-xs text-muted-foreground">{manager.role}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!canSubmit}
            >
              {isSubmitting ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
