
import React, { useState } from 'react';
import { FormDefinition } from '@/types/form-builder';
import { useFormSections } from '@/hooks/forms/useFormSections';
import { useFormFields } from '@/hooks/forms/useFormFields';
import FieldPalette from './FieldPalette';
import FormCanvas from './FormCanvas';
import SectionManager from './SectionManager';
import { Button } from '@/components/ui/button';
import { Save, Plus, Sparkles } from 'lucide-react';

interface FormDesignerProps {
  form: FormDefinition;
}

const FormDesigner: React.FC<FormDesignerProps> = ({ form }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSectionManager, setShowSectionManager] = useState(false);

  const { data: sections = [] } = useFormSections(form.id);
  const { data: fields = [] } = useFormFields(form.id);

  return (
    <div className="h-full flex">
      {/* Left Panel - Field Palette with AI Suggestions */}
      <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Smart Field Builder
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSectionManager(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Section
          </Button>
        </div>
        <FieldPalette 
          formId={form.id} 
          selectedSection={selectedSection}
          form={form}
        />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Form Canvas</h3>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <FormCanvas
            form={form}
            sections={sections}
            fields={fields}
            selectedSection={selectedSection}
            onSectionSelect={setSelectedSection}
          />
        </div>
      </div>

      {/* Section Manager Dialog */}
      <SectionManager
        isOpen={showSectionManager}
        onClose={() => setShowSectionManager(false)}
        formId={form.id}
      />
    </div>
  );
};

export default FormDesigner;
