
import React from 'react';
import { ReportFormProps } from '../types';

// Import new components
import EntitySelector from './form-components/EntitySelector';
import ColumnSelector from './ColumnSelector';
import FiltersInput from './FiltersInput';
import GroupBySelector from './form-components/GroupBySelector';
import VisualizationTypeSelector from './form-components/VisualizationTypeSelector';

const ReportForm: React.FC<ReportFormProps> = ({ 
  reportState,
  setReportState,
  availableFields,
  entityOptions,
  operatorOptions,
  visualizationOptions
}) => {
  
  // Handle column selection
  const handleColumnChange = (field: string, isChecked: boolean) => {
    if (isChecked) {
      setReportState(prev => ({ ...prev, columns: [...prev.columns, field] }));
    } else {
      setReportState(prev => ({ 
        ...prev, 
        columns: prev.columns.filter(col => col !== field) 
      }));
    }
  };

  // Handle entity change
  const handleEntityChange = (value: string) => {
    setReportState(prev => ({
      ...prev,
      entity: value,
      columns: [],
      filters: [],
      groupBy: '',
      aggregation: []
    }));
  };

  return (
    <div className="space-y-4">
      {/* Entity Selection */}
      <EntitySelector 
        entity={reportState.entity}
        entityOptions={entityOptions}
        onEntityChange={handleEntityChange}
      />
      
      {/* Column Selection */}
      <ColumnSelector 
        columns={reportState.columns}
        availableFields={availableFields}
        onColumnChange={handleColumnChange}
      />
      
      {/* Filters */}
      <FiltersInput 
        filters={reportState.filters}
        setFilters={(newFilters) => {
          // Fix: Explicitly cast the newFilters as Filter[] to avoid type issues
          setReportState(prev => ({ 
            ...prev, 
            filters: Array.isArray(newFilters) ? newFilters : [] 
          }));
        }}
        availableFields={availableFields}
        operatorOptions={operatorOptions}
      />
      
      {/* Group By */}
      <GroupBySelector 
        groupBy={reportState.groupBy}
        availableFields={availableFields}
        onGroupByChange={(value) => setReportState(prev => ({ ...prev, groupBy: value }))}
      />
      
      {/* Visualization Type */}
      <VisualizationTypeSelector 
        visualizationType={reportState.visualizationType}
        visualizationOptions={visualizationOptions}
        onVisualizationTypeChange={(value) => setReportState(prev => ({ ...prev, visualizationType: value }))}
      />
    </div>
  );
};

export default ReportForm;
