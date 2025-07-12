
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
import { MapPin, Loader2 } from 'lucide-react';

interface BranchOffice {
  id: string;
  branch_name: string;
  city?: string;
  is_headquarters: boolean;
}

interface BranchOfficeSelectorFormData {
  branch_office_id?: string;
  [key: string]: unknown;
}

interface BranchOfficeSelectorProps {
  form: UseFormReturn<BranchOfficeSelectorFormData>;
  branchOffices: BranchOffice[];
  isLoading: boolean;
}

export const BranchOfficeSelector: React.FC<BranchOfficeSelectorProps> = ({
  form,
  branchOffices,
  isLoading
}) => {
  return (
    <FormField
      control={form.control}
      name="branch_office_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Branch Office
          </FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading || branchOffices.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoading 
                    ? "Loading branches..." 
                    : branchOffices.length === 0 
                      ? "No branches available" 
                      : "Select a branch office (optional)"
                } />
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific branch</SelectItem>
                {branchOffices.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center gap-2">
                      {branch.branch_name}
                      {branch.is_headquarters && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">HQ</span>
                      )}
                      {branch.city && (
                        <span className="text-xs text-muted-foreground">({branch.city})</span>
                      )}
                    </div>
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
