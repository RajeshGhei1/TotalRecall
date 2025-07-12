
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Layout, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, DashboardWidget, DataSource } from '@/types/common';

interface DashboardBuilderHeaderProps {
  dashboardName: string;
  setDashboardName: (name: string) => void;
  setDataSourceDialogOpen: (open: boolean) => void;
  saveDashboard: () => void;
  isSaving: boolean;
  user: User | null;
  selectedWidgets: DashboardWidget[];
  dataSources: DataSource[];
}

const DashboardBuilderHeader: React.FC<DashboardBuilderHeaderProps> = ({
  dashboardName,
  setDashboardName,
  setDataSourceDialogOpen,
  saveDashboard,
  isSaving,
  user,
  selectedWidgets,
  dataSources
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Dashboard Builder
        </CardTitle>
        <CardDescription>
          Create and customize your analytics dashboard with configurable widgets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="dashboard-name">Dashboard Name</Label>
            <Input
              id="dashboard-name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Enter dashboard name"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => setDataSourceDialogOpen(true)}
              variant="outline"
              className="w-full"
            >
              <Database className="mr-2 h-4 w-4" />
              Add Data Source
            </Button>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={saveDashboard} 
              className="w-full"
              disabled={isSaving || !dashboardName.trim() || !user?.id || selectedWidgets.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Dashboard'}
            </Button>
          </div>
        </div>
        
        {!user?.id && (
          <Alert>
            <AlertDescription>
              You must be logged in to save dashboards.
            </AlertDescription>
          </Alert>
        )}

        {dataSources && dataSources.length > 0 && (
          <div>
            <Label>Available Data Sources</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {dataSources.map((source) => (
                <Badge key={source.id} variant="outline">
                  {source.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardBuilderHeader;
