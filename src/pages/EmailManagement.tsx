
import React from 'react';
import { EmailManagementPage } from '@/components/email/EmailManagementPage';
import AdminLayout from '@/components/AdminLayout';

const EmailManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <EmailManagementPage />
      </div>
    </AdminLayout>
  );
};

export default EmailManagement;
