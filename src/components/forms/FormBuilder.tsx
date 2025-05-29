
import React, { useState } from 'react';
import { FormDefinition } from '@/types/form-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormDesigner from './builder/FormDesigner';
import FormPreview from './builder/FormPreview';
import FormSettings from './builder/FormSettings';

interface FormBuilderProps {
  form: FormDefinition;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form }) => {
  const [activeTab, setActiveTab] = useState('design');

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="flex-1 overflow-hidden">
          <FormDesigner form={form} />
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 overflow-hidden">
          <FormPreview form={form} />
        </TabsContent>
        
        <TabsContent value="settings" className="flex-1 overflow-hidden">
          <FormSettings form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
