import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';
import { CalendarIcon, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CompanyLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  companies: { id: string; name: string }[];
  personType: 'talent' | 'contact';
  personId?: string;
  isSubmitting: boolean;
}

const CompanyLinkForm: React.FC<CompanyLinkFormProps> = ({
  isOpen,
  onClose,
  companies,
  personType,
  personId,
  isSubmitting
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isCurrent, setIsCurrent] = useState(true);
  
  const { createRelationship } = useCompanyPeopleRelationship();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany || !role || !personId) {
      return;
    }
    
    try {
      await createRelationship.mutateAsync({
        person_id: personId,
        company_id: selectedCompany,
        role,
        start_date: format(startDate, 'yyyy-MM-dd'),
        is_current: isCurrent,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error linking to company:', error);
    }
  };
  
  const resetForm = () => {
    setSelectedCompany('');
    setRole('');
    setStartDate(new Date());
    setIsCurrent(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      resetForm();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link to Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Select 
                value={selectedCompany} 
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger id="company">
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
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={personType === 'talent' ? "Job title" : "Contact role"}
              />
            </div>
            
            <div className="grid gap-2">
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="current">Current {personType === 'talent' ? 'position' : 'relationship'}</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              onClose();
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedCompany || !role || isSubmitting || createRelationship.isPending}>
              {createRelationship.isPending || isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Link to Company'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
