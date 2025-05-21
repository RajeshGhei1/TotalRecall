
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ColumnSelector from './ColumnSelector';
import FiltersInput from './FiltersInput';
import { ReportFormProps } from '../types';

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

  return (
    <div className="space-y-4">
      {/* Entity Selection */}
      <div>
        <Label htmlFor="entity-select">Select Entity</Label>
        <Select 
          value={reportState.entity} 
          onValueChange={(value) => {
            setReportState(prev => ({
              ...prev,
              entity: value,
              columns: [],
              filters: [],
              groupBy: '',
              aggregation: []
            }));
          }}
        >
          <SelectTrigger id="entity-select" className="w-full">
            <SelectValue placeholder="Select an entity" />
          </SelectTrigger>
          <SelectContent>
            {entityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
      <div>
        <Label htmlFor="group-by">Group By (Optional)</Label>
        <Select 
          value={reportState.groupBy} 
          onValueChange={(value) => setReportState(prev => ({ ...prev, groupBy: value }))}
        >
          <SelectTrigger id="group-by">
            <SelectValue placeholder="Select field (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {availableFields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Visualization Type */}
      <div>
        <Label htmlFor="visualization-type">Visualization Type</Label>
        <Select 
          value={reportState.visualizationType} 
          onValueChange={(value) => setReportState(prev => ({ ...prev, visualizationType: value }))}
        >
          <SelectTrigger id="visualization-type">
            <SelectValue placeholder="Select visualization type" />
          </SelectTrigger>
          <SelectContent>
            {visualizationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReportForm;
