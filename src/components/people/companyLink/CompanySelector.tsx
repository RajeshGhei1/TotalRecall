
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Loader2 } from 'lucide-react';

interface CompanySelectorFormData {
  company_id: string;
  [key: string]: unknown;
}

interface CompanySelectorProps {
  form: UseFormReturn<CompanySelectorFormData>;
  companies: { id: string; name: string }[];
  onCompanyChange: (companyId: string) => void;
  isLoading?: boolean;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  form,
  companies,
  onCompanyChange,
  isLoading = false
}) => {
  console.log('CompanySelector companies:', companies);
  
  return (
    <FormField
      control={form.control}
      name="company_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Company <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                console.log('Selected company:', value);
                field.onChange(value);
                onCompanyChange(value);
              }}
              disabled={isLoading || companies.length === 0}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={
                  isLoading 
                    ? "Loading companies..." 
                    : companies.length === 0 
                      ? "No companies available" 
                      : "Select a company"
                } />
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {companies.map((company) => (
                  <SelectItem 
                    key={company.id} 
                    value={company.id}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
