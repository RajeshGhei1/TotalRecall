import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from '@tanstack/react-query';
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

interface Person {
  id: string;
  full_name: string;
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
  const [formData, setFormData] = useState({
    company_id: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: true,
    relationship_type: personType || 'employment',
    reports_to: ''
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = React.useState<Date | undefined>(null);
  const [potentialManagers, setPotentialManagers] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Fetch potential managers for talent type
  useEffect(() => {
    const fetchPotentialManagers = async () => {
      if (!personId || personType !== 'talent') return;
      
      try {
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
        const validManagers = data?.filter(item => item.person && typeof item.person === 'object' && 'id' in item.person) || [];
        
        setPotentialManagers(validManagers);
      } catch (error) {
        console.error('Error fetching potential managers:', error);
        toast({
          title: "Error",
          description: "Failed to load potential managers",
          variant: "destructive"
        });
      }
    };
    
    fetchPotentialManagers();
  }, [formData.company_id, personId, personType, toast]);
  
  const createRelationshipMutation = useMutation(
    async () => {
      if (!personId) {
        throw new Error("Person ID is missing.");
      }
      
      const { company_id, role, start_date, end_date, is_current, relationship_type, reports_to } = formData;
      
      if (!company_id || !role || !start_date) {
        throw new Error("Missing required fields.");
      }
      
      const { data, error } = await supabase
        .from('company_relationships')
        .insert([
          {
            person_id: personId,
            company_id: company_id,
            role: role,
            start_date: start_date,
            end_date: end_date === '' ? null : end_date,
            is_current: is_current,
            relationship_type: relationship_type,
            reports_to: reports_to === '' ? null : reports_to
          }
        ])
        .select()
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    {
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
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <Label htmlFor="company_id">Company</Label>
            <Select
              id="company_id"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
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
                    onSelect={(date) => {
                      setDate(date)
                      setFormData({ ...formData, start_date: date?.toISOString().split('T')[0] || '' })
                    }}
                    disabled={(date) =>
                      date > new Date()
                    }
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
                      "w-[240px] justify-start text-left font-normal",
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
                    onSelect={(endDate) => {
                      setEndDate(endDate)
                      setFormData({ ...formData, end_date: endDate?.toISOString().split('T')[0] || '' })
                    }}
                    disabled={(date) =>
                      date > new Date() || (date < date && date !== undefined)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {potentialManagers && potentialManagers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="reports_to">Reports To</Label>
              <Select value={formData.reports_to || ''} onValueChange={(value) => setFormData({ ...formData, reports_to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {potentialManagers.map(item => {
                    // Skip invalid entries where person data might be null
                    if (!item.person || typeof item.person !== 'object' || !('id' in item.person)) {
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
