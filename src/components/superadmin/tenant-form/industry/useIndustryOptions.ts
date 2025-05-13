
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useCallback } from 'react';

export const useIndustryOptions = () => {
  // Get dropdown options from our hook
  const industryHook = useDropdownOptions('industries');
  const companySectorHook = useDropdownOptions('company_sectors');
  const companyTypeHook = useDropdownOptions('company_types');
  const entityTypeHook = useDropdownOptions('entity_types');
  
  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  // Map the options to the required format and add error handling
  const formatOptions = useCallback((hook: ReturnType<typeof useDropdownOptions>, fallbackOptions: Array<{value: string, label: string}>) => {
    if (hook.isLoading) {
      return [{ value: 'loading', label: 'Loading...' }];
    }
    
    if (hook.options && hook.options.length > 0) {
      const formattedOptions = hook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      }));
      console.log('Formatted options:', formattedOptions);
      return [...formattedOptions, addNewOption];
    }
    
    return [...fallbackOptions, addNewOption];
  }, []);
  
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
  const industries = formatOptions(industryHook, fallbackIndustryOptions);
  const sectors = formatOptions(companySectorHook, fallbackSectorOptions);
  const companyTypes = formatOptions(companyTypeHook, fallbackCompanyTypeOptions);
  const entityTypes = formatOptions(entityTypeHook, fallbackEntityTypeOptions);

  // Get category ID by name
  const getCategoryIdByName = async (name: string) => {
    console.log(`Getting category ID for: ${name}`);
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
        console.error(`No category mapping for field name: ${name}`);
        return null;
    }
  };

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
    getCategoryIdByName
  };
};
