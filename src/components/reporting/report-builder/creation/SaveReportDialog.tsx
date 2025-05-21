
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface SaveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportName: string;
  onReportNameChange: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const SaveReportDialog: React.FC<SaveReportDialogProps> = ({
  open,
  onOpenChange,
  reportName,
  onReportNameChange,
  onSave,
  isSaving
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            value={reportName}
            onChange={(e) => onReportNameChange(e.target.value)}
            placeholder="Enter report name"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={isSaving || !reportName.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveReportDialog;
