
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContextualWorkflowSuggestionsProps {
  module: string;
  formType?: string;
  userId: string;
  tenantId?: string;
}

export const ContextualWorkflowSuggestions: React.FC<ContextualWorkflowSuggestionsProps> = ({ 
  module, 
  formType, 
  userId, 
  tenantId 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900">Suggested Automation</h4>
            <p className="text-sm text-blue-700 mt-1">
              Based on your {module} module usage, consider setting up automated workflows.
            </p>
          </div>
          
          {formType && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900">Form-Specific Workflow</h4>
              <p className="text-sm text-green-700 mt-1">
                Optimize your {formType} forms with intelligent routing and validation.
              </p>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            User: {userId} | Tenant: {tenantId || 'Default'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
