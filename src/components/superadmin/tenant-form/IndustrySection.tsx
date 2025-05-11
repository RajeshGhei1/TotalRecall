
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './schema';
import AddOptionDialog from './common/AddOptionDialog';
import IndustryDropdownSection from './industry/IndustryDropdownSection';
import { useIndustryOptions } from './industry/useIndustryOptions';
import { useIndustryDialogHelpers } from './industry/useIndustryDialogHelpers';

interface IndustrySectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const IndustrySection: React.FC<IndustrySectionProps> = ({ form }) => {
  // Custom state for the "Add New" option dialogs
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  // Get dropdown options and helper functions
  const { 
    industryHook, 
    industries, 
    sectors, 
    companyTypes, 
    entityTypes, 
    getCategoryIdByName 
  } = useIndustryOptions();
  
  const { getDialogTitle, getDialogPlaceholder } = useIndustryDialogHelpers();

  // Handle selection of the "Add New" option
  const handleSelectOption = (name: string) => {
    setAddingType(name);
    setNewOption('');
  };

  // Handle adding a new option
  const handleAddNewOption = async () => {
    if (!addingType || !newOption.trim()) return;

    const categoryId = await getCategoryIdByName(addingType);

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

  return (
    <>
      <IndustryDropdownSection
        form={form}
        industryOptions={industries}
        companySectorOptions={sectors}
        companyTypeOptions={companyTypes}
        entityTypeOptions={entityTypes}
        onSelectAddNew={handleSelectOption}
      />

      {/* Dialog for adding new options */}
      <AddOptionDialog
        isOpen={!!addingType}
        onClose={() => setAddingType(null)}
        title={getDialogTitle(addingType)}
        placeholder={getDialogPlaceholder(addingType)}
        value={newOption}
        onChange={setNewOption}
        onSubmit={handleAddNewOption}
        isSubmitting={industryHook.isAddingOption}
      />
    </>
  );
};

export default IndustrySection;
