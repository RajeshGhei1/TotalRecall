
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface ImportRecord {
  id: string;
  fileName: string;
  importedBy: string;
  timestamp: Date;
  totalRows: number;
  successCount: number;
  errorCount: number;
  duplicateCount: number;
  status: 'completed' | 'failed' | 'partial';
  errors?: string[];
  duration: number; // in seconds
}

interface ImportHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportHistoryDialog: React.FC<ImportHistoryDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadImportHistory();
    }
  }, [isOpen]);

  const loadImportHistory = async () => {
    setIsLoading(true);
    
    // Simulate loading import history - in real implementation, this would come from a database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockHistory: ImportRecord[] = [
      {
        id: '1',
        fileName: 'companies_batch_1.csv',
        importedBy: 'John Admin',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        totalRows: 150,
        successCount: 145,
        errorCount: 3,
        duplicateCount: 2,
        status: 'completed',
        duration: 45
      },
      {
        id: '2',
        fileName: 'tech_companies.csv',
        importedBy: 'Sarah Manager',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        totalRows: 500,
        successCount: 475,
        errorCount: 15,
        duplicateCount: 10,
        status: 'partial',
        errors: ['Invalid email format in row 45', 'Missing required field in row 67'],
        duration: 120
      },
      {
        id: '3',
        fileName: 'startup_list.csv',
        importedBy: 'Mike Editor',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        totalRows: 75,
        successCount: 75,
        errorCount: 0,
        duplicateCount: 0,
        status: 'completed',
        duration: 18
      },
      {
        id: '4',
        fileName: 'large_dataset.csv',
        importedBy: 'Admin User',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        totalRows: 1000,
        successCount: 0,
        errorCount: 1000,
        duplicateCount: 0,
        status: 'failed',
        errors: ['File format error', 'Invalid headers detected'],
        duration: 5
      }
    ];

    setImportHistory(mockHistory);
    setIsLoading(false);
  };

  const getStatusIcon = (status: ImportRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ImportRecord['status']) => {
    const variants = {
      completed: 'default',
      partial: 'secondary',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  const getSuccessRate = (record: ImportRecord) => {
    return Math.round((record.successCount / record.totalRows) * 100);
  };

  const downloadErrorReport = (record: ImportRecord) => {
    if (!record.errors || record.errors.length === 0) return;
    
    const errorReport = [
      `Import Error Report - ${record.fileName}`,
      `Date: ${format(record.timestamp, 'PPP pp')}`,
      `Total Rows: ${record.totalRows}`,
      `Errors: ${record.errorCount}`,
      '',
      'Error Details:',
      ...record.errors.map((error, index) => `${index + 1}. ${error}`)
    ].join('\n');

    const blob = new Blob([errorReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-errors-${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Import History
          </DialogTitle>
          <DialogDescription>
            View and manage your bulk import history with detailed statistics and error reports
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {importHistory.length} import operations found
            </div>
            <Button variant="outline" size="sm" onClick={loadImportHistory} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {importHistory.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {record.fileName}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{record.totalRows}</div>
                        <div className="text-xs text-muted-foreground">Total Rows</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{record.successCount}</div>
                        <div className="text-xs text-muted-foreground">Imported</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{record.errorCount}</div>
                        <div className="text-xs text-muted-foreground">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{record.duplicateCount}</div>
                        <div className="text-xs text-muted-foreground">Duplicates</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {record.importedBy}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(record.timestamp, 'PPp')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDuration(record.duration)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="font-medium">
                            {getSuccessRate(record)}% success rate
                          </div>
                        </div>
                        
                        {record.errors && record.errors.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadErrorReport(record)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Error Report
                          </Button>
                        )}
                      </div>
                    </div>

                    {record.errors && record.errors.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <div className="text-sm font-medium text-red-800 mb-2">
                          Recent Errors ({record.errors.length}):
                        </div>
                        <div className="space-y-1">
                          {record.errors.slice(0, 3).map((error, index) => (
                            <div key={index} className="text-xs text-red-700">
                              • {error}
                            </div>
                          ))}
                          {record.errors.length > 3 && (
                            <div className="text-xs text-red-600">
                              ...and {record.errors.length - 3} more errors
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {importHistory.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Import History</h3>
                  <p className="text-gray-500">
                    Your bulk import operations will appear here once you start importing companies.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-8">
                  <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
                  <p className="text-gray-500">Loading import history...</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportHistoryDialog;
