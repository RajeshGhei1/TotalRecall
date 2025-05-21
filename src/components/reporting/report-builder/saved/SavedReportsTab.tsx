
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { deleteReport } from '@/services/reportingService';
import { SavedReportsTabProps } from '../types';
import { EntityOption } from '../types';

const SavedReportsTab: React.FC<SavedReportsTabProps> = ({ 
  savedReports, 
  setSavedReports, 
  onLoadReport 
}) => {
  const { toast } = useToast();

  // Entity options for display labels
  const entityOptions: EntityOption[] = [
    { value: 'companies', label: 'Companies' },
    { value: 'people', label: 'People' },
    { value: 'talents', label: 'Talents' },
    { value: 'dropdown_options', label: 'Dropdown Options' },
  ];

  // Delete a saved report
  const handleDeleteReport = async (id: string) => {
    try {
      await deleteReport(id);
      setSavedReports(savedReports.filter(report => report.id !== id));
      toast({
        title: 'Report Deleted',
        description: 'The report has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error Deleting Report',
        description: 'Failed to delete the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Saved Reports</h3>
      
      {savedReports.length === 0 ? (
        <div className="text-center p-6 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No saved reports yet</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => onLoadReport({ 
              id: '', 
              name: '', 
              entity: 'companies', 
              columns: [], 
              filters: [],
              group_by: '',
              aggregation: [],
              visualization_type: 'table',
              created_at: '',
              updated_at: ''
            })}
          >
            Create Your First Report
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {savedReports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    Entity: {entityOptions.find(e => e.value === report.entity)?.label || report.entity}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onLoadReport(report)}
                  >
                    Load
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedReportsTab;
