
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CompanyFormValues } from '@/components/superadmin/companies/schema';
import { useCustomFields } from '@/hooks/customFields';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  created_at: string;
  industry?: string;
  size?: string;
  location?: string;
  // Add additional fields to match the schema
  cin?: string;
  companyStatus?: string;
  registeredOfficeAddress?: string;
  registrationDate?: string;
  registeredEmailAddress?: string;
  noOfDirectives?: string;
  globalRegion?: string;
  country?: string;
  region?: string;
  hoLocation?: string;
}

export const useCompanies = () => {
  const queryClient = useQueryClient();
  const { saveCustomFieldValues } = useCustomFields();

  // Extract custom field values from form data
  const extractCustomFieldValues = (formData: CompanyFormValues) => {
    const customFields: Record<string, any> = {};
    
    // Loop through all form values and extract those that start with "custom_"
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith('custom_')) {
        const fieldKey = key.replace('custom_', '');
        customFields[fieldKey] = value;
      }
    });
    
    return customFields;
  };

  // Fetch companies from the database
  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      // Use any() to make TS happy until the next Supabase client regeneration
      const { data, error } = await supabase
        .from('companies' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Company[];
    },
  });

  // Mutation for creating a new company
  const createCompany = useMutation({
    mutationFn: async (companyData: CompanyFormValues) => {
      // Extract the company data
      const companyDataForInsert = {
        name: companyData.name,
        domain: companyData.website,
        industry: companyData.industry,
        size: companyData.size,
        description: companyData.description,
        location: companyData.location,
        email: companyData.email,
        phone: companyData.phone,
        linkedin: companyData.linkedin,
        twitter: companyData.twitter,
        facebook: companyData.facebook,
        founded: companyData.founded,
        // Add tenant-specific fields
        cin: companyData.cin,
        companyStatus: companyData.companyStatus,
        registeredOfficeAddress: companyData.registeredOfficeAddress,
        registrationDate: companyData.registrationDate,
        registeredEmailAddress: companyData.registeredEmailAddress,
        noOfDirectives: companyData.noOfDirectives,
        globalRegion: companyData.globalRegion,
        country: companyData.country,
        region: companyData.region,
        hoLocation: companyData.hoLocation,
        industry1: companyData.industry1,
        industry2: companyData.industry2,
        industry3: companyData.industry3,
        companySector: companyData.companySector,
        companyType: companyData.companyType,
        entityType: companyData.entityType,
        noOfEmployee: companyData.noOfEmployee,
        segmentAsPerNumberOfEmployees: companyData.segmentAsPerNumberOfEmployees,
        turnOver: companyData.turnOver,
        segmentAsPerTurnover: companyData.segmentAsPerTurnover,
        turnoverYear: companyData.turnoverYear,
        yearOfEstablishment: companyData.yearOfEstablishment,
        paidupCapital: companyData.paidupCapital,
        segmentAsPerPaidUpCapital: companyData.segmentAsPerPaidUpCapital,
        areaOfSpecialize: companyData.areaOfSpecialize,
        serviceLine: companyData.serviceLine,
        verticles: companyData.verticles,
        companyProfile: companyData.companyProfile,
        endUserChannel: companyData.endUserChannel,
      };

      const { data, error } = await supabase
        .from('companies' as any)
        .insert([companyDataForInsert])
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(companyData);
      
      if (Object.keys(customFieldValues).length > 0) {
        await saveCustomFieldValues('company', data.id, customFieldValues);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Company created',
        description: 'The company has been created successfully',
      });
    },
    onError: (error: any) => {
      console.error("Error creating company:", error);
      toast({
        title: 'Error',
        description: `Failed to create company: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    companies,
    isLoading,
    error,
    createCompany,
  };
};
