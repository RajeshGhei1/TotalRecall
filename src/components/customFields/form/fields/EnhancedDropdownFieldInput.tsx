
import React, { useState } from 'react';
import { CustomField } from '@/hooks/customFields/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { toast } from '@/hooks/use-toast';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';
import BaseFieldInput from './BaseFieldInput';

interface EnhancedDropdownFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const EnhancedDropdownFieldInput: React.FC<EnhancedDropdownFieldInputProps> = ({ 
  field, 
  form, 
  fieldName 
}) => {
  const [addingOption, setAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');
  
  // Get category name from field options if available
  const categoryName = field.options && typeof field.options === 'object' && 'category' in field.options
    ? field.options.category
    : 'dropdown_options';
  
  // Check if this is a multi-select field
  const isMultiSelect = field.field_type === 'multiselect' || 
    (field.options && typeof field.options === 'object' && 'multiSelect' in field.options && field.options.multiSelect);
  
  // Use dropdown options hook
  const { addOption, isAddingOption, refetchOptions } = useDropdownOptions(categoryName);
  
  // Handle adding a new option
  const handleAddOption = async () => {
    if (!newOption.trim()) return;
    
    try {
      console.log(`Adding new option to category ${categoryName}: ${newOption}`);
      const result = await addOption.mutateAsync({
        value: newOption,
        label: newOption,
        categoryName
      });
      
      console.log("New option added:", result);
      
      // Update the form based on field type
      if (isMultiSelect) {
        const currentValues = form.getValues(fieldName) || [];
        form.setValue(fieldName, [...currentValues, newOption]);
      } else {
        form.setValue(fieldName, newOption);
      }
      
      // Close dialog and reset
      setAddingOption(false);
      setNewOption('');
      refetchOptions();
      
      toast({
        title: 'Option added',
        description: `Added new option: ${newOption}`,
      });
    } catch (error) {
      console.error('Error adding option:', error);
      toast({
        title: 'Error',
        description: 'Failed to add new option',
        variant: 'destructive',
      });
    }
  };

  // Get options with "Add New" option
  const baseOptions = (field.options && typeof field.options === 'object' && 'options' in field.options) 
    ? field.options.options || [] 
    : [];

  const dropdownOptions = [
    ...baseOptions,
    { value: '__add_new__', label: '[+ Add New]' }
  ];

  // Convert options to MultiSelectOption format for multi-select
  const multiSelectOptions = baseOptions.map(option => ({
    value: option.value || option.label,
    label: option.label
  }));

  const handleValueChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      // Handle multi-select
      if (value.includes('__add_new__')) {
        setAddingOption(true);
        return;
      }
    } else {
      // Handle single select
      if (value === '__add_new__') {
        setAddingOption(true);
        return;
      }
    }
    
    form.setValue(fieldName, value);
  };

  return (
    <>
      <BaseFieldInput field={field} form={form} fieldName={fieldName}>
        {(formField) => (
          <>
            {isMultiSelect ? (
              <FormMultiSelect
                form={form}
                name={fieldName}
                label=""
                options={multiSelectOptions}
                placeholder={`Select ${field.name.toLowerCase()}`}
              />
            ) : (
              <FormSelect
                form={form}
                name={fieldName}
                label=""
                options={dropdownOptions}
                placeholder={`Select ${field.name.toLowerCase()}`}
                onChange={handleValueChange}
              />
            )}
          </>
        )}
      </BaseFieldInput>

      {/* Dialog for adding new option */}
      <Dialog open={addingOption} onOpenChange={setAddingOption}>
        <DialogContent className="z-[10001] bg-white">
          <DialogHeader>
            <DialogTitle>{`Add New ${field.name} Option`}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={`Enter new ${field.name.toLowerCase()} option`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAddingOption && newOption.trim()) {
                  handleAddOption();
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingOption(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddOption} 
              disabled={!newOption.trim() || isAddingOption}
            >
              {isAddingOption ? (
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

export default EnhancedDropdownFieldInput;
