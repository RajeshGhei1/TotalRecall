
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './schema';
import AddOptionDialog from './common/AddOptionDialog';
import IndustryDropdownSection from './industry/IndustryDropdownSection';
import { useIndustryOptions } from './industry/useIndustryOptions';
import { useIndustryDialogHelpers } from '@/hooks/useDialogHelpers';
import { toast } from '@/hooks/use-toast';

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
    entityTypes 
  } = useIndustryOptions();
  
  const { getDialogTitle, getDialogPlaceholder } = useIndustryDialogHelpers();

  // Handle selection of the "Add New" option
  const handleSelectOption = (name: string) => {
    console.log(`Selected to add new option for: ${name}`);
    setAddingType(name);
    setNewOption('');
  };

  // Handle adding a new option
  const handleAddNewOption = async () => {
    if (!addingType || !newOption.trim()) {
      console.log("Cannot add option: missing type or value");
      return;
    }

    console.log(`Adding new option for ${addingType}: ${newOption}`);
    let categoryName: string;
    
    switch (addingType) {
      case 'industry1':
      case 'industry2':
      case 'industry3':
        categoryName = 'industries';
        break;
      case 'companySector':
        categoryName = 'company_sectors';
        break;
      case 'companyType':
        categoryName = 'company_types';
        break;
      case 'entityType':
        categoryName = 'entity_types';
        break;
      default:
        console.error('Unknown option type:', addingType);
        toast({
          title: "Error",
          description: `Unknown option type: ${addingType}`,
          variant: "destructive"
        });
        return;
    }

    try {
      console.log(`Adding new option to category ${categoryName}: ${newOption}`);
      const newOptionObj = await industryHook.addOption.mutateAsync({
        value: newOption,
        label: newOption,
        categoryName
      });
      
      console.log("New option added:", newOptionObj);
      
      // Set the form value to the newly added option
      if (addingType && newOptionObj) {
        console.log(`Setting form value for ${addingType} to ${newOptionObj.value}`);
        form.setValue(addingType as any, newOptionObj.value);
      }
      
      toast({
        title: "Option Added",
        description: `Added new ${addingType} option: ${newOption}`
      });
      
      setAddingType(null);
    } catch (error) {
      console.error('Failed to add new option:', error);
      toast({
        title: "Error",
        description: `Failed to add new option: ${(error as Error).message}`,
        variant: "destructive"
      });
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
