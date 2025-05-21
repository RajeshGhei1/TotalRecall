
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CompanyFormValues } from '@/components/superadmin/companies/schema';
import { useCustomFields } from '@/hooks/useCustomFields';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  description?: string;
  created_at: string;
  industry?: string;
  size?: string;
  location?: string;
  // Add missing properties to match the schema
  email?: string;
  phone?: string;
  founded?: number;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  // Tenant-specific properties
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
  noOfEmployee?: string;
  turnover?: string;
  industry1?: string;
  industry2?: string;
  industry3?: string;
  companySector?: string;
  companyType?: string;
  entityType?: string;
  segmentAsPerNumberOfEmployees?: string;
  segmentAsPerTurnover?: string;
  turnoverYear?: string;
  yearOfEstablishment?: string;
  paidupCapital?: string;
  segmentAsPerPaidUpCapital?: string;
  areaOfSpecialize?: string;
  serviceLine?: string;
  verticles?: string;
  companyProfile?: string;
  endUserChannel?: string;
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
    refetch, // Explicitly expose the refetch function
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      // Fix the type issue by explicitly casting the data
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Explicitly cast the result to Company[] to fix the TypeScript error
      return (data as unknown) as Company[];
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
        .from('companies')
        .insert([companyDataForInsert])
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(companyData);
      
      if (Object.keys(customFieldValues).length > 0) {
        // Fix the TypeScript error by using a type assertion for data.id
        await saveCustomFieldValues('company', (data as any).id, customFieldValues);
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
    refetch, // Return the refetch function
  };
};
