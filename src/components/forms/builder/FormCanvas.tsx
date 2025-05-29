
import React from 'react';
import { FormDefinition, FormSection, FormField } from '@/types/form-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FormCanvasProps {
  form: FormDefinition;
  sections: FormSection[];
  fields: FormField[];
  selectedSection: string | null;
  onSectionSelect: (sectionId: string | null) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  form,
  sections,
  fields,
  selectedSection,
  onSectionSelect,
}) => {
  // Group fields by section
  const fieldsBySection = fields.reduce((acc, field) => {
    const sectionId = field.section_id || 'unsectioned';
    if (!acc[sectionId]) acc[sectionId] = [];
    acc[sectionId].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  const renderField = (field: FormField) => (
    <div
      key={field.id}
      className={`p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow ${
        field.required ? 'border-orange-200' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="font-medium text-sm">{field.name}</div>
          <div className="text-xs text-gray-500 capitalize">{field.field_type}</div>
        </div>
        <div className="flex gap-1">
          {field.required && (
            <Badge variant="outline" className="text-xs">Required</Badge>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {field.description && (
        <div className="text-xs text-gray-600">{field.description}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center py-4 border-b">
        <h2 className="text-xl font-semibold">{form.name}</h2>
        {form.description && (
          <p className="text-gray-600 mt-1">{form.description}</p>
        )}
      </div>

      {/* Unsectioned fields */}
      {fieldsBySection.unsectioned && fieldsBySection.unsectioned.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">General Fields</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSectionSelect(null)}
              className={selectedSection === null ? 'ring-2 ring-blue-500' : ''}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </div>
          <div className="grid gap-3">
            {fieldsBySection.unsectioned.map(renderField)}
          </div>
        </div>
      )}

      {/* Sectioned fields */}
      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden">
          <Collapsible defaultOpen={!section.is_collapsible}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CollapsibleTrigger className="flex-1 text-left">
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  {section.description && (
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  )}
                </CollapsibleTrigger>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSectionSelect(section.id)}
                    className={selectedSection === section.id ? 'ring-2 ring-blue-500' : ''}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  {fieldsBySection[section.id]?.map(renderField) || (
                    <div className="text-center py-8 text-gray-500">
                      No fields in this section yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      {sections.length === 0 && !fieldsBySection.unsectioned && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Your form is empty.</p>
          <p className="text-sm">Add fields from the palette on the left or create sections to organize your form.</p>
        </div>
      )}
    </div>
  );
};

export default FormCanvas;
