
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { saveReport, runDynamicReport } from '@/services/reportingService';
import { useReportFields } from '../hooks/useReportFields';
import ReportForm from './ReportForm';
import ReportResults from './ReportResults';
import { ReportCreationTabProps, ReportCreationState, EntityOption } from '../types';

const ReportCreationTab: React.FC<ReportCreationTabProps> = ({ 
  savedReports, 
  onSaveReport 
}) => {
  const { toast } = useToast();
  const [reportState, setReportState] = useState<ReportCreationState>({
    entity: 'companies',
    columns: [],
    filters: [],
    groupBy: '',
    aggregation: [],
    reportName: '',
    visualizationType: 'table'
  });
  
  const [reportResults, setReportResults] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  
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

  // Run the report
  const handleRunReport = async () => {
    if (!reportState.entity || reportState.columns.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select an entity and at least one column.',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    try {
      const results = await runDynamicReport(
        reportState.entity, 
        reportState.columns, 
        reportState.filters, 
        reportState.groupBy
      );
      setReportResults(results);
      toast({
        title: 'Report Generated',
        description: `Successfully generated report with ${results.length} records.`,
      });
    } catch (error) {
      console.error('Error running report:', error);
      toast({
        title: 'Error Running Report',
        description: 'Failed to run the report. Please check your inputs and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Save the report
  const handleSaveReport = async () => {
    if (!reportState.reportName) {
      toast({
        title: 'Missing Report Name',
        description: 'Please enter a name for your report.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const newReport = await saveReport({
        name: reportState.reportName,
        entity: reportState.entity,
        columns: reportState.columns,
        filters: reportState.filters,
        group_by: reportState.groupBy,
        aggregation: reportState.aggregation,
        visualization_type: reportState.visualizationType,
      });
      
      onSaveReport(newReport);
      setSaveDialogOpen(false);
      
      toast({
        title: 'Report Saved',
        description: 'Your report has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error Saving Report',
        description: 'Failed to save the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="flex justify-end space-x-2 pt-4">
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Save Report</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Report</DialogTitle>
              <DialogDescription>
                Give your report a name to save it for future use.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={reportState.reportName}
                onChange={(e) => setReportState(prev => ({ ...prev, reportName: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveReport}
                disabled={isSaving || !reportState.reportName.trim()}
              >
                {isSaving ? 'Saving...' : 'Save Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={handleRunReport} 
          disabled={isRunning || reportState.columns.length === 0}
        >
          {isRunning ? 'Running...' : 'Run Report'}
        </Button>
      </div>
      
      {/* Report Results */}
      <ReportResults 
        reportResults={reportResults}
        columns={reportState.columns}
        availableFields={availableFields}
      />
    </div>
  );
};

export default ReportCreationTab;
