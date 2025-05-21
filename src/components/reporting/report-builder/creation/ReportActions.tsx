
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

interface ReportActionsProps {
  isRunning: boolean;
  onRunReport: () => void;
  columnsSelected: boolean;
  setSaveDialogOpen: (open: boolean) => void;
}

const ReportActions: React.FC<ReportActionsProps> = ({
  isRunning,
  onRunReport,
  columnsSelected,
  setSaveDialogOpen
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>
        Save Report
      </Button>
      
      <Button 
        onClick={onRunReport} 
        disabled={isRunning || !columnsSelected}
      >
        {isRunning ? 'Running...' : 'Run Report'}
      </Button>
    </div>
  );
};

export default ReportActions;
