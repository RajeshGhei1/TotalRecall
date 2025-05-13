
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

interface LocationSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const LocationSection: React.FC<LocationSectionProps> = ({ form }) => {
  // Custom state for the "Add New" option dialogs
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  // Get dropdown options from our hook
  const regionHook = useDropdownOptions('global_regions');
  const countryHook = useDropdownOptions('countries');
  const localRegionHook = useDropdownOptions('local_regions');
  const locationHook = useDropdownOptions('locations');

  // Combine the options with an "Add New" option at the end
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  const regionOptions = regionHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...regionHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const countryOptions = countryHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...countryHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const localRegionOptions = localRegionHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...localRegionHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const locationOptions = locationHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...locationHook.options.map(o => ({ 
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

    let categoryId: string | null = null;
    
    switch (addingType) {
      case 'globalRegion':
        categoryId = await regionHook.getCategoryIdByName('global_regions');
        break;
      case 'country': 
        categoryId = await countryHook.getCategoryIdByName('countries');
        break;
      case 'region':
        categoryId = await localRegionHook.getCategoryIdByName('local_regions');
        break;
      case 'hoLocation':
        categoryId = await locationHook.getCategoryIdByName('locations');
        break;
    }

    if (!categoryId) {
      console.error('Category not found for', addingType);
      return;
    }

    try {
      const newOptionObj = await regionHook.addOption.mutateAsync({
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
            name="globalRegion"
            label="Global Region"
            options={regionOptions}
            required
            onChange={(value) => handleSelectOption('globalRegion', value)}
          />
          {form.watch('globalRegion') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('globalRegion')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Region
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="country"
            label="Country"
            options={countryOptions}
            required
            onChange={(value) => handleSelectOption('country', value)}
          />
          {form.watch('country') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('country')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Country
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="region"
            label="Region"
            options={localRegionOptions}
            required
            onChange={(value) => handleSelectOption('region', value)}
          />
          {form.watch('region') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('region')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Local Region
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="hoLocation"
            label="HO Location"
            options={locationOptions}
            required
            onChange={(value) => handleSelectOption('hoLocation', value)}
          />
          {form.watch('hoLocation') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('hoLocation')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Location Type
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
                addingType === 'globalRegion' ? 'Global Region' :
                addingType === 'country' ? 'Country' :
                addingType === 'region' ? 'Local Region' :
                addingType === 'hoLocation' ? 'Location Type' : ''
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={`Enter new ${
                addingType === 'globalRegion' ? 'global region' :
                addingType === 'country' ? 'country' :
                addingType === 'region' ? 'local region' :
                addingType === 'hoLocation' ? 'location type' : 'option'
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
              disabled={!newOption.trim() || regionHook.isAddingOption}
            >
              {regionHook.isAddingOption ? (
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

export default LocationSection;
