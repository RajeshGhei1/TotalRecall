
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSelect, FormInput } from './FormFields';
import { TenantFormValues } from './schema';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface CompanyMetricsSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const CompanyMetricsSection: React.FC<CompanyMetricsSectionProps> = ({ form }) => {
  // Get dropdown options from our hook
  const employeeRangeHook = useDropdownOptions('employee_ranges');
  const turnoverRangeHook = useDropdownOptions('turnover_ranges');
  const yearsHook = useDropdownOptions('years');
  const segmentHook = useDropdownOptions('specializations');
  
  // Map the options to the required format
  const employeeRangeOptions = employeeRangeHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : employeeRangeHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const turnoverRangeOptions = turnoverRangeHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : turnoverRangeHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const yearOptions = yearsHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : yearsHook.options.map(o => ({ value: o.value, label: o.label }));
  
  const segmentOptions = segmentHook.isLoading 
    ? [{ value: '', label: 'Loading...' }] 
    : segmentHook.options.map(o => ({ value: o.value, label: o.label }));
  
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
    { value: '1001+', label: '1001+' }
  ];
  
  const turnoverOptions = turnoverRangeOptions.length > 1 ? turnoverRangeOptions : [
    { value: 'Under $1M', label: 'Under $1M' },
    { value: '$1M-$10M', label: '$1M-$10M' },
    { value: '$10M-$50M', label: '$10M-$50M' },
    { value: '$50M-$100M', label: '$50M-$100M' },
    { value: '$100M+', label: '$100M+' }
  ];
  
  const years = yearOptions.length > 1 ? yearOptions : fallbackYearOptions;
  
  const segments = segmentOptions.length > 1 ? segmentOptions : [
    { value: 'Micro', label: 'Micro (1-9 employees)' },
    { value: 'Small', label: 'Small (10-49 employees)' },
    { value: 'Medium', label: 'Medium (50-249 employees)' },
    { value: 'Large', label: 'Large (250-999 employees)' },
    { value: 'Enterprise', label: 'Enterprise (1000+ employees)' }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="noOfEmployee"
        label="No Of Employee"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerNumberOfEmployees"
        label="Segment As Per Number Of Employees"
        options={employeeOptions}
        required
      />
      
      <FormInput
        form={form}
        name="turnOver"
        label="Turn Over"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerTurnover"
        label="Segment As Per Turnover"
        options={turnoverOptions}
        required
      />
      
      <FormSelect
        form={form}
        name="turnoverYear"
        label="Turnover Year"
        options={years}
        required
      />
      
      <FormSelect
        form={form}
        name="yearOfEstablishment"
        label="Year Of Establishment"
        options={years}
        required
      />
      
      <FormInput
        form={form}
        name="paidupCapital"
        label="Paidup Capital"
        required
      />
      
      <FormSelect
        form={form}
        name="segmentAsPerPaidUpCapital"
        label="Segment As Per Paid Up Capital"
        options={segments}
        required
      />
    </div>
  );
};

export default CompanyMetricsSection;
