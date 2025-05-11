
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './schema';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import IndustryDropdown from './dropdowns/IndustryDropdown';
import CompanyTypeDropdown from './dropdowns/CompanyTypeDropdown';
import AddOptionDialog from './common/AddOptionDialog';

interface IndustrySectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({ form }) => {
  // Custom state for the "Add New" option dialogs
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
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

  // Handle selection of the "Add New" option
  const handleSelectOption = (name: string) => {
    setAddingType(name);
    setNewOption('');
  };

  // Handle adding a new option
  const handleAddNewOption = async () => {
    if (!addingType || !newOption.trim()) return;

    let categoryId: string | null = null;
    
    switch (addingType) {
      case 'industry1':
      case 'industry2':
      case 'industry3':
        categoryId = await industryHook.getCategoryIdByName('industries');
        break;
      case 'companySector': 
        categoryId = await companySectorHook.getCategoryIdByName('company_sectors');
        break;
      case 'companyType':
        categoryId = await companyTypeHook.getCategoryIdByName('company_types');
        break;
      case 'entityType':
        categoryId = await entityTypeHook.getCategoryIdByName('entity_types');
        break;
    }

    if (!categoryId) {
      console.error('Category not found for', addingType);
      return;
    }

    try {
      const newOptionObj = await industryHook.addOption.mutateAsync({
        categoryId,
        value: newOption,
        label: newOption
      });
      
      // Set the form value to the newly added option
      if (addingType && newOptionObj) {
        form.setValue(addingType as any, newOptionObj.value);
      }
      
      setAddingType(null);
    } catch (error) {
      console.error('Failed to add new option:', error);
    }
  };

  // Get dialog props based on the current adding type
  const getDialogTitle = () => {
    if (addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3') {
      return 'Add New Industry';
    } else if (addingType === 'companySector') {
      return 'Add New Company Sector';
    } else if (addingType === 'companyType') {
      return 'Add New Company Type';  
    } else if (addingType === 'entityType') {
      return 'Add New Entity Type';
    }
    return 'Add New Option';
  };

  const getDialogPlaceholder = () => {
    if (addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3') {
      return 'Enter new industry name';
    } else if (addingType === 'companySector') {
      return 'Enter new company sector';
    } else if (addingType === 'companyType') {
      return 'Enter new company type';
    } else if (addingType === 'entityType') {
      return 'Enter new entity type';
    }
    return 'Enter new option name';
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IndustryDropdown
          form={form}
          name="industry1"
          label="Industry 1"
          options={industries}
          onSelectAddNew={handleSelectOption}
        />
        
        <IndustryDropdown
          form={form}
          name="industry2"
          label="Industry 2"
          options={industries}
          onSelectAddNew={handleSelectOption}
        />
        
        <IndustryDropdown
          form={form}
          name="industry3"
          label="Industry 3"
          options={industries}
          onSelectAddNew={handleSelectOption}
        />
        
        <CompanyTypeDropdown
          form={form}
          name="companySector"
          label="Company Sector"
          options={sectors}
          onSelectAddNew={handleSelectOption}
          buttonLabel="Add New Sector"
        />
        
        <CompanyTypeDropdown
          form={form}
          name="companyType"
          label="Company Type"
          options={companyTypes}
          onSelectAddNew={handleSelectOption}
          buttonLabel="Add New Company Type"
        />
        
        <CompanyTypeDropdown
          form={form}
          name="entityType"
          label="Entity Type"
          options={entityTypes}
          onSelectAddNew={handleSelectOption}
          buttonLabel="Add New Entity Type"
        />
      </div>

      {/* Dialog for adding new options */}
      <AddOptionDialog
        isOpen={!!addingType}
        onClose={() => setAddingType(null)}
        title={getDialogTitle()}
        placeholder={getDialogPlaceholder()}
        value={newOption}
        onChange={setNewOption}
        onSubmit={handleAddNewOption}
        isSubmitting={industryHook.isAddingOption}
      />
    </>
  );
};

export default IndustrySection;
