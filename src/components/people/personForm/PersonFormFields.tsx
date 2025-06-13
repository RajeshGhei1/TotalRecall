import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PersonFormValues } from './schema';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";

interface PersonFormFieldsProps {
  form: UseFormReturn<PersonFormValues>;
  personType?: 'talent' | 'contact';
  personId?: string;
}

interface Company {
  id: string;
  name: string;
}

interface ReportingPerson {
  id: string;
  full_name: string;
  role?: string;
}

const PersonFormFields: React.FC<PersonFormFieldsProps> = ({ form, personType, personId }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  
  const [reportingTo, setReportingTo] = useState<ReportingPerson[]>([]);
  const [selectedReportingTo, setSelectedReportingTo] = useState<ReportingPerson | null>(null);
  const [isReportingToOpen, setIsReportingToOpen] = useState(false);
  
  const [reportingFrom, setReportingFrom] = useState<ReportingPerson[]>([]);
  const [selectedReportingFrom, setSelectedReportingFrom] = useState<ReportingPerson[]>([]);
  const [isReportingFromOpen, setIsReportingFromOpen] = useState(false);
  
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [reportingToSearchQuery, setReportingToSearchQuery] = useState('');
  const [reportingFromSearchQuery, setReportingFromSearchQuery] = useState('');

  // Search companies
  const searchCompanies = async (query: string) => {
    if (!query || query.length < 2) {
      setCompanies([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(10);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error searching companies:', error);
      setCompanies([]);
    }
  };

  // Search people for reporting relationships
  const searchPeople = async (query: string, companyId?: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      let queryBuilder = supabase
        .from('people')
        .select('id, full_name')
        .ilike('full_name', `%${query}%`)
        .order('full_name')
        .limit(10);

      if (personId) {
        queryBuilder = queryBuilder.neq('id', personId);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching people:', error);
      return [];
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
    const timer = setTimeout(async () => {
      const people = await searchPeople(reportingToSearchQuery, selectedCompany?.id);
      setReportingTo(people);
    }, 300);
    return () => clearTimeout(timer);
  }, [reportingToSearchQuery, selectedCompany?.id, personId]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const people = await searchPeople(reportingFromSearchQuery, selectedCompany?.id);
      setReportingFrom(people);
    }, 300);
    return () => clearTimeout(timer);
  }, [reportingFromSearchQuery, selectedCompany?.id, personId]);

  const handleRemoveReportingFrom = (personIdToRemove: string) => {
    const newReportingFrom = selectedReportingFrom.filter(p => p.id !== personIdToRemove);
    setSelectedReportingFrom(newReportingFrom);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{personType === 'contact' ? 'Company Email' : 'Email'}</FormLabel>
            <FormControl>
              <Input placeholder="Enter email address" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business Contact specific fields */}
      {personType === 'contact' && (
        <>
          {/* Personal Email */}
          <FormField
            control={form.control}
            name="personal_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Email ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter personal email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Name */}
          <div className="space-y-2">
            <FormLabel>Company Name</FormLabel>
            <Popover open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isCompanyOpen}
                  className="w-full justify-between"
                >
                  {selectedCompany ? selectedCompany.name : "Search and select a company..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search companies..."
                    value={companySearchQuery}
                    onValueChange={setCompanySearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No companies found</CommandEmpty>
                    <CommandGroup>
                      {companies.map((company) => (
                        <CommandItem
                          key={company.id}
                          value={company.name}
                          onSelect={() => {
                            setSelectedCompany(company);
                            setIsCompanyOpen(false);
                          }}
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
          </div>

          {/* Reporting To */}
          <div className="space-y-2">
            <FormLabel>Reporting To (Manager)</FormLabel>
            <Popover open={isReportingToOpen} onOpenChange={setIsReportingToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedReportingTo ? selectedReportingTo.full_name : "Search and select manager..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search people..."
                    value={reportingToSearchQuery}
                    onValueChange={setReportingToSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No people found</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setSelectedReportingTo(null);
                          setIsReportingToOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !selectedReportingTo ? "opacity-100" : "opacity-0"
                          )}
                        />
                        None
                      </CommandItem>
                      {reportingTo.map((person) => (
                        <CommandItem
                          key={person.id}
                          value={person.full_name}
                          onSelect={() => {
                            setSelectedReportingTo(person);
                            setIsReportingToOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedReportingTo?.id === person.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {person.full_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Reporting From (Direct Reports) */}
          <div className="space-y-2">
            <FormLabel>Reporting From (Direct Reports)</FormLabel>
            
            {/* Selected Direct Reports */}
            {selectedReportingFrom.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedReportingFrom.map(person => (
                  <Badge key={person.id} variant="secondary" className="flex items-center gap-1">
                    {person.full_name}
                    <button
                      type="button"
                      onClick={() => handleRemoveReportingFrom(person.id)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <Popover open={isReportingFromOpen} onOpenChange={setIsReportingFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  Search and add direct reports...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search people..."
                    value={reportingFromSearchQuery}
                    onValueChange={setReportingFromSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No people found</CommandEmpty>
                    <CommandGroup>
                      {reportingFrom
                        .filter(person => !selectedReportingFrom.find(selected => selected.id === person.id))
                        .map((person) => (
                        <CommandItem
                          key={person.id}
                          value={person.full_name}
                          onSelect={() => {
                            setSelectedReportingFrom([...selectedReportingFrom, person]);
                            setReportingFromSearchQuery('');
                            setIsReportingFromOpen(false);
                          }}
                        >
                          {person.full_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
      
      {/* Type field is hidden since we don't want to allow changing it */}
      <input 
        type="hidden" 
        {...form.register("type")} 
        value={personType} 
      />
    </div>
  );
};

export default PersonFormFields;
