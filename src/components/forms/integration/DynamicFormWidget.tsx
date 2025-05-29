
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormPlacement } from '@/types/form-builder';
import { useFormPlacementsByLocation } from '@/hooks/forms/useFormDeployments';
import { useFormContext } from '@/contexts/FormContext';
import { useTenantContext } from '@/contexts/TenantContext';
import { FileText, ExternalLink } from 'lucide-react';

interface DynamicFormWidgetProps {
  context?: Record<string, any>;
  maxForms?: number;
}

const DynamicFormWidget: React.FC<DynamicFormWidgetProps> = ({ 
  context = {}, 
  maxForms = 3 
}) => {
  const { selectedTenantId } = useTenantContext();
  const { openForm } = useFormContext();
  const { data: placements = [], isLoading } = useFormPlacementsByLocation(
    'dashboard_widget', 
    selectedTenantId
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (placements.length === 0) {
    return null; // Don't render widget if no forms available
  }

  const displayPlacements = placements.slice(0, maxForms);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Available Forms
        </CardTitle>
        <CardDescription>
          Forms available for your current context
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayPlacements.map((placement) => {
          const form = placement.form_definitions;
          return (
            <div 
              key={placement.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{form.name}</h4>
                {form.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.description}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openForm(form, placement.id)}
                className="ml-3"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
        
        {placements.length > maxForms && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              +{placements.length - maxForms} more forms available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicFormWidget;
