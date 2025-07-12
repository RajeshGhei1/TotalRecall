
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormTextarea, FormSelect } from './fields';
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
import { createDialogHelpers } from '@/hooks/useDialogHelpers';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  // Custom state for the "Add New" option dialogs
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  // Get dropdown options from our hook
  const specializationHook = useDropdownOptions('specializations');
  const serviceLineHook = useDropdownOptions('service_lines');

  // Use the new dialog helpers
  const { getDialogTitle, getDialogPlaceholder } = createDialogHelpers({
    'areaOfSpecialize': {
      title: 'Add New Specialization',
      placeholder: 'Enter new specialization name'
    },
    'serviceLine': {
      title: 'Add New Service Line',
      placeholder: 'Enter new service line name'
    }
  });

  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  const specializationOptions = specializationHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...specializationHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const serviceLineOptions = serviceLineHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...serviceLineHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];

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

    let categoryName: string | null = null;
    
    switch (addingType) {
      case 'areaOfSpecialize':
        categoryName = 'specializations';
        break;
      case 'serviceLine': 
        categoryName = 'service_lines';
        break;
    }

    if (!categoryName) {
      console.error('Category not found for', addingType);
      return;
    }

    try {
      const newOptionObj = await specializationHook.addOption.mutateAsync({
        value: newOption,
        label: newOption,
        isDefault: false,
        categoryName: categoryName
      });
      
      // Set the form value to the newly added option
      if (addingType && newOptionObj) {
        form.setValue(addingType as unknown, newOptionObj.value);
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
            name="areaOfSpecialize"
            label="Area of Specialization"
            options={specializationOptions}
            onChange={(value) => handleSelectOption('areaOfSpecialize', value)}
          />
          {form.watch('areaOfSpecialize') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('areaOfSpecialize')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Specialization
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="serviceLine"
            label="Service Line"
            options={serviceLineOptions}
            onChange={(value) => handleSelectOption('serviceLine', value)}
          />
          {form.watch('serviceLine') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('serviceLine')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Service Line
            </Button>
          )}
        </div>
        
        <FormInput 
          form={form}
          name="verticles"
          label="Verticles"
        />
        
        <FormInput 
          form={form}
          name="webSite"
          label="Website"
        />
      </div>
      
      <FormTextarea
        form={form}
        name="companyProfile"
        label="Company Profile"
        required
      />

      {/* Dialog for adding new options */}
      <Dialog open={!!addingType} onOpenChange={(open) => !open && setAddingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getDialogTitle(addingType)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={getDialogPlaceholder(addingType)}
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
              disabled={!newOption.trim() || specializationHook.isAddingOption}
            >
              {specializationHook.isAddingOption ? (
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

export default AdditionalInfoSection;
