
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PersonFormValues } from './schema';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PersonFormFieldsProps {
  form: UseFormReturn<PersonFormValues>;
  personType?: 'talent' | 'contact';
}

const PersonFormFields: React.FC<PersonFormFieldsProps> = ({ form, personType = 'talent' }) => {
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [isSearchingCompanies, setIsSearchingCompanies] = useState(false);

  const searchCompanies = async () => {
    if (!companySearchQuery) return;
    
    setIsSearchingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .ilike('name', `%${companySearchQuery}%`)
        .limit(10);
        
      if (error) throw error;
      
      setCompanies(data || []);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setIsSearchingCompanies(false);
    }
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
            <FormLabel>Email</FormLabel>
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
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number (optional)" {...field} />
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
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter location (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Only show company fields for contacts */}
      {personType === 'contact' && (
        <>
          <div className="space-y-2">
            <FormLabel>Company</FormLabel>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search companies..."
                  className="pl-8" 
                  value={companySearchQuery}
                  onChange={(e) => setCompanySearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCompanies()}
                />
              </div>
              <Button type="button" onClick={searchCompanies} disabled={isSearchingCompanies}>
                {isSearchingCompanies ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {companies.length > 0 && (
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role at Company</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter role at company (optional)" 
                    {...field} 
                    disabled={!form.getValues().company_id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default PersonFormFields;
