
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { saveReport, runDynamicReport } from '@/services/reportingService';
import { ReportCreationState, SavedReport } from '../types';

export const useReportCreation = (onSaveReport: (report: SavedReport) => void) => {
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

  return {
    reportState,
    setReportState,
    reportResults,
    isSaving,
    isRunning,
    saveDialogOpen,
    setSaveDialogOpen,
    handleRunReport,
    handleSaveReport
  };
};
