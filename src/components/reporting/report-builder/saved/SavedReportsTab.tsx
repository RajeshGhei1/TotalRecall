
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureSavedReports, useSecureDeleteReport } from '@/hooks/useSecureReportingService';
import { SavedReport } from '@/services/reportingService';
import { Trash2, Play, Eye } from 'lucide-react';

interface SavedReportsTabProps {
  savedReports: SavedReport[];
  setSavedReports: (reports: SavedReport[]) => void;
  onLoadReport: (report: SavedReport) => void;
}

const SavedReportsTab: React.FC<SavedReportsTabProps> = ({ 
  savedReports, 
  setSavedReports, 
  onLoadReport 
}) => {
  const { data: reports, isLoading } = useSecureSavedReports();
  const deleteReportMutation = useSecureDeleteReport();

  useEffect(() => {
    if (reports) {
      setSavedReports(reports);
    }
  }, [reports, setSavedReports]);

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReportMutation.mutateAsync(reportId);
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!savedReports || savedReports.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Saved Reports</h3>
            <p className="text-sm">Create and save reports to see them here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Reports ({savedReports.length})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{report.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{report.entity}</Badge>
                <Badge variant="secondary">{report.visualization_type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Columns: {Array.isArray(report.columns) ? report.columns.join(', ') : 'N/A'}
                  </p>
                  {Array.isArray(report.filters) && report.filters.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Filters: {report.filters.length} applied
                    </p>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(report.created_at).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onLoadReport(report)}
                    className="flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReport(report.id)}
                    disabled={deleteReportMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedReportsTab;
