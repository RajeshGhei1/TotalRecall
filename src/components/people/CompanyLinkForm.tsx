
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
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companies: { id: string; name: string }[];
  personType?: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

interface Person {
  id: string;
  full_name: string;
}

interface PotentialManager {
  person: Person | null;
}

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companies,
  personType,
  personId,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<LinkCompanyRelationshipData>({
    person_id: personId || '',
    company_id: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: true,
    relationship_type: personType as 'employment' | 'business_contact' || 'employment'
  });
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [potentialManagers, setPotentialManagers] = useState<PotentialManager[]>([]);
  const { toast } = useToast();
  
  // Reset form data when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setDate(new Date());
      setEndDate(undefined);
      setFormData({
        person_id: personId || '',
        company_id: '',
        role: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_current: true,
        relationship_type: personType as 'employment' | 'business_contact' || 'employment'
      });
    }
  }, [isOpen, personId, personType]);
  
  // Fetch potential managers for talent type
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!personId || personType !== 'talent' || !formData.company_id) {
        setPotentialManagers([]);
        return;
      }
      
      try {
        console.log("Fetching managers for company:", formData.company_id);
        const { data, error } = await supabase
          .from('company_relationships')
          .select(`
            person:people(id, full_name)
          `)
          .eq('company_id', formData.company_id)
          .eq('is_current', true)
          .neq('person_id', personId);
          
        if (error) throw error;
        
        // Filter out invalid entries
        const validManagers = data?.filter(item => item && item.person) || [];
        console.log("Found potential managers:", validManagers.length, validManagers);
        
        setPotentialManagers(validManagers);
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
  }, [formData.company_id, personId, personType, toast]);
  
  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!personId) {
        throw new Error("Person ID is missing.");
      }
      
      if (!formData.company_id || !formData.role || !formData.start_date) {
        throw new Error("Missing required fields.");
      }
      
      const dataToSubmit = {
        ...formData,
        person_id: personId,
        end_date: formData.end_date === '' ? null : formData.end_date,
        reports_to: formData.reports_to === '' ? null : formData.reports_to
      };
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company relationship created successfully.",
      });
      onSubmit();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create company relationship.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we have a start date
    if (!formData.start_date && date) {
      setFormData({
        ...formData,
        start_date: date.toISOString().split('T')[0]
      });
    }
    
    createRelationshipMutation.mutate();
  };

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
          <div className="space-y-2">
            <Label htmlFor="company_select">Company</Label>
            <Select
              value={formData.company_id}
              onValueChange={(value) => setFormData({ ...formData, company_id: value, reports_to: '' })}
            >
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
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button" 
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setFormData({ ...formData, start_date: newDate?.toISOString().split('T')[0] || '' });
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      endDate ? "" : "text-muted-foreground"
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
                    onSelect={(newEndDate) => {
                      setEndDate(newEndDate);
                      setFormData({ ...formData, end_date: newEndDate?.toISOString().split('T')[0] || '' });
                    }}
                    disabled={(date) =>
                      date > new Date() || (date && date < new Date(formData.start_date))
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {personType === 'talent' && potentialManagers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="reports_to">Reports To</Label>
              <Select 
                value={formData.reports_to || ''} 
                onValueChange={(value) => setFormData({ ...formData, reports_to: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {potentialManagers.map(item => {
                    // Skip invalid entries where person data might be null
                    if (!item || !item.person) {
                      return null;
                    }
                    
                    return (
                      <SelectItem key={item.person.id} value={item.person.id}>
                        {item.person.full_name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || createRelationshipMutation.isPending}>
              {isSubmitting || createRelationshipMutation.isPending ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
