
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye, Settings } from 'lucide-react';
import { useFormDefinitions } from '@/hooks/forms/useFormDefinitions';
import { useNavigate } from 'react-router-dom';

const FormsDashboardWidget = () => {
  const navigate = useNavigate();
  const { data: forms = [], isLoading } = useFormDefinitions();

  const activeForms = forms.filter(form => form.is_active);
  const globalForms = forms.filter(form => form.visibility_scope === 'global');
  const tenantSpecificForms = forms.filter(form => form.visibility_scope === 'tenant_specific');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Forms Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Forms Management
        </CardTitle>
        <CardDescription>
          Create and manage dynamic forms across tenants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{forms.length}</div>
            <div className="text-sm text-blue-600">Total Forms</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeForms.length}</div>
            <div className="text-sm text-green-600">Active Forms</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Form Distribution:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default" className="text-xs">
              Global: {globalForms.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Tenant Specific: {tenantSpecificForms.length}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => navigate('/superadmin/forms')}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-1" />
            Manage Forms
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/superadmin/forms')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {forms.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(Math.max(...forms.map(f => new Date(f.updated_at).getTime()))).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormsDashboardWidget;
