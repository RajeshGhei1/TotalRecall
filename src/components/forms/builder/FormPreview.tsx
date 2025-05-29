
import React from 'react';
import { FormDefinition } from '@/types/form-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormPreviewProps {
  form: FormDefinition;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{form.name}</CardTitle>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p>Form preview will be rendered here.</p>
              <p className="text-sm mt-2">
                Add fields using the designer to see them in the preview.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPreview;
