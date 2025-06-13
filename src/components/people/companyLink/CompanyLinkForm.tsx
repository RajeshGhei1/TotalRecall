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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Check, ChevronsUpDown, X, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLogger } from '@/hooks/audit/useAuditLogger';
import { Badge } from "@/components/ui/badge";
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

interface Company {
  id: string;
  name: string;
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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reportsTo, setReportsTo] = useState('');
  const [directReports, setDirectReports] = useState<string[]>([]);
  const [potentialManagers, setPotentialManagers] = useState<PotentialManager[]>([]);
  const [potentialDirectReports, setPotentialDirectReports] = useState<PotentialDirectReport[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Company search state
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
  const [isCompanyPopoverOpen, setIsCompanyPopoverOpen] = useState(false);
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false);

  // Manager search state
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [searchedManagers, setSearchedManagers] = useState<PotentialManager[]>([]);
  const [isManagerPopoverOpen, setIsManagerPopoverOpen] = useState(false);
  const [isSearchingManagers, setIsSearchingManagers] = useState(false);
  const [selectedManager, setSelectedManager] = useState<PotentialManager | null>(null);

  // Direct reports search state
  const [directReportSearchQuery, setDirectReportSearchQuery] = useState('');
  const [searchedDirectReports, setSearchedDirectReports] = useState<PotentialDirectReport[]>([]);
  const [isDirectReportPopoverOpen, setIsDirectReportPopoverOpen] = useState(false);
  const [isSearchingDirectReports, setIsSearchingDirectReports] = useState(false);
  const [selectedDirectReports, setSelectedDirectReports] = useState<PotentialDirectReport[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logEvent } = useAuditLogger();

  // Search companies dynamically
  const searchCompanies = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchedCompanies([]);
      return;
    }

    setIsSearchingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(10);

      if (error) throw error;
      
      setSearchedCompanies(data || []);
    } catch (error) {
      console.error('Error searching companies:', error);
      setSearchedCompanies([]);
    } finally {
      setIsSearchingCompanies(false);
    }
  };

  // Search managers dynamically
  const searchManagers = async (query: string) => {
    if (!query || query.length < 2 || !companyId) {
      setSearchedManagers([]);
      return;
    }

    setIsSearchingManagers(true);
    try {
      const { data, error } = await supabase
        .from('company_relationships')
        .select(`
          role,
          person:people(id, full_name)
        `)
        .eq('company_id', companyId)
        .eq('is_current', true)
        .neq('person_id', personId)
        .ilike('people.full_name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      
      const managers = data?.map(item => ({
        id: item.person?.id || '',
        full_name: item.person?.full_name || '',
        role: item.role
      })).filter(person => person.id && person.full_name) || [];
      
      setSearchedManagers(managers);
    } catch (error) {
      console.error('Error searching managers:', error);
      setSearchedManagers([]);
    } finally {
      setIsSearchingManagers(false);
    }
  };

  // Search direct reports dynamically
  const searchDirectReports = async (query: string) => {
    if (!query || query.length < 2 || !companyId) {
      setSearchedDirectReports([]);
      return;
    }

    setIsSearchingDirectReports(true);
    try {
      const { data, error } = await supabase
        .from('company_relationships')
        .select(`
          role,
          person:people(id, full_name)
        `)
        .eq('company_id', companyId)
        .eq('is_current', true)
        .neq('person_id', personId)
        .ilike('people.full_name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      
      const reports = data?.map(item => ({
        id: item.person?.id || '',
        full_name: item.person?.full_name || '',
        role: item.role
      })).filter(person => person.id && person.full_name) || [];
      
      setSearchedDirectReports(reports);
    } catch (error) {
      console.error('Error searching direct reports:', error);
      setSearchedDirectReports([]);
    } finally {
      setIsSearchingDirectReports(false);
    }
  };

  // Debounced search effects
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCompanies(companySearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [companySearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchManagers(managerSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [managerSearchQuery, companyId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchDirectReports(directReportSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [directReportSearchQuery, companyId]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log('CompanyLinkForm opened for person:', personId, 'type:', personType);
      // Reset all form fields
      setCompanyId('');
      setSelectedCompany(null);
      setRole('');
      setStartDate(undefined);
      setEndDate(undefined);
      setReportsTo('');
      setDirectReports([]);
      setSelectedManager(null);
      setSelectedDirectReports([]);
      setValidationErrors({});
      setCompanySearchQuery('');
      setSearchedCompanies([]);
      setManagerSearchQuery('');
      setSearchedManagers([]);
      setDirectReportSearchQuery('');
      setSearchedDirectReports([]);
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

  const handleCompanySelect = (company: Company) => {
    console.log('Company selected:', company);
    setCompanyId(company.id);
    setSelectedCompany(company);
    setReportsTo('');
    setDirectReports([]);
    setSelectedManager(null);
    setSelectedDirectReports([]);
    setIsCompanyPopoverOpen(false);
    if (validationErrors.companyId) {
      setValidationErrors(prev => ({ ...prev, companyId: '' }));
    }
  };

  const handleManagerSelect = (manager: PotentialManager) => {
    setSelectedManager(manager);
    setReportsTo(manager.id);
    setIsManagerPopoverOpen(false);
    if (validationErrors.reportsTo) {
      setValidationErrors(prev => ({ ...prev, reportsTo: '' }));
    }
  };

  const handleDirectReportSelect = (report: PotentialDirectReport) => {
    if (!selectedDirectReports.find(r => r.id === report.id)) {
      const newReports = [...selectedDirectReports, report];
      setSelectedDirectReports(newReports);
      setDirectReports(newReports.map(r => r.id));
      setIsDirectReportPopoverOpen(false);
      setDirectReportSearchQuery('');
      if (validationErrors.directReports) {
        setValidationErrors(prev => ({ ...prev, directReports: '' }));
      }
    }
  };

  const handleRemoveDirectReport = (reportId: string) => {
    const newReports = selectedDirectReports.filter(r => r.id !== reportId);
    setSelectedDirectReports(newReports);
    setDirectReports(newReports.map(r => r.id));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRole(value);
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
          {/* Company Search Selection */}
          <div className="space-y-2">
            <Label htmlFor="company_select" className="text-sm font-medium">
              Company <span className="text-destructive">*</span>
            </Label>
            <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isCompanyPopoverOpen}
                  className={cn(
                    "w-full h-11 justify-between border-2 transition-colors",
                    validationErrors.companyId ? 'border-destructive' : 'border-input hover:border-primary'
                  )}
                >
                  {selectedCompany ? selectedCompany.name : "Search and select a company..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-background border shadow-lg" align="start">
                <Command className="w-full">
                  <CommandInput
                    placeholder="Search companies..."
                    value={companySearchQuery}
                    onValueChange={setCompanySearchQuery}
                    className="h-9"
                  />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>
                      {isSearchingCompanies ? "Searching..." : "No companies found"}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchedCompanies.map((company) => (
                        <CommandItem
                          key={company.id}
                          value={company.name}
                          onSelect={() => handleCompanySelect(company)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {company.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {validationErrors.companyId && (
              <p className="text-sm text-destructive font-medium">{validationErrors.companyId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Start typing to search for companies. Select one from the dropdown.
            </p>
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
          {companyId && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Reporting Structure
              </h3>
              
              {/* Reports To (Manager) */}
              <div className="space-y-2">
                <Label htmlFor="reports_to" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Reports To (Manager)
                </Label>
                <Popover open={isManagerPopoverOpen} onOpenChange={setIsManagerPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full h-11 justify-between border-2 bg-background"
                    >
                      {selectedManager ? 
                        `${selectedManager.full_name}${selectedManager.role ? ` (${selectedManager.role})` : ''}` :
                        "Search and select a manager (optional)"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-background border shadow-lg">
                    <Command>
                      <CommandInput 
                        placeholder="Search managers..." 
                        value={managerSearchQuery}
                        onValueChange={setManagerSearchQuery}
                      />
                      <CommandList className="max-h-[200px]">
                        <CommandEmpty>
                          {isSearchingManagers ? "Searching..." : "No managers found"}
                        </CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              setSelectedManager(null);
                              setReportsTo('');
                              setIsManagerPopoverOpen(false);
                              if (validationErrors.reportsTo) {
                                setValidationErrors(prev => ({ ...prev, reportsTo: '' }));
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !selectedManager ? "opacity-100" : "opacity-0"
                              )}
                            />
                            None
                          </CommandItem>
                          {searchedManagers.map(manager => (
                            <CommandItem
                              key={manager.id}
                              value={manager.full_name}
                              onSelect={() => handleManagerSelect(manager)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedManager?.id === manager.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{manager.full_name}</span>
                                {manager.role && (
                                  <span className="text-xs text-muted-foreground">{manager.role}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {validationErrors.reportsTo && (
                  <p className="text-sm text-destructive font-medium">{validationErrors.reportsTo}</p>
                )}
              </div>

              {/* Direct Reports */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Direct Reports (Subordinates)
                </Label>
                
                {/* Selected Direct Reports */}
                {selectedDirectReports.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDirectReports.map(report => (
                      <Badge key={report.id} variant="secondary" className="flex items-center gap-1">
                        {report.full_name}
                        {report.role && <span className="text-xs">({report.role})</span>}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveDirectReport(report.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Popover open={isDirectReportPopoverOpen} onOpenChange={setIsDirectReportPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full h-11 justify-between border-2 bg-background"
                    >
                      Search and add direct reports (optional)
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-background border shadow-lg">
                    <Command>
                      <CommandInput 
                        placeholder="Search people..." 
                        value={directReportSearchQuery}
                        onValueChange={setDirectReportSearchQuery}
                      />
                      <CommandList className="max-h-[200px]">
                        <CommandEmpty>
                          {isSearchingDirectReports ? "Searching..." : "No people found"}
                        </CommandEmpty>
                        <CommandGroup>
                          {searchedDirectReports
                            .filter(report => !selectedDirectReports.find(r => r.id === report.id))
                            .map(report => (
                            <CommandItem
                              key={report.id}
                              value={report.full_name}
                              onSelect={() => handleDirectReportSelect(report)}
                            >
                              <div className="flex flex-col">
                                <span>{report.full_name}</span>
                                {report.role && (
                                  <span className="text-xs text-muted-foreground">{report.role}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {validationErrors.directReports && (
                  <p className="text-sm text-destructive font-medium">{validationErrors.directReports}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Search and select people who will report to this person in their new role
                </p>
              </div>
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
