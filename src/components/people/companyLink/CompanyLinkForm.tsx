
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
import { CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLogger } from '@/hooks/audit/useAuditLogger';
import { MultiSelect } from "@/components/ui/multi-select";

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

interface PotentialDirectReport {
  id: string;
  full_name: string;
  role?: string;
}

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Role validation helper
const validateRole = (role: string): boolean => {
  return role.length >= 2 && role.length <= 100 && /^[a-zA-Z0-9\s\-&.,()]+$/.test(role);
};

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
  const [directReports, setDirectReports] = useState<string[]>([]);
  const [potentialManagers, setPotentialManagers] = useState<PotentialManager[]>([]);
  const [potentialDirectReports, setPotentialDirectReports] = useState<PotentialDirectReport[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logEvent } = useAuditLogger();

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

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
      setDirectReports([]);
      setPotentialManagers([]);
      setPotentialDirectReports([]);
      setValidationErrors({});
      setCompanySearchQuery('');
    }
  }, [isOpen, personId, personType]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!companyId) {
      errors.companyId = 'Company is required';
    }

    if (!role) {
      errors.role = 'Role is required';
    } else if (!validateRole(role)) {
      errors.role = 'Role must be 2-100 characters and contain only letters, numbers, spaces, and basic punctuation';
    }

    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    if (endDate && startDate && endDate <= startDate) {
      errors.endDate = 'End date must be after start date';
    }

    if (startDate && startDate > new Date()) {
      errors.startDate = 'Start date cannot be in the future';
    }

    // Validate circular reporting - person cannot report to themselves
    if (reportsTo === personId) {
      errors.reportsTo = 'Person cannot report to themselves';
    }

    // Validate circular reporting - person cannot be their own direct report
    if (directReports.includes(personId || '')) {
      errors.directReports = 'Person cannot be their own direct report';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch potential managers and direct reports when company changes
  useEffect(() => {
    const fetchPotentialPeople = async () => {
      if (!companyId || !personId) {
        setPotentialManagers([]);
        setPotentialDirectReports([]);
        return;
      }
      
      try {
        console.log('Fetching potential managers and direct reports for company:', companyId);
        
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
          console.error('Error fetching potential people:', error);
          throw error;
        }
        
        const people = data?.map(item => ({
          id: item.person?.id || '',
          full_name: item.person?.full_name || '',
          role: item.role
        })).filter(person => person.id && person.full_name) || [];
        
        console.log('Found potential people:', people);
        setPotentialManagers(people);
        setPotentialDirectReports(people);
      } catch (error) {
        console.error('Error fetching potential people:', error);
        toast({
          title: "Error",
          description: "Failed to load potential managers and direct reports",
          variant: "destructive"
        });
        setPotentialManagers([]);
        setPotentialDirectReports([]);
      }
    };
    
    fetchPotentialPeople();
  }, [companyId, personId, toast]);

  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!personId || !companyId || !role || !startDate) {
        throw new Error("Missing required fields.");
      }

      // Sanitize inputs
      const sanitizedRole = sanitizeInput(role);
      
      if (!validateRole(sanitizedRole)) {
        throw new Error("Invalid role format");
      }
      
      console.log('Creating relationship with data:', {
        person_id: personId,
        company_id: companyId,
        role: sanitizedRole,
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
        role: sanitizedRole,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        is_current: !endDate,
        relationship_type: personType === 'talent' ? 'employment' : 'business_contact',
        reports_to: reportsTo || null
      };
      
      const { data: relationshipData, error } = await supabase
        .from('company_relationships')
        .insert([dataToSubmit])
        .select();
      
      if (error) {
        console.error('Error creating relationship:', error);
        throw new Error(error.message);
      }

      // Update direct reports relationships if any selected
      if (directReports.length > 0) {
        const updatePromises = directReports.map(reportId => 
          supabase
            .from('company_relationships')
            .update({ reports_to: personId })
            .eq('person_id', reportId)
            .eq('company_id', companyId)
            .eq('is_current', true)
        );

        const results = await Promise.all(updatePromises);
        const hasErrors = results.some(result => result.error);
        
        if (hasErrors) {
          console.warn('Some direct report relationships could not be updated');
        }
      }
      
      return relationshipData;
    },
    onSuccess: (data) => {
      // Log audit event
      logEvent('CREATE', 'company_relationship', {
        entity_id: data?.[0]?.id,
        new_values: {
          person_id: personId,
          company_id: companyId,
          role: sanitizeInput(role),
          relationship_type: personType,
          reports_to: reportsTo || null,
          direct_reports_count: directReports.length
        },
        severity: 'medium',
        module_name: 'people_management'
      });

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
      
      // Log failed attempt
      logEvent('CREATE_FAILED', 'company_relationship', {
        severity: 'high',
        module_name: 'people_management',
        additional_context: { error: error.message }
      });

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
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors below.",
        variant: "destructive",
      });
      return;
    }
    
    createRelationshipMutation.mutate();
  };

  const handleCompanyChange = (value: string) => {
    console.log('Company changed to:', value);
    setCompanyId(value);
    setReportsTo(''); // Reset manager when company changes
    setDirectReports([]); // Reset direct reports when company changes
    // Clear company validation error when user selects a company
    if (validationErrors.companyId) {
      setValidationErrors(prev => ({ ...prev, companyId: '' }));
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRole(value);
    // Clear role validation error when user types
    if (validationErrors.role) {
      setValidationErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const isSubmitting = createRelationshipMutation.isPending || externalIsSubmitting;
  const canSubmit = companyId && role && startDate && !isSubmitting && Object.keys(validationErrors).length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Link Person to Company</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new company relationship for this person. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Company Selection with Search */}
          <div className="space-y-2">
            <Label htmlFor="company_select" className="text-sm font-medium">
              Company <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Select value={companyId} onValueChange={handleCompanyChange}>
                <SelectTrigger className={cn(
                  "w-full h-11 border-2 transition-colors bg-background",
                  validationErrors.companyId ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
                )}>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-[100]">
                  <div className="flex items-center border-b px-3 pb-2 mb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search companies..."
                      value={companySearchQuery}
                      onChange={(e) => setCompanySearchQuery(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  {filteredCompanies.length === 0 ? (
                    <div className="py-2 px-3 text-sm text-muted-foreground">
                      No companies found
                    </div>
                  ) : (
                    filteredCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {validationErrors.companyId && (
              <p className="text-sm text-destructive font-medium">{validationErrors.companyId}</p>
            )}
          </div>

          {/* Role Input */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role"
              value={role}
              onChange={handleRoleChange}
              placeholder="e.g., Software Engineer, Marketing Manager"
              className={cn(
                "h-11 border-2 transition-colors",
                validationErrors.role ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
              )}
              maxLength={100}
            />
            {validationErrors.role && (
              <p className="text-sm text-destructive font-medium">{validationErrors.role}</p>
            )}
          </div>

          {/* Date Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal border-2 transition-colors",
                      !startDate && "text-muted-foreground",
                      validationErrors.startDate ? "border-destructive" : "border-input hover:border-primary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-[100]" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      if (validationErrors.startDate) {
                        setValidationErrors(prev => ({ ...prev, startDate: '' }));
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.startDate && (
                <p className="text-sm text-destructive font-medium">{validationErrors.startDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal border-2 transition-colors",
                      !endDate && "text-muted-foreground",
                      validationErrors.endDate ? "border-destructive" : "border-input hover:border-primary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-[100]" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      if (validationErrors.endDate) {
                        setValidationErrors(prev => ({ ...prev, endDate: '' }));
                      }
                    }}
                    disabled={(date) => 
                      date > new Date() || 
                      (startDate && date < startDate)
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.endDate && (
                <p className="text-sm text-destructive font-medium">{validationErrors.endDate}</p>
              )}
            </div>
          </div>

          {/* Reporting Structure Section */}
          {companyId && (potentialManagers.length > 0 || potentialDirectReports.length > 0) && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Reporting Structure</h3>
              
              {/* Reports To (Manager) */}
              {potentialManagers.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="reports_to" className="text-sm font-medium">Reports To (Manager)</Label>
                  <Select value={reportsTo} onValueChange={(value) => {
                    setReportsTo(value);
                    if (validationErrors.reportsTo) {
                      setValidationErrors(prev => ({ ...prev, reportsTo: '' }));
                    }
                  }}>
                    <SelectTrigger className="h-11 border-2 bg-background">
                      <SelectValue placeholder="Select a manager (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-[100]">
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
                  {validationErrors.reportsTo && (
                    <p className="text-sm text-destructive font-medium">{validationErrors.reportsTo}</p>
                  )}
                </div>
              )}

              {/* Direct Reports */}
              {potentialDirectReports.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Direct Reports (Subordinates)</Label>
                  <MultiSelect
                    options={potentialDirectReports.map(person => ({
                      label: `${person.full_name}${person.role ? ` (${person.role})` : ''}`,
                      value: person.id
                    }))}
                    onValueChange={(values) => {
                      setDirectReports(values);
                      if (validationErrors.directReports) {
                        setValidationErrors(prev => ({ ...prev, directReports: '' }));
                      }
                    }}
                    value={directReports}
                    placeholder="Select direct reports (optional)"
                    maxCount={5}
                    className="bg-background"
                  />
                  {validationErrors.directReports && (
                    <p className="text-sm text-destructive font-medium">{validationErrors.directReports}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select people who will report to this person in their new role
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!canSubmit}
              className="h-11 min-w-[120px]"
            >
              {isSubmitting ? "Saving..." : "Save Relationship"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyLinkForm;
