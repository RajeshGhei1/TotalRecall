
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
import { supabase } from '@/integrations/supabase/client';
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
  importedBy: string;
  timestamp: Date;
  totalRows: number;
  successCount: number;
  errorCount: number;
  duplicateCount: number;
  status: 'completed' | 'failed' | 'partial';
  errors?: Array<{ field?: string; message?: string; cin?: string; row?: number }>;
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

    try {
      const { data: auditLogs, error } = await supabase
        .from('audit_logs')
        .select('id, user_id, created_at, additional_context')
        .eq('action', 'companies.bulk_import')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userIds = Array.from(new Set((auditLogs || []).map((log) => log.user_id).filter(Boolean)));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profileMap = new Map<string, string>();
      (profiles || []).forEach((profile) => {
        profileMap.set(profile.id, profile.full_name || profile.email || profile.id);
      });

      const mappedHistory: ImportRecord[] = (auditLogs || []).map((log) => {
        const context = (log.additional_context || {}) as {
          total?: number;
          inserted?: number;
          skipped?: number;
          errors?: Array<{ field?: string; message?: string; cin?: string; row?: number }>;
        };
        const total = context.total || 0;
        const inserted = context.inserted || 0;
        const errors = context.errors || [];
        const errorCount = errors.length;
        const duplicateCount = context.skipped || 0;

        let status: ImportRecord['status'] = 'completed';
        if (inserted === 0 && (errorCount > 0 || duplicateCount > 0)) {
          status = 'failed';
        } else if (errorCount > 0 || duplicateCount > 0) {
          status = 'partial';
        }

        return {
          id: log.id,
          importedBy: log.user_id ? (profileMap.get(log.user_id) || log.user_id) : 'Unknown',
          timestamp: new Date(log.created_at),
          totalRows: total,
          successCount: inserted,
          errorCount,
          duplicateCount,
          status,
          errors,
        };
      });

      setImportHistory(mappedHistory);
    } catch (err) {
      console.error('Failed to load import history:', err);
      setImportHistory([]);
    } finally {
      setIsLoading(false);
    }
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

  const getSuccessRate = (record: ImportRecord) => {
    return Math.round((record.successCount / record.totalRows) * 100);
  };

  const downloadErrorReport = (record: ImportRecord) => {
    if (!record.errors || record.errors.length === 0) return;
    
    const errorReport = [
      `Import Error Report`,
      `Date: ${format(record.timestamp, 'PPP pp')}`,
      `Total Rows: ${record.totalRows}`,
      `Errors: ${record.errorCount}`,
      '',
      'Error Details:',
      ...record.errors.map((error, index) => `${index + 1}. ${error.message || 'Error'}${error.field ? ` (Field: ${error.field})` : ''}${error.cin ? ` (CIN: ${error.cin})` : ''}`)
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

  const formatImportError = (error: ImportRecord['errors'][number]) => {
    const parts = [error.message || 'Error'];
    if (error.field) parts.push(`(Field: ${error.field})`);
    if (error.cin) parts.push(`(CIN: ${error.cin})`);
    if (error.row) parts.push(`(Row: ${error.row})`);
    return parts.join(' ');
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
                        Companies Bulk Import
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
                              • {formatImportError(error)}
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
