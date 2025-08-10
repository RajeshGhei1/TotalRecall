import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomField } from '@/hooks/customFields/types';
import { Edit, Trash2, Globe, Building2, Crown } from 'lucide-react';

interface CustomFieldsListProps {
  fields: CustomField[];
  onEdit: (field: CustomField) => void;
  onDelete: (fieldId: string) => void;
  onReorder?: (fields: CustomField[]) => void;
  showGlobalFields?: boolean;
}

const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  fields,
  onEdit,
  onDelete,
  onReorder,
  showGlobalFields = true
}) => {
  // Separate fields by scope for better organization
  const globalFields = fields.filter(field => field.is_global);
  const tenantFields = fields.filter(field => !field.is_global);

  const renderFieldCard = (field: CustomField) => {
    const isGlobal = field.is_global;
    
    return (
      <Card 
        key={field.id} 
        className={`transition-all hover:shadow-md ${
          isGlobal ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <span>{field.name}</span>
              {isGlobal && (
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-blue-600" />
                  <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                    <Globe className="h-3 w-3 mr-1" />
                    Global
                  </Badge>
                </div>
              )}
              {!isGlobal && (
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  Tenant
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(field)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(field.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>Type:</strong> 
                <Badge variant="secondary" className="ml-1 text-xs">
                  {field.field_type}
                </Badge>
              </span>
              <span>
                <strong>Key:</strong> {field.field_key}
              </span>
              {field.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
            
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            
            {isGlobal && (
              <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-xs text-blue-700">
                <div className="flex items-start gap-1">
                  <Crown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Super Admin Field:</strong> This field is available to all tenants who have access to the associated modules.
                  </span>
                </div>
              </div>
            )}
            
            {field.applicable_forms && field.applicable_forms.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Applicable Forms:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {field.applicable_forms.map((form, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {form}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (fields.length === 0) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Custom Fields</p>
            <p className="text-sm">Create your first custom field to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Fields Section */}
      {showGlobalFields && globalFields.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Global Fields</h3>
            <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-700">
              {globalFields.length} field{globalFields.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-blue-600 mb-4">
            These fields are created by Super Admin and available to all tenants with module access.
          </p>
          <div className="space-y-3">
            {globalFields.map(renderFieldCard)}
          </div>
        </div>
      )}

      {/* Tenant Fields Section */}
      {tenantFields.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Tenant-Specific Fields</h3>
            <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700">
              {tenantFields.length} field{tenantFields.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These fields are specific to your organization and only visible to your tenant.
          </p>
          <div className="space-y-3">
            {tenantFields.map(renderFieldCard)}
          </div>
        </div>
      )}

      {/* Show combined message if both types exist */}
      {globalFields.length > 0 && tenantFields.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="flex gap-1">
              <Crown className="h-4 w-4 text-blue-600" />
              <Building2 className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Combined Field Access</p>
              <p className="text-xs text-gray-600 mt-1">
                You have access to {globalFields.length} global field{globalFields.length !== 1 ? 's' : ''} (available to all tenants) 
                and {tenantFields.length} tenant-specific field{tenantFields.length !== 1 ? 's' : ''} (your organization only).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFieldsList; 