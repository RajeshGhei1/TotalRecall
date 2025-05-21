
import React from 'react';
import { useReportFields } from '../hooks/useReportFields';
import { useReportCreation } from '../hooks/useReportCreation';
import ReportForm from './ReportForm';
import ReportResults from './ReportResults';
import ReportActions from './ReportActions';
import SaveReportDialog from './SaveReportDialog';
import { ReportCreationTabProps, EntityOption } from '../types';

const ReportCreationTab: React.FC<ReportCreationTabProps> = ({ 
  savedReports, 
  onSaveReport 
}) => {
  const {
    reportState,
    setReportState,
    reportResults,
    isSaving,
    isRunning,
    saveDialogOpen,
    setSaveDialogOpen,
    handleRunReport,
    handleSaveReport
  } = useReportCreation(onSaveReport);
  
  const { availableFields } = useReportFields(reportState.entity);

  // Entity options for the dropdown
  const entityOptions: EntityOption[] = [
    { value: 'companies', label: 'Companies' },
    { value: 'people', label: 'People' },
    { value: 'talents', label: 'Talents' },
    { value: 'dropdown_options', label: 'Dropdown Options' },
  ];

  // Operator options for filters
  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
  ];

  // Visualization options
  const visualizationOptions = [
    { value: 'table', label: 'Table' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'line', label: 'Line Chart' },
  ];

  return (
    <div className="space-y-4">
      <ReportForm 
        reportState={reportState}
        setReportState={setReportState}
        availableFields={availableFields}
        entityOptions={entityOptions}
        operatorOptions={operatorOptions}
        visualizationOptions={visualizationOptions}
      />
      
      {/* Action Buttons */}
      <ReportActions
        isRunning={isRunning}
        onRunReport={handleRunReport}
        columnsSelected={reportState.columns.length > 0}
        setSaveDialogOpen={setSaveDialogOpen}
      />
      
      {/* Save Dialog */}
      <SaveReportDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        reportName={reportState.reportName}
        onReportNameChange={(name) => setReportState(prev => ({ ...prev, reportName: name }))}
        onSave={handleSaveReport}
        isSaving={isSaving}
      />
      
      {/* Report Results */}
      <ReportResults 
        reportResults={reportResults}
        columns={reportState.columns}
        availableFields={availableFields}
        visualizationType={reportState.visualizationType}
      />
    </div>
  );
};

export default ReportCreationTab;
