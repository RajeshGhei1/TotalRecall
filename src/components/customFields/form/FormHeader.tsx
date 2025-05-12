
import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const FormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Add Custom Field</CardTitle>
      <CardDescription>
        Define a new custom field for this tenant
      </CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
