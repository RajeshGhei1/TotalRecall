
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect, FormInput } from './FormFields';
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

interface CompanyMetricsSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const CompanyMetricsSection: React.FC<CompanyMetricsSectionProps> = ({ form }) => {
  // Custom state for the "Add New" option dialogs
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  // Get dropdown options from our hook
  const employeeRangeHook = useDropdownOptions('employee_ranges');
  const turnoverRangeHook = useDropdownOptions('turnover_ranges');
  const yearsHook = useDropdownOptions('years');
  const segmentHook = useDropdownOptions('specializations');
  
  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  // Map the options to the required format
  const employeeRangeOptions = employeeRangeHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...employeeRangeHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const turnoverRangeOptions = turnoverRangeHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...turnoverRangeHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const yearOptions = yearsHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...yearsHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  const segmentOptions = segmentHook.isLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...segmentHook.options.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), addNewOption];
  
  // If no options are available, provide fallback options using the scheme generator
  const fallbackYearOptions = Array.from({ length: 51 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString()
  }));
  
  // Use fetched options or fallbacks
  const employeeOptions = employeeRangeOptions.length > 1 ? employeeRangeOptions : [
    { value: '1-10', label: '1-10' }, 
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501-1000', label: '501-1000' },
    { value: '1001+', label: '1001+' },
    addNewOption
  ];
  
  const turnoverOptions = turnoverRangeOptions.length > 1 ? turnoverRangeOptions : [
    { value: 'Under $1M', label: 'Under $1M' },
    { value: '$1M-$10M', label: '$1M-$10M' },
    { value: '$10M-$50M', label: '$10M-$50M' },
    { value: '$50M-$100M', label: '$50M-$100M' },
    { value: '$100M+', label: '$100M+' },
    addNewOption
  ];
  
  const years = yearOptions.length > 1 ? yearOptions : [...fallbackYearOptions, addNewOption];
  
  const segments = segmentOptions.length > 1 ? segmentOptions : [
    { value: 'Micro', label: 'Micro (1-9 employees)' },
    { value: 'Small', label: 'Small (10-49 employees)' },
    { value: 'Medium', label: 'Medium (50-249 employees)' },
    { value: 'Large', label: 'Large (250-999 employees)' },
    { value: 'Enterprise', label: 'Enterprise (1000+ employees)' },
    addNewOption
  ];
  
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
      case 'segmentAsPerNumberOfEmployees':
        categoryId = await employeeRangeHook.getCategoryIdByName('employee_ranges');
        break;
      case 'segmentAsPerTurnover': 
        categoryId = await turnoverRangeHook.getCategoryIdByName('turnover_ranges');
        break;
      case 'turnoverYear':
      case 'yearOfEstablishment':
        categoryId = await yearsHook.getCategoryIdByName('years');
        break;
      case 'segmentAsPerPaidUpCapital':
        categoryId = await segmentHook.getCategoryIdByName('specializations');
        break;
    }

    if (!categoryId) {
      console.error('Category not found for', addingType);
      return;
    }

    try {
      const newOptionObj = await employeeRangeHook.addOption.mutateAsync({
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
        <FormInput
          form={form}
          name="noOfEmployee"
          label="No Of Employee"
          required
        />
        
        <div className="space-y-1">
          <FormSelect
            form={form}
            name="segmentAsPerNumberOfEmployees"
            label="Segment As Per Number Of Employees"
            options={employeeOptions}
            required
            onChange={(value) => handleSelectOption('segmentAsPerNumberOfEmployees', value)}
          />
          {form.watch('segmentAsPerNumberOfEmployees') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('segmentAsPerNumberOfEmployees')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Employee Range
            </Button>
          )}
        </div>
        
        <FormInput
          form={form}
          name="turnOver"
          label="Turn Over"
          required
        />
        
        <div className="space-y-1">
          <FormSelect
            form={form}
            name="segmentAsPerTurnover"
            label="Segment As Per Turnover"
            options={turnoverOptions}
            required
            onChange={(value) => handleSelectOption('segmentAsPerTurnover', value)}
          />
          {form.watch('segmentAsPerTurnover') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('segmentAsPerTurnover')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Turnover Range
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect
            form={form}
            name="turnoverYear"
            label="Turnover Year"
            options={years}
            required
            onChange={(value) => handleSelectOption('turnoverYear', value)}
          />
          {form.watch('turnoverYear') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('turnoverYear')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Year
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <FormSelect
            form={form}
            name="yearOfEstablishment"
            label="Year Of Establishment"
            options={years}
            required
            onChange={(value) => handleSelectOption('yearOfEstablishment', value)}
          />
          {form.watch('yearOfEstablishment') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('yearOfEstablishment')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Year
            </Button>
          )}
        </div>
        
        <FormInput
          form={form}
          name="paidupCapital"
          label="Paidup Capital"
          required
        />
        
        <div className="space-y-1">
          <FormSelect
            form={form}
            name="segmentAsPerPaidUpCapital"
            label="Segment As Per Paid Up Capital"
            options={segments}
            required
            onChange={(value) => handleSelectOption('segmentAsPerPaidUpCapital', value)}
          />
          {form.watch('segmentAsPerPaidUpCapital') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingType('segmentAsPerPaidUpCapital')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Segment
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
                addingType === 'segmentAsPerNumberOfEmployees' ? 'Employee Range' :
                addingType === 'segmentAsPerTurnover' ? 'Turnover Range' :
                addingType === 'turnoverYear' || addingType === 'yearOfEstablishment' ? 'Year' :
                addingType === 'segmentAsPerPaidUpCapital' ? 'Segment' : ''
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={`Enter new ${
                addingType === 'segmentAsPerNumberOfEmployees' ? 'employee range' :
                addingType === 'segmentAsPerTurnover' ? 'turnover range' :
                addingType === 'turnoverYear' || addingType === 'yearOfEstablishment' ? 'year' :
                addingType === 'segmentAsPerPaidUpCapital' ? 'segment' : 'option'
              }`}
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
              disabled={!newOption.trim() || employeeRangeHook.isAddingOption}
            >
              {employeeRangeHook.isAddingOption ? (
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

export default CompanyMetricsSection;
