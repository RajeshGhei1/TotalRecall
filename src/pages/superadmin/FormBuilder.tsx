
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import FormsManager from '@/components/forms/FormsManager';
import { TenantProvider } from '@/contexts/TenantContext';

const FormBuilder = () => {
  return (
    <AdminLayout>
      <TenantProvider>
        <FormsManager />
      </TenantProvider>
    </AdminLayout>
  );
};

export default FormBuilder;
