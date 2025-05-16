
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TenantFormValues } from './schema';
import { useMetricsOptions } from './metrics/useMetricsOptions';
import AddOptionDialog from './metrics/AddOptionDialog';
import EmployeeSection from './metrics/EmployeeSection';
import TurnoverSection from './metrics/TurnoverSection';
import EstablishmentSection from './metrics/EstablishmentSection';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Section */}
        <div className="space-y-6">
          <EmployeeSection 
            form={form}
            employeeOptions={employeeOptions}
            onSelectOption={handleSelectOption}
            onAddNewClick={setAddingType}
          />
        </div>
        
        {/* Turnover Section */}
        <div className="space-y-6">
          <TurnoverSection
            form={form}
            turnoverOptions={turnoverOptions}
            yearOptions={years}
            onSelectOption={handleSelectOption}
            onAddNewClick={setAddingType}
          />
        </div>
        
        {/* Establishment & Capital Section */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EstablishmentSection
            form={form}
            yearOptions={years}
            segmentOptions={segments}
            onSelectOption={handleSelectOption}
            onAddNewClick={setAddingType}
          />
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
