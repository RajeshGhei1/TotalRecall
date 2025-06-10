import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useCallback } from 'react';

export const useIndustryOptions = () => {
  // Get dropdown options from our hook for all industry-related categories
  const industry1Hook = useDropdownOptions('industry1');
  const industry2Hook = useDropdownOptions('industry2');
  const industry3Hook = useDropdownOptions('industry3');
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
  
  // Use specific industry categories when available, fall back to the general 'industries' category
  const industry1Options = industry1Hook.options && industry1Hook.options.length > 0 
    ? formatOptions(industry1Hook, fallbackIndustryOptions) 
    : formatOptions(industryHook, fallbackIndustryOptions);
  
  // Define mappings for hierarchical filtering
  const industry1ToIndustry2Map: Record<string, string[]> = {
    'services': ['it_software', 'financial_services', 'healthcare_services', 'consulting', 'education', 'telecommunications', 'media_entertainment', 'hospitality', 'real_estate', 'professional_services'],
    'trading': ['import_export', 'retail_trade', 'wholesale_trade', 'commodity_trading', 'e_commerce', 'distribution'],
    'manufacturing': ['automotive', 'electronics', 'textiles', 'chemicals', 'pharmaceuticals', 'food_processing', 'machinery', 'aerospace', 'construction_materials'],
    'government': ['central_government', 'state_government', 'local_government', 'public_sector', 'defense', 'regulatory_bodies']
  };

  const industry2ToIndustry3Map: Record<string, string[]> = {
    'it_software': ['web_development', 'mobile_app_development', 'software_consulting', 'cloud_services', 'cybersecurity', 'data_analytics', 'ai_ml', 'enterprise_software', 'gaming', 'fintech'],
    'financial_services': ['banking', 'insurance', 'investment_management', 'wealth_management', 'credit_services', 'payment_processing', 'microfinance', 'securities'],
    'automotive': ['vehicle_manufacturing', 'auto_components', 'electric_vehicles', 'automotive_software', 'auto_finance', 'auto_insurance'],
    // Add more mappings as needed
  };
  
  // Other options
  const sectors = formatOptions(companySectorHook, fallbackSectorOptions);
  const companyTypes = formatOptions(companyTypeHook, fallbackCompanyTypeOptions);
  const entityTypes = formatOptions(entityTypeHook, fallbackEntityTypeOptions);

  // Hierarchical dropdown functions
  const getIndustry2OptionsForIndustry1 = useCallback((industry1Value: string) => {
    if (!industry1Value || industry1Value === '__add_new__') {
      return [];
    }

    const allowedValues = industry1ToIndustry2Map[industry1Value] || [];
    const allIndustry2Options = industry2Hook.options || [];
    
    const filteredOptions = allIndustry2Options
      .filter(option => allowedValues.includes(option.value))
      .map(option => ({ value: option.value, label: option.label }));
    
    return [...filteredOptions, addNewOption];
  }, [industry2Hook.options]);

  const getIndustry3OptionsForIndustry2 = useCallback((industry2Value: string) => {
    if (!industry2Value || industry2Value === '__add_new__') {
      return [];
    }

    const allowedValues = industry2ToIndustry3Map[industry2Value] || [];
    const allIndustry3Options = industry3Hook.options || [];
    
    const filteredOptions = allIndustry3Options
      .filter(option => allowedValues.includes(option.value))
      .map(option => ({ value: option.value, label: option.label }));
    
    return [...filteredOptions, addNewOption];
  }, [industry3Hook.options]);

  // Get category ID by name
  const getCategoryIdByName = async (name: string) => {
    console.log(`Getting category ID for: ${name}`);
    switch (name) {
      case 'industry1':
        return await industry1Hook.getCategoryIdByName('industry1', true);
      case 'industry2':
        return await industry2Hook.getCategoryIdByName('industry2', true);
      case 'industry3':
        return await industry3Hook.getCategoryIdByName('industry3', true);
      case 'companySector': 
        return await companySectorHook.getCategoryIdByName('company_sectors', true);
      case 'companyType':
        return await companyTypeHook.getCategoryIdByName('company_types', true);
      case 'entityType':
        return await entityTypeHook.getCategoryIdByName('entity_types', true);
      default:
        console.error(`No category mapping for field name: ${name}`);
        return null;
    }
  };

  // Return hooks and formatted options
  return {
    industryHook,
    industry1Hook,
    industry2Hook,
    industry3Hook,
    companySectorHook,
    companyTypeHook,
    entityTypeHook,
    industries: [], // Not used anymore
    industry1Options,
    industry2Options: [], // Will be filtered dynamically
    industry3Options: [], // Will be filtered dynamically
    sectors,
    companyTypes,
    entityTypes,
    getIndustry2OptionsForIndustry1,
    getIndustry3OptionsForIndustry2,
    getCategoryIdByName
  };
};
