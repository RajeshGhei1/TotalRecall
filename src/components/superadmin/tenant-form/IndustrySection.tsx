
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from './FormFields';
import { TenantFormValues } from './schema';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

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
  const handleSelectOption = (name: string, value: string) => {
    if (value === '__add_new__') {
      setAddingType(name);
      setNewOption('');
    }
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
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="industry1"
            label="Industry 1"
            options={industries}
            required
            onChange={(value) => handleSelectOption('industry1', value)}
          />
          {form.watch('industry1') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('industry1')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Industry
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="industry2"
            label="Industry 2"
            options={industries}
            required
            onChange={(value) => handleSelectOption('industry2', value)}
          />
          {form.watch('industry2') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('industry2')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Industry
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="industry3"
            label="Industry 3"
            options={industries}
            required
            onChange={(value) => handleSelectOption('industry3', value)}
          />
          {form.watch('industry3') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('industry3')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Industry
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="companySector"
            label="Company Sector"
            options={sectors}
            required
            onChange={(value) => handleSelectOption('companySector', value)}
          />
          {form.watch('companySector') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('companySector')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Sector
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="companyType"
            label="Company Type"
            options={companyTypes}
            required
            onChange={(value) => handleSelectOption('companyType', value)}
          />
          {form.watch('companyType') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('companyType')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Company Type
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="entityType"
            label="Entity Type"
            options={entityTypes}
            required
            onChange={(value) => handleSelectOption('entityType', value)}
          />
          {form.watch('entityType') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('entityType')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Entity Type
            </Button>
          )}
        </div>
      </div>

      {/* Dialog for adding new options */}
      <Dialog open={!!addingType} onOpenChange={(open) => !open && setAddingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New {
                addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3' ? 'Industry' :
                addingType === 'companySector' ? 'Company Sector' :
                addingType === 'companyType' ? 'Company Type' :
                addingType === 'entityType' ? 'Entity Type' : ''
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={`Enter new ${
                addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3' ? 'industry' :
                addingType === 'companySector' ? 'company sector' :
                addingType === 'companyType' ? 'company type' :
                addingType === 'entityType' ? 'entity type' : 'option'
              } name`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingType(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewOption} 
              disabled={!newOption.trim() || industryHook.isAddingOption}
            >
              {industryHook.isAddingOption ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IndustrySection;
