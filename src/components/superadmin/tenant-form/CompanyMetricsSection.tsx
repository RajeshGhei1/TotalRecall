
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './schema';
import { useMetricsOptions } from './metrics/useMetricsOptions';
import AddOptionDialog from './metrics/AddOptionDialog';
import EmployeeSection from './metrics/EmployeeSection';
import TurnoverSection from './metrics/TurnoverSection';
import CapitalSection from './metrics/CapitalSection';

interface CompanyMetricsSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const CompanyMetricsSection: React.FC<CompanyMetricsSectionProps> = ({ form }) => {
  const {
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
  } = useMetricsOptions();
  
  // Handle adding a new option with form value update
  const submitNewOption = async () => {
    try {
      if (addingType) {
        const newOptionObj = await handleAddNewOption();
        
        // Set the form value to the newly added option
        if (newOptionObj) {
          form.setValue(addingType as any, newOptionObj.value);
        }
        
        setAddingType(null);
      }
    } catch (error) {
      console.error('Failed to add option:', error);
    }
  };
  
  return (
    <>
      <div className="space-y-8">
        {/* Employee Metrics Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Employee Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmployeeSection 
              form={form}
              employeeOptions={employeeOptions}
              onSelectOption={handleSelectOption}
              onAddNewClick={setAddingType}
            />
          </div>
        </div>
        
        {/* Financial Metrics Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Financial Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TurnoverSection
              form={form}
              turnoverOptions={turnoverOptions}
              yearOptions={years}
              onSelectOption={handleSelectOption}
              onAddNewClick={setAddingType}
            />
          </div>
        </div>
        
        {/* Capital Information Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Capital Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CapitalSection
              form={form}
              segmentOptions={segments}
              onSelectOption={handleSelectOption}
              onAddNewClick={setAddingType}
            />
          </div>
        </div>
      </div>

      {/* Dialog for adding new options */}
      <AddOptionDialog
        open={!!addingType}
        onOpenChange={(open) => !open && setAddingType(null)}
        title={getDialogTitle(addingType)}
        placeholder={getDialogPlaceholder(addingType)}
        value={newOption}
        onChange={setNewOption}
        onSubmit={submitNewOption}
        isSubmitting={employeeRangeHook.isAddingOption}
      />
    </>
  );
};

export default CompanyMetricsSection;
