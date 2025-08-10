
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Hash, 
  Mail, 
  Calendar, 
  ToggleLeft, 
  List, 
  CheckSquare,
  FileText,
  Star,
  Grid3X3,
  Settings,
  Sparkles
} from 'lucide-react';
import { FieldDefinition, FieldType } from '@/types/form-builder';
import { useCreateFormField } from '@/hooks/forms/useFormFields';
import { useToast } from '@/hooks/use-toast';
import FieldSuggestionButton from './FieldSuggestionButton';
import { FormDefinition } from '@/types/form-builder';
import { useCustomFieldsQuery } from '@/hooks/customFields/useCustomFieldsQuery';
import { useAuth } from '@/contexts/AuthContext';

interface FieldPaletteProps {
  formId: string;
  selectedSection?: string | null;
  form?: FormDefinition;
}

const fieldDefinitions: FieldDefinition[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: 'Type',
    description: 'Single line text input',
    defaultOptions: { placeholder: 'Enter text...' }
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: 'FileText',
    description: 'Multi-line text input',
    defaultOptions: { placeholder: 'Enter description...', rows: 4 }
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'Hash',
    description: 'Numeric input field',
    defaultOptions: { placeholder: '0' }
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    description: 'Email address input',
    defaultOptions: { placeholder: 'user@example.com' }
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'Calendar',
    description: 'Date picker',
    defaultOptions: {}
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'List',
    description: 'Select from options',
    defaultOptions: { 
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
  },
  {
    type: 'multiselect',
    label: 'Multi-Select',
    icon: 'Grid3X3',
    description: 'Multiple selections from options',
    defaultOptions: { 
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      multiSelect: true,
      maxSelections: 0
    }
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckSquare',
    description: 'Multiple selections',
    defaultOptions: { 
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: 'ToggleLeft',
    description: 'Single selection',
    defaultOptions: { 
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
  },
  {
    type: 'boolean',
    label: 'Yes/No',
    icon: 'ToggleLeft',
    description: 'Boolean toggle',
    defaultOptions: {}
  },
  {
    type: 'rating',
    label: 'Rating',
    icon: 'Star',
    description: 'Star rating input',
    defaultOptions: { maxRating: 5 }
  }
];

const iconMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  Type,
  FileText,
  Hash,
  Mail,
  Calendar,
  List,
  CheckSquare,
  ToggleLeft,
  Star,
  Grid3X3,
  Settings
};

// Icon mapping for custom field types
const getCustomFieldIcon = (fieldType: string) => {
  const mapping: Record<string, React.ComponentType<Record<string, unknown>>> = {
    text: Type,
    textarea: FileText,
    number: Hash,
    date: Calendar,
    dropdown: List,
    multiselect: Grid3X3,
    boolean: ToggleLeft,
    select: List
  };
  return mapping[fieldType] || Settings;
};

const FieldPalette: React.FC<FieldPaletteProps> = ({ 
  formId, 
  selectedSection,
  form 
}) => {
  const createField = useCreateFormField();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get current tenant ID for custom fields
  const getCurrentTenantId = () => {
    // You might need to adjust this based on your auth structure
    return user?.user_metadata?.tenant_id || 'global';
  };

  // Fetch custom fields for the current tenant
  const { data: customFields = [], isLoading: customFieldsLoading } = useCustomFieldsQuery(
    getCurrentTenantId(),
    'form' // Form context
  );

  const handleAddField = async (fieldDef: FieldDefinition | unknown) => {
    try {
      const fieldKey = (fieldDef.label || fieldDef.name || 'New Field').toLowerCase().replace(/\s+/g, '_');
      
      const fieldData = {
        name: fieldDef.label || fieldDef.name || 'New Field',
        field_key: fieldKey,
        field_type: fieldDef.type || fieldDef.fieldType,
        required: fieldDef.required || false,
        form_id: formId,
        section_id: selectedSection,
        options: fieldDef.defaultOptions || fieldDef.options,
        sort_order: 0
      };

      await createField.mutateAsync(fieldData);

      toast({
        title: 'Field Added',
        description: `${fieldData.name} has been added to the form.`,
      });
    } catch (error: unknown) {
      console.error('Error adding field:', error);
      toast({
        title: 'Error',
        description: `Failed to add field: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleAddCustomField = async (customField: any) => {
    try {
      const fieldData = {
        name: customField.name,
        field_key: customField.field_key,
        field_type: customField.field_type,
        required: customField.required || false,
        form_id: formId,
        section_id: selectedSection,
        options: customField.options || {},
        sort_order: 0,
        description: customField.description
      };

      await createField.mutateAsync(fieldData);

      toast({
        title: 'Custom Field Added',
        description: `${customField.name} has been added to the form.`,
      });
    } catch (error: unknown) {
      console.error('Error adding custom field:', error);
      toast({
        title: 'Error',
        description: `Failed to add custom field: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Suggestions */}
      {form && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSuggestionButton 
              form={form}
              onAddField={handleAddField}
            />
          </CardContent>
        </Card>
      )}

      {/* Custom Fields */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Custom Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {customFieldsLoading ? (
            <div className="text-center py-4 text-sm text-gray-500">
              Loading custom fields...
            </div>
          ) : customFields.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              No custom fields available.
              <br />
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-purple-600"
                onClick={() => window.open('/tenant-admin/settings/custom-fields', '_blank')}
              >
                Create custom fields
              </Button>
            </div>
          ) : (
            customFields.map((customField) => {
              const IconComponent = getCustomFieldIcon(customField.field_type);
              
              return (
                <Button
                  key={customField.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-3 text-left hover:bg-purple-100"
                  onClick={() => handleAddCustomField(customField)}
                  disabled={createField.isPending}
                >
                  <div className="flex items-start gap-3 w-full">
                    <IconComponent className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{customField.name}</span>
                        <Badge variant="outline" className="text-xs bg-purple-100">
                          {customField.field_type}
                        </Badge>
                        {customField.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      {customField.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {customField.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Standard Field Types */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Standard Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {fieldDefinitions.map((fieldDef) => {
            const IconComponent = iconMap[fieldDef.icon] || Type;
            
            return (
              <Button
                key={fieldDef.type}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => handleAddField(fieldDef)}
                disabled={createField.isPending}
              >
                <div className="flex items-start gap-3 w-full">
                  <IconComponent className="h-4 w-4 mt-0.5 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{fieldDef.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {fieldDef.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fieldDef.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldPalette;
