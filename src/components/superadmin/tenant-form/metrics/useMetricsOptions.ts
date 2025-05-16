
import { useState } from 'react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

// Define type for the mapping between form fields and category names
type CategoryMapping = {
  [key: string]: string;
};

export function useMetricsOptions() {
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  // Get dropdown options from our hooks
  const employeeRangeHook = useDropdownOptions('employee_ranges');
  const turnoverRangeHook = useDropdownOptions('turnover_ranges');
  const yearsHook = useDropdownOptions('years');
  const segmentHook = useDropdownOptions('specializations');

  // Map form field names to category names
  const categoryMapping: CategoryMapping = {
    'segmentAsPerNumberOfEmployees': 'employee_ranges',
    'segmentAsPerTurnover': 'turnover_ranges',
    'turnoverYear': 'years',
    'yearOfEstablishment': 'years',
    'segmentAsPerPaidUpCapital': 'specializations'
  };

  // Map the options to the required format
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
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
  
  // If no options are available, provide fallback options
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

    const categoryName = categoryMapping[addingType];
    
    if (!categoryName) {
      console.error('Category not found for', addingType);
      return;
    }

    try {
      const newOptionObj = await employeeRangeHook.addOption.mutateAsync({
        value: newOption,
        label: newOption,
        isDefault: false,
        categoryName: categoryName
      });
      
      return newOptionObj;
    } catch (error) {
      console.error('Failed to add new option:', error);
      throw error;
    }
  };
  
  const getDialogTitle = (type: string | null): string => {
    if (!type) return '';
    
    switch (type) {
      case 'segmentAsPerNumberOfEmployees': return 'Add New Employee Range';
      case 'segmentAsPerTurnover': return 'Add New Turnover Range';
      case 'turnoverYear': 
      case 'yearOfEstablishment': return 'Add New Year';
      case 'segmentAsPerPaidUpCapital': return 'Add New Segment';
      default: return 'Add New Option';
    }
  };
  
  const getDialogPlaceholder = (type: string | null): string => {
    if (!type) return '';
    
    switch (type) {
      case 'segmentAsPerNumberOfEmployees': return 'Enter new employee range';
      case 'segmentAsPerTurnover': return 'Enter new turnover range';
      case 'turnoverYear': 
      case 'yearOfEstablishment': return 'Enter new year';
      case 'segmentAsPerPaidUpCapital': return 'Enter new segment';
      default: return 'Enter new option';
    }
  };

  return {
    addingType,
    setAddingType,
    newOption,
    setNewOption,
    employeeRangeHook,
    employeeOptions,
    turnoverOptions,
    years,
    segments,
    handleSelectOption,
    handleAddNewOption,
    getDialogTitle,
    getDialogPlaceholder
  };
}
