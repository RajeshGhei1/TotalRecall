
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLog } from '@/types/audit';
import { format } from 'date-fns';

interface AuditLogDetailDialogProps {
  log: AuditLog;
  open: boolean;
  onClose: () => void;
}

const AuditLogDetailDialog: React.FC<AuditLogDetailDialogProps> = ({
  log,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Event ID: {log.id}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <p className="font-mono">
                      {format(new Date(log.created_at), 'PPpp')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Action</label>
                    <div>
                      <Badge variant="outline">{log.action}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                    <p>{log.entity_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entity ID</label>
                    <p className="font-mono text-sm">
                      {log.entity_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Severity</label>
                    <div>
                      <Badge 
                        className={
                          log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {log.severity}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Module</label>
                    <p>{log.module_name || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            {log.profiles && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="font-mono text-sm">{log.user_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{log.profiles.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p>{log.profiles.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tenant</label>
                      <p>{log.tenants?.name || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="font-mono">{log.ip_address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                    <p className="font-mono text-sm">{log.session_id || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="text-sm break-all">{log.user_agent || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Changes */}
            {(log.old_values || log.new_values) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Changes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {log.old_values && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Old Values</label>
                      <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(log.old_values, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.new_values && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">New Values</label>
                      <pre className="mt-2 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(log.new_values, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Context */}
            {log.additional_context && Object.keys(log.additional_context).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(log.additional_context, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDetailDialog;
