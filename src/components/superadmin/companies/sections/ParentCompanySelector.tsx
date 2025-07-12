
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompanies } from '@/hooks/useCompanies';

interface ParentCompanySelectorProps {
  form: UseFormReturn<CompanyFormValues>;
  name: keyof CompanyFormValues;
  label: string;
  placeholder?: string;
  currentCompanyId?: string;
  disabled?: boolean;
}

const ParentCompanySelector: React.FC<ParentCompanySelectorProps> = ({
  form,
  name,
  label,
  placeholder = "Select parent company...",
  currentCompanyId,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { companies, isLoading } = useCompanies();

  // Ensure companies is always an array, even if undefined
  const safeCompanies = companies || [];

  // Filter companies to exclude current company and its children
  const availableCompanies = safeCompanies.filter(company => {
    // Exclude current company
    if (currentCompanyId && company.id === currentCompanyId) {
      return false;
    }
    
    // Exclude companies that have current company as parent (prevent circular references)
    if (currentCompanyId && company.parent_company_id === currentCompanyId) {
      return false;
    }
    
    return true;
  });

  // Filter by search value
  const filteredCompanies = availableCompanies.filter(company =>
    company.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedCompany = availableCompanies.find(
    company => company.id === form.getValues(name)
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={disabled}
                >
                  {selectedCompany ? (
                    <span className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      {selectedCompany.name}
                    </span>
                  ) : (
                    placeholder
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search companies..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>
                    {isLoading ? "Loading companies..." : "No companies found."}
                  </CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {filteredCompanies.map((company) => (
                      <CommandItem
                        key={company.id}
                        value={company.id}
                        onSelect={() => {
                          form.setValue(name, company.id as unknown);
                          // Auto-populate group name if not already set
                          if (!form.getValues('companyGroupName') && company.company_group_name) {
                            form.setValue('companyGroupName', company.company_group_name);
                          }
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === company.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{company.name}</div>
                            {company.company_group_name && (
                              <div className="text-xs text-muted-foreground">
                                Group: {company.company_group_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
          {field.value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.setValue(name, undefined as unknown);
              }}
              className="mt-1"
              disabled={disabled}
            >
              Clear Selection
            </Button>
          )}
        </FormItem>
      )}
    />
  );
};

export default ParentCompanySelector;
