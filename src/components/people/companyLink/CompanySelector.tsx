
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
import { Building } from 'lucide-react';

interface CompanySelectorProps {
  form: UseFormReturn<any>;
  companies: { id: string; name: string }[];
  onCompanyChange: (companyId: string) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  form,
  companies,
  onCompanyChange
}) => {
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
                field.onChange(value);
                onCompanyChange(value);
              }}
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
