
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

export const useIndustryOptions = () => {
  // Get dropdown options from our hook
  const industryHook = useDropdownOptions('industries');
  const companySectorHook = useDropdownOptions('company_sectors');
  const companyTypeHook = useDropdownOptions('company_types');
  const entityTypeHook = useDropdownOptions('entity_types');
  
  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  // Map the options to the required format
  const industryOptions = industryHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...industryHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const companySectorOptions = companySectorHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...companySectorHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const companyTypeOptions = companyTypeHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...companyTypeHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const entityTypeOptions = entityTypeHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...entityTypeHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  // Fallback options in case API fails or has no data
  const fallbackIndustryOptions = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' }
  ];
  
  const fallbackSectorOptions = [
    { value: 'Private', label: 'Private Sector' },
    { value: 'Public', label: 'Public Sector' },
    { value: 'Government', label: 'Government' },
    { value: 'Non-profit', label: 'Non-profit' }
  ];
  
  const fallbackCompanyTypeOptions = [
    { value: 'LLC', label: 'Limited Liability Company' },
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' }
  ];
  
  const fallbackEntityTypeOptions = [
    { value: 'LLC', label: 'LLC' },
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' }
  ];
  
  // Use fetched options or fallbacks
  const industries = industryOptions.length > 1 ? industryOptions : [...fallbackIndustryOptions, addNewOption];
  const sectors = companySectorOptions.length > 1 ? companySectorOptions : [...fallbackSectorOptions, addNewOption];
  const companyTypes = companyTypeOptions.length > 1 ? companyTypeOptions : [...fallbackCompanyTypeOptions, addNewOption];
  const entityTypes = entityTypeOptions.length > 1 ? entityTypeOptions : [...fallbackEntityTypeOptions, addNewOption];

  // Return hooks and formatted options
  return {
    industryHook,
    companySectorHook,
    companyTypeHook,
    entityTypeHook,
    industries,
    sectors,
    companyTypes,
    entityTypes,
    getCategoryIdByName: async (name: string) => {
      switch (name) {
        case 'industry1':
        case 'industry2':
        case 'industry3':
          return await industryHook.getCategoryIdByName('industries');
        case 'companySector': 
          return await companySectorHook.getCategoryIdByName('company_sectors');
        case 'companyType':
          return await companyTypeHook.getCategoryIdByName('company_types');
        case 'entityType':
          return await entityTypeHook.getCategoryIdByName('entity_types');
        default:
          return null;
      }
    }
  };
};
