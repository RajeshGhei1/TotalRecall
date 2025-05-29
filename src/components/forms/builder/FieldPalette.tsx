
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateFormField } from '@/hooks/forms/useFormFields';
import { FieldDefinition, FieldType } from '@/types/form-builder';
import {
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  CheckCircle,
  FileText,
  Star,
  Grid3X3,
} from 'lucide-react';

interface FieldPaletteProps {
  formId: string;
  selectedSection: string | null;
}

const FIELD_TYPES: FieldDefinition[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: 'Type',
    description: 'Single line text input',
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: 'FileText',
    description: 'Multi-line text input',
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'Hash',
    description: 'Numeric input field',
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    description: 'Email address input',
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: 'Phone',
    description: 'Phone number input',
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'Calendar',
    description: 'Date picker',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'ChevronDown',
    description: 'Select from options',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckCircle',
    description: 'Multiple choice',
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: 'CheckCircle',
    description: 'Single choice',
  },
  {
    type: 'boolean',
    label: 'Yes/No',
    icon: 'CheckCircle',
    description: 'Boolean toggle',
  },
];

const getFieldIcon = (iconName: string) => {
  const icons = {
    Type,
    FileText,
    Hash,
    Mail,
    Phone,
    Calendar,
    ChevronDown,
    CheckCircle,
    Star,
    Grid3X3,
  };
  const IconComponent = icons[iconName as keyof typeof icons] || Type;
  return <IconComponent className="h-4 w-4" />;
};

const FieldPalette: React.FC<FieldPaletteProps> = ({ formId, selectedSection }) => {
  const createFieldMutation = useCreateFormField();

  const handleAddField = async (fieldType: FieldType) => {
    try {
      const fieldData = {
        name: `${fieldType}_field_${Date.now()}`,
        field_key: `${fieldType}_${Date.now()}`,
        field_type: fieldType,
        required: false,
        form_id: formId,
        section_id: selectedSection || undefined,
        tenant_id: null, // Will be set by RLS
        sort_order: 0,
      };

      await createFieldMutation.mutateAsync(fieldData);
    } catch (error) {
      console.error('Failed to add field:', error);
    }
  };

  return (
    <div className="space-y-2">
      {FIELD_TYPES.map((fieldDef) => (
        <Card key={fieldDef.type} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto"
              onClick={() => handleAddField(fieldDef.type)}
              disabled={createFieldMutation.isPending}
            >
              <div className="flex items-center gap-3">
                {getFieldIcon(fieldDef.icon)}
                <div className="text-left">
                  <div className="font-medium text-sm">{fieldDef.label}</div>
                  <div className="text-xs text-gray-500">{fieldDef.description}</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FieldPalette;
