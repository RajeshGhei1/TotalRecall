
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyFormValues } from '@/components/superadmin/companies/schema';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';
import { logger } from '@/utils/logger';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  description?: string;
  created_at: string;
  size?: string;
  location?: string;
  // Add missing properties to match the schema
  email?: string;
  phone?: string;
  founded?: number;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  // Tenant-specific properties - using lowercase to match database
  cin?: string;
  companystatus?: string;
  registeredofficeaddress?: string;
  registrationdate?: string;
  registeredemailaddress?: string;
  noofdirectives?: string;
  globalregion?: string;
  country?: string;
  region?: string;
  holocation?: string;
  noofemployee?: string;
  turnover?: string;
  industry1?: string;
  industry2?: string;
  industry3?: string;
  companysector?: string;
  companytype?: string;
  entitytype?: string;
  segmentaspernumberofemployees?: string;
  segmentasperturnover?: string;
  turnoveryear?: string;
  yearofestablishment?: string;
  paidupcapital?: string;
  segmentasperpaidupcapital?: string;
  areaofspecialize?: string;
  serviceline?: string;
  verticles?: string;
  companyprofile?: string;
  // Add parent company and group structure fields
  parent_company_id?: string;
  company_group_name?: string;
  hierarchy_level?: number;
}

export const useCompanies = () => {
  const queryClient = useQueryClient();
  const { saveCustomFieldValues } = useCustomFields();
  const { createSecureKey } = useSecureQueryKey();

  // Extract custom field values from form data
  const extractCustomFieldValues = (formData: CompanyFormValues) => {
    const customFields: Record<string, unknown> = {};
    
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
    refetch,
  } = useQuery({
    queryKey: createSecureKey(['companies']),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as unknown) as Company[];
    },
  });

  // Mutation for creating a new company
  const createCompany = useMutation({
    mutationFn: async (companyData: CompanyFormValues) => {
      // Calculate hierarchy level based on parent
      let hierarchyLevel = 0;
      if (companyData.parentCompanyId) {
        const parentCompany = companies?.find(c => c.id === companyData.parentCompanyId);
        if (parentCompany) {
          hierarchyLevel = (parentCompany.hierarchy_level || 0) + 1;
        }
      }

      // Extract the company data and convert Date to string
      const companyDataForInsert = {
        name: companyData.name,
        domain: companyData.website,
        size: companyData.size,
        description: companyData.description,
        location: companyData.location,
        email: companyData.email,
        phone: companyData.phone,
        linkedin: companyData.linkedin,
        twitter: companyData.twitter,
        facebook: companyData.facebook,
        founded: companyData.founded,
        // Add tenant-specific fields - using lowercase to match database
        cin: companyData.cin,
        companystatus: companyData.companyStatus,
        registeredofficeaddress: companyData.registeredOfficeAddress,
        registrationdate: companyData.registrationDate ? companyData.registrationDate.toISOString() : null,
        registeredemailaddress: companyData.registeredEmailAddress,
        noofdirectives: companyData.noOfDirectives,
        globalregion: companyData.globalRegion,
        country: companyData.country,
        region: companyData.region,
        holocation: companyData.hoLocation,
        industry1: companyData.industry1,
        industry2: companyData.industry2,
        industry3: companyData.industry3,
        companysector: companyData.companySector,
        companytype: companyData.companyType,
        entitytype: companyData.entityType,
        noofemployee: companyData.noOfEmployee,
        segmentaspernumberofemployees: companyData.segmentAsPerNumberOfEmployees,
        turnover: companyData.turnOver,
        segmentasperturnover: companyData.segmentAsPerTurnover,
        turnoveryear: companyData.turnoverYear,
        yearofestablishment: companyData.yearOfEstablishment,
        paidupcapital: companyData.paidupCapital,
        segmentasperpaidupcapital: companyData.segmentAsPerPaidUpCapital,
        areaofspecialize: companyData.areaOfSpecialize,
        serviceline: companyData.serviceLine,
        verticles: companyData.verticles,
        companyprofile: companyData.companyProfile,
        // Add parent company and group structure fields
        parent_company_id: companyData.parentCompanyId || null,
        company_group_name: companyData.companyGroupName || null,
        hierarchy_level: hierarchyLevel,
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(companyDataForInsert)
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(companyData);
      
      if (Object.keys(customFieldValues).length > 0) {
        await saveCustomFieldValues('company', (data as Company).id, customFieldValues);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createSecureKey(['companies']) });
      toast.success('Company created successfully');
    },
    onError: (error: Error) => {
      logger.error("Error creating company:", error);
      toast.error(`Failed to create company: ${error.message}`);
    },
  });

  // Mutation for updating a company
  const updateCompany = useMutation({
    mutationFn: async ({ id, companyData }: { id: string; companyData: CompanyFormValues }) => {
      // Calculate hierarchy level based on parent
      let hierarchyLevel = 0;
      if (companyData.parentCompanyId) {
        const parentCompany = companies?.find(c => c.id === companyData.parentCompanyId);
        if (parentCompany) {
          hierarchyLevel = (parentCompany.hierarchy_level || 0) + 1;
        }
      }

      // Extract the company data for update and convert Date to string
      const companyDataForUpdate = {
        name: companyData.name,
        domain: companyData.website,
        size: companyData.size,
        description: companyData.description,
        location: companyData.location,
        email: companyData.email,
        phone: companyData.phone,
        linkedin: companyData.linkedin,
        twitter: companyData.twitter,
        facebook: companyData.facebook,
        founded: companyData.founded,
        // Add tenant-specific fields - using lowercase to match database
        cin: companyData.cin,
        companystatus: companyData.companyStatus,
        registeredofficeaddress: companyData.registeredOfficeAddress,
        registrationdate: companyData.registrationDate ? companyData.registrationDate.toISOString() : null,
        registeredemailaddress: companyData.registeredEmailAddress,
        noofdirectives: companyData.noOfDirectives,
        globalregion: companyData.globalRegion,
        country: companyData.country,
        region: companyData.region,
        holocation: companyData.hoLocation,
        industry1: companyData.industry1,
        industry2: companyData.industry2,
        industry3: companyData.industry3,
        companysector: companyData.companySector,
        companytype: companyData.companyType,
        entitytype: companyData.entityType,
        noofemployee: companyData.noOfEmployee,
        segmentaspernumberofemployees: companyData.segmentAsPerNumberOfEmployees,
        turnover: companyData.turnOver,
        segmentasperturnover: companyData.segmentAsPerTurnover,
        turnoveryear: companyData.turnoverYear,
        yearofestablishment: companyData.yearOfEstablishment,
        paidupcapital: companyData.paidupCapital,
        segmentasperpaidupcapital: companyData.segmentAsPerPaidUpCapital,
        areaofspecialize: companyData.areaOfSpecialize,
        serviceline: companyData.serviceLine,
        verticles: companyData.verticles,
        companyprofile: companyData.companyProfile,
        // Add parent company and group structure fields
        parent_company_id: companyData.parentCompanyId || null,
        company_group_name: companyData.companyGroupName || null,
        hierarchy_level: hierarchyLevel,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('companies')
        .update(companyDataForUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Handle custom fields if any exist
      const customFieldValues = extractCustomFieldValues(companyData);
      
      if (Object.keys(customFieldValues).length > 0) {
        await saveCustomFieldValues('company', id, customFieldValues);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createSecureKey(['companies']) });
      toast.success('Company updated successfully');
    },
    onError: (error: Error) => {
      logger.error("Error updating company:", error);
      toast.error(`Failed to update company: ${error.message}`);
    },
  });

  // Mutation for deleting a company
  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
      
      return companyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createSecureKey(['companies']) });
      toast.success('Company deleted successfully');
    },
    onError: (error: Error) => {
      logger.error("Error deleting company:", error);
      toast.error(`Failed to delete company: ${error.message}`);
    },
  });

  return {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch,
  };
};
