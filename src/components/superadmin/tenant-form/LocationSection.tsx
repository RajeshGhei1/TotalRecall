
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect } from './fields';
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
import { toast } from '@/hooks/use-toast';
import { useAddOptionDialog } from '@/hooks/useDialogHelpers';
import { BranchOfficeManager } from '@/components/superadmin/companies/sections/BranchOfficeManager';

interface LocationSectionProps {
  form: UseFormReturn<TenantFormValues>;
  showBranchOffices?: boolean;
  companyId?: string;
  companyName?: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  form, 
  showBranchOffices = false,
  companyId,
  companyName = ''
}) => {
  // Use our custom dialog hook
  const { addingType, setAddingType, newOption, setNewOption, resetDialog } = useAddOptionDialog();
  
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
    console.log(`Select option called for ${name} with value ${value}`);
    if (value === '__add_new__') {
      console.log(`Setting adding type to ${name}`);
      setAddingType(name);
      setNewOption('');
    }
  };

  // Handle adding a new option
  const handleAddNewOption = async () => {
    if (!addingType || !newOption.trim()) return;

    console.log(`Adding new option for ${addingType}: ${newOption}`);
    let categoryName: string;
    let hook;
    
    switch (addingType) {
      case 'globalRegion':
        categoryName = 'global_regions';
        hook = regionHook;
        break;
      case 'country': 
        categoryName = 'countries';
        hook = countryHook;
        break;
      case 'region':
        categoryName = 'local_regions';
        hook = localRegionHook;
        break;
      case 'hoLocation':
        categoryName = 'locations';
        hook = locationHook;
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
      const newOptionObj = await hook.addOption.mutateAsync({
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
      
      resetDialog();
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
      <div className="space-y-6">
        {/* Headquarters Location */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Headquarters Location</h3>
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
                  <Plus className="h-4 w-4 mr-1" /> Add New Location
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Branch Offices Section */}
        {showBranchOffices && companyId && (
          <div className="border-t pt-6">
            <BranchOfficeManager 
              companyId={companyId}
              companyName={companyName}
            />
          </div>
        )}
      </div>

      {/* Dialog for adding new options */}
      <Dialog open={!!addingType} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="z-[10001] bg-white">
          <DialogHeader>
            <DialogTitle>
              Add New {
                addingType === 'globalRegion' ? 'Global Region' :
                addingType === 'country' ? 'Country' :
                addingType === 'region' ? 'Local Region' :
                addingType === 'hoLocation' ? 'Location' :
                'Option'
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={`Enter new ${
                addingType === 'globalRegion' ? 'global region' :
                addingType === 'country' ? 'country' :
                addingType === 'region' ? 'local region' :
                addingType === 'hoLocation' ? 'location' :
                'option'
              } name`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !regionHook.isAddingOption && newOption.trim()) {
                  handleAddNewOption();
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog}>
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
