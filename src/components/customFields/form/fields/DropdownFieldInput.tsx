
import React, { useState } from 'react';
import { CustomField } from '@/hooks/customFields/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { toast } from '@/hooks/use-toast';
import BaseFieldInput from './BaseFieldInput';

interface DropdownFieldInputProps {
  field: CustomField;
  form: any;
  fieldName: string;
}

const DropdownFieldInput: React.FC<DropdownFieldInputProps> = ({ field, form, fieldName }) => {
  const [addingOption, setAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');
  
  // Get category name from field options if available
  const categoryName = field.options?.category || 'dropdown_options';
  
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
      
      // Update the form
      form.setValue(fieldName, newOption);
      
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
  const dropdownOptions = [
    ...(field.options?.options || []),
    { value: '__add_new__', label: '[+ Add New]' }
  ];

  return (
    <>
      <BaseFieldInput field={field} form={form} fieldName={fieldName}>
        {(formField) => (
          <Select
            onValueChange={(value) => {
              if (value === '__add_new__') {
                setAddingOption(true);
                return;
              }
              formField.onChange(value);
            }}
            value={formField.value || ""}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="z-[10000] bg-white">
              {dropdownOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default DropdownFieldInput;
