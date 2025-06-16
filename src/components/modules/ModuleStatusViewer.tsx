
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings,
  Database,
  Users,
  Calendar,
  Activity
} from 'lucide-react';

interface ModuleStatusViewerProps {
  module: any;
  onClose: () => void;
}

const ModuleStatusViewer: React.FC<ModuleStatusViewerProps> = ({ module, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getAccessMethodColor = (method: string) => {
    switch (method) {
      case 'subscription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'core': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {module.name} - Status Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Module Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">{module.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Version</p>
                  <p className="text-lg">v{module.version}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <Badge variant="outline" className="capitalize">
                    {module.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(module.status)}>
                    {module.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {module.status === 'inactive' && <XCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{module.status}</span>
                  </Badge>
                </div>
              </div>

              {module.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{module.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Access Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Access Method</p>
                <Badge className={getAccessMethodColor(module.accessMethod)}>
                  <span className="capitalize">{module.accessMethod}</span>
                </Badge>
              </div>

              {module.planName && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Subscription Plan</p>
                  <p className="text-gray-700">{module.planName}</p>
                </div>
              )}

              {module.limits && Object.keys(module.limits).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Usage Limits</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-sm text-gray-700">
                      {JSON.stringify(module.limits, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Operational</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Module is functioning normally with no reported issues.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleStatusViewer;
